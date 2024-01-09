import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";

export default function SuggestionButtons({
  suggestionName,
  onButtonClick,
  values,
}) {
  const [clickedNames, setClickedNames] = useState([]);

  // const handleClick = (name) => {
  //   if (clickedNames.includes(name)) {
  //     const newClickedNames = clickedNames.filter(
  //       (clickedName) => clickedName !== name
  //     );
  //     setClickedNames(newClickedNames);
  //   } else {
  //     setClickedNames([...clickedNames, name]);
  //   }
  // };

  const handleClick = (name) => {
    if (clickedNames.includes(name)) {
      const newClickedNames = clickedNames.filter(
        (clickedName) => clickedName !== name
      );
      setClickedNames(newClickedNames);
    } else {
      setClickedNames([...clickedNames, name]);
    }
  };

  useEffect(() => {
    if (onButtonClick) {
      onButtonClick(suggestionName, clickedNames);
    }
  }, [suggestionName, clickedNames, onButtonClick]);

  return (
    <>
      {values.map((value, index) => (
        <Button
          key={index}
          size="small"
          variant={clickedNames.includes(value) ? "contained" : "outlined"}
          color="primary"
          sx={{
            mt: 1,
            ml: 1,
            borderRadius: "30px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
            },
          }}
          style={{ textTransform: "lowercase" }}
          onClick={() => handleClick(value)}
          name={value}
        >
          {value}
        </Button>
      ))}
    </>
  );
}
