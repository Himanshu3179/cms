import React from "react";
import { isSameMonth, format, isSameDay } from "date-fns";

import { getWebpageIcon } from "../../utils/iconUtils";
import { Clock } from "lucide-react";
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

interface CalendarMonthViewProps {
  calendarDays: Date[];
  currentDate: Date;
  getArticlesForDay: (day: Date) => Article[];
  handleArticleClick: (article: Article) => void;
}

export default function CalendarMonthView({
  calendarDays,
  currentDate,
  getArticlesForDay,
  handleArticleClick,
}: CalendarMonthViewProps) {
  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
        >
          {day}
        </div>
      ))}
      {calendarDays.map((day, dayIdx) => {
        const dayArticles = getArticlesForDay(day);
        return (
          <div
            key={day.toString()}
            className={`bg-white min-h-[120px] p-2 ${
              !isSameMonth(day, currentDate) ? "bg-gray-50" : ""
            }`}
          >
            <div className="font-medium text-sm text-gray-500">
              {format(day, "d")}
            </div>
            <div className="mt-1 space-y-1 max-h-[100px] overflow-y-auto">
              {dayArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className={`w-full text-left text-xs p-2 rounded hover:opacity-75 transition-opacity ${
                    article.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  <div className="font-medium truncate">{article.title}</div>
                  <div className="text-xs opacity-75 flex items-center mt-1">
                    <div className="mr-1">
                      {getWebpageIcon(article.webpage)}
                    </div>
                    <span className="mr-2">{article.webpage}</span>
                    {article.matchDate && <Clock className="h-3 w-3" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
