import React, { useEffect, useState } from "react";
import {
  fetchFeeds,
  fetchFilters,
  generateMultipleAiArticles,
  getAvailableModelAuthors,
} from "../../api";
import { Feed } from "../../types/feeds";
import HeaderSection from "../../components/HeaderSection";
import TableSection from "../../components/TableSection";
import FilterPopup from "../../components/FilterPopup";
import GroupSection from "../../components/GroupSection";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

interface Filters {
  categories: string[];
  sources: string[];
  dates: string[];
}

const RSSArticles: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    sources: [],
    dates: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [clearTableSelection, setClearTableSelection] = useState(false);

  // State for AI Article Generation
  const [numberOfArticles, setNumberOfArticles] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticles, setGeneratedArticles] = useState<any[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Use URL query params as the single source for filters and search query
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedFilters = {
    categories: searchParams.getAll("categories"),
    sourceUrl: searchParams.get("sourceUrl") || "",
    pubDate: searchParams.get("pubDate") || "",
    sort: searchParams.get("sort") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    leagues: searchParams.getAll("leagues"),
  };

  const searchQuery = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  // Helper to merge and update search parameters
  const updateSearchParams = (params: Record<string, any>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        sp.delete(key);
        value.forEach((v) => sp.append(key, v));
      } else if (value === "" || value == null) {
        sp.delete(key);
      } else {
        sp.set(key, value);
      }
    });
    setSearchParams(sp);
  };

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
          limit,
          search: searchQuery,
          category: selectedFilters.categories,
          sourceUrl: selectedFilters.sourceUrl,
          pubDate: selectedFilters.pubDate,
          sort: selectedFilters.sort,
          startDate: selectedFilters.startDate,
          endDate: selectedFilters.endDate,
          leagues: selectedFilters.leagues,
        });
        setFeeds(data.data);
        setTotalPages(data.meta.totalPages);
        setTotalArticles(data.meta.totalFeeds);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeeds();
  }, [currentPage, searchQuery, selectedFilters]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await getAvailableModelAuthors();
        setAvailableModels(data.models);
        if (data.models.length > 0) {
          setSelectedModel(data.models[0]);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };
    loadModels();
  }, []);

  const clearFilters = () => {
    updateSearchParams({
      categories: [],
      sourceUrl: "",
      pubDate: "",
      sort: "",
      startDate: "",
      endDate: "",
      leagues: [],
      search: "",
      page: "1",
    });
  };

  const clearSearchQuery = () => {
    updateSearchParams({ search: "", page: "1" });
  };

  const toggleCategoryFilter = (category: string) => {
    const current = selectedFilters.categories;
    let updated: string[];
    if (current.includes(category)) {
      updated = current.filter((cat) => cat !== category);
    } else {
      updated = [...current, category];
    }
    updateSearchParams({ categories: updated, page: "1" });
  };

  const updateSearchQuery = (query: string) => {
    updateSearchParams({ search: query, page: "1" });
  };

  const handleClearTableSelection = () => {
    setClearTableSelection(true);
    setTimeout(() => setClearTableSelection(false), 0);
  };

  const handleGenerateArticles = async () => {
    setIsGenerating(true);
    try {
      const response = await generateMultipleAiArticles({
        modelAuthor: selectedModel,
        filters: {
          category: selectedFilters.categories,
          sourceUrl: selectedFilters.sourceUrl,
          pubDate: selectedFilters.pubDate,
          search: searchQuery,
        },
        numberOfArticles,
        userInstructions: "Generate articles based on the selected filters.",
      });
      setGeneratedArticles(response.generatedArticles);
      toast.success("Articles generated successfully");
    } catch (err: any) {
      toast.error("Failed to generate articles");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto">
      <HeaderSection
        searchQuery={searchQuery}
        setSearchQuery={updateSearchQuery}
        setIsFilterOpen={setIsFilterOpen}
        clearSearchQuery={clearSearchQuery}
        clearTableSelection={handleClearTableSelection}
      />

      {(selectedFilters.categories.length > 0 ||
        selectedFilters.sourceUrl ||
        selectedFilters.pubDate ||
        selectedFilters.startDate ||
        selectedFilters.endDate) && (
        <div className="mb-6 flex flex-wrap gap-2 ">
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
                <span className="sr-only">Remove filter</span>X
              </button>
            </span>
          ))}
          {selectedFilters.sourceUrl && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {selectedFilters.sourceUrl}
              <button
                className="ml-2 hover:text-blue-600"
                onClick={() => updateSearchParams({ sourceUrl: "", page: "1" })}
              >
                <span className="sr-only">Remove filter</span>X
              </button>
            </span>
          )}
          {selectedFilters.startDate && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Start Date: {selectedFilters.startDate}
              <button
                className="ml-2 hover:text-blue-600"
                onClick={() => updateSearchParams({ startDate: "", page: "1" })}
              >
                <span className="sr-only">Remove filter</span>X
              </button>
            </span>
          )}
          {selectedFilters.endDate && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              End Date: {selectedFilters.endDate}
              <button
                className="ml-2 hover:text-blue-600"
                onClick={() => updateSearchParams({ endDate: "", page: "1" })}
              >
                <span className="sr-only">Remove filter</span>X
              </button>
            </span>
          )}
          <button
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            onClick={clearFilters}
          >
            Clear all
            <span className="sr-only">Clear all filters</span>
          </button>
        </div>
      )}
      <div className="flex justify-between mb-4 ">
        <div>Fetched {totalArticles} articles</div>
        <div className="bg-gray-300 p-1 rounded-lg">
          <button
            className={`p-2 rounded-l-lg ${
              viewMode === "table" ? "bg-gray-300" : "bg-white"
            }`}
            onClick={() => setViewMode("table")}
            style={{ outline: "none", boxShadow: "none" }}
          >
            <span className="sr-only">Table View</span>
            <span>Table</span>
          </button>
          <button
            className={`p-2 rounded-r-lg  ${
              viewMode === "grid" ? "bg-gray-300" : "bg-white"
            }`}
            onClick={() => setViewMode("grid")}
            style={{ outline: "none", boxShadow: "none" }}
          >
            <span className="sr-only">Grid View</span>
            <span>Grid</span>
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <TableSection
          feeds={feeds}
          selectedFilters={selectedFilters}
          toggleCategoryFilter={toggleCategoryFilter}
          clearTableSelection={clearTableSelection}
        />
      ) : (
        <GroupSection
          feeds={feeds}
          selectedFilters={selectedFilters}
          toggleCategoryFilter={toggleCategoryFilter}
          clearTableSelection={clearTableSelection}
        />
      )}

      {isFilterOpen && (
        <FilterPopup
          filters={filters}
          selectedFilters={selectedFilters}
          setSearchParams={setSearchParams}
          setIsFilterOpen={setIsFilterOpen}
        />
      )}

      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={() => updateSearchParams({ page: currentPage - 1 })}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 border border-gray-300 rounded-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => updateSearchParams({ page: currentPage + 1 })}
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
