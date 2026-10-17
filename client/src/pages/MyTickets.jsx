import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import API_BASE_URL from "../config";

function MyTickets() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/bookings/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setBookings(response.data);
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
            "Unable to load your tickets."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) {
    return (
      <div className="page">
        <Navbar />

        <main className="my-tickets-page">
          <div className="events-message">
            Loading your tickets...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="my-tickets-page">
        <div className="my-tickets-header">
          <div>
            <p className="section-label">
              YOUR BOOKINGS
            </p>

            <h1>My Tickets</h1>

            <p>
              View and manage all your event bookings.
            </p>
          </div>
        </div>

        {error && (
          <div className="events-message error">
            {error}
          </div>
        )}

        {!error && bookings.length === 0 && (
          <div className="my-tickets-empty">
            <p className="section-label">
              NO BOOKINGS YET
            </p>

            <h2>Nothing booked yet</h2>

            <p>
              Discover an event and book your first
              experience.
            </p>

            <Link
              to="/events"
              className="my-tickets-browse-button"
            >
              Explore Events
            </Link>
          </div>
        )}

        {!error && bookings.length > 0 && (
          <div className="my-tickets-list">
            {bookings.map((booking) => {
              const event = booking.event;

              return (
                <Link
                  to={`/booking/${booking._id}`}
                  className="my-ticket-card"
                  key={booking._id}
                >
                  <div className="my-ticket-main">
                    <div className="my-ticket-top">
                      <span className="my-ticket-status">
                        {booking.status}
                      </span>

                      <span className="my-ticket-date">
                        {event?.date &&
                          new Date(
                            event.date
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            }
                          )}
                      </span>
                    </div>

                    <h2>
                      {event?.title ||
                        "Event"}
                    </h2>

                    <p>
                      {event?.venue || ""}
                      {event?.city
                        ? ` · ${event.city}`
                        : ""}
                    </p>
                  </div>

                  <div className="my-ticket-details">
                    <div>
                      <span>Booking ID</span>

                      <strong>
                        {booking.bookingId}
                      </strong>
                    </div>

                    <div>
                      <span>Tickets</span>

                      <strong>
                        {booking.quantity}
                      </strong>
                    </div>

                    <div>
                      <span>Total</span>

                      <strong>
                        ₹
                        {booking.totalAmount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  </div>

                  <span className="my-ticket-arrow">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyTickets;