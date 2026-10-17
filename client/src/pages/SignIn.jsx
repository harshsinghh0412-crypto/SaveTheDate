import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signin",
        formData
      );

      // Save authentication information
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Go to homepage
      navigate("/");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <Navbar />

      <main className="signin-page">

        <div className="signin-card">

          <p className="section-label">
            WELCOME BACK
          </p>

          <h1>
            Sign in to SaveTheDate
          </h1>

          <p className="signin-description">
            Sign in to book events, manage your tickets and create
            experiences.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="signin-submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/signup">
              Sign up
            </Link>
          </p>

        </div>

      </main>

    </div>
  );
}

export default SignIn;