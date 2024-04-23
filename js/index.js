"use strict";

import { initializeTabs } from "./tabs.js";
initializeTabs();

// DOM variables tab 1
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const presetButtons = document.querySelectorAll(".time-span .button");
const countButton = document.querySelector(".count__button");
const resultsList = document.querySelector(".result-history");
const daySelect = document.getElementById("selectDays");
const timeUnitSelect = document.getElementById("selectUnits");

import { displayResultsList } from "./resultsModule.js";
displayResultsList();

// Event functions tab 1
startDateInput.addEventListener("input", () => {
  const startDateValue = new Date(startDateInput.value);
  const endDateValue = new Date(endDateInput.value);

  endDateInput.min = startDateInput.value;

  if (startDateValue > endDateValue) {
    startDateInput.value = endDateInput.value;
  }

  endDateInput.removeAttribute("disabled");
});

endDateInput.addEventListener("input", () => {
  const startDateValue = new Date(startDateInput.value);
  const endDateValue = new Date(endDateInput.value);

  startDateInput.max = endDateInput.value;

  if (endDateValue < startDateValue) {
    endDateInput.value = startDateInput.value;
  }
});

presetButtons.forEach((button) => {
  button.addEventListener("click", handlePresetButtonClick);
});

function handlePresetButtonClick(event) {
  const preset = event.target.getAttribute("data-preset");
  console.log("Preset:", preset);

  const startDate = new Date(startDateInput.value);

  switch (preset) {
    case "week":
      endDateInput.value = addWeek(startDate);
      break;
    case "month":
      endDateInput.value = addMonth(startDate);
      break;
    default:
      break;
  }
}

function addWeek(newStartDate) {
  const endDate = new Date(newStartDate);
  endDate.setDate(endDate.getDate() + 7);
  return endDate.toISOString().split("T")[0];
}

function addMonth(newStartDate) {
  const endDate = new Date(newStartDate);
  endDate.setMonth(endDate.getMonth() + 1);
  return endDate.toISOString().split("T")[0];
}

daySelect.addEventListener("change", () => {
  console.log(daySelect.value);
});

timeUnitSelect.addEventListener("change", () => {
  console.log(timeUnitSelect.value);
});

