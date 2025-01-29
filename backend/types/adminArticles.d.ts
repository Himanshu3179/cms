export interface AdminArticle {
  _id?: string;
  title: string;
  description: string;
  category: string[];
  sourceUrl?: string;
  userId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}