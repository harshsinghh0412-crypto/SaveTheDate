import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
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

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/signin");
      }, 1500);

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
            JOIN SAVETHEDATE
          </p>

          <h1>Create your account</h1>

          <p className="signin-description">
            Create an account to book events, manage your tickets and
            discover new experiences.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

            {message && (
              <p className="form-success">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="signin-submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <p className="signup-text">
            Already have an account?{" "}
            <Link to="/signin">
              Sign in
            </Link>
          </p>

        </div>
      </main>
    </div>
  );
}

export default SignUp;