import { Link } from "react-router-dom";

const fallbackImage =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200";

function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event._id}`}
      className="event-card"
    >

      <div className="event-image-container">

        <img
          src={event.image || fallbackImage}
          alt={event.title}
          className="event-image"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />

        <span className="event-category">
          {event.category || "OTHER"}
        </span>

        <button
          type="button"
          className="event-favorite"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          ♡
        </button>

      </div>

      <div className="event-card-content">

        <p className="event-date">
          {event.date}
        </p>

        <h3 className="event-title">
          {event.title}
        </h3>

        <p className="event-venue">
          {event.venue}
        </p>

        <div className="event-bottom">

          <span className="event-price">
            ₹{event.price}
          </span>

          <span className="event-city">
            {event.city}
          </span>

        </div>

      </div>

    </Link>
  );
}

export default EventCard;