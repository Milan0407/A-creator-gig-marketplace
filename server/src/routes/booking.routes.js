import express from "express";

import {
  createBooking,
  getCreatorBookings,
  getClientBookings,
  acceptBooking,
  declineBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);

router.get("/creator", getCreatorBookings);

router.get("/client", getClientBookings);

router.patch("/:id/accept", acceptBooking);

router.patch("/:id/decline", declineBooking);

export default router;