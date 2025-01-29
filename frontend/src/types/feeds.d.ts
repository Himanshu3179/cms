export interface Feed {
  _id: string;
  title: string;
  link: string;
  pubDate: string;
  category: string[];
  description: string;
  sourceUrl: string;
  fetchedAt: Date;
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
