export interface Article {
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
