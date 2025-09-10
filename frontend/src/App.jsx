import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import React from 'react'

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import { isAuthenticated } from "./utils/authUtils";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FutureTrips from "./pages/FutureTrips/FutureTrips";
import About from "./pages/Home/About";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Root />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signUp" exact element={<SignUp />} />
          <Route path="/future-trips" exact element={<FutureTrips />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </div>
  )
}

// Define the root component to handle the initial redirect
const Root = () => {
  // Use the authentication utility
  const authenticated = isAuthenticated();

  // Redirect to dashboard if authenticated, otherwise to login 
  return authenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
}


export default App