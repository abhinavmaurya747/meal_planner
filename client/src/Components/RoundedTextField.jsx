import { TextField } from "@mui/material";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

export default function RoundedTextField(props) {
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange(event.target.value, props.name);
    }
  };

  return (
    <>
      <TextField
        fullWidth
        id={props.id}
        label={props.fieldLabel}
        multiline
        rows={1}
        type="text"
        value={props.value}
        defaultValue=""
        required={props.isRequired ? true : false}
        aria-required={props.isRequired ? "true" : "false"}
        sx={{
          borderRadius: "20px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
          },
          boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
        }}
        onChange={handleChange}
      />
    </>
  );
}
