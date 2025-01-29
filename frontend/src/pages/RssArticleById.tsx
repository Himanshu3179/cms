import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchFeedById } from "../api";
import { Feed } from "../types/feeds";

const RssArticleById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFeed = async () => {
      try {
        if (id) {
          const data = await fetchFeedById(id);

          setFeed(data);
        }
      } catch (err: any) {
        setError(err.message);
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

  if (!feed) {
    return <p>Feed not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{feed.title}</h1>
      <div
        className="text-gray-600 mb-4"
        dangerouslySetInnerHTML={{ __html: feed.description }}
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {feed.category.map((category, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full text-sm"
            style={{ backgroundColor: "#E5E7EB", color: "#1F2937" }}
          >
            {category}
          </span>
        ))}
      </div>
      <div>
        <div>
          Source :-
          <Link
            to={feed.sourceUrl}
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            {" "}
            {feed.sourceUrl}
          </Link>
        </div>
        <div>
          Link :-
          <Link
            to={feed.link}
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            {" "}
            {feed.link}
          </Link>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Published on: {new Date(feed.pubDate).toLocaleDateString()}
      </p>
    </div>
  );
};

export default RssArticleById;
