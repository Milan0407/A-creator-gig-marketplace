import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: [true, "Gig ID is required"],
    },

    creatorName: {
      type: String,
      required: [true, "Creator name is required"],
      trim: true,
    },

    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: 100,
    },

    clientEmail: {
      type: String,
      required: [true, "Client email is required"],
      trim: true,
      lowercase: true,
    },

    requirements: {
      type: String,
      required: [true, "Project requirements are required"],
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    preferredDeliveryDate: {
      type: Date,
      required: [true, "Preferred delivery date is required"],
    },

    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DECLINED"],
      default: "PENDING",
    },

    declineReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;