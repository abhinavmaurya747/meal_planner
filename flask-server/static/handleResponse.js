// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault(); // Prevent the default form submission
  if (!validate_form()) return;

  //show loading button and disable submit button
  var loading = document.getElementById("loading");
  loading.style.display = "block";
  var submitBtn = document.getElementById("submit");
  submitBtn.disabled = true;
  var errorOccured = document.getElementById("errorOccured");
  errorOccured.style.display = "none";
  var schedule = document.getElementById("schedule-table");
  schedule.innerHTML = "";
  var scheduleContainer = document.getElementById("scheduleContainer");
  scheduleContainer.style.display = "none";
  var ingredientContainer = document.getElementById("ingredientContainer");
  ingredientContainer.innerHTML = "";

  // Get the form data
  const form = event.target;
  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData,
    timeout: 120000,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.text(); // Get the response as text
    })
    .then((responseData) => {
      // console.log(responseData); // Print the response data to the console

      // Convert the response data to JSON
      const data = JSON.parse(responseData);

      // Handle the JSON data as needed
      errorOccured.style.display = "none";
      format_and_display_data_on_UI(data);

      console.log("Response fetched!");
      loading.style.display = "none";
      submitBtn.disabled = false;
    })
    .catch((error) => {
      loading.style.display = "none";
      submitBtn.disabled = false;
      errorOccured.style.display = "block";
      console.error("Error:", error);
    });
}

// Add event listener to the form submit event
const form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

function format_and_display_data_on_UI(data) {
  const scheduleContainer = document.getElementById("scheduleContainer");
  scheduleContainer.style.display = "block";
  var scheduleData = data.meal_plan;
  var table = document.getElementById("schedule-table");
  table.classList.add("table", "table-bordered");

  var Leftover = data.Leftover;
  var Takeout = data.Takeout;
  var curr_row = 0;
  var curr_col = 0;

  var final_treat_items = data.final_treat_items;
  var treat_ind = 0;

  // Create the first row with meal categories
  var firstRow = document.createElement("tr");
  var emptyCell = document.createElement("th"); // Empty cell for the day column
  firstRow.appendChild(emptyCell);
  // var categories = data["Time of day for schedule"];
  var categories = [
    "Breakfast",
    "Morning Snacks",
    "Lunch",
    "Afternoon Snacks",
    "Dinner",
  ];
  for (var i = 0; i < categories.length; i++) {
    var categoryCell = document.createElement("th");
    categoryCell.textContent = categories[i];
    categoryCell.classList.add("px-3");
    firstRow.appendChild(categoryCell);
  }
  table.appendChild(firstRow);

  for (var day in scheduleData) {
    ++curr_row;
    curr_col = 0;
    if (scheduleData.hasOwnProperty(day)) {
      var meals = scheduleData[day];
      var row = document.createElement("tr");
      var dayCell = document.createElement("th");
      dayCell.setAttribute("scope", "row");
      dayCell.textContent = day;
      row.appendChild(dayCell);

      for (var meal in meals) {
        ++curr_col;
        var mealCell = document.createElement("td");
        mealCell.textContent = meals[meal];
        mealCell.classList.add("px-3");

        try {
          if (Leftover["" + curr_row].includes("" + curr_col)) {
            mealCell.textContent = "Leftover food";
          }
        } catch {}
        try {
          if (Takeout["" + curr_row].includes("" + curr_col)) {
            mealCell.textContent = "Takeout food";
          }
        } catch {}

        if (
          mealCell.textContent != "Takeout food" &&
          mealCell.textContent != "Leftover food" &&
          meal == "dinner" &&
          treat_ind < 3 &&
          // !(curr_row % 2) &&
          final_treat_items[treat_ind] != null &&
          final_treat_items[treat_ind] != ""
        ) {
          mealCell.textContent += " with " + final_treat_items[treat_ind];
          treat_ind += 1;
        }
        row.appendChild(mealCell);
      }
      table.appendChild(row);
    }
  }

  // Show the ingredients list
  var mealIngredients = data.ingredients_list;
  var container = document.getElementById("ingredientContainer");

  var card = document.createElement("div");
  card.classList.add("card");
  var cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  var cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = "Ingredients List";
  var ingredientText = document.createElement("p");

  var value = ``;
  for (var mealName in mealIngredients) {
    var ingredients = mealIngredients[mealName];
    value += `<div class="row">
        <div class="col">
          <strong>${mealName}</strong> : ${ingredients}
        </div>
      </div>`;
  }

  ingredientText.innerHTML = value;

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(ingredientText);
  card.appendChild(cardBody);
  container.appendChild(card);
}

function validate_form() {
  var tod = document.getElementById("to_include_foods");
  tod_names = ["breakfast", "snacks", "lunch", "dinner"];
  const containsTodName = tod_names.some((name) => tod.value.includes(name));
  var invalid_tod = document.getElementById("invalid_to_include_foods");
  if (tod.value == "" || !containsTodName) {
    invalid_tod.textContent =
      "Please provide a valid input.\nFor example: breakfast, lunch and dinnner for all days.";
    return false;
  } else {
    invalid_tod.textContent = "";
  }
  var prf_fd = document.getElementById("preffered_foods");
  // const split_pf_Items = prf_fd.value.split(`/[,\s]+/`);
  const split_len1 = prf_fd.value.split(",").length;
  const split_len2 = prf_fd.value.split(" ").length;
  const hasMoreThan5Items = split_len1 >= 5 || split_len2 >= 5;
  var invalid_pf = document.getElementById("invalid_preffered_foods");

  if (prf_fd.value == "" || !hasMoreThan5Items) {
    invalid_pf.textContent =
      "Please provide minimum 5-10 preffered foods for better results.";
    return false;
  } else {
    invalid_pf.textContent = "";
  }

  var avd_fd = document.getElementById("avoid_foods");
  avd_fd.style.display = "block";
  var allg_fd = document.getElementById("allergic_foods");
  allg_fd.style.display = "block";
  var left_day = document.getElementById("leftover_days");
  left_day.style.display = "block";
  var out_day = document.getElementById("takeout_days");

  return true;
}
