import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">

        <p className="hero-label">DISCOVER YOUR NEXT EXPERIENCE</p>

        <h1>
          Find something
          <br />
          <span>worth remembering.</span>
        </h1>

        <p className="hero-description">
          Discover concerts, movies, sports, workshops, meetups and
          <br />
          experiences happening around you.
        </p>

        <div className="hero-search">
          <input
            type="text"
            placeholder="Search events, artists, venues..."
          />
          <button type="button">Search</button>
        </div>

        {/* Hero action buttons */}
        <div className="hero-cta-row">
          <Link to="/events" className="hero-cta hero-cta-primary">
            Explore Events
          </Link>

          <Link to="/create-event" className="hero-cta hero-cta-secondary">
            Create an Event
          </Link>
        </div>

      </div>
    </section>
  );
}

export default Hero;