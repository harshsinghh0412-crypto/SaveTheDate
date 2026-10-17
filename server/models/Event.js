import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: [
        "Music",
        "Sports",
        "Comedy",
        "Theatre",
        "Meetups",
        "Workshops",
        "Movies",
        "Other"
      ],
      default: "Other"
    },

    city: {
      type: String,
      required: true,
      enum: ["Bhubaneswar", "Hyderabad", "Bengaluru"]
    },

    venue: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: Date,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    totalTickets: {
      type: Number,
      required: true,
      min: 1
    },

    availableTickets: {
      type: Number,
      required: true,
      min: 0
    },

    image: {
      type: String,
      default: ""
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;