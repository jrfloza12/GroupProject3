// Define variables for the airport data
var LAX_data;
var SFO_data;
var SAN_data;
var selectedAirport = "LAX";

function init() {
  // Load the airport data
  loadAirportData();
}

// Function to load the airport data
function loadAirportData() {
  // Make asynchronous requests to load the airport data
  d3.json("http://127.0.0.1:5000/LAX_data").then(function (data) {
    LAX_data = data;
    console.log(LAX_data);
    // Call the updateCharts function after loading the data
    updateCharts(selectedAirport);
  });

  d3.json("http://127.0.0.1:5000/SFO_data").then(function (data) {
    SFO_data = data;
    console.log(SFO_data);
    // Call the updateCharts function after loading the data
    updateCharts(selectedAirport);
  });

  d3.json("http://127.0.0.1:5000/SAN_data").then(function (data) {
    SAN_data = data;
    console.log(SAN_data);
    // Call the updateCharts function after loading the data
    updateCharts(selectedAirport);
  });
}

// Update the selected airport when the dropdown value changes
d3.select("#airport-select").on("change", function () {
  selectedAirport = d3.select(this).property("value");
  updateCharts(selectedAirport);
});

// Function to update both the bar chart and line chart based on the selected airport
function updateCharts(airport) {
  updateBarChart(airport);
  updateLineChart(airport);
}

// Call the updateCharts function to initialize the chart with the selected airport data
// updateCharts(selectedAirport);

// Function to update the bar chart with the delayed flights data by year
function updateBarChart(airport) {
  // Extract the delayed flights data by year for the selected airport
  var data = getDataByYear(getAirportData(airport));
  
  // Extract the delay rate data by year for the selected airport
  var delayRateData = getDelayRateByYear(getAirportData(airport));

  // Get the canvas element for the bar chart
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
      labels: data.map(function (d) {
        return d.year;
      }),
      datasets: [
        {
          label: "Delay Rate",
          data: delayRateData.map(function (d) {
            return d.delayRate;
          }),
          type: "line",
          borderColor: "red",
          borderWidth: 2,
          fill: false,
          yAxisID: "rate",
        },
        {
          label: "Delayed Flights",
          data: data.map(function (d) {
            return d.count;
          }),
          backgroundColor: "steelblue",
        },
      ],
    },
    options: {
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "white",
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            stepSize: 1,
            color: "white",
          },
        },
        rate: {
          position: "right",
          min: 0,
          max: 100,
          grid: {
            display: false,
          },
          ticks: {
            stepSize: 10,
            color: "red",
          },
          scaleLabel: {
            display: true,
            labelString: "Delay Rate (%)",
            color: "red",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
    },
  });
}

// Function to update the line chart with the average delay data by year
function updateLineChart(airport) {
  // Extract the average departure delay data by year for the selected airport
  var data = getAverageDelayByYear(getAirportData(airport));

  // Get the canvas element for the line chart
  var canvas = document.getElementById("line");

  // Check if a chart instance already exists on the canvas
  if (canvas.chart) {
    // Destroy the existing chart
    canvas.chart.destroy();
  }

  // Create the line chart using Chart.js
  var ctx = canvas.getContext("2d");
  canvas.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(function (d) {
        return d.year;
      }),
      datasets: [
        {
          label: "Average Departure Delay",
          data: data.map(function (d) {
            return d.averageDelay;
          }),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          pointBackgroundColor: "rgba(75, 192, 192, 1)",
          pointBorderColor: "#fff",
          pointRadius: 5,
          pointHoverRadius: 7,
          
        },
      ],
    },
    options: {
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'white', // Set x-axis tick color to white
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)', // Set y-axis grid color to white with opacity
          },
          ticks: {
            color: 'white', // Set y-axis tick color to white
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            // Add legend label style options
            color: 'white', // Set legend label font color to white
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
      if (d.DELAYED_STATUS === "1") {
        delayedData[year]++;
      }
    });
  }

  console.log("delayedData:", delayedData); // Log the intermediate result

  var result = Object.keys(delayedData).map(function (year) {
    return { year: year, count: delayedData[year] };
  });

  console.log("result:", result); // Log the final result

  return result;
}
  
function getAverageDelayByYear(data) {
  var averageDelayData = {};

  // Check if data is defined and is an array
  if (Array.isArray(data)) {
    data.forEach(function (d) {
      var year = getYearFromDateString(d.FL_DATE);
      if (!averageDelayData[year]) {
        averageDelayData[year] = { totalDelay: 0, count: 0 };
      }
      var depDelay = parseInt(d.DEP_DELAY);
      if (!isNaN(depDelay)) { // Check if depDelay is a valid number
        averageDelayData[year].totalDelay += Math.abs(depDelay);
        averageDelayData[year].count++;

        // Modify the DEP_DELAY value in the original array
        d.DEP_DELAY = depDelay;
      }
    });
  }

  console.log("averageDelayData:", averageDelayData); // Log the intermediate result

  var result = Object.keys(averageDelayData).map(function (year) {
    var averageDelay = averageDelayData[year].totalDelay / averageDelayData[year].count;
    return { year: year, averageDelay: averageDelay };
  });

  console.log("result:", result); // Log the final result

  return result;
}

function getDelayRateByYear(data) {
  var delayRateData = {};

  // Check if data is defined and is an array
  if (Array.isArray(data)) {
    data.forEach(function (d) {
      var year = getYearFromDateString(d.FL_DATE);
      if (!delayRateData[year]) {
        delayRateData[year] = { totalRecords: 0, totalDelays: 0 };
      }
      delayRateData[year].totalRecords++;
      if (d.DELAYED_STATUS === "1") {
        delayRateData[year].totalDelays++;
      }
    });
  }

  console.log("delayRateData:", delayRateData); // Log the intermediate result

  var result = Object.keys(delayRateData).map(function (year) {
    var delayRate = (delayRateData[year].totalDelays / delayRateData[year].totalRecords) * 100;
    return { year: year, delayRate: delayRate };
  });

  console.log("result:", result); // Log the final result

  return result;
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