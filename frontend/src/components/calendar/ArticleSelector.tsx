// src/components/calendar/ArticleSelector.tsx
import React from "react";
import { Article } from "../CalendarView";

interface ArticleSelectorProps {
  articles: Article[];
  selectedArticleId: string;
  onChange: (articleId: string) => void;
}

export default function ArticleSelector({
  articles,
  selectedArticleId,
  onChange,
}: ArticleSelectorProps) {
  return (
    <select
      className="border border-gray-300 rounded px-3 py-2 w-full"
      value={selectedArticleId}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-- Select an Article --</option>
      {articles.map((article) => (
        <option key={article.id} value={article.id}>
          {article.title}
        </option>
      ))}
    </select>
  );
}
