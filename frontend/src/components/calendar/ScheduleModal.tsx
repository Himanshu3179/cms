import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { X } from "lucide-react";
import { Article } from "../CalendarView";
import ArticleSelector from "./ArticleSelector"; // Reuse your ArticleSelector component

export interface ScheduledArticleData {
  articleId: string;
  scheduledAt: string;
  postingPlatform: string;
  caption: string;
  hashtags: string[];
  // Optionally, add schedulingRules here in the future
}

interface ScheduleModalProps {
  articles: Article[];
  onClose: () => void;
  onScheduleCreated: (data: ScheduledArticleData) => void;
}

export default function ScheduleModal({
  articles,
  onClose,
  onScheduleCreated,
}: ScheduleModalProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string>("");
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [postingPlatform, setPostingPlatform] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState<string>("");

  // When the user presses Enter, add the hashtag to the chip list.
  const handleHashtagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newHashtag.trim() !== "") {
      e.preventDefault();
      setHashtags((prev) => [...prev, newHashtag.trim()]);
      setNewHashtag("");
    }
  };

  const removeHashtag = (index: number) => {
    setHashtags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticleId || !scheduledAt || !postingPlatform) {
      alert("Please fill in all required fields.");
      return;
    }
    const data: ScheduledArticleData = {
      articleId: selectedArticleId,
      scheduledAt,
      postingPlatform,
      caption,
      hashtags,
    };
    onScheduleCreated(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Schedule Article</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Article Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Article
            </label>
            <ArticleSelector
              articles={articles}
              selectedArticleId={selectedArticleId}
              onChange={setSelectedArticleId}
            />
          </div>

          {/* Scheduled Date/Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled At
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Posting Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posting Platform
            </label>
            <input
              type="text"
              value={postingPlatform}
              onChange={(e) => setPostingPlatform(e.target.value)}
              placeholder="e.g., Premier League"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Hashtags Chip Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hashtags{" "}
              <span className="text-xs text-gray-500">
                (press Enter to add)
              </span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeHashtag(idx)}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type a hashtag and press Enter"
              value={newHashtag}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewHashtag(e.target.value)
              }
              onKeyDown={handleHashtagKeyDown}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit and Cancel buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
