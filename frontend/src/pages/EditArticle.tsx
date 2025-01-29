import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArticleById, fetchAdminArticleById } from "../api";
import { Article } from "../types/article";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import ArticleEditorForm from "./ArticleEditorForm";
import { AdminArticle } from "../types";

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | AdminArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticle = async () => {
      try {
        if (id) {
          let data;
          if (user?.role === "admin") {
            data = await fetchAdminArticleById(id);
          } else if (user?.role === "writer") {
            data = await fetchArticleById(id);
          }
          if (data) {
            setArticle(data);
          } else {
            setError("Article not found");
          }
        }
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to load article details");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, user?.role]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!article) {
    return <p>Article not found</p>;
  }

  return <ArticleEditorForm article={article} mode="edit" />;
};

export default EditArticle;
