import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createArticle,
  createAdminArticle,
  updateAdminArticle,
  updateArticle,
} from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Article } from "../types/article";
import { AdminArticle } from "../types";

interface ArticleEditorProps {
  article?: Article | AdminArticle;
  mode: "create" | "edit";
}

const ArticleEditorForm: React.FC<ArticleEditorProps> = ({ article, mode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState(article?.title || "");
  const [description, setDescription] = useState(article?.description || "");
  const [category, setCategory] = useState<string[]>(article?.category || []);
  const [sourceUrl, setSourceUrl] = useState(article?.sourceUrl || "");
  const [isPublished, setIsPublished] = useState(article?.isPublished || false);
  const [error, setError] = useState("");

  const isEditMode = mode === "edit";

  const handleSubmit = async () => {
    setError("");

    try {
      if (user?.role === "writer") {
        if (isEditMode) {
          await updateArticle(article!._id!, {
            title,
            description,
            category,
            sourceUrl,
            isPublished,
          });
          toast.success("Article updated successfully");
        } else {
          await createArticle({
            title,
            description,
            category,
            sourceUrl,
            isPublished,
          });
          toast.success("Article created successfully");
        }
        navigate("/my-articles");
      } else if (user?.role === "admin") {
        if (isEditMode) {
          await updateAdminArticle(article!._id!, {
            title,
            description,
            category,
            sourceUrl,
            isPublished,
          });
          toast.success("Article updated successfully");
        } else {
          await createAdminArticle({
            title,
            description,
            category,
            sourceUrl,
            isPublished,
          });
          toast.success("Article created successfully");
        }
        navigate("/my-articles");
      }
    } catch (err: any) {
      setError(err.message);
      toast.error("An error occurred while saving the article");
    }
  };

  const togglePublish = () => {
    setIsPublished((prev) => !prev);
    toast.success(
      `Article ${isPublished ? "unpublished" : "published"} successfully`
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {isEditMode ? "Edit Article" : "Create a New Article"}
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
          <label className="block text-sm font-medium text-gray-700 mr-2">
            Published
          </label>
          <button
            type="button"
            onClick={togglePublish}
            className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${
              isPublished ? "bg-green-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                isPublished ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        <div className="flex items-center justify-end gap-2">
          <button
            type="submit"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditorForm;
