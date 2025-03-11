import React from "react";
import { format, isSameDay } from "date-fns";

import { getWebpageIcon } from "../../utils/iconUtils";
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

// Time slots for week view
const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

interface CalendarWeekViewProps {
  calendarDays: Date[];
  filteredArticles: Article[];
  handleArticleClick: (article: Article) => void;
}

export default function CalendarWeekView({
  calendarDays,
  filteredArticles,
  handleArticleClick,
}: CalendarWeekViewProps) {
  return (
    <div className="flex">
      {/* Time column */}
      <div className="w-16 border-r">
        <div className="h-12 border-b"></div> {/* Empty cell for day headers */}
        {timeSlots.map((hour) => (
          <div
            key={hour}
            className="h-20 border-b flex items-start justify-end pr-2 pt-1"
          >
            <span className="text-xs text-gray-500">
              {hour % 12 || 12} {hour >= 12 ? "PM" : "AM"}
            </span>
          </div>
        ))}
      </div>

      {/* Days columns */}
      <div className="flex-1 grid grid-cols-7">
        {/* Day headers */}
        {calendarDays.map((day) => (
          <div
            key={day.toString()}
            className="h-12 border-b border-r flex flex-col items-center justify-center"
          >
            <div className="text-sm font-medium">{format(day, "EEE")}</div>
            <div
              className={`text-sm ${
                isSameDay(day, new Date())
                  ? "bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
                  : ""
              }`}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}

        {/* Time slots for each day */}
        {calendarDays.map((day) => (
          <React.Fragment key={day.toString()}>
            {timeSlots.map((hour) => {
              const slotArticles = filteredArticles.filter((article) => {
                const articleDate = new Date(article.date);
                return (
                  isSameDay(articleDate, day) && articleDate.getHours() === hour
                );
              });

              return (
                <div
                  key={`${day}-${hour}`}
                  className="h-20 border-b border-r p-1 relative"
                >
                  {slotArticles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => handleArticleClick(article)}
                      className={`w-full text-left text-xs p-2 rounded hover:opacity-75 transition-opacity mb-1 ${
                        article.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="mr-1">
                          {getWebpageIcon(article.webpage)}
                        </div>
                        <div className="font-medium truncate">
                          {article.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
