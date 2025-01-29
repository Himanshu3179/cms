import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchArticleById,
  fetchAdminArticleById,
  deleteArticle,
  deleteAdminArticle,
} from "../api";
import { useAuth } from "../context/AuthContext";
import { AdminArticle, Article } from "../types";
import { Pen, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const MyArticleById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | AdminArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticle = async () => {
      try {
        if (id) {
          let data;
          if (user?.role === "writer") {
            data = await fetchArticleById(id);
          } else if (user?.role === "admin") {
            data = await fetchAdminArticleById(id);
          }
          if (data) {
            setArticle(data);
          } else {
            setError("Article not found");
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, user?.role]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        if (id) {
          if (user?.role === "writer") {
            await deleteArticle(id);
          } else if (user?.role === "admin") {
            await deleteAdminArticle(id);
          }
          toast.success("Article deleted successfully");
          navigate(-1); // Navigate back
        }
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to delete article");
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!article) {
    return <p>Article not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 rounded-lg relative">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => navigate(`/edit/${article._id}`)}
          className="text-blue-600 hover:text-blue-900"
          title="Edit"
        >
          <Pen className="h-5 w-5" />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-900"
          title="Delete"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-600 mb-4">{article.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {article.category.map((category, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full text-sm"
            style={{ backgroundColor: "#E5E7EB", color: "#1F2937" }}
          >
            {category}
          </span>
        ))}
      </div>
      {article.sourceUrl && (
        <div>
          Source :-
          <Link
            to={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            {article.sourceUrl}
          </Link>
        </div>
      )}
      <p className="text-sm text-gray-500 mt-4">
        Published on: {new Date(article.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default MyArticleById;
