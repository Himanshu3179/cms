import React, { useEffect, useState } from "react";
import { fetchArticles } from "../api";
import { AdminArticle } from "../types/adminArticles";
import { ArticleCard } from "../components/ArticleCard";

const Dashboard: React.FC = () => {
  // State management
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch articles on component mount
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Loading state */}
      {loading && <p>Loading...</p>}

      {/* Error state */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Articles grid - changed to 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
