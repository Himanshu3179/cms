import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchFeeds, fetchFilters } from "../../api";
import { Feed } from "../../types/feeds";
import { Copy, X, Filter, Check } from "lucide-react";

interface Filters {
  categories: string[];
  sources: string[];
  dates: string[];
}

const RSSArticles: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    sources: [],
    dates: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    sourceUrl: "",
    pubDate: "",
    sort: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const categoryPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await fetchFilters();
        setFilters({
          categories: data.categories,
          sources: data.sources,
          dates: data.dates.map(
            (date: { year: number; month: number; day: number }) =>
              `${date.year}-${String(date.month).padStart(2, "0")}-${String(
                date.day
              ).padStart(2, "0")}`
          ),
        });
      } catch (err: any) {
        console.error("Failed to fetch filters", err);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const data = await fetchFeeds({
          page: currentPage,
          search: searchQuery,
          category: selectedFilters.categories,
          sourceUrl: selectedFilters.sourceUrl,
          pubDate: selectedFilters.pubDate,
          sort: selectedFilters.sort,
        });
        setFeeds(data.data);
        setTotalPages(data.meta.totalPages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeeds();
  }, [currentPage, searchQuery, selectedFilters]);

  const clearFilters = () => {
    setSelectedFilters({
      categories: [],
      sourceUrl: "",
      pubDate: "",
      sort: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const clearSearchQuery = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const toggleCategoryFilter = (category: string) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      categories: prevFilters.categories.includes(category)
        ? prevFilters.categories.filter((cat) => cat !== category)
        : [...prevFilters.categories, category],
    }));
    setCurrentPage(1);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      categoryPopupRef.current &&
      !categoryPopupRef.current.contains(event.target as Node)
    ) {
      setIsCategoryPopupOpen(false);
    }
  };

  useEffect(() => {
    if (isCategoryPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryPopupOpen]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">RSS Articles</h2>
        <div className="w-full sm:w-auto flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={clearSearchQuery}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-5 w-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {Object.values(selectedFilters).some((val) =>
        Array.isArray(val) ? val.length > 0 : val !== ""
      ) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {selectedFilters.categories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
              {category}
              <button
                className="ml-2 hover:text-blue-600"
                onClick={() => toggleCategoryFilter(category)}
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
          {selectedFilters.sourceUrl && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {selectedFilters.sourceUrl}
              <button
                className="ml-2 hover:text-blue-600"
                onClick={() =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    sourceUrl: "",
                  }))
                }
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          )}
          {/* Add similar blocks for other filters */}
          <button
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            onClick={clearFilters}
          >
            Clear all
            <X className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}

      {/* Table Section */}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Filter Popup */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-xl animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Filters</h3>
              <button
                className="p-1 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Categories Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Categories
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2">
                  {filters.categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategoryFilter(cat)}
                      className={`flex items-center justify-between px-4 py-2 rounded-lg border ${
                        selectedFilters.categories.includes(cat)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <span className="text-sm">{cat}</span>
                      {selectedFilters.categories.includes(cat) && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Source
                </h4>
                <select
                  value={selectedFilters.sourceUrl}
                  onChange={(e) => {
                    setSelectedFilters((prev) => ({
                      ...prev,
                      sourceUrl: e.target.value,
                    }));
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sources</option>
                  {filters.sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Date</h4>
                <select
                  value={selectedFilters.pubDate}
                  onChange={(e) => {
                    setSelectedFilters((prev) => ({
                      ...prev,
                      pubDate: e.target.value,
                    }));
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Dates</option>
                  {filters.dates.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Sort By
                </h4>
                <div className="space-y-2">
                  {["Default", "Recent", "Published Date"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.toLowerCase()}
                        checked={selectedFilters.sort === option.toLowerCase()}
                        onChange={(e) => {
                          setSelectedFilters((prev) => ({
                            ...prev,
                            sort: e.target.value,
                          }));
                          setCurrentPage(1);
                        }}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <button
                onClick={clearFilters}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 border border-gray-300 rounded-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RSSArticles;
