import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setBooking(response.data);
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
            "Unable to load booking."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="page">
        <Navbar />

        <main className="booking-details-page">
          <div className="events-message">
            Loading booking...
          </div>
        </main>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="page">
        <Navbar />

        <main className="booking-details-page">
          <div className="events-message error">
            {error || "Booking not found."}
            <br />

            <Link to="/my-tickets">
              Back to My Tickets
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const event = booking.event;

  const eventDate = event?.date
    ? new Date(event.date)
    : null;

  return (
    <div className="page">
      <Navbar />

      <main className="booking-details-page">
        <Link
          to="/my-tickets"
          className="booking-back-link"
        >
          ← Back to My Tickets
        </Link>

        <div className="booking-details-card">
          <div className="booking-details-success">
            <span>✓</span>

            <div>
              <p>BOOKING CONFIRMED</p>

              <h1>Your tickets are booked!</h1>
            </div>
          </div>

          <div className="booking-id-box">
            <span>Booking ID</span>

            <strong>{booking.bookingId}</strong>
          </div>

          <div className="booking-event-section">
            <p className="section-label">
              EVENT
            </p>

            <h2>
              {event?.title || "Event"}
            </h2>

            {event && (
              <>
                <p>
                  {event.venue} · {event.city}
                </p>

                {eventDate && (
                  <p>
                    {eventDate.toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      }
                    )}

                    {" · "}

                    {eventDate.toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "numeric",
                        minute: "2-digit"
                      }
                    )}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="booking-details-grid">
            <div>
              <span>Tickets</span>

              <strong>
                {booking.quantity}
              </strong>
            </div>

            <div>
              <span>Price per ticket</span>

              <strong>
                ₹
                {event?.price?.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div>
              <span>Total Amount</span>

              <strong>
                ₹
                {booking.totalAmount.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong className="booking-status">
                {booking.status}
              </strong>
            </div>
          </div>

          <div className="booking-details-actions">
            {event?._id && (
              <Link
                to={`/events/${event._id}`}
                className="booking-view-event-button"
              >
                View Event
              </Link>
            )}

            <Link
              to="/my-tickets"
              className="booking-back-button"
            >
              My Tickets
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookingDetails;