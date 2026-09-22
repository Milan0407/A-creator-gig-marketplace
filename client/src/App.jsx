import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import GigDetails from "./pages/GigDetails.jsx";
import PostGig from "./pages/PostGig.jsx";
import Booking from "./pages/Booking.jsx";
import CreatorDashboard from "./pages/CreatorDashboard.jsx";
import MyBookings from "./pages/MyBookings.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/gigs/:id" element={<GigDetails />} />
          <Route path="/post-gig" element={<PostGig />} />
          <Route path="/booking/:gigId" element={<Booking />} />
          <Route path="/creator-dashboard" element={<CreatorDashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
