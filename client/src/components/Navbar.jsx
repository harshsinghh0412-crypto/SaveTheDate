import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import axios from "axios";
import API_BASE_URL from "../config";

import {
  useCity
} from "../context/CityContext.jsx";


const cities = [
  "Bhubaneswar",
  "Hyderabad",
  "Bengaluru"
];


function Navbar() {

  const navigate = useNavigate();

  const locationRef = useRef(null);


  const {
    selectedCity,
    changeCity
  } = useCity();


  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [locationOpen, setLocationOpen] =
    useState(false);


  /*
    Check authentication
  */

  useEffect(() => {

    const fetchUser = async () => {

      const token =
        localStorage.getItem("token");


      if (!token) {

        setLoading(false);

        return;
      }


      try {

        const response = await axios.get(`${API_BASE_URL}/api/auth/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        setUser(
          response.data.user
        );

      } catch (error) {

        console.error(
          "Authentication check failed"
        );


        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );


        setUser(null);

      } finally {

        setLoading(false);

      }

    };


    fetchUser();

  }, []);


  /*
    Close location dropdown
    when clicking outside
  */

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          locationRef.current &&
          !locationRef.current.contains(
            event.target
          )
        ) {

          setLocationOpen(false);

        }

      };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  /*
    Logout
  */

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );


    setUser(null);

    navigate("/");

  };


  /*
    Change city
  */

  const handleCityChange =
    (city) => {

      changeCity(city);

      setLocationOpen(false);

    };


  return (

    <nav className="navbar">


      {/* LOGO */}

      <Link
        to="/"
        className="navbar-logo"
      >
        Save<span>TheDate</span>
      </Link>


      {/* NAVIGATION */}

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/events">
          Events
        </Link>


        {user && (
          <>

            <Link to="/my-tickets">
              My Tickets
            </Link>

            <Link to="/my-events">
              My Events
            </Link>

            <Link to="/dashboard">
              Dashboard
            </Link>

          </>
        )}


        <Link to="/create-event">
          Create Event
        </Link>

      </div>


      {/* RIGHT SIDE */}

      <div className="navbar-actions">


        {/* LOCATION */}

        <div
          className="navbar-location-wrapper"
          ref={locationRef}
        >

          <button
            type="button"
            className="navbar-city"
            onClick={() =>
              setLocationOpen(
                !locationOpen
              )
            }
          >

            <span>
              📍
            </span>

            <span>
              {selectedCity}
            </span>

            <span
              className={
                locationOpen
                  ? "location-arrow open"
                  : "location-arrow"
              }
            >
              ▾
            </span>

          </button>


          {locationOpen && (

            <div className="navbar-location-menu">

              <div className="navbar-location-title">
                Select your city
              </div>


              {cities.map(
                (city) => (

                  <button
                    key={city}
                    type="button"
                    className={
                      selectedCity === city
                        ? "navbar-city-option active"
                        : "navbar-city-option"
                    }
                    onClick={() =>
                      handleCityChange(
                        city
                      )
                    }
                  >

                    <span>

                      {selectedCity === city
                        ? "✓"
                        : ""}

                    </span>

                    <span>
                      {city}
                    </span>

                  </button>

                )
              )}

            </div>

          )}

        </div>


        {/* SIGN IN */}

        {!loading &&
          !user && (

            <Link
              to="/signin"
              className="navbar-signin"
            >
              Sign In
            </Link>

          )}


        {/* LOGGED-IN USER */}

        {!loading &&
          user && (

            <div className="navbar-user">

              <span className="navbar-user-name">
                {user.name}
              </span>

              <button
                type="button"
                className="navbar-logout"
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>

            </div>

          )}

      </div>

    </nav>

  );
}


export default Navbar;