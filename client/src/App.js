// src/App.js
import React, { useState, useEffect, useRef } from "react";
import { Alert, Card, CardContent, Typography } from "@mui/material";
// import HomeStepper from "./Components/HomeStepper";
// import Header from "./Components/header";
// import backgroundImage from "./images/background1.jpg";
import "./App.css";
// import ResultsTable from "./Components/ResultsTable";
// import Footer from "./Components/Footer";
import Login from "./Components/Login";
// import Button from "@mui/material/Button";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  const checkLogin = (status) => {
    if (status === true) {
      handleLogin();
    }
  };
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("loginStatus", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setHideHomeStepper(false); // Show the login form again
    setHideResultsTable(true);
    localStorage.setItem("loginStatus", "false");
  };

  const [tableData, setTableData] = useState({});
  const [hideHomeStepper, setHideHomeStepper] = useState(false);
  const [hideResultsTable, setHideResultsTable] = useState(true);
  const [days, setDays] = useState(null);
  const [meals, setMeals] = useState(null);
  const [leftover, setLeftover] = useState(null);
  const [takeout, setTakeout] = useState(null);

  const handleResposeFetched = (resp, days, meals, leftover, takeout) => {
    setHideHomeStepper(true);
    setHideResultsTable(false);
    setTableData(resp);
    setDays(days);
    setMeals(meals);
    setTakeout(takeout);
    setLeftover(leftover);
  };

  // Function to update data when inline editing occurs
  const handleCellChange = (day, mealType, newValue) => {
    // Create a copy of the data
    const updatedData = { ...tableData };
    console.log(tableData);

    // Update the specific cell value
    updatedData["meal_plan"][day][mealType] = newValue;

    // Set the updated data
    setTableData(updatedData);
  };

  const cardRef = useRef(null);
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const card = cardRef.current;
        setScrolling(card.scrollTop > 0);
      }
    };

    if (cardRef.current) {
      const card = cardRef.current;
      card.addEventListener("scroll", handleScroll);
      return () => card.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <>
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} checkLogin={checkLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard logout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login onLogin={handleLogin} />} /> */}
        </Routes>

        {/* <Footer /> */}
      </Router>
    </>
  );
}

export default App;
