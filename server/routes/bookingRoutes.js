import express from "express";
import crypto from "crypto";
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE BOOKING
router.post("/", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { eventId, quantity } = req.body;

    if (!eventId || !quantity) {
      return res.status(400).json({
        message: "Event and quantity are required"
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1"
      });
    }

    session.startTransaction();

    // Find event and reserve tickets atomically
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        availableTickets: { $gte: quantity }
      },
      {
        $inc: {
          availableTickets: -quantity
        }
      },
      {
        new: true,
        session
      }
    );

    if (!event) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Event not found or not enough tickets available"
      });
    }

    const totalAmount = event.price * quantity;

    const bookingId =
      "STD-" +
      crypto.randomBytes(4).toString("hex").toUpperCase();

    const booking = new Booking({
      bookingId,
      user: req.user.userId,
      event: event._id,
      quantity,
      totalAmount
    });

    await booking.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      message: "Booking confirmed",
      booking: {
        bookingId: booking.bookingId,
        event: event.title,
        quantity: booking.quantity,
        totalAmount: booking.totalAmount,
        status: booking.status
      }
    });

  } catch (error) {
    await session.abortTransaction();

    console.error("Booking error:", error);

    res.status(500).json({
      message: "Failed to create booking"
    });

  } finally {
    session.endSession();
  }
});

// GET MY BOOKINGS
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.userId
    })
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);

  } catch (error) {
    console.error("Fetch bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch bookings"
    });
  }
});

// GET SINGLE BOOKING
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate("event");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error(
      "Fetch booking error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch booking"
    });
  }
});

export default router;