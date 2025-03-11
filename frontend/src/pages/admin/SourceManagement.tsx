import React, { useEffect, useState } from "react";
import { fetchFeeds, fetchFilters } from "../../api";
import { Feed, FiltersResponse } from "../../types/feeds";
import toast from "react-hot-toast";

const SourceManagement: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [numberOfArticles, setNumberOfArticles] = useState<number>(1);

  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const data = await fetchFeeds({ limit: 1000 }); // Ensure fetching all feeds
        setFeeds(data.data);
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to load feeds");
      } finally {
        setLoading(false);
      }
    };

    loadFeeds();
  }, []);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data: FiltersResponse = await fetchFilters();
        setSources(data.sources);
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to load filters");
      }
    };

    loadFilters();
  }, []);

  const getArticleCountBySource = (source: string) => {
    return feeds.filter((feed) => feed.sourceUrl === source).length;
  };

  const extractDomain = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return hostname;
    } catch {
      return url;
    }
  };

  const handleGenerateArticles = async () => {
    if (!selectedSource) return;
    try {
      //   await generateMultipleAiArticles({
      //     sourceUrl: selectedSource,
      //     numberOfArticles,
      //   });
      toast.success("Articles generated successfully");
    } catch (err: any) {
      toast.error("Failed to generate articles");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Source Management
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-x-4 flex flex-wrap">
          {sources.map((source) => (
            <div
              key={source}
              className={`p-4 border border-gray-300 rounded-md cursor-pointer ${
                selectedSource === source ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedSource(source)}
            >
              <h2 className="text-sm font-semibold text-gray-700">
                {extractDomain(source)}
              </h2>
              <p className="text-sm text-gray-500">
                Number of articles: {getArticleCountBySource(source)}
              </p>
            </div>
          ))}
        </div>
      )}
      {selectedSource && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Generate Articles for {extractDomain(selectedSource)}
          </h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Articles
          </label>
          <input
            type="number"
            value={numberOfArticles}
            onChange={(e) => setNumberOfArticles(Number(e.target.value))}
            min="1"
            className="block w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <button
            onClick={handleGenerateArticles}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Generate
          </button>
        </div>
      )}
    </div>
  );
};

export default SourceManagement;
