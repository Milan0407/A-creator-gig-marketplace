import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import gigRoutes from "./routes/gig.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();
// Security
app.use(helmet());

// CORS
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

// Logging
app.use(morgan("dev"));

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use("/api/gigs", gigRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Creator Gig Marketplace API is running",
  });
});

export default app;