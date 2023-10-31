// Add an event listener to the filter input
const filterInput = document.getElementById("filterCountry");

const filterCapitalInput = document.getElementById("filterCapital");
filterCapitalInput.addEventListener("input", filterTable);

const filterRegionInput = document.getElementById("filterRegion");
filterRegionInput.addEventListener("input", filterTable);

const filterSubregionInput = document.getElementById("filterSubregion");
filterSubregionInput.addEventListener("input", filterTable);

async function fetchData() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation", error);
  }
}

// Function to create the table dynamically with a class name
async function createTableWithData() {
  const container = document.getElementById("table-container");
  const table = document.createElement("table");

  // Fetch data asynchronously
  const data = await fetchData();

  // Create table headers
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = [
    "Country",
    "Capital",
    "Region",
    "Subregion",
    "Latitude",
    "Longitude",
  ];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  data.forEach((item, index) => {
    const row = document.createElement("tr");

    // Array of property keys to display in the table
    const propertiesToDisplay = [
      "name.common",
      "capital",
      "region",
      "subregion",
      "latlng.0",
      "latlng.1",
    ];

    propertiesToDisplay.forEach((propertyKey) => {
      const cell = document.createElement("td");

      // Use a helper function to navigate the nested object properties
      let cellValue = getObjectPropertyValue(item, propertyKey);

      // Format latitude and longitude values with 2 decimal places
      if (propertyKey === "latlng.0" || propertyKey === "latlng.1") {
        cellValue = parseFloat(cellValue).toFixed(2);
      }

      cell.textContent = cellValue;
      row.appendChild(cell);
    });

    // Add the row to the table
    table.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// Helper function to access nested properties in the object
function getObjectPropertyValue(obj, prop) {
  const props = prop.split(".");
  return props.reduce((o, p) => o && o[p], obj);
}

// Function to filter the table based on user input
function filterTable() {
  const filterValue = filterInput.value.toLowerCase();
  const filterCapital = filterCapitalInput.value.toLowerCase();
  const filterRegion = filterRegionInput.value.toLowerCase();
  const filterSubregion = filterSubregionInput.value.toLowerCase();
  const rows = document.querySelectorAll("table tr");

  console.log(rows, "row");
  rows.forEach((row) => {
    const countryNameCell = row.querySelector("td:nth-child(1) ");
    const capitalCell = row.querySelector("td:nth-child(2)");
    const regionCell = row.querySelector("td:nth-child(3)");
    const subregionCell = row.querySelector("td:nth-child(4)");

    if (countryNameCell) {
      const countryName = countryNameCell.textContent.toLowerCase();
      const capitalName = capitalCell.textContent.toLowerCase();
      const regionName = regionCell.textContent.toLowerCase();
      const subregionName = subregionCell.textContent.toLowerCase();

      // Hide or show rows based on the filter value
      if (
        countryName.includes(filterValue) &&
        capitalName.includes(filterCapital) &&
        regionName.includes(filterRegion) &&
        subregionName.includes(filterSubregion)
      ) {
        row.style.display = ""; // Show the row
      } else {
        row.style.display = "none"; // Hide the row
      }
    }
  });
}

filterInput.addEventListener("input", filterTable);

// Call the createTableWithData function to fetch data and generate the table
createTableWithData().then(() => {
  // Call the filterTable function initially to show all rows
  filterTable();
});
