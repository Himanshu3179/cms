import React, { useState, useEffect } from "react";
import { useSelectedArticles } from "../../context/SelectedArticlesContext";
import {
  fetchFeedById,
  getAvailableModelAuthors,
  handleChatRequest,
} from "../../api"; // Import the handleChatRequest function
import { Feed } from "../../types";
import { Loader, Plus, Trash2 } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import OutputSection from "../../components/OutputSection";

const AIEditor: React.FC = () => {
  const { selectedArticles, removeArticle } = useSelectedArticles();
  const [selectedModel, setSelectedModel] = useState("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [articles, setArticles] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [latestOutput, setLatestOutput] = useState({
    title: "",
    description: "",
  });

  const [isGenerating, setIsGenerating] = useState(false); // ✅ Track loading state

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const fetchedArticles = await Promise.all(
          selectedArticles.map((id) => fetchFeedById(id))
        );
        setArticles(fetchedArticles);
      } catch (err: any) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedArticles.length > 0) {
      loadArticles();
    } else {
      setLoading(false);
    }
  }, [selectedArticles]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await getAvailableModelAuthors();
        setAvailableModels(data.models);
        if (data.models.length > 0) {
          setSelectedModel(data.models[0]); // Set the first model as the selected model
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    loadModels();
  }, []);

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    if (availableModels.includes(selected)) {
      setSelectedModel(selected);
    }
  };

  const handleRemoveArticle = (id: string) => {
    removeArticle(id); // Remove from context

    // ✅ Update state to reflect changes in UI
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article._id !== id)
    );

    // ✅ Check if no articles remain and reset UI
    if (selectedArticles.length === 1) {
      setArticles([]); // Clear articles if the last one is removed
    }
  };

  const handleSendMessage = async (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);
    setIsGenerating(true); // ✅ Show "Generating..." indicator

    try {
      const response = await handleChatRequest({
        modelAuthor: selectedModel,
        selectedArticleIds: selectedArticles,
        userInstructions: message,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response.description },
      ]);

      setLatestOutput({
        title: response.title,
        description: response.description,
      });
    } catch (error: any) {
      toast.error(error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Failed to generate response." },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto ">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Editor</h1>
      <div className="flex flex-row gap-5">
        <div className="w-1/3 flex flex-col space-y-5">
          <div>
            <label className="block font-bold text-gray-700 mb-2 ">
              Choose AI Model
            </label>
            <select
              value={selectedModel}
              onChange={handleModelChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="font-bold text-gray-700 mb-2">
              Tell AI what you want to do
            </p>
            <textarea
              className="block w-full p-2 border border-gray-300 rounded-md"
              disabled={isGenerating}
              rows={4}
              placeholder="Type your message here..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => {
                const textarea = document.querySelector(
                  "textarea"
                ) as HTMLTextAreaElement;
                handleSendMessage(textarea.value);
                textarea.value = "";
              }}
              disabled={isGenerating}
            >
              Generate
            </button>
            {/* generating */}
            {isGenerating && (
              <div className="flex gap-2 items-center mt-2">
                <Loader className="h-8 w-8 animate-spin text-indigo-600" />
                <p className=" text-gray-500">Generating...</p>
              </div>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className=" font-semibold text-gray-700 ">
                Selected Articles
              </h2>
              <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center h-7 w-7">
                <NavLink to="/admin/rss-articles">
                  <Plus className="h-5 w-5" />
                </NavLink>
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : articles.length === 0 ? (
              <div className="flex flex-col gap-5">
                <p className="px-4">No articles selected.</p>
                <NavLink
                  to="/admin/rss-articles"
                  className="w-fit px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-semibold"
                >
                  Choose Articles
                </NavLink>
              </div>
            ) : (
              <ul className="border list-disc relative max-h-[490px] overflow-y-auto p-2">
                {articles.map((article) => (
                  <div
                    key={article._id}
                    className="mb-2 shadow-sm hover:shadow-md border border-gray-400 bg-gray-50 p-2 rounded-lg relative group"
                  >
                    <Link
                      to={`/admin/rss-articles/${article._id}`}
                      className="block"
                    >
                      <h3 className="font-semibold group-hover:text-blue-500">
                        {article.title}
                      </h3>
                    </Link>
                    <button
                      className="absolute -top-2 -right-2 text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity
                    p-2 bg-gray-200 rounded-full
                    "
                      onClick={() => handleRemoveArticle(article._id!)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="w-2/3">
          <OutputSection
            title={latestOutput.title || "Title"}
            description={
              latestOutput.description || "Generated content will appear here."
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AIEditor;