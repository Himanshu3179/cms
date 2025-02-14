import React, { useEffect, useState } from "react";
import { fetchFeeds, fetchFilters } from "../../api";
import { Feed } from "../../types/feeds";
import HeaderSection from "../../components/HeaderSection";
import TableSection from "../../components/TableSection";
import FilterPopup from "../../components/FilterPopup";
import { X } from "lucide-react";

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
  const [clearTableSelection, setClearTableSelection] = useState(false);

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

  const handleClearTableSelection = () => {
    setClearTableSelection(true);
    setTimeout(() => setClearTableSelection(false), 0); // Reset the state after clearing
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className=" max-w-7xl mx-auto">
      <HeaderSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsFilterOpen={setIsFilterOpen}
        clearSearchQuery={clearSearchQuery}
        clearTableSelection={handleClearTableSelection} // Pass the function to clear table selection
      />

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
          <button
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            onClick={clearFilters}
          >
            Clear all
            <X className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}

      <TableSection
        feeds={feeds}
        selectedFilters={selectedFilters}
        toggleCategoryFilter={toggleCategoryFilter}
        clearTableSelection={clearTableSelection} // Pass the state to clear table selection
      />

      {isFilterOpen && (
        <FilterPopup
          filters={filters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          setIsFilterOpen={setIsFilterOpen}
          clearFilters={clearFilters}
          setCurrentPage={setCurrentPage}
        />
      )}

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
