import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  CssBaseline,
  Grid,
} from "@mui/material";
import api from "../api";

const styles = {
  signUpContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  signUpPaper: {
    padding: "32px",
    maxWidth: 500,
    borderRadius: "16px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  },
  submitButton: {
    marginTop: "24px",
    backgroundColor: "#1976D2",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1565C0",
    },
  },
  signInLink: {
    marginTop: "16px",
    display: "block",
    textAlign: "center",
    color: "#1976D2",
    textDecoration: "none",
  },
};

function SignUp({ handleLoginClick }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();

    // Perform sign up logic here
    console.log("Signed up with email:", email);
    console.log("Username:", username);
    console.log("Password:", password);
    api
      .postData("/api/register", { username, email, password })
      .then((response) => {
        console.log(response);
        try {
          if (response.ok) {
            alert("Registration successful. You can now log in.");
            window.location.reload(false);
          } else {
            alert(
              "Registration failed. Username/Email already exists.\nPlease try different username/email"
            );
          }
        } catch {}
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  };

  return (
    <Container component="main" maxWidth="xs" style={styles.signUpContainer}>
      <CssBaseline />
      <Paper elevation={3} style={styles.signUpPaper}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h4" component="h2">
              Sign Up
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Create a new account
            </Typography>
          </Grid>
          <Grid item style={{ width: "100%" }}>
            <form onSubmit={handleSignUp}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                style={styles.submitButton}
              >
                Sign Up
              </Button>
            </form>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              className="mt-2"
            >
              Already an account?{" "}
              <a
                style={{
                  color: "#1976D2",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onClick={handleLoginClick}
              >
                Log In as existing user
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default SignUp;
