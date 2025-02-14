// frontend/src/components/FilterPopup.tsx
import React from "react";
import { X, Check } from "lucide-react";

interface Filters {
  categories: string[];
  sources: string[];
  dates: string[];
}

interface FilterPopupProps {
  filters: Filters;
  selectedFilters: {
    categories: string[];
    sourceUrl: string;
    pubDate: string;
    sort: string;
  };
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<{
      categories: string[];
      sourceUrl: string;
      pubDate: string;
      sort: string;
    }>
  >;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clearFilters: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const FilterPopup: React.FC<FilterPopupProps> = ({
  filters,
  selectedFilters,
  setSelectedFilters,
  setIsFilterOpen,
  clearFilters,
  setCurrentPage,
}) => {
  const toggleCategoryFilter = (category: string) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      categories: prevFilters.categories.includes(category)
        ? prevFilters.categories.filter((cat) => cat !== category)
        : [...prevFilters.categories, category],
    }));
    setCurrentPage(1);
  };

  return (
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
            <h4 className="text-sm font-medium text-gray-900 mb-3">Source</h4>
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
            <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
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
  );
};

export default FilterPopup;
