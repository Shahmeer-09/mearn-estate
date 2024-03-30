import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Header from "./componenets/Header";
import Private from "./componenets/Private";
import Listing from "./pages/Listing";
import EditListItem from './pages/EditListItem'
import ListingLandPage from "./pages/ListingLandPage";
import Search from "./pages/Search";
const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Sign-up" element={<Signup />} />
        <Route path="/Sign-in" element={<Signin />} />
        <Route path="/listing/:listingId" element={<ListingLandPage />} />
        <Route path="/search" element={<Search />} />
        <Route element={<Private/>} >
          <Route path="/profile" element={<Profile />} />
          <Route path="/create_listing" element={<Listing />} />
          <Route path="/update_listing/:itemId" element={<EditListItem />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
