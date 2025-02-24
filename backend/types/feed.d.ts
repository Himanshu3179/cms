export interface Feed {
  _id?: string;
  title: string;
  description: string;
  link?: string;
  pubDate?: string;
  category: string[];
  customCategory: string[];
  rejectedCategories: string[];
  sourceUrl?: string;
  fetchedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
