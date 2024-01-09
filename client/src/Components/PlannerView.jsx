import HomeStepper from "./HomeStepper";
import Header from "./header";
import backgroundImage from "../images/background1.jpg";
// import "./App.css";
import ResultsTable from "./ResultsTable";
import Footer from "./Footer";
import React, { useState, useEffect, useRef } from "react";
import { Alert, Card, CardContent, Typography } from "@mui/material";

function PlannerView() {
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
      <div //parent division of content
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "90vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          ref={cardRef}
          className={scrolling ? "Card scrolling" : "Card"}
          hidden={hideHomeStepper}
          sx={{
            minWidth: 275,
            borderRadius: "20px",
            border: "1px solid rgba( 255, 255, 255, 0.18 )",
            overflow: "hidden",
          }}
          style={{
            maxWidth: "95%",
            maxHeight: "80%",
            overflow: "auto",
            background: "rgba( 255, 255, 255, 0.7 )",
            boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
            backdropFilter: "blur( 13.5px )",
            webkitBackdropFilter: "blur( 13.5px ),",
          }}
        >
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            ></Typography>
            <div style={{}}>
              <div className="container">
                <div className="row mx-5 mt-5">
                  <HomeStepper handleResposeFetched={handleResposeFetched} />
                </div>
              </div>
            </div>
          </CardContent>
          {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
        </Card>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            maxWidth: "95%",
            maxHeight: "90%",
            overflow: "auto",
            background: "rgba( 255, 255, 255, 0 )",
          }}
          hidden={hideResultsTable}
        >
          <ResultsTable
            data={tableData.meal_plan}
            final_days={days}
            final_meals={meals}
            final_leftover={leftover}
            final_takeout={takeout}
            onCellChange={handleCellChange}
          />
        </div>
      </div>
    </>
  );
}

export default PlannerView;
