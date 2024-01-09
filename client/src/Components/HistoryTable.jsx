import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import api from "../api";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "left",
    "&:first-of-type": {
      textAlign: "center", // Center text in the first column
    },
  },
  borderRight: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    border: `1px solid ${theme.palette.divider}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function createData(uid, name, timestamp, leftover_days, takeout_days, plan) {
  return { uid, name, timestamp, leftover_days, takeout_days, plan };
}

export default function HistoryTable() {
  const [rows, setRows] = useState([]);

  async function get_current_user_meals() {
    let meals = null;
    console.log("Have to print current user here!");
    api
      .postData("/getUserMealDetails", { username: "user" })
      .then((response) => {
        meals = response;
        let newRows = [];
        for (let index in meals["all_meal_data"]) {
          let leftover_days =
            meals["all_meal_data"][index]["meal_data"].meal_requirements
              .leftover_days;
          let leftover_days_string = "";
          let leftover_days_list = [];
          for (let day in leftover_days) {
            for (let day_meal in leftover_days[day]) {
              // leftover_days_string +=
              //   day + " " + leftover_days[day][day_meal] + ", ";
              leftover_days_list.push(day + " " + leftover_days[day][day_meal]);
            }
          }
          leftover_days_string = leftover_days_list.join(", ");
          let takeout_days =
            meals["all_meal_data"][index]["meal_data"].meal_requirements
              .takeout_days;
          let takeout_days_string = "";
          let takeout_days_list = [];
          for (let day in takeout_days) {
            for (let day_meal in takeout_days[day]) {
              takeout_days_list.push(day + " " + takeout_days[day][day_meal]);
            }
          }

          let plan =
            meals["all_meal_data"][index]["meal_data"]["json_data"][
              "meal_plan"
            ];
          takeout_days_string = takeout_days_list.join(", ");
          let data_point = createData(
            meals["all_meal_data"][index]["uid"],
            meals["all_meal_data"][index]["uid"],
            meals["all_meal_data"][index]["date"],
            leftover_days_string,
            takeout_days_string,
            plan
          );
          newRows.push(data_point);
        }
        setRows(newRows);
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  }

  const handleDownload = (plan, date) => {
    // Replace the following line with the action you want to perform
    api
      .postData("/generate_pdf_file", { meal_plan: plan, date: date })
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

  useEffect(() => {
    get_current_user_meals();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Plan ID</StyledTableCell>
            <StyledTableCell align="right">Created On</StyledTableCell>
            <StyledTableCell align="right">Leftover Days</StyledTableCell>
            <StyledTableCell align="right">Takeout Days</StyledTableCell>
            <StyledTableCell align="right">Download</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">
                {/* {row.calories}*/} {row.timestamp.replace(/\.\d{6}$/, "")}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.leftover_days}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.takeout_days}
              </StyledTableCell>
              <StyledTableCell align="right">
                {/* {row.fat} */}
                <Button
                  variant="contained"
                  size="small"
                  className="mt-2"
                  style={{
                    background: "#D25719", // Add D25719 color to the background
                    color: "#fff", // Set text color to white
                    border: "none", // Remove border
                    borderRadius: "20px", // Add rounded corners
                    cursor: "pointer",
                    fontSize: "12px", // Reduce font size for a smaller button
                    padding: "6px 14px", // Adjust padding for a smaller button
                  }}
                  onClick={() => handleDownload(row.plan, row.timestamp)}
                >
                  Download <DownloadIcon />
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
