import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import { useCity } from "../context/CityContext.jsx";

const categories = [
  "Movies",
  "Music",
  "Sports",
  "Comedy",
  "Theatre",
  "Workshops",
  "Meetups",
  "Food & Drink"
];

function Home() {
  const {
    selectedCity,
    changeCity
  } = useCity();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/events"
        );

        setEvents(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch events:",
          error
        );

        setEventError(
          "Unable to load popular events."
        );
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  /*
    Count events by city
  */

  const bhubaneswarEvents = events.filter(
    (event) =>
      event.city === "Bhubaneswar"
  ).length;

  const hyderabadEvents = events.filter(
    (event) =>
      event.city === "Hyderabad"
  ).length;

  const bengaluruEvents = events.filter(
    (event) =>
      event.city === "Bengaluru"
  ).length;


  /*
    Get events for selected city
  */

  const cityEvents = events.filter(
    (event) =>
      event.city === selectedCity
  );


  /*
    Show first 4 events
  */

  const popularEvents =
    cityEvents.slice(0, 4);


  return (
    <div className="page">

      <Navbar />


      {/* ==========================================
          HERO
          ========================================== */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            DISCOVER YOUR NEXT EXPERIENCE
          </p>

          <h1>
            Find something
            <br />
            <span>
              worth remembering.
            </span>
          </h1>

          <p className="hero-description">
            Discover concerts, movies, sports,
            workshops, meetups and experiences
            happening around you.
          </p>


          <div className="search-box">

            <input
              type="text"
              placeholder="Search events, artists, venues..."
            />

            <button type="button">
              Search
            </button>

          </div>


          <div className="hero-buttons">

            <Link
              to="/events"
              className="primary-button"
            >
              Explore Events
            </Link>

            <Link
              to="/create-event"
              className="secondary-button"
            >
              Create an Event
            </Link>

          </div>

        </div>

      </section>


      {/* ==========================================
          CITY SELECTION
          ========================================== */}

      <section className="section">

        <div className="section-header">

          <div>

            <p className="section-label">
              EXPLORE
            </p>

            <h2>
              Events near you
            </h2>

          </div>

        </div>


        {/* CHROME-STYLE CITY TABS */}

        <div className="city-tabs-container">


          {/* BHUBANESWAR */}

          <button
            type="button"
            className={
              selectedCity === "Bhubaneswar"
                ? "city-tab-card active"
                : "city-tab-card"
            }
            onClick={() =>
              changeCity("Bhubaneswar")
            }
          >

            <span>
              Bhubaneswar
            </span>

            <small>
              {bhubaneswarEvents} events
            </small>

          </button>


          {/* HYDERABAD */}

          <button
            type="button"
            className={
              selectedCity === "Hyderabad"
                ? "city-tab-card active"
                : "city-tab-card"
            }
            onClick={() =>
              changeCity("Hyderabad")
            }
          >

            <span>
              Hyderabad
            </span>

            <small>
              {hyderabadEvents} events
            </small>

          </button>


          {/* BENGALURU */}

          <button
            type="button"
            className={
              selectedCity === "Bengaluru"
                ? "city-tab-card active"
                : "city-tab-card"
            }
            onClick={() =>
              changeCity("Bengaluru")
            }
          >

            <span>
              Bengaluru
            </span>

            <small>
              {bengaluruEvents} events
            </small>

          </button>

        </div>

      </section>


      {/* ==========================================
          CATEGORIES
          ========================================== */}

      <section className="section">

        <div className="section-header">

          <div>

            <p className="section-label">
              BROWSE
            </p>

            <h2>
              Explore by category
            </h2>

          </div>

          <Link
            to="/events"
            className="view-all"
          >
            View all
          </Link>

        </div>


        <div className="category-grid">

            {categories.map((category) => (

                <Link
                key={category}
                to={`/events?category=${encodeURIComponent(
                    category
                )}`}
                className="category-card"
                >

                <h3>
                    {category}
                </h3>

                <p>
                    Explore{" "}
                    {category.toLowerCase()}
                </p>

                </Link>

            ))}

        </div>

      </section>


      {/* ==========================================
          POPULAR EVENTS
          ========================================== */}

      <section className="section events-section">

        <div className="section-header">

          <div>

            <p className="section-label">
              DON'T MISS OUT
            </p>

            <h2>
              Popular events in{" "}
              {selectedCity}
            </h2>

          </div>

          <Link
            to="/events"
            className="view-all"
          >
            See all events
          </Link>

        </div>


        {/* LOADING */}

        {loadingEvents && (
          <div className="events-message">
            Loading popular events...
          </div>
        )}


        {/* ERROR */}

        {!loadingEvents &&
          eventError && (

            <div className="events-message error">
              {eventError}
            </div>

          )}


        {/* EVENTS */}

        {!loadingEvents &&
          !eventError &&
          popularEvents.length > 0 && (

            <div className="event-grid">

              {popularEvents.map(
                (event) => (

                  <EventCard
                    key={event._id}
                    event={{
                      ...event,

                      date:
                        new Date(
                          event.date
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          }
                        )
                    }}
                  />

                )
              )}

            </div>

          )}


        {/* NO EVENTS */}

        {!loadingEvents &&
          !eventError &&
          popularEvents.length === 0 && (

            <div className="events-message">

              No upcoming events in{" "}
              {selectedCity}.

              <br />

              <Link to="/create-event">
                Create the first event
              </Link>

            </div>

          )}

      </section>


      {/* ==========================================
          CREATOR CTA
          ========================================== */}

      <section className="creator-cta">

        <div className="creator-cta-inner">

          <div className="creator-cta-label">
            FOR CREATORS
          </div>

          <h2>
            Have an event in mind?
          </h2>

          <p>
            Create your event, sell tickets
            and bring people together on
            SaveTheDate.
          </p>

          <Link to="/create-event">
            Create Your Event
          </Link>

        </div>

      </section>


      {/* ==========================================
          FOOTER
          ========================================== */}

      <footer className="footer">

        <div className="footer-logo">
          Save<span>TheDate</span>
        </div>

        <p>
          Discover. Connect. Experience.
        </p>

      </footer>

    </div>
  );
}

export default Home;