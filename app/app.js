var LAX_data;
var SFO_data;
var SAN_data;
var selectedAirport = "LAX";

function init() {
    d3.json("http://127.0.0.1:5000/LAX_data").then(function (data) {
      LAX_data = data;
      console.log(LAX_data);
      // Further code using the LAX data can be placed here
    });
  
    d3.json("http://127.0.0.1:5000/SFO_data").then(function (data) {
      SFO_data = data;
      console.log(SFO_data);
      // Further code using the SFO data can be placed here
    });
  
    d3.json("http://127.0.0.1:5000/SAN_data").then(function (data) {
      SAN_data = data;
      console.log(SAN_data);
      // Further code using the SAN data can be placed here
    });
  }

// Initialize the selected airport
var selectedAirport = "LAX";

// Update the selected airport when the dropdown value changes
d3.select("#airport-select").on("change", function () {
    selectedAirport = d3.select(this).property("value");
    updateData(selectedAirport);
  });

// Call the updateData function to initialize the chart with the selected airport data
updateData(selectedAirport);

// Function to update the chart with the selected airport data
function updateData(airport) {
    // Extract the delayed flights data by year for the selected airport
    var data = getDataByYear(getAirportData(airport));
  
    // Get the canvas element for the chart
    var canvas = document.getElementById("bar");
  
    // Check if a chart instance already exists on the canvas
    if (canvas.chart) {
      // Destroy the existing chart
      canvas.chart.destroy();
    }
  
    // Create the bar chart using Chart.js
    var ctx = canvas.getContext("2d");
    canvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map(function (d) { return d.year; }),
        datasets: [{
          label: "Delayed Flights",
          data: data.map(function (d) { return d.count; }),
          backgroundColor: "steelblue",
        }]
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }
  

// Function to extract the delayed flights data by year
function getDataByYear(data) {
    var delayedData = {};
  
    // Check if data is defined and is an array
    if (Array.isArray(data)) {
      data.forEach(function (d) {
        var year = getYearFromDateString(d.FL_DATE);
        if (!delayedData[year]) {
          delayedData[year] = 0;
        }
        delayedData[year]++;
      });
    }
  
    return Object.keys(delayedData).map(function (year) {
      return { year: year, count: delayedData[year] };
    });
  }
  

// Function to get the data for the selected airport
function getAirportData(airport) {
  switch (airport) {
    case "LAX":
      return LAX_data;
    case "SFO":
      return SFO_data;
    case "SAN":
      return SAN_data;
    default:
      return [];
  }
}

// Function to extract the year from a date string
function getYearFromDateString(dateString) {
  var date = new Date(dateString);
  return date.getFullYear().toString();
}



init();