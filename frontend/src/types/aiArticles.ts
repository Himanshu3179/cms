export interface GenerateAiArticlesRequest {
  modelAuthor: string;
  filters: {
    category?: string[];
    sourceUrl?: string;
    pubDate?: string;
    search?: string;
  };
  numberOfArticles: number;
  userInstructions: string;
}

export interface GenerateAiArticlesResponse {
  generatedArticles: {
    originalFeed: string;
    title: string;
    processedContent: string;
    seo: {
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
    };
    status: string;
    processedAt: string;
  }[];
}

export interface AiArticle {
  _id?: string;
  originalFeed: string;
  title: string;
  processedContent: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  status: "pending" | "processed" | "failed";
  processedAt: string;
  errorMessage?: string;
}
