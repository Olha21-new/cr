export function getLastTenResults() {
  const results = JSON.parse(localStorage.getItem("results")) || [];
  return results.slice(-10); // Retrieve the last 10 results
}

export function displayResultsList() {
  const results = getLastTenResults();
  const resultList = document.getElementById("resultsTable");
  resultList.innerHTML = "";

  results.forEach((result) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${result.startDate} - ${result.endDate}: ${result.result}`;
    resultList.appendChild(listItem);
  });
}
