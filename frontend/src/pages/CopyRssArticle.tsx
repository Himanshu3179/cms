import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArticleEditorForm from "./ArticleEditorForm";
import { fetchFeedById } from "../api";
import { Feed, AdminArticle } from "../types";
import toast from "react-hot-toast";

const CopyRssArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Partial<AdminArticle> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFeed = async () => {
      try {
        if (id) {
          const feed: Feed = await fetchFeedById(id);
          const newArticle: Partial<AdminArticle> = {
            title: feed.title,
            description: feed.description,
            category: feed.category,
            sourceUrl: feed.link,
          };
          setArticle(newArticle);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to load feed details");
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!article) {
    return <p>Feed not found</p>;
  }

  return <ArticleEditorForm mode="create" article={article as AdminArticle} />;
};

export default CopyRssArticle;
