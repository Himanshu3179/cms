export interface Feed {
  _id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category: string[];
  customCategory: string[];
  sourceUrl: string;
  fetchedAt: string;
  guid: object;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
