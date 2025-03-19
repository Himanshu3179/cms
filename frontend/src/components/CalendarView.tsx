import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  setMonth,
  setYear,
} from "date-fns";

import CalendarMonthView from "./calendar/CalendarMonthView";
import ArticleModal from "./calendar/ArticleModal";
import HistoryPanel from "./calendar/HistoryPanel";
import FiltersPanel from "./calendar/FiltersPanel";
import DatePickerDropdown from "./calendar/DatePickerDropdown";

export interface Article {
  id: string;
  title: string;
  status: "published" | "scheduled";
  date: string;
  webpage: string;
  matchDate?: string;
  competition?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  canonicalUrl?: string;
  content?: string;
  images?: ArticleImage[];
  internalLinks?: InternalLink[];
}

export interface ArticleImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  position: "left" | "right" | "center" | "full";
  width?: number;
  height?: number;
}

export interface InternalLink {
  id: string;
  targetArticleId: string;
  targetTitle: string;
  keyword: string;
  url: string;
}

const mockArticles: Article[] = [
  {
    id: "1",
    title:
      "Match Report: Arsenal Secure Dramatic Victory Over Manchester United",
    status: "published",
    date: "2025-03-10",
    webpage: "Premier League",
    matchDate: "2025-03-09",
    competition: "Premier League",
    content: "Arsenal secured a dramatic 3-2 victory over Manchester United...",
    seoTitle: "Arsenal vs Manchester United Match Report - Premier League 2025",
    seoDescription:
      "Full match report of Arsenal's thrilling 3-2 victory over Manchester United in the Premier League.",
    seoKeywords: [
      "Arsenal",
      "Manchester United",
      "Premier League",
      "Match Report",
    ],
  },
  {
    id: "2",
    title: "Champions League Preview: Real Madrid vs Manchester City",
    status: "scheduled",
    date: "2025-03-15",
    webpage: "Champions League",
    matchDate: "2025-03-16",
    competition: "Champions League",
    content: "Preview of the upcoming Champions League clash...",
    seoTitle: "Real Madrid vs Manchester City Preview - Champions League 2025",
    seoDescription:
      "Preview of the highly anticipated Champions League quarter-final between Real Madrid and Manchester City.",
    seoKeywords: [
      "Real Madrid",
      "Manchester City",
      "Champions League",
      "Preview",
    ],
  },
  {
    id: "3",
    title: "Transfer Update: Harry Kane Set for Premier League Return",
    status: "scheduled",
    date: "2025-03-20",
    webpage: "Transfer News",
    competition: "Transfers",
    content: "Latest transfer news regarding Harry Kane...",
    seoTitle: "Harry Kane Transfer News - Premier League Return",
    seoDescription:
      "Latest updates on Harry Kane's potential return to the Premier League.",
    seoKeywords: ["Harry Kane", "Transfer News", "Premier League"],
  },
  {
    id: "4",
    title: "Top 10 Goals of the Champions League Group Stage",
    status: "published",
    date: "2025-03-08",
    webpage: "Champions League",
    competition: "Champions League",
    content: "Ranking the best goals from the group stage...",
    seoTitle: "Top 10 Champions League Group Stage Goals 2025",
    seoDescription:
      "Countdown of the most spectacular goals from the Champions League group stage.",
    seoKeywords: ["Champions League", "Goals", "Top 10"],
  },
  {
    id: "5",
    title: "Tactical Analysis: How Liverpool Dominated Chelsea",
    status: "scheduled",
    date: "2025-03-25",
    webpage: "Premier League",
    matchDate: "2025-03-24",
    competition: "Premier League",
    content: "In-depth tactical analysis of Liverpool's performance...",
    seoTitle: "Liverpool vs Chelsea Tactical Analysis - Premier League 2025",
    seoDescription:
      "Detailed tactical breakdown of Liverpool's dominant performance against Chelsea.",
    seoKeywords: [
      "Liverpool",
      "Chelsea",
      "Tactical Analysis",
      "Premier League",
    ],
  },
  {
    id: "6",
    title: "Serie A Weekly Roundup: Inter Milan Extends Lead",
    status: "scheduled",
    date: "2025-03-26",
    webpage: "Serie A",
    matchDate: "2025-03-24",
    competition: "Serie A",
    content:
      "Weekly roundup of all Serie A matches with focus on Inter Milan...",
    seoTitle: "Serie A Weekly Roundup - Inter Milan Extends Lead",
    seoDescription:
      "Complete coverage of this week's Serie A action as Inter Milan extends their lead at the top.",
    seoKeywords: [
      "Serie A",
      "Inter Milan",
      "Italian Football",
      "Weekly Roundup",
    ],
  },
  {
    id: "7",
    title: "La Liga Transfer Rumors: Barcelona Eyes Premier League Talent",
    status: "scheduled",
    date: "2025-03-18",
    webpage: "La Liga",
    competition: "La Liga",
    content: "Barcelona scouts monitoring several Premier League players...",
    seoTitle: "Barcelona Transfer Rumors - Premier League Targets",
    seoDescription:
      "Latest transfer rumors linking Barcelona with moves for Premier League stars.",
    seoKeywords: ["Barcelona", "La Liga", "Transfer Rumors", "Premier League"],
  },
  {
    id: "8",
    title: "Bundesliga Match Preview: Bayern Munich vs Borussia Dortmund",
    status: "scheduled",
    date: "2025-03-30",
    webpage: "Bundesliga",
    matchDate: "2025-03-30",
    competition: "Bundesliga",
    content:
      "Preview of the upcoming Der Klassiker between Bayern and Dortmund...",
    seoTitle: "Bayern Munich vs Borussia Dortmund Preview - Bundesliga 2025",
    seoDescription:
      "Complete preview of the highly anticipated Der Klassiker between Bayern Munich and Borussia Dortmund.",
    seoKeywords: [
      "Bayern Munich",
      "Borussia Dortmund",
      "Bundesliga",
      "Der Klassiker",
    ],
  },
];

