import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { fetchFeedById } from "../api";
import { Feed } from "../types/feeds";
import { ArrowLeft, Edit, Calendar } from "lucide-react";
import { useSelectedArticles } from "../context/SelectedArticlesContext";

const RssArticleById: React.FC = () => {
  const { id } = useParams();
  if (typeof id !== "string") {
    throw new Error("Invalid id");
  }
  const navigate = useNavigate();
  const { selectedArticles, addArticle, removeArticle } = useSelectedArticles();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleToggle = (id: string) => {
    if (selectedArticles.includes(id)) {
      removeArticle(id);
    } else {
      addArticle(id);
    }
  };

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const data = await fetchFeedById(id);
        setFeed(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [id]);

  if (loading) {
    return <p className="text-center py-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-8">{error}</p>;
  }

  if (!feed) {
    return <p className="text-center py-8">Feed not found</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex gap-2 items-center bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <Link
            to={`/admin/rss-articles/edit/${id}`}
            className="flex gap-2 items-center text-white bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg"
          >
            <Edit size={20} />
            <span>Edit</span>
          </Link>
          <Link
            to={`/admin/scheduler/${id}`}
            className="flex gap-2 items-center text-white bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg"
          >
            <Calendar size={20} />
            <span>Schedule</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-medium">Add to AI Editor</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={selectedArticles.includes(id)}
              onChange={() => handleToggle(id)}
            />
            <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 
              peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
              after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
              peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>
      </div>

      {/* Main Feed Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{feed.title}</h1>
        <div
          className="text-gray-700 mb-4"
          dangerouslySetInnerHTML={{ __html: feed.description }}
        />
        <div className="flex flex-wrap gap-2 mb-4">
          {feed.category.map((cat, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800"
            >
              {cat}
            </span>
          ))}
        </div>
        {feed.customCategory.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {feed.customCategory.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm bg-blue-200 text-blue-800"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Render Markdown content */}
        <div className="prose prose-indigo max-w-none mb-8">
          <ReactMarkdown>{feed.content}</ReactMarkdown>
        </div>

        {/* Source and Link */}
        <div className="mb-4 space-y-2">
          <div>
            <span className="font-semibold">Source:</span>{" "}
            <Link
              to={feed.sourceUrl}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {feed.sourceUrl}
            </Link>
          </div>
          <div>
            <span className="font-semibold">Link:</span>{" "}
            <Link
              to={feed.link}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {feed.link}
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            Published on: {new Date(feed.pubDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* SEO Details */}
      <div className="bg-gray-50 shadow-sm rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">SEO &amp; Metadata</h2>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">SEO Title:</span> {feed.seoTitle}
          </div>
          <div>
            <span className="font-semibold">Meta Description:</span>{" "}
            {feed.metaDescription}
          </div>
          <div>
            <span className="font-semibold">Keywords:</span>{" "}
            {feed.keywords.join(", ")}
          </div>
          <div>
            <span className="font-semibold">Slug:</span> {feed.slug}
          </div>
        </div>
      </div>

      {/* Timestamp Details */}
      <div className="bg-gray-50 shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Timestamps</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <span className="font-semibold">Fetched At:</span>{" "}
            {new Date(feed.fetchedAt).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Created At:</span> {feed.createdAt}
          </div>
          <div>
            <span className="font-semibold">Updated At:</span> {feed.updatedAt}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RssArticleById;
