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
import { AlignJustify, LayoutGrid, X } from "lucide-react";
import toast from "react-hot-toast";
import GroupSection from "../../components/GroupSection";

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

  // State for AI Article Generation
  const [numberOfArticles, setNumberOfArticles] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticles, setGeneratedArticles] = useState<any[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

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

  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await getAvailableModelAuthors();
        setAvailableModels(data.models);
        if (data.models.length > 0) {
          setSelectedModel(data.models[0]); // Set the first model as the selected model
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    loadModels();
  }, []);

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
      <div className="flex justify-end mb-4 ">
        <div className="bg-gray-300 p-1 rounded-lg">
          <button
            className={`p-2 rounded-l-lg ${
              viewMode === "table" ? "bg-gray-300" : "bg-white"
            }`}
            onClick={() => setViewMode("table")}
            style={{ outline: "none", boxShadow: "none" }}
          >
            <AlignJustify className="h-4 w-4" />
          </button>
          <button
            className={`p-2 rounded-r-lg  ${
              viewMode === "grid" ? "bg-gray-300" : "bg-white"
            }`}
            onClick={() => setViewMode("grid")}
            style={{ outline: "none", boxShadow: "none" }}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <TableSection
          feeds={feeds}
          selectedFilters={selectedFilters}
          toggleCategoryFilter={toggleCategoryFilter}
          clearTableSelection={clearTableSelection} // Pass the state to clear table selection
        />
      ) : (
        <GroupSection
          feeds={feeds}
          selectedFilters={selectedFilters}
          toggleCategoryFilter={toggleCategoryFilter}
          clearTableSelection={clearTableSelection} // Pass the state to clear table selection
        />
      )}
      {/* 
      <TableSection
        feeds={feeds}
        selectedFilters={selectedFilters}
        toggleCategoryFilter={toggleCategoryFilter}
        clearTableSelection={clearTableSelection} // Pass the state to clear table selection
      /> */}

      {/* <GroupSection
        feeds={feeds}
        selectedFilters={selectedFilters}
        toggleCategoryFilter={toggleCategoryFilter}
        clearTableSelection={clearTableSelection} // Pass the state to clear table selection
      /> */}

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

      {/* <div className="mt-6 p-4 border border-gray-300 rounded-md">
        <h2 className="text-lg font-semibold text-gray-700">
          Generate Articles
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Articles
        </label>
        <input
          type="number"
          value={numberOfArticles}
          onChange={(e) => setNumberOfArticles(Number(e.target.value))}
          min="1"
          className="block w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose AI Model
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md mb-4"
        >
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        <button
          onClick={handleGenerateArticles}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>

      {generatedArticles.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Generated Articles
          </h2>
          <ul className="space-y-4">
            {generatedArticles.map((article, index) => (
              <li key={index} className="p-4 border border-gray-300 rounded-md">
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: article.processedContent }}
                />
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default RSSArticles;
