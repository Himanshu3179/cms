export interface SchedulingRules {
  dailyPostLimit: number;
  weeklyPostRange: {
    min: number;
    max: number;
  };
  postingWindow: {
    start: string; // e.g., "09:00"
    end: string; // e.g., "21:00"
  };
  randomizeTimes: boolean;
}

export interface ScheduledArticleData {
  _id?: string; // Optional for new documents
  feedId: string;
  scheduledAt: string; // ISO string date
  postingPlatform: string;
  caption: string;
  hashtags: string[];
  status?: "pending" | "scheduled" | "published" | "failed";
  schedulingRules: SchedulingRules;
  createdAt?: string;
  updatedAt?: string;
}
