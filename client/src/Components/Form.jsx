import { Button } from "@mui/material";
import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import RoundedTextField from "./RoundedTextField";
import MultiDayMealSelect from "./MultiDayMealSelect";
import MultiMealSelect from "./MultiMealSelect";
import MultiDaySelect from "./MultiDaySelect";

function Form() {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 mt-2">
            <form>
              <div className="row mt-3 mb-3">
                <div className="col-6">
                  <MultiDaySelect />
                </div>
                <div className="col-6">
                  <MultiMealSelect />
                </div>
              </div>
              <div className="row mt-3 mb-3">
                <RoundedTextField
                  fieldLabel="Your food genre preferences: (Mexican, Italian, Chinese, etc.) :"
                  id="food_genre"
                />
              </div>
              <div className="row mt-3 mb-3">
                <RoundedTextField
                  fieldLabel="Preferred foods (Add atleast 5-10 foods) :"
                  id="preferred"
                />
              </div>
              <div className="row mt-3 mb-3">
                <RoundedTextField
                  fieldLabel="Foods to avoid :"
                  id="avoid_foods"
                />
              </div>
              <div className="row mt-3 mb-3">
                <RoundedTextField
                  fieldLabel="Allergic foods:"
                  id="allergic_foods"
                />
              </div>
              <div className="row mt-3 mb-3">
                <RoundedTextField
                  fieldLabel="If you'd like to plan treats in your plan, what are fun foods you enjoy?"
                  id="treats"
                />
              </div>
              <div className="row mt-3 mb-3">
                <MultiDayMealSelect
                  id="leftover_days"
                  label="Select Leftover Days"
                />
              </div>
              <div className="row mt-3 mb-3">
                <MultiDayMealSelect
                  id="takeout_days"
                  label="Select Takeout Days"
                />
              </div>

              <hr></hr>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Form;
