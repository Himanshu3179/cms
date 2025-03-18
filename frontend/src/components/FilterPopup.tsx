import React from "react";
import { X } from "lucide-react";

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
    startDate: string;
    endDate: string;
    leagues?: string[];
  };
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterPopup: React.FC<FilterPopupProps> = ({
  filters,
  selectedFilters,
  setSearchParams,
  setIsFilterOpen,
}) => {
  const updateParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev.toString());
      if (value === "") {
        sp.delete(key);
      } else {
        sp.set(key, value);
      }
      return sp;
    });
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
          {/* Source Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Source</h4>
            <select
              value={selectedFilters.sourceUrl}
              onChange={(e) => {
                updateParam("sourceUrl", e.target.value);
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
                updateParam("pubDate", e.target.value);
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
        </div>

        <div className="flex gap-4 mt-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Start Date
            </h4>
            <input
              type="date"
              value={selectedFilters.startDate}
              onChange={(e) => {
                updateParam("startDate", e.target.value);
                if (!selectedFilters.endDate) {
                  const nextDay = new Date(e.target.value);
                  nextDay.setDate(nextDay.getDate() + 1);
                  updateParam("endDate", nextDay.toISOString().split("T")[0]);
                }
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">End Date</h4>
            <input
              type="date"
              value={selectedFilters.endDate}
              onChange={(e) => {
                updateParam("endDate", e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
