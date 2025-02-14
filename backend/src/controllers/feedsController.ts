import { Request, Response } from "express";
import { Feed } from "../models/Feed";

export const getFeeds = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      sourceUrl,
      pubDate,
      sort,
      order,
      page = 1,
      limit = 10,
    } = req.query;

    // Construct the MongoDB query
    const query: any = {};

    // Search by title or description (case-insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: "i" } },
        { description: { $regex: search as string, $options: "i" } },
        { category: { $regex: search as string, $options: "i" } },
      ];
    }

    // Filter by categories (Ensure filtering is included in MongoDB query)
    if (category) {
      const categories = Array.isArray(category) ? category : [category];
      query.category = { $in: categories }; // This ensures MongoDB filters by category before fetching
    }

    // Filter by source URL
    if (sourceUrl) {
      query.sourceUrl = sourceUrl;
    }

    // Filter by pubDate
    if (pubDate) {
      const [year, month, day] = (pubDate as string).split("-");
      query.pubDate = {
        $gte: new Date(`${year}-${month}-${day}T00:00:00.000Z`),
        $lt: new Date(`${year}-${month}-${day}T23:59:59.999Z`),
      };
    }

    // Sorting
    const sortField = (sort as string) || "pubDate"; // Default sorting by pubDate
    const sortOrder = order === "asc" ? 1 : -1;

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * pageSize;

    // Fetch total count for accurate pagination
    const totalFeeds = await Feed.countDocuments(query);

    // Fetch the data with filtering in MongoDB
    const feeds = await Feed.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(pageSize);

    res.json({
      data: feeds,
      meta: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalFeeds / pageSize), // Fix totalPages count
        totalFeeds,
        limit: pageSize,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch feeds." });
  }
};

// get article by id
export const getFeedById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const feed = await Feed.findById(req.params.id);
    if (!feed) {
      res.status(404).json({ message: "Feed not found." });
      return;
    }

    res.json(feed);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch feed." });
  }
};
