// src/pages/NewSchedulePage.tsx
import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createScheduledArticle } from "../api";
import { ScheduledArticleData } from "../types/scheduledArticle";
import { fetchFeedById } from "../api"; // to optionally fetch feed details
import { Feed } from "../types/feeds";

export default function NewSchedulePage() {
  const { id } = useParams<{ id: string }>(); // feed id in params
  const navigate = useNavigate();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch feed details so we can show its title (optional)
  useEffect(() => {
    if (id) {
      const loadFeed = async () => {
        try {
          const data = await fetchFeedById(id);
          setFeed(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoadingFeed(false);
        }
      };
      loadFeed();
    }
  }, [id]);

  // Scheduling fields
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [postingPlatform, setPostingPlatform] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState<string>("");

  // Scheduling rules fields
  const [dailyPostLimit, setDailyPostLimit] = useState<number>(1);
  const [weeklyMin, setWeeklyMin] = useState<number>(1);
  const [weeklyMax, setWeeklyMax] = useState<number>(3);
  const [postingWindowStart, setPostingWindowStart] = useState<string>("09:00");
  const [postingWindowEnd, setPostingWindowEnd] = useState<string>("21:00");
  const [randomizeTimes, setRandomizeTimes] = useState<boolean>(true);

  // Hashtag input handler
  const handleHashtagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newHashtag.trim() !== "") {
      e.preventDefault();
      setHashtags((prev) => [...prev, newHashtag.trim()]);
      setNewHashtag("");
    }
  };

  const removeHashtag = (index: number) => {
    setHashtags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) {
      toast.error("Feed ID is missing");
      return;
    }
    // Build scheduled article object based on our ScheduledArticleData type
    const scheduleData: Omit<
      ScheduledArticleData,
      "_id" | "createdAt" | "updatedAt"
    > = {
      feedId: id,
      scheduledAt,
      postingPlatform,
      caption,
      hashtags,
      status: "scheduled", // default status
      schedulingRules: {
        dailyPostLimit,
        weeklyPostRange: { min: weeklyMin, max: weeklyMax },
        postingWindow: { start: postingWindowStart, end: postingWindowEnd },
        randomizeTimes,
      },
    };

    try {
      const newSchedule = await createScheduledArticle(scheduleData);
      toast.success("Article scheduled successfully!");
      navigate("/admin/scheduled-posts"); // or any route you want to redirect to
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loadingFeed) {
    return <p className="text-center py-8">Loading feed details...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500 py-8">{error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Schedule for Article</h1>
      {feed && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h2 className="text-xl font-semibold">Article: {feed.title}</h2>
          <p className="text-sm text-gray-600">Feed ID: {feed._id}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Scheduled Date/Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled At
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Posting Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Posting Platform
          </label>
          <input
            type="text"
            placeholder="e.g., Premier League"
            value={postingPlatform}
            onChange={(e) => setPostingPlatform(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Caption
          </label>
          <input
            type="text"
            placeholder="Write a caption for the post..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Hashtags Chip Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hashtags{" "}
            <span className="text-xs text-gray-500">(press Enter to add)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeHashtag(idx)}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a hashtag and press Enter"
            value={newHashtag}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewHashtag(e.target.value)
            }
            onKeyDown={handleHashtagKeyDown}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Scheduling Rules */}
        <div className="border border-gray-200 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Scheduling Rules</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Daily Post Limit
              </label>
              <input
                type="number"
                value={dailyPostLimit}
                onChange={(e) => setDailyPostLimit(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-2 py-1"
                min={1}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weekly Post Range (Min)
              </label>
              <input
                type="number"
                value={weeklyMin}
                onChange={(e) => setWeeklyMin(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-2 py-1"
                min={1}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weekly Post Range (Max)
              </label>
              <input
                type="number"
                value={weeklyMax}
                onChange={(e) => setWeeklyMax(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-2 py-1"
                min={1}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Posting Window Start
              </label>
              <input
                type="time"
                value={postingWindowStart}
                onChange={(e) => setPostingWindowStart(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Posting Window End
              </label>
              <input
                type="time"
                value={postingWindowEnd}
                onChange={(e) => setPostingWindowEnd(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
                required
              />
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                checked={randomizeTimes}
                onChange={(e) => setRandomizeTimes(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                Randomize Posting Times
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Schedule
          </button>
        </div>
      </form>
    </div>
  );
}

