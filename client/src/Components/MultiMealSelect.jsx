import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "All",
  "Breakfast",
  "Morning Snacks",
  "Lunch",
  "Afternoon Snacks",
  "Dinner",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultiMealSelect({ handleMealsChange }) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState(["All"]);
  const [prevValues, setPrevValues] = React.useState(["All"]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value.includes("All") && !prevValues.includes("All")) {
      setPersonName(["All"]);
    } else if (value.length >= 2 && value.includes("All")) {
      setPersonName(value.filter((name) => name !== "All"));
    } else {
      setPersonName(value);
    }
    setPrevValues(value);
  };

  React.useEffect(() => {
    handleMealsChange(personName);
  }, [personName, handleMealsChange]);

  return (
    <div>
      <FormControl
        sx={{
          m: 1,
          ml: -1,
          width: "100%",
          borderRadius: "20px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
          },
          boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
        }}
      >
        <InputLabel id="demo-multiple-chip-label" sx={{ width: "100%" }}>
          Select Meals
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={
            <OutlinedInput id="select-multiple-chip" label="Select Meals" />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
