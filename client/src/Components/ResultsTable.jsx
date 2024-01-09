import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Alert, CircularProgress, TextField, Typography } from "@mui/material";
import { ClassNames } from "@emotion/react";
import api from "../api";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import { saveAs } from "file-saver";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#D27519",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    cursor: "pointer", // Add cursor pointer to the body cells
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#E6F4F1",
  },
  "&:hover": {
    backgroundColor: "#FFF59D", // Change the background color on hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomizedTables({
  data,
  final_days,
  final_meals,
  final_leftover,
  final_takeout,
  onCellChange,
}) {
  const [selectedCell, setSelectedCell] = React.useState(null);
  const [suggestedRecipe, setSuggestedRecipe] = React.useState(null);
  const [ingredients, setIngredients] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedValues, setEditedValues] = React.useState({});

  // Add this function
  const toggleEditing = () => {
    if (isEditing) {
      // Save changes and exit editing mode
      // Pass the edited values to the parent component using onCellChange
      Object.keys(editedValues).forEach((day) => {
        Object.keys(editedValues[day]).forEach((mealType) => {
          onCellChange(day, mealType, editedValues[day][mealType]);
        });
      });
    }
    setIsEditing(!isEditing);
    setEditedValues({}); // Reset edited values
  };
  const handleCellChange = (day, mealType, newValue) => {
    onCellChange(day, mealType, newValue); // Call the handler from the parent
  };

  const handleCellClick = async (value) => {
    setSelectedCell(value);
  };

  const handleClosePopup = () => {
    setSelectedCell(null);
  };

  const downloadTxtFile = () => {
    if (!selectedCell || (!suggestedRecipe && !ingredients)) {
      return; // If no data is available, do not proceed with the download
    }

    let content = `${selectedCell}\n\nSuggested Recipe:\n`;
    if (suggestedRecipe) {
      content += `${suggestedRecipe}\n\n`;
    } else {
      content += "No suggested recipe found.\n\n";
    }

    content += "Ingredients:\n";
    if (ingredients) {
      content += `${ingredients}\n`;
    } else {
      content += "No ingredients found.\n";
    }

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedCell}.txt`;
    document.body.appendChild(element); // Required for Firefox
    element.click();
  };

  // Function to check if a given meal is leftover for a specific day
  const isLeftover = (day, meal) => {
    return final_leftover[day]?.includes(meal);
  };

  // Function to check if a given meal is takeout for a specific day
  const isTakeout = (day, meal) => {
    return final_takeout[day]?.includes(meal);
  };

  const handleDownload = () => {
    api
      .postData("/generate_pdf_file", { meal_plan: data })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });

    const downloadFile = async () => {
      try {
        const response = await api.fetchData("/download_pdf_file");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "meal_plan.pdf");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    };
    downloadFile();
  };

  // Effect to fetch the suggested recipe when selectedCell changes
  React.useEffect(() => {
    const fetchSuggestedRecipe = async () => {
      if (selectedCell) {
        try {
          setLoading(true);
          var payload = { selectedCell: selectedCell };
          // console.log(payload);

          // Use await when making the API call
          var response = await api.postData("/getSuggestedRecipe", payload);
          // console.log(response);
          setSuggestedRecipe(response.suggestedRecipe);
          setIngredients(response.ingredients);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching suggested recipe:", error);
          setLoading(false);
        }
      }
    };

    // Call the fetchSuggestedRecipe function
    fetchSuggestedRecipe();
  }, [selectedCell]);

  if (!data) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "5px" }}
      >
        <div style={{ margin: "5px" }}>
          <Button onClick={toggleEditing} variant="contained" size="small">
            {isEditing ? "Save Changes" : "Edit"}
          </Button>
        </div>
        <div style={{ margin: "5px" }}>
          <Button variant="contained" size="small" onClick={handleDownload}>
            Download <DownloadIcon />
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <strong>Day</strong>
              </StyledTableCell>
              {(final_meals.includes("Breakfast") ||
                final_meals.includes("All")) && (
                <StyledTableCell>
                  <strong>Breakfast</strong>
                </StyledTableCell>
              )}
              {(final_meals.includes("Morning Snacks") ||
                final_meals.includes("All")) && (
                <StyledTableCell>
                  <strong>Morning Snacks</strong>
                </StyledTableCell>
              )}
              {(final_meals.includes("Lunch") ||
                final_meals.includes("All")) && (
                <StyledTableCell>
                  <strong>Lunch</strong>
                </StyledTableCell>
              )}
              {(final_meals.includes("Afternoon Snacks") ||
                final_meals.includes("All")) && (
                <StyledTableCell>
                  <strong>Afternoon Snacks</strong>
                </StyledTableCell>
              )}
              {(final_meals.includes("Dinner") ||
                final_meals.includes("All")) && (
                <StyledTableCell>
                  <strong>Dinner</strong>
                </StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data).map(([day, meals]) => {
              if (!final_days.includes(day) && !final_days.includes("All")) {
                return null; // Skip rendering the row if day is not in final_days
              }
              return (
                <>
                  <StyledTableRow key={day}>
                    <StyledTableCell component="th" scope="row">
                      <strong>{day}</strong>
                    </StyledTableCell>
                    {(final_meals.includes("Breakfast") ||
                      final_meals.includes("All")) && (
                      <StyledTableCell
                        onClick={() => {
                          if (!isEditing) {
                            handleCellClick(meals.breakfast);
                          }
                        }}
                      >
                        {isLeftover(day, "Breakfast") ? (
                          "Leftover food"
                        ) : isTakeout(day, "Breakfast") ? (
                          "Takeout food"
                        ) : isEditing ? (
                          <TextField
                            type="text"
                            value={
                              editedValues[day]?.breakfast || meals.breakfast
                            }
                            onChange={(e) =>
                              handleCellChange(day, "breakfast", e.target.value)
                            }
                          />
                        ) : (
                          <div onClick={() => handleCellClick(meals.breakfast)}>
                            {editedValues[day]?.breakfast || meals.breakfast}
                          </div>
                        )}
                      </StyledTableCell>
                    )}
                    {(final_meals.includes("Morning Snacks") ||
                      final_meals.includes("All")) && (
                      <StyledTableCell
                        // onClick={() => handleCellClick(meals.morning_snacks)}
                        onClick={() => {
                          if (!isEditing) {
                            handleCellClick(meals.morning_snacks);
                          }
                        }}
                      >
                        {/* {isLeftover(day, "Morning Snacks")
                          ? "Leftover food"
                          : isTakeout(day, "Morning Snacks")
                          ? "Takeout food"
                          : meals.morning_snacks} */}
                        {isLeftover(day, "Morning Snacks") ? (
                          "Leftover food"
                        ) : isTakeout(day, "Morning Snacks") ? (
                          "Takeout food"
                        ) : isEditing ? (
                          <TextField
                            type="text"
                            value={
                              editedValues[day]?.morning_snacks ||
                              meals.morning_snacks
                            }
                            onChange={(e) =>
                              handleCellChange(
                                day,
                                "morning_snacks",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <div
                            onClick={() =>
                              handleCellClick(meals.morning_snacks)
                            }
                          >
                            {editedValues[day]?.morning_snacks ||
                              meals.morning_snacks}
                          </div>
                        )}
                      </StyledTableCell>
                    )}
                    {(final_meals.includes("Lunch") ||
                      final_meals.includes("All")) && (
                      <StyledTableCell
                        // onClick={() => handleCellClick(meals.lunch)}
                        onClick={() => {
                          if (!isEditing) {
                            handleCellClick(meals.lunch);
                          }
                        }}
                      >
                        {isLeftover(day, "Lunch") ? (
                          "Leftover food"
                        ) : isTakeout(day, "Lunch") ? (
                          "Takeout food"
                        ) : isEditing ? (
                          <TextField
                            type="text"
                            value={editedValues[day]?.lunch || meals.lunch}
                            onChange={(e) =>
                              handleCellChange(day, "lunch", e.target.value)
                            }
                          />
                        ) : (
                          <div onClick={() => handleCellClick(meals.lunch)}>
                            {editedValues[day]?.lunch || meals.lunch}
                          </div>
                        )}
                      </StyledTableCell>
                    )}
                    {(final_meals.includes("Afternoon Snacks") ||
                      final_meals.includes("All")) && (
                      <StyledTableCell
                        // onClick={() => handleCellClick(meals.afternoon_snacks)}
                        onClick={() => {
                          if (!isEditing) {
                            handleCellClick(meals.afternoon_snacks);
                          }
                        }}
                      >
                        {isLeftover(day, "Afternoon Snacks") ? (
                          "Leftover food"
                        ) : isTakeout(day, "Afternoon Snacks") ? (
                          "Takeout food"
                        ) : isEditing ? (
                          <TextField
                            type="text"
                            value={
                              editedValues[day]?.afternoon_snacks ||
                              meals.afternoon_snacks
                            }
                            onChange={(e) =>
                              handleCellChange(
                                day,
                                "afternoon_snacks",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <div
                            onClick={() =>
                              handleCellClick(meals.afternoon_snacks)
                            }
                          >
                            {editedValues[day]?.afternoon_snacks ||
                              meals.afternoon_snacks}
                          </div>
                        )}
                      </StyledTableCell>
                    )}
                    {(final_meals.includes("Dinner") ||
                      final_meals.includes("All")) && (
                      <StyledTableCell
                        // onClick={() => handleCellClick(meals.dinner)}
                        onClick={() => {
                          if (!isEditing) {
                            handleCellClick(meals.dinner);
                          }
                        }}
                      >
                        {isLeftover(day, "Dinner") ? (
                          "Leftover food"
                        ) : isTakeout(day, "Dinner") ? (
                          "Takeout food"
                        ) : isEditing ? (
                          <TextField
                            type="text"
                            value={editedValues[day]?.dinner || meals.dinner}
                            onChange={(e) =>
                              handleCellChange(day, "dinner", e.target.value)
                            }
                          />
                        ) : (
                          <div onClick={() => handleCellClick(meals.dinner)}>
                            {editedValues[day]?.dinner || meals.dinner}
                          </div>
                        )}
                      </StyledTableCell>
                    )}
                  </StyledTableRow>
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedCell && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "25px",
            borderRadius: "4px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 9999,
            width: "60%", // Set the width of the popup
            maxHeight: "90%", // Set the maximum height of the popup
            overflowY: "auto", // Enable vertical scrollbar when content overflows
          }}
        >
          <h4 style={{ color: "#1976D2", width: "80%" }}>{selectedCell}</h4>
          <hr className="hr hr-blurry" />
          <strong>Suggested Recipe : </strong>
          <div className="mt-3">
            {loading ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress />
              </div>
            ) : suggestedRecipe ? (
              suggestedRecipe
                .split("\n")
                .map((step, index) => <div key={index}>{step}</div>)
            ) : (
              <p>No suggested recipe found.</p>
            )}
          </div>
          <br />
          <strong className="mt-3 mb-2">Ingredients : </strong>
          <div className="mt-3">
            {loading ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress />
              </div>
            ) : ingredients ? (
              ingredients
                .split("\n")
                .map((step, index) => <div key={index}>{step}</div>)
            ) : (
              <p>No ingredients found.</p>
            )}
          </div>

          <button
            className="mt-2"
            style={{
              position: "absolute",
              top: "10px",
              right: "60px",
              background: "#D25719", // Add D25719 color to the background
              color: "#fff", // Set text color to white
              border: "none", // Remove border
              borderRadius: "20px", // Add rounded corners
              cursor: "pointer",
              fontSize: "14px", // Reduce font size for a smaller button
              padding: "6px 14px", // Adjust padding for a smaller button
            }}
            onClick={downloadTxtFile} // Call the download function on button click
          >
            Download
          </button>

          <button
            className="mt-2 mr-2"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent", // Make the button background transparent
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "#D25719", // Make the "X" symbol (cross text) red
            }}
            onClick={handleClosePopup}
          >
            &#x2715;
          </button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <Alert
            severity="info"
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              boxShadow: "0 2px 5px 0 rgba(31, 38, 135, 0.37)",
              backdropFilter: "blur(13.5px)",
              webkitBackdropFilter: "blur(13.5px)",
            }}
          >
            Click on a meal to get a recipe and ingredients list!
          </Alert>
        </div>
      </div>
    </>
  );
}
