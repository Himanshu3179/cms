import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { Feed } from "../types";

interface FeedEditFormProps {
  feed: Feed;
  onSubmit: (updatedFeed: Partial<Feed>) => void;
}

export default function FeedEditForm({ feed, onSubmit }: FeedEditFormProps) {
  // Only editable fields are kept in state.
  const [formData, setFormData] = useState<Partial<Feed>>({
    title: feed.title,
    description: feed.description,
    category: feed.category,
    seoTitle: feed.seoTitle,
    metaDescription: feed.metaDescription,
    keywords: feed.keywords,
    slug: feed.slug,
    content: feed.content,
  });

  // Local state for new category and keyword inputs
  const [newCategory, setNewCategory] = useState<string>("");
  const [newKeyword, setNewKeyword] = useState<string>("");

  // Generic handler for text inputs and textareas.
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Category chip input handlers
  const handleCategoryKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newCategory.trim() !== "") {
      e.preventDefault();
      const updatedCategories = [
        ...(formData.category || []),
        newCategory.trim(),
      ];
      setFormData((prev) => ({ ...prev, category: updatedCategories }));
      setNewCategory("");
    }
  };

  const removeCategory = (index: number) => {
    const updatedCategories = (formData.category || []).filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, category: updatedCategories }));
  };

  // Keywords chip input handlers
  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newKeyword.trim() !== "") {
      e.preventDefault();
      const updatedKeywords = [...(formData.keywords || []), newKeyword.trim()];
      setFormData((prev) => ({ ...prev, keywords: updatedKeywords }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    const updatedKeywords = (formData.keywords || []).filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, keywords: updatedKeywords }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* Title */}
      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 p-2 rounded"
        ></textarea>
      </div>

      {/* Category Chip Input */}
      <div>
        <label className="block font-medium mb-1">
          Category{" "}
          <span className="text-sm text-gray-500">(press Enter to add)</span>
        </label>
        <input
          type="text"
          placeholder="Type a category and press Enter"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={handleCategoryKeyDown}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex flex-wrap gap-2 my-2">
          {(formData.category || []).map((cat, idx) => (
            <span
              key={idx}
              className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
            >
              {cat}
              <button
                type="button"
                onClick={() => removeCategory(idx)}
                className="ml-1 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* SEO Title */}
      <div>
        <label className="block font-medium">SEO Title</label>
        <input
          type="text"
          name="seoTitle"
          value={formData.seoTitle || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Meta Description */}
      <div>
        <label className="block font-medium">Meta Description</label>
        <textarea
          name="metaDescription"
          value={formData.metaDescription || ""}
          onChange={handleChange}
          rows={2}
          className="w-full border border-gray-300 p-2 rounded"
        ></textarea>
      </div>

      {/* Keywords Chip Input */}
      <div>
        <label className="block font-medium mb-1">
          Keywords{" "}
          <span className="text-sm text-gray-500">(press Enter to add)</span>
        </label>

        <input
          type="text"
          placeholder="Type a keyword and press Enter"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={handleKeywordKeyDown}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex flex-wrap gap-2 my-2">
          {(formData.keywords || []).map((kw, idx) => (
            <span
              key={idx}
              className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
            >
              {kw}
              <button
                type="button"
                onClick={() => removeKeyword(idx)}
                className="ml-1 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Slug */}
      <div>
        <label className="block font-medium">Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block font-medium">Content</label>
        <textarea
          name="content"
          value={formData.content || ""}
          onChange={handleChange}
          rows={6}
          className="w-full border border-gray-300 p-2 rounded"
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </form>
  );
}
