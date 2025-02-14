import React from "react";
import { X, Filter, Brain } from "lucide-react";
import { useSelectedArticles } from "../context/SelectedArticlesContext"; // Import context
import { NavLink } from "react-router-dom";

interface HeaderSectionProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clearSearchQuery: () => void;
  clearTableSelection: () => void; // Add this prop to clear table selection
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  searchQuery,
  setSearchQuery,
  setIsFilterOpen,
  clearSearchQuery,
}) => {
  const { selectedArticles } = useSelectedArticles(); // Get selected articles and clearArticles function

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Sources</h2>
      <div className="w-full sm:w-auto flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        {selectedArticles.length > 0 && (
          <NavLink
            to="/admin/ai-editor"
            className={`flex items-center gap-2 px-4 py-2 border ${
              selectedArticles.length > 0
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500"
            } border-blue-300 rounded-lg hover:bg-blue-400`}
          >
            <Brain className="h-5 w-5" />
            <span className="hidden sm:inline">
              AI Editor ({selectedArticles.length})
            </span>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;
