import express from "express";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// GET ALL EVENTS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch events"
    });
  }
});

// ==========================================
// GET MY EVENTS
// ==========================================

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: req.user.userId
    }).sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch your events"
    });
  }
});

// ==========================================
// GET MY ORGANIZER ANALYTICS
// ==========================================

router.get("/my/analytics", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: req.user.userId
    }).lean();

    const eventIds = events.map((event) => event._id);

    if (eventIds.length === 0) {
      return res.status(200).json({
        summary: {
          totalEvents: 0,
          totalTicketsSold: 0,
          totalRevenue: 0
        },
        performance: []
      });
    }

    const bookingStats = await Booking.aggregate([
      {
        $match: {
          event: {
            $in: eventIds
          },
          status: "confirmed"
        }
      },
      {
        $group: {
          _id: null,
          totalTicketsSold: {
            $sum: "$quantity"
          },
          totalRevenue: {
            $sum: "$totalAmount"
          }
        }
      }
    ]);

    const summaryStats = bookingStats[0] || {
      totalTicketsSold: 0,
      totalRevenue: 0
    };

    const eventPerformance = await Booking.aggregate([
      {
        $match: {
          event: {
            $in: eventIds
          },
          status: "confirmed"
        }
      },
      {
        $group: {
          _id: "$event",
          ticketsSold: {
            $sum: "$quantity"
          },
          revenue: {
            $sum: "$totalAmount"
          }
        }
      }
    ]);

    const performanceMap = {};

    eventPerformance.forEach((item) => {
      performanceMap[item._id.toString()] = {
        ticketsSold: item.ticketsSold,
        revenue: item.revenue
      };
    });

    const performance = events.map((event) => {
      const stats = performanceMap[event._id.toString()] || {
        ticketsSold: 0,
        revenue: 0
      };

      return {
        id: event._id,
        title: event.title,
        category: event.category,
        city: event.city,
        venue: event.venue,
        date: event.date,
        totalTickets: event.totalTickets,
        availableTickets: event.availableTickets,
        ticketsSold: stats.ticketsSold,
        revenue: stats.revenue
      };
    });

    res.status(200).json({
      summary: {
        totalEvents: events.length,
        totalTicketsSold: summaryStats.totalTicketsSold,
        totalRevenue: summaryStats.totalRevenue
      },
      performance
    });
  } catch (error) {
    console.error("Organizer analytics error:", error);

    res.status(500).json({
      message: "Failed to fetch organizer analytics"
    });
  }
});

// ==========================================
// GET SINGLE EVENT
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch event"
    });
  }
});

// ==========================================
// CREATE EVENT
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      city,
      venue,
      date,
      price,
      totalTickets,
      image
    } = req.body;

    const event = new Event({
      title,
      description,
      category,
      city,
      venue,
      date,
      price,
      totalTickets,
      availableTickets: totalTickets,
      image,
      createdBy: req.user.userId
    });

    const savedEvent = await event.save();

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create event"
    });
  }
});

// ==========================================
// UPDATE EVENT
// ==========================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Only the organizer who created the event can edit it
    if (event.createdBy?.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to edit this event"
      });
    }

    const {
      title,
      description,
      category,
      city,
      venue,
      date,
      price,
      totalTickets,
      image
    } = req.body;

    // Calculate tickets already sold
    const ticketsSold =
      event.totalTickets - event.availableTickets;

    // Prevent organizer from reducing total capacity
    // below the number of tickets already sold
    if (
      totalTickets !== undefined &&
      Number(totalTickets) < ticketsSold
    ) {
      return res.status(400).json({
        message:
          `Total tickets cannot be less than ${ticketsSold}, ` +
          "because those tickets have already been sold."
      });
    }

    // Calculate new available tickets
    let newAvailableTickets = event.availableTickets;

    if (totalTickets !== undefined) {
      newAvailableTickets =
        Number(totalTickets) - ticketsSold;
    }

    event.title = title;
    event.description = description;
    event.category = category;
    event.city = city;
    event.venue = venue;
    event.date = date;
    event.price = price;
    event.totalTickets = totalTickets;
    event.availableTickets = newAvailableTickets;
    event.image = image;

    const updatedEvent = await event.save();

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Update event error:", error);

    res.status(500).json({
      message: "Failed to update event"
    });
  }
});

// ==========================================
// DELETE EVENT
// ==========================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Only the organizer who created the event can delete it
    if (event.createdBy?.toString() !== req.user.userId) {
      return res.status(403).json({
        message:
          "You are not authorized to delete this event"
      });
    }

    // Check whether tickets have already been sold
    const ticketsSold =
      event.totalTickets - event.availableTickets;

    if (ticketsSold > 0) {
      return res.status(400).json({
        message:
          "This event cannot be deleted because tickets have already been sold."
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      message: "Failed to delete event"
    });
  }
});

export default router;