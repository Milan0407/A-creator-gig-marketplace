import express from "express";
import { generateGig, getCreatorInsights, getMatch, getRecommendations, smartSearch } from "../controllers/ai.controller.js";

const router = express.Router();
router.post("/generate-gig", generateGig);
router.post("/search", smartSearch);
router.post("/match/:id", getMatch);
router.post("/recommendations", getRecommendations);
router.get("/creator-insights", getCreatorInsights);
export default router;
