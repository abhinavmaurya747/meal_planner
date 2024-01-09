import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

function Header() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <center>
            <Toolbar>
              <Typography variant="h3" component="span" sx={{ flexGrow: 1 }}>
                <div className="mt-3 mb-3" style={{ userSelect: "none" }}>
                  Meal Planner
                </div>
              </Typography>
            </Toolbar>
          </center>
        </AppBar>
      </Box>
    </>
  );
}

export default Header;
