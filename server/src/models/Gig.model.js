import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    creatorName: {
      type: String,
      required: [true, "Creator name is required"],
      trim: true,
      maxlength: 100,
    },

    title: {
      type: String,
      required: [true, "Gig title is required"],
      trim: true,
      minlength: 5,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, "Gig description is required"],
      trim: true,
      minlength: 20,
      maxlength: 2000,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Web Development",
        "App Development",
        "UI/UX Design",
        "Graphic Design",
        "Video Editing",
        "Photography",
        "Content Writing",
        "Social Media",
        "Music",
        "Marketing",
        "Other",
      ],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 1,
    },

    deliveryDays: {
      type: Number,
      required: [true, "Delivery time is required"],
      min: 1,
      max: 365,
    },

    tags: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    bookingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "PAUSED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const Gig = mongoose.model("Gig", gigSchema);

export default Gig;