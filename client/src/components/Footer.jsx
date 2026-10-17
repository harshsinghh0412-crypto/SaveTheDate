function Footer() {
  return (
    <footer className="footer">

      <div className="footer-inner">

        <div className="footer-brand">

          <div className="logo footer-logo">
            <span className="logo-mark">S</span>
            <span>SaveTheDate</span>
          </div>

          <p>
            Discover experiences.
            Meet people.
            Make memories.
          </p>

        </div>

        <div className="footer-column">

          <h4>Discover</h4>

          <a href="/events">Events</a>
          <a href="/meetups">Meetups</a>
          <a href="/cities">Cities</a>
          <a href="/categories">Categories</a>

        </div>

        <div className="footer-column">

          <h4>For Organizers</h4>

          <a href="/create-event">Create Event</a>
          <a href="/dashboard">Organizer Dashboard</a>
          <a href="/pricing">Pricing</a>

        </div>

        <div className="footer-column">

          <h4>Company</h4>

          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>

        </div>

      </div>

      <div className="footer-bottom">
        © 2026 SaveTheDate. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;