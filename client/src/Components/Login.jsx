import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  CssBaseline,
  Grid,
  Box,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import SignUp from "./SignUp";
import backgroundImage from "../images/login_background.jpg";
import Footer from "./Footer";
import api from "../api";

const styles = {
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  loginPaper: {
    padding: "32px",
    maxWidth: 500,
    borderRadius: "16px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  },
  lockIcon: {
    fontSize: "64px",
    marginBottom: "16px",
    color: "#1976D2",
  },
  submitButton: {
    marginTop: "24px",
    backgroundColor: "#1976D2",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1565C0",
    },
  },
};

function Login({ onLogin, checkLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);

  useEffect(() => {
    const status = localStorage.getItem("loginStatus");
    // Check if a value exists in local storage
    if (status === "true") {
      checkLogin(true);
      // Check as a string
      // setIsLoggedIn(true);
    } else {
      // onLogin(false);
      // setIsLoggedIn(false);
    }
  }, []); // Added empty dependency array to run the effect only once

  const handleSignUpClick = () => {
    // Your function logic here
    // console.log("Sign Up link clicked!");
    setIsSignUp(true);
    setIsLogIn(false);
    // Call any function you want here
  };

  const handleLoginClick = () => {
    // Your function logic here
    // console.log("Sign Up link clicked!");
    setIsSignUp(false);
    setIsLogIn(true);
    // Call any function you want here
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Perform authentication logic here
    // For demonstration purposes, let's assume a simple username/password check
    api
      .postData("/api/login", { username, password })
      .then((response) => {
        console.log(response);
        if (response["message"] === "success") {
          onLogin();
        } else {
          setInvalidCredentials(true);
        }
        // if (response.ok) {
        //   alert("Login successful");
        // } else {
        //   alert("Login failed");
        // }
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
    // if (username === "user" && password === "password") {
    //   onLogin();
    // } else {
    //   setInvalidCredentials(true);
    // }
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          minHeight: "300px",
          overflow: "hidden", // Hide overflowing blurred image
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "blur(4px)", // Apply the blur effect
            zIndex: -1,
          }}
        >
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          ></Box>
        </div>
        {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0",
          }}
        >
          <h1
            style={{
              display: "flex",
              fontSize: "4rem",
              color: "#D27519",
              fontFamily: "cursive",
            }}
          >
            {" "}
            Meal Planner
          </h1>
        </div> */}

        {isSignUp && <SignUp handleLoginClick={handleLoginClick} />}
        {isLogIn && (
          <Container
            component="main"
            maxWidth="xs"
            style={styles.loginContainer}
          >
            <CssBaseline />
            <Paper elevation={3} style={styles.loginPaper}>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <LockIcon style={styles.lockIcon} />
                </Grid>
                <Grid item>
                  <Typography variant="h4" component="h2">
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Please sign in to continue
                  </Typography>
                </Grid>
                {invalidCredentials && (
                  <Grid item>
                    <Typography variant="body2" color="error">
                      Invalid credentials
                    </Typography>
                  </Grid>
                )}
                <Grid item style={{ width: "100%" }}>
                  <form onSubmit={handleLogin}>
                    <TextField
                      label="Username or Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                      label="Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                      margin="normal"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      style={styles.submitButton}
                    >
                      Login
                    </Button>
                  </form>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                    className="mt-2"
                  >
                    Don't have an account?{" "}
                    <a
                      style={{
                        color: "#1976D2",
                        textDecoration: "none",
                        cursor: "pointer",
                      }} // Add cursor property
                      onClick={handleSignUpClick}
                    >
                      Sign Up as a new user
                    </a>
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        )}
      </Box>
      <Footer />
    </>
  );
}

export default Login;
