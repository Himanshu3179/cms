import { Request, Response } from "express";
import { Feed } from "../models/Feed";

export const getFeeds = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      sourceUrl,
      pubDate,
      startDate,
      endDate,
      sort,
      order,
      leagues,
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
      query.category = { $in: categories };
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

    // Filter by startDate and endDate
    if (startDate && endDate) {
      query.pubDate = {
        $gte: new Date(startDate as string),
        $lt: new Date(
          new Date(endDate as string).setDate(
            new Date(endDate as string).getDate() + 1
          )
        ),
      };
    } else if (startDate) {
      query.pubDate = { $gte: new Date(startDate as string) };
    } else if (endDate) {
      query.pubDate = {
        $lt: new Date(
          new Date(endDate as string).setDate(
            new Date(endDate as string).getDate() + 1
          )
        ),
      };
    }

    // -------------------------------
    // New Leagues Filter Section
    // -------------------------------
    // If the user provides a leagues filter, use text search.
    if (leagues) {
      const leaguesArr = Array.isArray(leagues) ? leagues : [leagues];
      // Joining the array creates a single search string, e.g. "Liga Pro UEFA"
      query.$text = { $search: leaguesArr.join(" ") };
    }

    // Sorting: if text search is used, we want to sort by text score as the primary sort
    // Otherwise, we use the provided sort and order, defaulting to pubDate
    const sortField = (sort as string) || "pubDate";
    const sortOrder = order === "asc" ? 1 : -1;

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * pageSize;

    // Fetch total count for accurate pagination
    const totalFeeds = await Feed.countDocuments(query);

    let feeds;
    if (query.$text) {
      // If using text search, project text score and sort by it as primary criteria.
      feeds = await Feed.find(query, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" }, [sortField]: sortOrder })
        .skip(skip)
        .limit(pageSize);
    } else {
      feeds = await Feed.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(pageSize);
    }

    res.json({
      data: feeds,
      meta: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalFeeds / pageSize),
        totalFeeds,
        limit: pageSize,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch feeds." });
  }
};

// Get article by id
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

// edit

export const editFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const feed = await Feed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!feed) {
      res.status(404).json({ message: "Feed not found." });
      return;
    }

    res.json(feed);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update feed." });
  }
};
