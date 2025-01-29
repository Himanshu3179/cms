import { Router } from "express";
import { getFilters } from "../controllers/filtersController";

const router = Router();

// Route to fetch available filters
router.get("/", getFilters);

export default router;
