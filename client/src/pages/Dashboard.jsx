import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/events/my/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setAnalytics(response.data);
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
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  if (loading) {
    return (
      <div className="page">
        <Navbar />

        <main className="dashboard-page">
          <div className="events-message">
            Loading dashboard...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Navbar />

        <main className="dashboard-page">
          <div className="events-message error">
            {error}
          </div>
        </main>
      </div>
    );
  }

  const summary = analytics?.summary || {
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0
  };

  const performance = analytics?.performance || [];

  return (
    <div className="page">
      <Navbar />

      <main className="dashboard-page">
        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <p className="section-label">
              ORGANIZER
            </p>

            <h1>Dashboard</h1>

            <p>
              Track your events, ticket sales and revenue.
            </p>
          </div>

          <Link
            to="/create-event"
            className="dashboard-create-button"
          >
            + Create Event
          </Link>
        </div>

        {/* SUMMARY CARDS */}
        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <span className="dashboard-stat-label">
              Total Events
            </span>

            <strong className="dashboard-stat-value">
              {summary.totalEvents}
            </strong>

            <span className="dashboard-stat-description">
              Events you've created
            </span>
          </div>

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-label">
              Tickets Sold
            </span>

            <strong className="dashboard-stat-value">
              {summary.totalTicketsSold}
            </strong>

            <span className="dashboard-stat-description">
              Confirmed tickets
            </span>
          </div>

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-label">
              Total Revenue
            </span>

            <strong className="dashboard-stat-value">
              ₹{summary.totalRevenue.toLocaleString("en-IN")}
            </strong>

            <span className="dashboard-stat-description">
              From confirmed bookings
            </span>
          </div>
        </div>

        {/* EVENT PERFORMANCE */}
        <section className="dashboard-performance">
          <div className="dashboard-section-header">
            <div>
              <p className="section-label">
                PERFORMANCE
              </p>

              <h2>Event Performance</h2>
            </div>

            <Link to="/my-events">
              View All Events →
            </Link>
          </div>

          {performance.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No events yet</h3>

              <p>
                Create your first event to start tracking
                performance.
              </p>

              <Link
                to="/create-event"
                className="dashboard-empty-button"
              >
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Tickets Sold</th>
                    <th>Available</th>
                    <th>Revenue</th>
                  </tr>
                </thead>

                <tbody>
                  {performance.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <Link
                          to={`/events/${event.id}`}
                          className="dashboard-event-name"
                        >
                          {event.title}
                        </Link>

                        <span className="dashboard-event-location">
                          {event.venue}, {event.city}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          event.date
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>

                      <td>
                        <strong>
                          {event.ticketsSold}
                        </strong>
                      </td>

                      <td>
                        {event.availableTickets}
                      </td>

                      <td>
                        <strong>
                          ₹
                          {event.revenue.toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;