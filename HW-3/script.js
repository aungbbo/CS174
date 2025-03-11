// Function to fetch and display trucking companies
function loadTruckingCompanies() {
  const jsonUrl = document.getElementById("jsonUrl").value;
  const errorMessage = document.getElementById("errorMessage");

  // Clear any previous error message
  errorMessage.innerHTML = "";

  if (!jsonUrl) {
    errorMessage.innerHTML = "Please enter a valid JSON file URL.";
    return;
  }

  // Fetch the JSON file from the server
  fetch(jsonUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the JSON file
    })
    .then((data) => {
      // Check if the JSON contains trucking companies
      if (
        data.Mainline &&
        data.Mainline.Table &&
        data.Mainline.Table.Row &&
        data.Mainline.Table.Row.length > 0
      ) {
        displayTruckingCompanies(data);
      } else {
        throw new Error("No trucking companies found in the JSON file");
      }
    })
    .catch((error) => {
      errorMessage.innerHTML = `Error: ${error.message}`;
    });
}

// Function to display trucking companies in a new pop-up window
function displayTruckingCompanies(data) {
  // Create a new window for displaying the table
  const tableWindow = window.open(
    "",
    "",
    "width=800,height=600,scrollbars=yes"
  );
  let tableHTML = '<table border="1"><tr>';

  // Create table headers dynamically from the "Header" data
  const headers = data.Mainline.Table.Header.Data;
  headers.forEach((header) => {
    tableHTML += `<th>${header}</th>`;
  });
  tableHTML += "</tr>";

  // Loop through each trucking company and add rows to the table
  data.Mainline.Table.Row.forEach((company) => {
    tableHTML += "<tr>";
    tableHTML += `<td>${company.Company || ""}</td>`;
    tableHTML += `<td>${company.Services || ""}</td>`;
    tableHTML += "<td><ul>";
    company.Hubs.Hub.forEach((hub, index) => {
      if (index === 0) {
        tableHTML += `<li><b>${hub}</b></li>`;
      } else {
        tableHTML += `<li>${hub}</li>`;
      }
    });
    tableHTML += "</ul></td>";
    tableHTML += `<td>${company.Revenue || ""}</td>`;
    tableHTML += `<td><a href="${company.HomePage}" target="_blank">${company.HomePage}</a></td>`;
    tableHTML += `<td style="width: 250px; text-align: center;"><img src="files/${company.Logo}" alt="${company.Company}" style="max-width: 100px; max-height: 100px; display: block; margin: 0 auto;"></td>`;

    tableHTML += "</tr>";
  });

  tableHTML += "</table>";
  tableWindow.document.write(tableHTML); // Write the HTML table to the pop-up window
}
