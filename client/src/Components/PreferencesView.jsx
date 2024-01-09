import {
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
// import PhoneInput from "react-phone-number-input/react-native-input";

import React, { useState } from "react";

const countryOptions = [
  { code: "+1", name: "United States (+1)" },
  { code: "+44", name: "United Kingdom (+44)" },
  { code: "+91", name: "India (+91)" },
  // Add more countries as needed
];

const PreferencesView = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newContactNumber, setNewContactNumber] = useState();
  const [selectedCountry, setSelectedCountry] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleContactNumberChange = (event) => {
    setNewContactNumber(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the form from submitting
    // Here, you would typically send a request to your server to update the contact number
    // For this example, we'll just simulate a successful update after a delay
    setTimeout(() => {
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <>
      <div className="container">
        <div className="row mt-4 mb-2">
          <h2>User Preferences</h2>
        </div>
        <div className="row mb-2">
          <hr></hr>
        </div>
        <div className="row mb-2">
          {" "}
          <p>Manage user preferences here.</p>
        </div>

        <div className="row mb-2 mx-2">
          <div className="col-md-3 mt-2 col-sm-12">Change Password</div>

          <div className="col-md-3 col-sm-12">
            <TextField
              fullWidth
              label="Old Password"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={handleOldPasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleOldPasswordVisibility}>
                      {showOldPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="col-md-3 col-sm-12">
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        <div className="row mx-2 mb-2">
          <div className="col-md-3 mt-2 col-12">Update Phone Number</div>
          <div className="col-md-3 col-12 mt-2">
            {isSuccess ? (
              <Typography variant="body1" color="success">
                Contact number updated successfully!
              </Typography>
            ) : (
              <>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={newContactNumber}
                  onChange={setNewContactNumber}
                />
              </>
            )}
          </div>
          <div className="col-md-2 col-6 mt-2">
            <Button
              //   type="submit"
              variant="contained"
              color="primary"
              size="small"
            >
              Verify
            </Button>
          </div>
        </div>
        <div className="row mb-2 mx-2">
          <div className="col-md-3 mt-2 col-sm-12">Change Email</div>

          <div className="col-md-3 col-sm-12">
            <TextField
              fullWidth
              label="New Email"
              type="text"
              //   value={password}
              //   onChange={}
            />
          </div>
          <div className="col-md-2 col-6 mt-2">
            <Button
              //   type="submit"
              variant="contained"
              sx={{ backgroundColor: "#d32f2f" }}
              size="small"
            >
              Send OTP
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreferencesView;
