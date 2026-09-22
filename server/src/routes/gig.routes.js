import express from "express";

import {
  createGig,
  getGigs,
  getGigById,
} from "../controllers/gig.controller.js";

const router = express.Router();

router.post("/", createGig);
router.get("/", getGigs);
router.get("/:id", getGigById);

export default router;