// Calculations
function calculateTimeInterval() {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  // Weekdays and Weekends
  const dayOption = daySelect.value;
  let timeDifference;
  switch (dayOption) {
    case "all":
      timeDifference = endDate - startDate;
      break;
    case "weekdays":
      timeDifference =
        countWeekdays(startDate, endDate, "weekdays") * (1000 * 60 * 60 * 24);
      break;
    case "weekends":
      timeDifference =
        countWeekends(startDate, endDate, "weekends") * (1000 * 60 * 60 * 24);
      break;
    default:
      timeDifference = endDate - startDate;
  }

  // TimeUnits Converting
  const timeUnit = timeUnitSelect.value;
  let result;
  switch (timeUnit) {
    case "milliseconds":
      result = timeDifference;
      break;
    case "seconds":
      result = timeDifference / 1000;
      break;
    case "minutes":
      result = timeDifference / (1000 * 60);
      break;
    case "hours":
      result = timeDifference / (1000 * 60 * 60);
      break;
    case "days":
      result = timeDifference / (1000 * 60 * 60 * 24);
      break;
    default:
      result = "Invalid time unit";
  }

  function isWeekend(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  function countWeekends(startDate, endDate) {
    let currentDate = new Date(startDate);
    let finishDate = new Date(endDate);
    let count = 0;

    while (currentDate < finishDate) {
      if (isWeekend(currentDate)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  }

  function countWeekdays(startDate, endDate) {
    let currentDate = new Date(startDate);
    let finishDate = new Date(endDate);
    let count = 0;

    while (currentDate < finishDate) {
      if (!isWeekend(currentDate)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  }

  const positiveResult = Math.abs(result);

  const li = document.createElement("li");
  li.textContent = `${startDateInput.value} - ${endDateInput.value}: ${positiveResult} ${timeUnit}`;
  resultsList.append(li);

  const resultObject = {
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    result: `${positiveResult} ${timeUnit}`,
  };

  storeResult(resultObject);
}

countButton.addEventListener("click", calculateTimeInterval);

function storeResult(resultObject) {
  let results = JSON.parse(localStorage.getItem("results")) || [];
  results.push(resultObject);
  localStorage.setItem("results", JSON.stringify(results));
}

// Tab 2
import { getCountries, getHolidays } from "./apiModule.js";

const displayError = (errorMessage) => {
  const errorBlock = document.createElement("div");
  errorBlock.classList.add("error-block");
  errorBlock.textContent = errorMessage;

  const errorContainer = document.getElementById("errorContainer");
  errorContainer.appendChild(errorBlock);
};

const displayHolidaysList = (holidays, sortOrder = "asc") => {
  const resultList = document.querySelector(".result-history--holidays");
  resultList.innerHTML = "";

  // Sort holidays based on date
  if (sortOrder === "asc") {
    holidays.sort((a, b) => new Date(a.date.iso) - new Date(b.date.iso));
  } else {
    holidays.sort((a, b) => new Date(b.date.iso) - new Date(a.date.iso));
  }

  if (holidays && holidays.length > 0) {
    holidays.forEach((holiday) => {
      const listItem = document.createElement("li");
      listItem.classList.add("result-history--holidays-list");

      const dateSpan = document.createElement("span");
      dateSpan.textContent = holiday.date.iso;
      listItem.appendChild(dateSpan);

      const nameSpan = document.createElement("span");
      nameSpan.textContent = holiday.name;
      listItem.appendChild(nameSpan);

      resultList.appendChild(listItem);
    });
  } else {
    const noResultsMessage = document.createElement("li");
    noResultsMessage.textContent =
      "No holidays found for the selected country and year.";
    resultList.appendChild(noResultsMessage);
    console.error("No holidays found for the selected country and year.");
  }
};

const populateCountries = async () => {
  const selectCountry = document.getElementById("selectCountry");
  try {
    const countries = await getCountries();
    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country["iso-3166"];
      option.text = country.country_name;
      selectCountry.appendChild(option);
    });
    populateYears();
  } catch (error) {
    console.error("Error fetching countries:", error);
    displayError("Error fetching countries. Please try again later.");
  }
};

const populateYears = () => {
  const selectYear = document.getElementById("selectYear");
  const currentYear = new Date().getFullYear();
  for (let year = 2001; year <= 2049; year++) {
    const option = document.createElement("option");
    option.text = year;
    option.value = year;
    selectYear.add(option);
  }
  selectYear.value = currentYear;
  selectYear.disabled = true;
};

populateCountries();

document
  .getElementById("selectCountry")
  .addEventListener("change", function () {
    const selectYear = document.getElementById("selectYear");
    selectYear.disabled = false;
  });

document
  .querySelector(".holidays__button")
  .addEventListener("click", async () => {
    const selectCountry = document.getElementById("selectCountry");
    const selectYear = document.getElementById("selectYear");
    const country = selectCountry.value;
    const year = selectYear.value;

    if (country && year) {
      try {
        const holidays = await getHolidays(country, year);
        displayHolidaysList(holidays);
      } catch (error) {
        console.error("Error fetching holidays:", error);
        displayError("Error fetching holidays. Please try again later.");
      }
    } else {
      console.error("Please select both country and year");
      displayError("Please select both country and year.");
    }
  });

let sortOrder = "asc";

document
  .getElementById("sortByDateButton")
  .addEventListener("click", async () => {
    const selectCountry = document.getElementById("selectCountry");
    const selectYear = document.getElementById("selectYear");
    const country = selectCountry.value;
    const year = selectYear.value;

    if (country && year) {
      try {
        const holidays = await getHolidays(country, year);

        // Toggle sort order
        sortOrder = sortOrder === "asc" ? "desc" : "asc";

        // Sort holidays based on the current sort order
        displayHolidaysList(holidays, sortOrder);
      } catch (error) {
        console.error("Error fetching holidays:", error);
        displayError("Error fetching holidays. Please try again later.");
      }
    } else {
      console.error("Please select both country and year");
      displayError("Please select both country and year.");
    }
  });
