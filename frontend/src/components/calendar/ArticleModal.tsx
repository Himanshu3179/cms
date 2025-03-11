import React from 'react';

import { Edit, X } from 'lucide-react';
import { getWebpageIcon } from '../../utils/iconUtils';
import { Calendar, Clock, Trophy } from 'lucide-react';

export interface Article {
    id: string;
    title: string;
    status: 'published' | 'scheduled';
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
    position: 'left' | 'right' | 'center' | 'full';
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
  

interface ArticleModalProps {
  selectedArticle: Article | null;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  editedArticle: Partial<Article>;
  setEditedArticle: (article: Partial<Article>) => void;
  setShowArticleModal: (value: boolean) => void;
  handleEditSave: () => void;
}

export default function ArticleModal({
  selectedArticle,
  editMode,
  setEditMode,
  editedArticle,
  setEditedArticle,
  setShowArticleModal,
  handleEditSave
}: ArticleModalProps) {
  if (!selectedArticle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {editMode ? 'Edit Article' : 'Article Details'}
          </h2>
          <div className="flex space-x-2">
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            )}
            <button
              onClick={() => setShowArticleModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {editMode ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editedArticle.title || ''}
                  onChange={(e) => setEditedArticle({ ...editedArticle, title: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={editedArticle.content || ''}
                  onChange={(e) => setEditedArticle({ ...editedArticle, content: e.target.value })}
                  rows={6}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={editedArticle.date || ''}
                    onChange={(e) => setEditedArticle({ ...editedArticle, date: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editedArticle.status || ''}
                    onChange={(e) => setEditedArticle({ ...editedArticle, status: e.target.value as 'published' | 'scheduled' })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Article Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <span>Published: {selectedArticle.date}</span>
                      </div>
                      {selectedArticle.matchDate && (
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-500 mr-2" />
                          <span>Match Date: {selectedArticle.matchDate}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Trophy className="h-5 w-5 text-gray-500 mr-2" />
                        <span>Competition: {selectedArticle.competition}</span>
                      </div>
                      <div className="flex items-center">
                        {getWebpageIcon(selectedArticle.webpage)}
                        <span className="ml-2">Website: {selectedArticle.webpage}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">SEO Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="text-sm"><strong>Title:</strong> {selectedArticle.seoTitle}</p>
                      <p className="text-sm"><strong>Description:</strong> {selectedArticle.seoDescription}</p>
                      <div>
                        <strong className="text-sm">Keywords:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedArticle.seoKeywords?.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-200 rounded-full text-xs"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Content Preview</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedArticle.content}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}