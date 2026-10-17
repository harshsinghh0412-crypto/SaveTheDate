import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateEvent from "./pages/CreateEvent";
import MyTickets from "./pages/MyTickets";
import MyEvents from "./pages/MyEvents";
import Dashboard from "./pages/Dashboard";
import EditEvent from "./pages/EditEvent";
import BookingDetails from "./pages/BookingDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/events" element={<Events />} />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

        <Route
          path="/signin"
          element={<SignIn />}
        />

        <Route
          path="/signup"
          element={<SignUp />}
        />

        <Route
          path="/create-event"
          element={<CreateEvent />}
        />

        <Route
          path="/my-tickets"
          element={<MyTickets />}
        />

        <Route
          path="/my-events"
          element={<MyEvents />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

        <Route
          path="/edit-event/:id"
          element={<EditEvent />}
        />

        <Route
          path="/booking/:id"
          element={<BookingDetails />}
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App;