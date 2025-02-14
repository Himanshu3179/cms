import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Feed } from "../types/feeds";
import { Copy } from "lucide-react";
import { useSelectedArticles } from "../context/SelectedArticlesContext"; // Import context

interface TableSectionProps {
  feeds: Feed[];
  selectedFilters: {
    categories: string[];
  };
  toggleCategoryFilter: (category: string) => void;
  clearTableSelection: boolean; // Update this prop to boolean
}

const TableSection: React.FC<TableSectionProps> = ({
  feeds,
  selectedFilters,
  toggleCategoryFilter,
  clearTableSelection, // Update this prop to boolean
}) => {
  const { selectedArticles, addArticle, removeArticle } = useSelectedArticles();
  const [tableSelectedArticles, setTableSelectedArticles] = useState<string[]>(
    []
  );

  const handleToggle = (id: string) => {
    if (selectedArticles.includes(id)) {
      removeArticle(id);
    } else {
      addArticle(id);
    }
  };

  // Clear table selection when the Add To AI-Editor button is clicked
  useEffect(() => {
    if (clearTableSelection) {
      setTableSelectedArticles([]);
    }
  }, [clearTableSelection]);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categories
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Published Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {feeds.map((feed) => (
            <tr key={feed._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 max-w-xs">
                <Link
                  to={`/admin/rss-articles/${feed._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {feed.title}
                </Link>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
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
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(feed.pubDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add custom checkbox styles */}
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

export default TableSection;
