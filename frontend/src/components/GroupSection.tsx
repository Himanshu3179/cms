import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Feed } from "../types/feeds";
import { Copy } from "lucide-react";
import { useSelectedArticles } from "../context/SelectedArticlesContext";

interface GroupSectionProps {
  feeds: Feed[];
  selectedFilters: {
    categories: string[];
  };
  toggleCategoryFilter: (category: string) => void;
  clearTableSelection: boolean;
}

const GroupSection: React.FC<GroupSectionProps> = ({
  feeds,
  selectedFilters,
  toggleCategoryFilter,
  clearTableSelection,
}) => {
  const { selectedArticles, addArticle, removeArticle } = useSelectedArticles();
  const [groupSelectedArticles, setGroupSelectedArticles] = useState<string[]>(
    []
  );

  const handleToggle = (id: string) => {
    if (selectedArticles.includes(id)) {
      removeArticle(id);
    } else {
      addArticle(id);
    }
  };

  // Clear selection when needed
  useEffect(() => {
    if (clearTableSelection) {
      setGroupSelectedArticles([]);
    }
  }, [clearTableSelection]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {feeds.map((feed) => (
        <div
          key={feed._id}
          className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
        >
          {/* Title */}
          <Link
            to={`/admin/rss-articles/${feed._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-lg mb-2"
          >
            {feed.title}
          </Link>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-2">
            {feed.category.map((cat) => (
              <span
                key={cat}
                className={`px-2 py-1 rounded-full text-xs cursor-pointer ${
                  selectedFilters.categories.includes(cat)
                    ? "bg-blue-200 text-blue-800"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => toggleCategoryFilter(cat)}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Published Date */}
          <div className="text-sm text-gray-500 mb-2">
            {new Date(feed.pubDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              className="text-gray-400 hover:text-blue-600 p-1 rounded-md"
              title="Copy"
              onClick={() =>
                (window.location.href = `/copy-rss-article/${feed._id}`)
              }
            >
              <Copy className="h-5 w-5" />
            </button>
            <input
              type="checkbox"
              className="custom-checkbox ml-2"
              checked={selectedArticles.includes(feed._id)}
              onChange={() => handleToggle(feed._id)}
            />
          </div>
        </div>
      ))}

      {/* Custom checkbox styles */}
      <style>{`
        .custom-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #3b82f6; /* Blue border */
          border-radius: 4px;
          background-color: #fff;
          appearance: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .custom-checkbox:checked {
          background-color: #3b82f6; /* Blue background when checked */
          border-color: #3b82f6;
        }

        .custom-checkbox:checked::before {
          content: '\\2713'; /* Checkmark */
          display: block;
          text-align: center;
          color: #fff;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default GroupSection;
