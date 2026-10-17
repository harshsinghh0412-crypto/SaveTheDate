import {
  useEffect,
  useState
} from "react";

import {
  useSearchParams
} from "react-router-dom";

import axios from "axios";
import API_BASE_URL from "../config";

import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import { useCity } from "../context/CityContext.jsx";


const categories = [
  "All",
  "Movies",
  "Music",
  "Sports",
  "Comedy",
  "Theatre",
  "Workshops",
  "Meetups",
  "Other"
];


function Events() {

  const {
    selectedCity
  } = useCity();


  const [
    searchParams,
    setSearchParams
  ] = useSearchParams();


  const categoryFromUrl =
    searchParams.get("category");


  const [
    events,
    setEvents
  ] = useState([]);


  const [
    selectedCategory,
    setSelectedCategory
  ] = useState(
    categoryFromUrl &&
    categories.includes(categoryFromUrl)
      ? categoryFromUrl
      : "All"
  );


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  /*
    Fetch events
  */

  useEffect(() => {

    const fetchEvents =
      async () => {

        try {

          const response = await axios.get(`${API_BASE_URL}/api/events`);

          setEvents(
            response.data
          );

        } catch (error) {

          console.error(
            "Failed to fetch events:",
            error
          );

          setError(
            "Unable to load events."
          );

        } finally {

          setLoading(false);

        }

      };


    fetchEvents();

  }, []);


  /*
    Keep selected category
    synchronized with URL
  */

  useEffect(() => {

    if (
      categoryFromUrl &&
      categories.includes(
        categoryFromUrl
      )
    ) {

      setSelectedCategory(
        categoryFromUrl
      );

    } else {

      setSelectedCategory(
        "All"
      );

    }

  }, [categoryFromUrl]);


  /*
    Change category
  */

  const handleCategoryChange =
    (category) => {

      setSelectedCategory(
        category
      );


      if (category === "All") {

        setSearchParams({});

      } else {

        setSearchParams({
          category
        });

      }

    };


  /*
    Filter events
  */

  const filteredEvents =
    events.filter((event) => {

      const matchesCity =
        event.city ===
        selectedCity;


      const matchesCategory =
        selectedCategory === "All" ||
        event.category ===
        selectedCategory;


      return (
        matchesCity &&
        matchesCategory
      );

    });


  return (

    <div className="page">

      <Navbar />


      <main className="events-page">


        {/* HEADER */}

        <section className="events-header">

          <div>

            <p className="section-label">
              DISCOVER
            </p>

            <h1>
              {selectedCategory === "All"
                ? `Events in ${selectedCity}`
                : `${selectedCategory} events in ${selectedCity}`
              }
            </h1>

            <p>
              {selectedCategory === "All"
                ? `Find something exciting to do in ${selectedCity}.`
                : `Discover ${selectedCategory.toLowerCase()} events happening in ${selectedCity}.`
              }
            </p>

          </div>

        </section>


        {/* CATEGORY FILTER */}

        <section className="events-filters">

          <div className="category-filter">

            {categories.map(
              (category) => (

                <button
                  key={category}
                  type="button"
                  className={
                    selectedCategory ===
                    category
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() =>
                    handleCategoryChange(
                      category
                    )
                  }
                >
                  {category}
                </button>

              )
            )}

          </div>

        </section>


        {/* EVENTS */}

        <section className="events-list">


          {/* LOADING */}

          {loading && (

            <div className="events-message">
              Loading events...
            </div>

          )}


          {/* ERROR */}

          {!loading &&
            error && (

              <div className="events-message error">
                {error}
              </div>

            )}


          {/* EVENTS FOUND */}

          {!loading &&
            !error &&
            filteredEvents.length > 0 && (

              <div className="event-grid">

                {filteredEvents.map(
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

          {!loading &&
            !error &&
            filteredEvents.length === 0 && (

              <div className="events-message">

                No{" "}

                {selectedCategory === "All"
                  ? ""
                  : selectedCategory.toLowerCase() +
                    " "
                }

                events found in{" "}
                {selectedCity}.

              </div>

            )}

        </section>

      </main>

    </div>

  );

}


export default Events;