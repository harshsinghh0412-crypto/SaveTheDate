import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/events/${id}`
        );

        setEvent(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load event."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const increaseQuantity = () => {
    if (event && quantity < event.availableTickets) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    setBookingLoading(true);
    setError("");
    setBookingSuccess(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          eventId: event._id,
          quantity: quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBookingSuccess(response.data.booking);

      // Update available tickets immediately
      setEvent({
        ...event,
        availableTickets:
          event.availableTickets - quantity
      });

      setQuantity(1);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Booking failed. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Navbar />

        <main className="event-details-page">
          <div className="events-message">
            Loading event...
          </div>
        </main>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="page">
        <Navbar />

        <main className="event-details-page">
          <div className="events-message error">
            {error}

            <br />

            <Link to="/events">
              Back to Events
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const formattedDate = new Date(
    event.date
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const formattedTime = new Date(
    event.date
  ).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  });

  const totalAmount = event.price * quantity;

  const fallbackImage =
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200";

  return (
    <div className="page">

      <Navbar />

      <main className="event-details-page">

        {/* Event image */}

        <div className="event-details-image">

          <img
            src={event.image || fallbackImage}
            alt={event.title}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />

        </div>

        {/* Event information */}

        <div className="event-details-content">

          <p className="section-label">
            {event.category || "OTHER"}
          </p>

          <h1>
            {event.title}
          </h1>

          <p className="event-details-description">
            {event.description}
          </p>

          <div className="event-info">

            <div>
              <span>Date</span>
              <strong>{formattedDate}</strong>
            </div>

            <div>
              <span>Time</span>
              <strong>{formattedTime}</strong>
            </div>

            <div>
              <span>Venue</span>
              <strong>{event.venue}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{event.city}</strong>
            </div>

          </div>

          {/* Ticket availability */}

          <div className="event-ticket-info">

            <div>
              <span>Tickets available</span>

              <strong>
                {event.availableTickets}
              </strong>
            </div>

            <div>
              <span>Ticket price</span>

              <strong>
                ₹{event.price}
              </strong>
            </div>

          </div>

          {/* Booking section */}

          {event.availableTickets > 0 ? (
            <div className="booking-box">

              <div className="booking-box-header">
                <h2>Book Tickets</h2>

                <span>
                  {event.availableTickets} left
                </span>
              </div>

              <div className="ticket-selector">

                <div>
                  <span>Number of tickets</span>
                  <small>
                    ₹{event.price} per ticket
                  </small>
                </div>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                  >
                    −
                  </button>

                  <strong>
                    {quantity}
                  </strong>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={
                      quantity >= event.availableTickets
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              <div className="booking-total">

                <span>Total</span>

                <strong>
                  ₹{totalAmount}
                </strong>

              </div>

              {error && (
                <p className="form-error">
                  {error}
                </p>
              )}

              <button
                type="button"
                className="book-ticket-button"
                onClick={handleBooking}
                disabled={bookingLoading}
              >
                {bookingLoading
                  ? "Booking..."
                  : "Book Tickets"}
              </button>

            </div>
          ) : (
            <div className="sold-out-box">
              <strong>Sold Out</strong>
              <span>
                There are no tickets remaining for this event.
              </span>
            </div>
          )}

          {/* Booking confirmation */}

          {bookingSuccess && (
            <div className="booking-success">

              <p>
                BOOKING CONFIRMED
              </p>

              <h3>
                Your tickets are booked!
              </h3>

              <div className="booking-success-details">

                <span>Booking ID</span>

                <strong>
                  {bookingSuccess.bookingId}
                </strong>

                <span>Tickets</span>

                <strong>
                  {bookingSuccess.quantity}
                </strong>

                <span>Total paid</span>

                <strong>
                  ₹{bookingSuccess.totalAmount}
                </strong>

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default EventDetails;