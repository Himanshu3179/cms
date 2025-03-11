import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Feed } from "../types/feeds";
import { Copy, Sparkles } from "lucide-react";
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
  const [selectAll, setSelectAll] = useState(false);

  const handleToggle = (id: string) => {
    if (selectedArticles.includes(id)) {
      removeArticle(id);
    } else {
      addArticle(id);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      feeds.forEach((feed) => {
        if (selectedArticles.includes(feed._id)) {
          removeArticle(feed._id);
        }
      });
    } else {
      feeds.forEach((feed) => {
        if (!selectedArticles.includes(feed._id)) {
          addArticle(feed._id);
        }
      });
    }
    setSelectAll(!selectAll);
  };

  // Clear table selection when the Add To AI-Editor button is clicked
  useEffect(() => {
    if (clearTableSelection) {
      setTableSelectedArticles([]);
      setSelectAll(false);
    }
  }, [clearTableSelection]);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={selectedArticles.includes(feed._id)}
                  onChange={() => handleToggle(feed._id)}
                />
              </td>
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
              <td className="px-6 py-4 flex gap-2">
                <div className="relative group">
                  <button
                    className="text-gray-400 hover:text-blue-600 p-1 rounded-md"
                    title="Copy"
                    onClick={() =>
                      (window.location.href = `/copy-rss-article/${feed._id}`)
                    }
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-200 text-black text-xs rounded py-1 px-2">
                    Copy
                  </span>
                </div>
                <div className="relative group">
                  <button
                    className="text-gray-400 hover:text-blue-600 p-1 rounded-md"
                    title="Copy"
                    onClick={() =>
                      (window.location.href = `/copy-rss-article/${feed._id}`)
                    }
                  >
                    <Sparkles className="h-5 w-5" />
                  </button>
                  <span className="absolute right-2 bottom-full mb-2 hidden group-hover:block bg-gray-200 text-black text-xs rounded py-1 px-2">
                    Regenerate
                  </span>
                </div>
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
