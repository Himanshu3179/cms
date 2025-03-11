import React from "react";

import {
  Eye,
  Edit,
  CalendarDays as CalendarDate,
  ChevronRight,
} from "lucide-react";
import { getWebpageIcon } from "../../utils/iconUtils";
import { mockWebpages } from "../CalendarView";
import DatePickerDropdown from "./DatePickerDropdown";
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

interface CalendarListViewProps {
  filteredArticles: Article[];
  handleArticleClick: (article: Article) => void;
  setEditMode: (value: boolean) => void;
  setSelectedArticle: (article: Article | null) => void;
  setEditedArticle: (article: Partial<Article>) => void;
  setShowArticleModal: (value: boolean) => void;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
  currentDate: Date;
  handleMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  goToToday: () => void;
}

export default function CalendarListView({
  filteredArticles,
  handleArticleClick,
  setEditMode,
  setSelectedArticle,
  setEditedArticle,
  setShowArticleModal,
  showDatePicker,
  setShowDatePicker,
  currentDate,
  handleMonthChange,
  handleYearChange,
  goToToday,
}: CalendarListViewProps) {
  // This function stops event propagation to prevent the dropdown from closing
  const handleDatePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Article List</h2>
          <div className="flex items-center">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <CalendarDate className="h-5 w-5 mr-1" />
              Filter by date
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
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Competition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Match Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publish Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AI Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredArticles.map((article) => {
              const webpage = mockWebpages.find(
                (w) => w.name === article.webpage
              );
              return (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {article.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {article.competition}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        article.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {article.matchDate || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{article.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getWebpageIcon(article.webpage)}
                      <span className="ml-2 text-sm text-gray-900">
                        {article.webpage}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {webpage?.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleArticleClick(article)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedArticle(article);
                        setEditedArticle(article);
                        setShowArticleModal(true);
                        setEditMode(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
