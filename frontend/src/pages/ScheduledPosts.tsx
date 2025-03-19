import { useEffect, useState } from "react";
import { fetchScheduledArticles } from "../api";
import { ScheduledArticleData } from "../types/scheduledArticle";
import { Clock } from "lucide-react";

export default function ScheduledPosts() {
  const [articles, setArticles] = useState<ScheduledArticleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadScheduledArticles = async () => {
      try {
        const data = await fetchScheduledArticles();
        setArticles(data || []); // Default to empty array
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadScheduledArticles();
  }, []);

  if (loading) {
    return <p className="text-center py-8">Loading scheduled articles...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-8">{error}</p>;
  }

  if (articles.length === 0) {
    return <p className="text-center py-8">No scheduled articles found.</p>;
  }

  // Sort articles descending by scheduledAt
  const sortedArticles = articles.sort(
    (a, b) =>
      new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );

  const handleArticleClick = (article: ScheduledArticleData) => {
    // Replace with your logic (e.g., open a modal)
    console.log("Article clicked:", article);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Scheduled Articles</h3>
      <div className="space-y-4">
        {sortedArticles.map((article) => (
          <div
            key={article._id}
            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => handleArticleClick(article)}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  article.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {article.status}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(article.scheduledAt).toLocaleDateString()}
              </span>
            </div>
            <h4 className="font-medium text-sm mb-1 line-clamp-2">
              {article.caption || "No caption"}
            </h4>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span className="ml-2">Platform: {article.postingPlatform}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
