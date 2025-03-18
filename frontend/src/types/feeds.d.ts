export interface Feed {
  _id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category: string[];
  customCategory: string[];
  sourceUrl: string;
  fetchedAt: Date;
  guid: string;

  // New Fields for SEO and Cleaned Content
  seoTitle: string;
  metaDescription?: string;
  keywords: string[];
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedResponse {
  data: Feed[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalFeeds: number;
    limit: number;
  };
}

export interface FiltersResponse {
  categories: string[];
  sources: string[];
  dates: {
    year: number;
    month: number;
    day: number;
  }[];
}
