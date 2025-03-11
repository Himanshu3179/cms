import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAIGeneratedArticleById } from "../../api";
import { AiArticle } from "../../types/aiArticles";
import toast from "react-hot-toast";

const AIGeneratedArticleById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<AiArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticle = async () => {
      try {
        if (id) {
          const data = await fetchAIGeneratedArticleById(id);
          setArticle(data);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to load AI-generated article");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <div
        className="text-gray-600 mb-4"
        dangerouslySetInnerHTML={{ __html: article.processedContent }}
      />
      <div className="mb-4">
        <h2 className="text-xl font-semibold">SEO Metadata</h2>
        <p>
          <strong>Meta Title:</strong> {article.seo.metaTitle}
        </p>
        <p>
          <strong>Meta Description:</strong> {article.seo.metaDescription}
        </p>
        <p>
          <strong>Keywords:</strong> {article.seo.keywords.join(", ")}
        </p>
      </div>
      <p className="text-sm text-gray-500">
        Processed At: {new Date(article.processedAt).toLocaleString()}
      </p>
      {article.errorMessage && (
        <p className="text-sm text-red-500">Error: {article.errorMessage}</p>
      )}
      <Link
        to="/admin/ai-generated-articles"
        className="text-blue-600 hover:text-blue-900"
      >
        Back to AI-Generated Articles
      </Link>
    </div>
  );
};

export default AIGeneratedArticleById;
