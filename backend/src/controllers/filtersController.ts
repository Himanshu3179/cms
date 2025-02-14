import { Request, Response } from "express";
import { Feed } from "../models/Feed";

export const getFilters = async (req: Request, res: Response) => {
  try {
    // Fetch distinct categories
    const categories = await Feed.distinct("category");

    const sources = await Feed.distinct("sourceUrl");

    // Fetch distinct dates (year, month, day) for filtering
    const dates = await Feed.aggregate([
      {
        $match: {
          pubDate: { $type: "date" }, // Ensure pubDate is a valid date
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$pubDate" },
            month: { $month: "$pubDate" },
            day: { $dayOfMonth: "$pubDate" },
          },
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 }, // Sort in descending order
      },
    ]);

    // Transform dates to a simplified structure
    const formattedDates = dates.map((d) => ({
      year: d._id.year,
      month: d._id.month,
      day: d._id.day,
    }));

    // Respond with the filters
    res.json({
      categories,
      sources,
      dates: formattedDates,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch filters." });
  }
};
