import { CronJob } from "cron";
import { fetchAndStoreRSSFeeds } from "../services/rssService";

const interval = "0 */30 * * * *"; // Every 30 minutes

const job = new CronJob(interval, () => {
  console.log(`[${new Date().toISOString()}] Running scheduled cron job...`);
  fetchAndStoreRSSFeeds();
});

export const startCronJob = async () => {
  console.log(`[${new Date().toISOString()}] Starting cron job...`);
  await fetchAndStoreRSSFeeds(); // Run the job immediately
  job.start(); // Schedule the recurring job
  console.log(
    `[${new Date().toISOString()}] Cron job scheduled to run every 30 minutes.`
  );
};
