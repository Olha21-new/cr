const API_KEY = "sozdxXW28T3mYARZUixN6B4ZlbnjQaXR";
const API_URL = "https://calendarific.com/api/v2";

async function getCountries() {
  try {
    const response = await fetch(`${API_URL}/countries?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const {
      response: { countries },
    } = await response.json();
    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}

async function getHolidays(country, year) {
  try {
    const response = await fetch(
      `${API_URL}/holidays?&api_key=${API_KEY}&country=${country}&year=${year}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const {
      response: { holidays },
    } = await response.json();
    return holidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return [];
  }
}

export { getCountries, getHolidays };
