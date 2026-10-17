import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Music",
    city: "Bhubaneswar",
    venue: "",
    date: "",
    price: "",
    totalTickets: "",
    image: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please sign in before creating an event.");
        setLoading(false);
        return;
      }

      const eventData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        price: Number(formData.price),
        totalTickets: Number(formData.totalTickets)
      };

      await axios.post(
        "http://localhost:5000/api/events",
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate("/events");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <Navbar />

      <main className="create-event-page">

        <div className="create-event-header">

          <p className="section-label">
            CREATE
          </p>

          <h1>
            Create an Event
          </h1>

          <p>
            Share your event with the SaveTheDate community.
          </p>

        </div>

        <form
          className="create-event-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label>Event Title</label>

            <input
              type="text"
              name="title"
              placeholder="e.g. Live Music Night"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Tell people about your event..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Comedy">Comedy</option>
                <option value="Theatre">Theatre</option>
                <option value="Meetups">Meetups</option>
                <option value="Workshops">Workshops</option>
                <option value="Movies">Movies</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>City</label>

              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
              >
                <option value="Bhubaneswar">
                  Bhubaneswar
                </option>

                <option value="Hyderabad">
                  Hyderabad
                </option>

                <option value="Bengaluru">
                  Bengaluru
                </option>
              </select>
            </div>

          </div>

          <div className="form-group">
            <label>Venue</label>

            <input
              type="text"
              name="venue"
              placeholder="e.g. IIT Bhubaneswar"
              value={formData.venue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Date & Time</label>

              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ticket Price (₹)</label>

              <input
                type="number"
                name="price"
                placeholder="499"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label>Total Tickets</label>

            <input
              type="number"
              name="totalTickets"
              placeholder="100"
              min="1"
              value={formData.totalTickets}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>

            <input
              type="url"
              name="image"
              placeholder="https://example.com/event-image.jpg"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="create-event-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Event..."
              : "Create Event"}
          </button>

        </form>

      </main>

    </div>
  );
}

export default CreateEvent;