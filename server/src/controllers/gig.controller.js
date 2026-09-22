import mongoose from "mongoose";
import Gig from "../models/Gig.model.js";


export const createGig = async (req, res) => {
  try {
    const {
      creatorName,
      title,
      description,
      category,
      price,
      deliveryDays,
      tags,
      image,
    } = req.body;

    const gig = await Gig.create({
      creatorName,
      title,
      description,
      category,
      price,
      deliveryDays,
      tags,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Gig created successfully",
      data: gig,
    });
  } catch (error) {
    console.error("Create gig error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getGigs = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {
      status: "ACTIVE",
    };

    // Search by title, description or tags
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Pagination
    const currentPage = Math.max(Number(page), 1);
    const itemsPerPage = Math.min(Number(limit), 50);
    const skip = (currentPage - 1) * itemsPerPage;

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "price-low":
        sortOption = { price: 1 };
        break;

      case "price-high":
        sortOption = { price: -1 };
        break;

      case "popular":
        sortOption = { bookingsCount: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const [gigs, total] = await Promise.all([
      Gig.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(itemsPerPage),

      Gig.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: gigs,
      pagination: {
        currentPage,
        itemsPerPage,
        totalItems: total,
        totalPages: Math.ceil(total / itemsPerPage),
      },
    });
  } catch (error) {
    console.error("Get gigs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch gigs",
    });
  }
};

export const getGigById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gig ID",
      });
    }

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gig,
    });
  } catch (error) {
    console.error("Get gig error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch gig",
    });
  }
};