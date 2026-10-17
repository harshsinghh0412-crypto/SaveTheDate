import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import API_BASE_URL from "../config";

function MyEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await axios.get(
          "${API_BASE_URL}/api/events/my",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setEvents(response.data);
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
            "Unable to load your events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [navigate]);

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    setDeleteLoading(event._id);
    setError("");

    try {
      await axios.delete(
        `${API_BASE_URL}/api/events/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEvents((currentEvents) =>
        currentEvents.filter(
          (currentEvent) =>
            currentEvent._id !== event._id
        )
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
          "Failed to delete event."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Navbar />

        <main className="my-events-page">
          <div className="events-message">
            Loading your events...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="my-events-page">
        {/* HEADER */}

        <div className="my-events-header">
          <div>
            <p className="section-label">
              ORGANIZER
            </p>

            <h1>My Events</h1>

            <p>
              Manage the events you've created.
            </p>
          </div>

          <div className="my-events-header-actions">
            <Link
              to="/dashboard"
              className="my-events-dashboard-button"
            >
              Dashboard
            </Link>

            <Link
              to="/create-event"
              className="my-events-create-button"
            >
              + Create Event
            </Link>
          </div>
        </div>

        {error && (
          <div className="events-message error">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}

        {!error && events.length === 0 && (
          <div className="my-events-empty">
            <p className="section-label">
              NOTHING HERE YET
            </p>

            <h2>Create your first event</h2>

            <p>
              Start organizing experiences and selling
              tickets through SaveTheDate.
            </p>

            <Link
              to="/create-event"
              className="my-events-create-button"
            >
              Create an Event
            </Link>
          </div>
        )}

        {/* EVENT LIST */}

        {!error && events.length > 0 && (
          <div className="my-events-list">
            {events.map((event) => {
              const ticketsSold =
                event.totalTickets -
                event.availableTickets;

              return (
                <article
                  className="my-event-card"
                  key={event._id}
                >
                  <div className="my-event-card-main">
                    <div className="my-event-card-top">
                      <span className="my-event-category">
                        {event.category || "OTHER"}
                      </span>

                      <span className="my-event-date">
                        {new Date(
                          event.date
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    <Link
                      to={`/events/${event._id}`}
                      className="my-event-title"
                    >
                      {event.title}
                    </Link>

                    <p className="my-event-location">
                      {event.venue} · {event.city}
                    </p>

                    <div className="my-event-stats">
                      <div>
                        <span>Tickets Sold</span>
                        <strong>{ticketsSold}</strong>
                      </div>

                      <div>
                        <span>Available</span>
                        <strong>
                          {event.availableTickets}
                        </strong>
                      </div>

                      <div>
                        <span>Price</span>
                        <strong>
                          ₹
                          {Number(
                            event.price
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="my-event-actions">
                    <Link
                      to={`/edit-event/${event._id}`}
                      className="my-event-edit-button"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="my-event-delete-button"
                      onClick={() =>
                        handleDelete(event)
                      }
                      disabled={
                        deleteLoading === event._id
                      }
                    >
                      {deleteLoading === event._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyEvents;