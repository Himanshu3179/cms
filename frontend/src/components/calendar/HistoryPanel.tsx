import React from "react";

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

interface HistoryPanelProps {
  filteredArticles: Article[];
  handleArticleClick: (article: Article) => void;
}

export default function HistoryPanel({
  filteredArticles,
  handleArticleClick,
}: HistoryPanelProps) {
  return (
    <div className="w-1/4 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Article History</h3>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredArticles
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((article) => (
            <div
              key={article.id}
              className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => handleArticleClick(article)}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    article.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {article.status}
                </span>
                <span className="text-xs text-gray-500">{article.date}</span>
              </div>
              <h4 className="font-medium text-sm mb-1 line-clamp-2">
                {article.title}
              </h4>
              <div className="flex items-center text-xs text-gray-500">
                <div className="mr-1">{getWebpageIcon(article.webpage)}</div>
                <span className="mr-2">{article.webpage}</span>
                {article.matchDate && <Clock className="h-3 w-3" />}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
