import React, { useEffect, useState } from "react";
import { fetchAIGeneratedArticles } from "../../api";
import { AiArticle } from "../../types/aiArticles";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AIGeneratedArticles: React.FC = () => {
  const [articles, setArticles] = useState<AiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchAIGeneratedArticles();
        console.log(data);
        setArticles(data);
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to load AI-generated articles");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        AI-Generated Articles
      </h1>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Processed At
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {articles.map((article) => (
              <tr key={article._id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {article.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(article.processedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600 flex space-x-2">
                  <Link
                    to={`/admin/ai-generated-articles/${article._id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AIGeneratedArticles;
