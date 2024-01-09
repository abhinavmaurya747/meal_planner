import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import ModifiedMultiMealSelect from "./ModifiedMultiMealSelect";

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
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultiDayMealSelect(props) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [data, setData] = React.useState({});

  const handleMealsChange = (incoming_meals, day) => {
    if (data[day] !== incoming_meals) {
      const updatedData = { ...data, [day]: incoming_meals };
      setData(updatedData);
      props.handleLeftoverTakeoutChange(props.id, updatedData);
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setPersonName(value);
  };

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
        <InputLabel id={props.id} sx={{ width: "100%" }}>
          {props.label}
        </InputLabel>
        <Select
          labelId={props.id}
          id={props.id}
          multiple
          value={personName}
          onChange={handleChange}
          input={
            <OutlinedInput id={`select-${props.id}`} label={props.label} />
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
              disabled={name === "All" && personName.length > 1}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Conditionally render the SelectedElementComponent */}
      <div className="row">
        {personName.map((selectedValue) => (
          <div className="col-6">
            {/* <SelectedElementComponent
            key={selectedValue}
            selectedValue={selectedValue}
          /> */}
            <ModifiedMultiMealSelect
              handleMealsChange={handleMealsChange}
              label={selectedValue}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
