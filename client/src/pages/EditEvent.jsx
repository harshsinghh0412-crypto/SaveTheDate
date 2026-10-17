import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import API_BASE_URL from "../config";

function EditEvent() {
  const { id } = useParams();
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

  const [ticketsSold, setTicketsSold] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);

        const event = response.data;

        setFormData({
          title: event.title || "",
          description: event.description || "",
          category: event.category || "Music",
          city: event.city || "Bhubaneswar",
          venue: event.venue || "",
          date: event.date
            ? formatDateForInput(event.date)
            : "",
          price: event.price ?? "",
          totalTickets: event.totalTickets ?? "",
          image: event.image || ""
        });

        setTicketsSold(
          event.totalTickets - event.availableTickets
        );
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/signin");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Unable to load event."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const formatDateForInput = (date) => {
    const parsedDate = new Date(date);

    const offset = parsedDate.getTimezoneOffset();

    const localDate = new Date(
      parsedDate.getTime() - offset * 60 * 1000
    );

    return localDate.toISOString().slice(0, 16);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const eventData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        price: Number(formData.price),
        totalTickets: Number(formData.totalTickets)
      };

      await axios.put(`${API_BASE_URL}/api/events/${id}`, data);

      navigate("/my-events");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to update event. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Navbar />

        <main className="create-event-page">
          <div className="events-message">
            Loading event...
          </div>
        </main>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="page">
        <Navbar />

        <main className="create-event-page">
          <div className="events-message error">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="create-event-page">
        <div className="create-event-header">
          <p className="section-label">
            MANAGE EVENT
          </p>

          <h1>Edit Event</h1>

          <p>
            Update the details of your event.
          </p>
        </div>

        {/* TICKET INFORMATION */}

        <div className="edit-event-notice">
          <div>
            <span>Tickets already sold</span>

            <strong>{ticketsSold}</strong>
          </div>

          <p>
            You cannot reduce the total ticket capacity
            below the number of tickets already sold.
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
              min={Math.max(1, ticketsSold)}
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

          <div className="edit-event-actions">
            <button
              type="button"
              className="edit-event-cancel"
              onClick={() => navigate("/my-events")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-event-submit"
              disabled={saving}
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditEvent;