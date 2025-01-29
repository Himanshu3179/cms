import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

interface ArticleEditorProps {
  user: {
    role: string;
  };
  fetchArticleById: (id: string) => Promise<any>;
  saveArticle: (data: any, isPublished: boolean) => Promise<void>;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
  user,
  fetchArticleById,
  saveArticle,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [sourceUrl, setSourceUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticle = async () => {
      if (id) {
        try {
          const article = await fetchArticleById(id);
          setTitle(article.title);
          setDescription(article.description);
          setCategory(article.category);
          setSourceUrl(article.sourceUrl || "");
          setIsPublished(article.isPublished || false);
        } catch (err: any) {
          setError(err.message);
          toast.error("Failed to load article details");
        }
      }
    };

    loadArticle();
  }, [id, fetchArticleById]);

  const handleSubmit = async () => {
    setError("");

    try {
      const payload = {
        title,
        description,
        category,
        sourceUrl,
      };

      await saveArticle(payload, isPublished);
      toast.success(`Article ${id ? "updated" : "created"} successfully`);
      navigate(
        user.role === "admin" ? "/admin/admin-articles" : "/user/articles"
      );
    } catch (err: any) {
      setError(err.message);
      toast.error("An error occurred while saving the article");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {id ? "Edit Article" : "Create a New Article"}
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 pl-3 block w-full rounded-md border-gray-300 shadow-sm border focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 pl-3 block w-full rounded-md border-gray-300 shadow-sm border focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            value={category.join(", ")}
            onChange={(e) =>
              setCategory(e.target.value.split(",").map((cat) => cat.trim()))
            }
            className="mt-1 p-2 pl-3 block w-full rounded-md border-gray-300 shadow-sm border focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Source URL
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="mt-1 p-2 pl-3 block w-full rounded-md border-gray-300 shadow-sm border focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label className="block text-sm font-medium text-gray-700 mr-4">
            Publish:
          </label>
          <button
            type="button"
            onClick={() => setIsPublished((prev) => !prev)}
            className={`px-4 py-2 border text-sm font-medium rounded-md ${
              isPublished
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {isPublished ? "True" : "False"}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;
