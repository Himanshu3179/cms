import axios from "axios";
import xml2js from "xml2js";
import { Feed } from "../models/Feed";
import { rssFeedUrls } from "../config/rssFeeds";

export const fetchAndStoreRSSFeeds = async () => {
  console.log(`[${new Date().toISOString()}] Starting RSS feed fetch...`);
  for (const url of rssFeedUrls) {
    console.log(`[${new Date().toISOString()}] Fetching data from: ${url}`);
    try {
      const response = await axios.get(url);
      const parser = new xml2js.Parser({ explicitArray: false });
      const jsonData = await parser.parseStringPromise(response.data);

      console.log(
        `[${new Date().toISOString()}] Parsing and normalizing data from: ${url}`
      );
      const items = jsonData.rss.channel.item || [];
      const normalizedItems = Array.isArray(items) ? items : [items];

      for (const item of normalizedItems) {
        // Add or update the feed with the current fetched time
        await Feed.updateOne(
          { "guid._": item.guid._ }, // Match existing feed by unique GUID
          {
            $set: {
              title: item.title,
              link: item.link,
              description: item.description,
              pubDate: new Date(item.pubDate),
              category: item.category,
              sourceUrl: url,
              fetchedAt: new Date(), // Update fetchedAt to the current time
            },
          },
          { upsert: true } // Insert new feed if it doesn't exist
        );
      }
      console.log(
        `[${new Date().toISOString()}] Successfully updated data from: ${url}`
      );
    } catch (error: any) {
      console.error(
        `[${new Date().toISOString()}] Error fetching data from ${url}:`,
        error.message
      );
    }
  }
  console.log(`[${new Date().toISOString()}] RSS feed fetch completed.`);
};
