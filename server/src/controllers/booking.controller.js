import mongoose from "mongoose";
import Booking from "../models/Booking.model.js";
import Gig from "../models/Gig.model.js";

export const createBooking = async (req, res) => {
  try {
    const {
      gigId,
      clientName,
      clientEmail,
      requirements,
      preferredDeliveryDate,
      additionalNotes,
    } = req.body;

    // Validate Gig ID
    if (!mongoose.Types.ObjectId.isValid(gigId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gig ID",
      });
    }

    // Check if gig exists
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    // Check if gig is active
    if (gig.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "This gig is currently unavailable",
      });
    }

    // Create booking
    const booking = await Booking.create({
      gigId: gig._id,
      creatorName: gig.creatorName,
      clientName,
      clientEmail,
      requirements,
      preferredDeliveryDate,
      additionalNotes,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCreatorBookings = async (req, res) => {
  try {
    const { creatorName } = req.query;

    if (!creatorName) {
      return res.status(400).json({
        success: false,
        message: "Creator name is required",
      });
    }

    const bookings = await Booking.find({ creatorName })
      .populate("gigId", "title category price deliveryDays")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get creator bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch creator bookings",
    });
  }
};

export const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only pending bookings can be accepted
    if (booking.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status.toLowerCase()}`,
      });
    }

    // Atomically reserve the gig before accepting a request. This prevents two
    // different pending requests for the same gig from being accepted together.
    const reservedGig = await Gig.findOneAndUpdate(
      { _id: booking.gigId, status: "ACTIVE" },
      {
        $set: { status: "PAUSED" },
        $inc: { bookingsCount: 1 },
      },
      { new: true }
    );

    if (!reservedGig) {
      return res.status(409).json({
        success: false,
        message: "This gig has already been reserved by another accepted booking.",
      });
    }

    const acceptedBooking = await Booking.findOneAndUpdate(
      { _id: id, status: "PENDING" },
      { $set: { status: "ACCEPTED" } },
      { new: true }
    );

    // A concurrent decline could have changed this request after it was read.
    // Release the gig reservation so another pending request can still be reviewed.
    if (!acceptedBooking) {
      await Gig.findByIdAndUpdate(booking.gigId, {
        $set: { status: "ACTIVE" },
        $inc: { bookingsCount: -1 },
      });

      return res.status(409).json({
        success: false,
        message: "This booking was updated before it could be accepted.",
      });
    }

    // Decline other pending bookings for the same gig
    await Booking.updateMany(
      {
        gigId: booking.gigId,
        _id: { $ne: booking._id },
        status: "PENDING",
      },
      {
        $set: {
          status: "DECLINED",
          declineReason:
            "The creator accepted another booking for this gig.",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Booking accepted successfully",
      data: acceptedBooking,
    });
  } catch (error) {
    console.error("Accept booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to accept booking",
    });
  }
};

export const declineBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status.toLowerCase()}`,
      });
    }

    booking.status = "DECLINED";
    booking.declineReason =
      reason?.trim() || "Creator declined this booking.";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking declined successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Decline booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to decline booking",
    });
  }
};

export const getClientBookings = async (req, res) => {
  try {
    const { clientEmail } = req.query;

    if (!clientEmail) {
      return res.status(400).json({
        success: false,
        message: "Client email is required",
      });
    }

    const bookings = await Booking.find({
      clientEmail: clientEmail.toLowerCase().trim(),
    })
      .populate(
        "gigId",
        "title category price deliveryDays creatorName image"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get client bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch client bookings",
    });
  }
};