export const mockWebpages = [
  { name: "Premier League", model: "gpt-4", icon: "football" },
  { name: "Champions League", model: "gpt-4", icon: "trophy" },
  { name: "Transfer News", model: "gpt-3.5", icon: "refresh-cw" },
  { name: "Match Analysis", model: "gpt-4", icon: "bar-chart" },
  { name: "Serie A", model: "gpt-3.5", icon: "flag" },
  { name: "La Liga", model: "gpt-3.5", icon: "sun" },
  { name: "Bundesliga", model: "gpt-3.5", icon: "shield" },
];

export default function CalendarView() {
  const [selectedWebpages, setSelectedWebpages] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedArticle, setEditedArticle] = useState<Partial<Article>>({});
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredArticles = useMemo(() => {
    return mockArticles.filter((article) => {
      const matchesWebpage =
        selectedWebpages.length === 0 ||
        selectedWebpages.includes(article.webpage);
      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(article.status);
      const matchesSearch =
        searchTerm === "" ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.webpage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.competition &&
          article.competition.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesWebpage && matchesStatus && matchesSearch;
    });
  }, [selectedWebpages, statusFilter, searchTerm]);

  // Always use month view
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getArticlesForDay = (day: Date) => {
    return filteredArticles.filter((article) =>
      isSameDay(parseISO(article.date), day)
    );
  };

  const nextPeriod = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevPeriod = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setEditedArticle(article);
    setShowArticleModal(true);
    setEditMode(false);
  };

  const handleEditSave = () => {
    // In a real application, this would update the database
    console.log("Saving edited article:", editedArticle);
    setEditMode(false);
    setShowArticleModal(false);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setCurrentDate(setMonth(currentDate, newMonth));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setCurrentDate(setYear(currentDate, newYear));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // This function stops event propagation to prevent the dropdown from closing
  const handleDatePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter Button */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Football Articles Calendar
          </h1>
          <div className="bg-white rounded-lg shadow p-1">
            <button className="px-3 py-1.5 rounded bg-indigo-100 text-indigo-700">
              <CalendarIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search articles by title, website, or competition..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
            >
              <Clock className="h-5 w-5 mr-2" />
              History
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className={`${showHistoryPanel ? "w-3/4" : "w-full"}`}>
          {/* Filters Panel */}
          {showFilters && (
            <FiltersPanel
              selectedWebpages={selectedWebpages}
              setSelectedWebpages={setSelectedWebpages}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          )}

          {/* Calendar Header */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={prevPeriod}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="text-xl font-semibold flex items-center"
                  >
                    {format(currentDate, "MMMM yyyy")}
                    <ChevronRight
                      className={`h-4 w-4 ml-1 transform transition-transform ${
                        showDatePicker ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {showDatePicker && (
                    <div
                      className="absolute mt-32 bg-white shadow-lg rounded-lg p-3 z-10"
                      onClick={handleDatePickerClick}
                    >
                      <DatePickerDropdown
                        currentDate={currentDate}
                        handleMonthChange={handleMonthChange}
                        handleYearChange={handleYearChange}
                        goToToday={goToToday}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={nextPeriod}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <CalendarMonthView
              calendarDays={calendarDays}
              currentDate={currentDate}
              getArticlesForDay={getArticlesForDay}
              handleArticleClick={handleArticleClick}
            />
          </div>
        </div>

        {/* History Panel */}
        {showHistoryPanel && (
          <HistoryPanel
            filteredArticles={filteredArticles}
            handleArticleClick={handleArticleClick}
          />
        )}
      </div>

      {/* Article Modal */}
      {showArticleModal && (
        <ArticleModal
          selectedArticle={selectedArticle}
          editMode={editMode}
          setEditMode={setEditMode}
          editedArticle={editedArticle}
          setEditedArticle={setEditedArticle}
          setShowArticleModal={setShowArticleModal}
          handleEditSave={handleEditSave}
        />
      )}
    </div>
  );
}
