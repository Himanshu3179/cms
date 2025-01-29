import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAdminArticles,
  updateAdminArticle,
  deleteAdminArticle,
} from "../../api";
import { AdminArticle } from "../../types/adminArticles";
import { Eye, EyeOff, Pen, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const AdminArticles: React.FC = () => {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchAdminArticles();
        setArticles(data);
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const togglePublish = async (id: string) => {
    const article = articles.find((article) => article._id === id);
    if (article) {
      try {
        const updatedArticle = {
          ...article,
          isPublished: !article.isPublished,
        };
        await updateAdminArticle(id, updatedArticle);
        setArticles((prevArticles) =>
          prevArticles.map((a) =>
            a._id === id ? { ...a, isPublished: !a.isPublished } : a
          )
        );
        toast.success(
          `Article ${
            article.isPublished ? "unpublished" : "published"
          } successfully`
        );
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to update article status");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteAdminArticle(id);
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article._id !== id)
        );
        toast.success("Article deleted successfully");
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to delete article");
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">Admin Articles</h2>
      <p className="mt-2 text-gray-600">Manage admin articles here.</p>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                Categories
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {articles.map((article) => (
              <tr key={article._id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <Link
                    to={`/admin/admin-articles/${article._id}`}
                    className="hover:text-blue-700 hover:underline"
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.category.join(", ")}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      article.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {article.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-blue-600 flex space-x-2">
                  <button
                    onClick={() => togglePublish(article._id!)}
                    className="text-blue-600 hover:text-blue-900"
                    title={article.isPublished ? "Unpublish" : "Publish"}
                  >
                    {article.isPublished ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => navigate(`/edit/${article._id}`)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit"
                  >
                    <Pen className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(article._id!)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArticles;
