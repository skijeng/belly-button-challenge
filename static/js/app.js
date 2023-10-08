// Get the json
const samples = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
// Fetch the JSON data and log it
d3.json(samples).then(function(data) {
  console.log(data);
});
// Function to update the charts based on the selected individual
function Chart(selectedIndividual) {
  // Fetch the data from the JSON file
  d3.json("samples.json").then(function(data) {
    // Filter data for the selected individual
    const individualData = data.samples.find(sample => sample.id === selectedIndividual);
    // get the top 10 OTUs by sample_values
    const sortedData = individualData.sample_values.slice(0, 10).reverse();
    const otuLabels = individualData.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    const hoverText = individualData.otu_labels.slice(0, 10);
    // Create the horizontal bar chart
    var bar1 = {
      x: sortedData,
      y: otuLabels,
      text: hoverText,
      type: "bar",
      orientation: "h"
    };
    var layout = {
      title: `Top 10 by Individual ${selectedIndividual}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "ID" }
    };
    Plotly.newPlot("bar", [bar1], layout);

    // Call the function to display demographic info
    displayDemographicInfo(selectedIndividual, data.metadata);
    // Call the function to create the bubble chart
    createBubbleChart(selectedIndividual, data.samples);
    // Call the function to create the gauge chart
    createGaugeChart(selectedIndividual, data.metadata);
  });
}
// Function to create the bubble chart
function createBubbleChart(selectedIndividual, samplesData) {
  const individualData = samplesData.find(sample => sample.id === selectedIndividual);

  // Define trace for the bubble chart
  var trace1 = {
    x: individualData.otu_ids,
    y: individualData.sample_values,
    text: individualData.otu_labels,
    mode: "markers",
    marker: {
      size: individualData.sample_values,
      color: individualData.otu_ids,
      colorscale: "Earth"
    }
  };
  var data2 = [trace1];
  var layout2 = {
    title: `Bubble Chart for Individual ${selectedIndividual}`,
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" }
  };

  // Create the bubble chart
  Plotly.newPlot("bubble", data2, layout2);
}

// Function to create the gauge chart
function createGaugeChart(selectedIndividual, metadata) {
  const individualMetadata = metadata.find(item => item.id === parseInt(selectedIndividual));

  // Define the data for the gauge chart
  const data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: individualMetadata.wfreq,
      title: `Belly Button Washing Frequency<br>Scrubs per Week by Individual ${selectedIndividual}`,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 9] },
        steps: [
          { range: [0, 1], color: "gray" },
          { range: [1, 2], color: "green" },
          { range: [2, 3], color: "yellow" },
          { range: [3, 4], color: "orange" },
          { range: [4, 5], color: "red" },
          { range: [5, 6], color: "purple" },
          { range: [6, 7], color: "blue" },
          { range: [7, 8], color: "darkblue" },
          { range: [8, 9], color: "darkred" }
        ],
      },
    },
  ];

  // Define the layout for the gauge chart
  const layout = { width: 400, height: 300, margin: { t: 0, b: 0 } };

  // Plot the gauge chart
  Plotly.newPlot("gauge", data, layout);
}

// Define a function to populate the dropdown menu
function Dropdown() {
  d3.json("samples.json").then(function(data) {
    const dropdown = d3.select("#selDataset");
    const metadata = data.metadata;
    const names = data.names;
    names.forEach(name => {
      dropdown.append("option").attr("value", name).text(name);
    });
    const initialIndividual = names[0];
    updateCharts(initialIndividual);
  });
}
// Define a function to handle dropdown change
function optionChanged(selectedIndividual) {
  // Update the charts when a new individual is selected
  updateCharts(selectedIndividual);
}
// Call the dropdown function and initialize the charts
Dropdown();
// Function to display demographic info
function displayDemographicInfo(selectedIndividual, metadata) {
  // Select the HTML element where you want to display the info
  const demographicInfo = d3.select("#sample-metadata");
  // Filter metadata for the selected individual
  const individualMetadata = metadata.find(item => item.id === parseInt(selectedIndividual));
  // Clear any existing data
  demographicInfo.html("");
  // Iterate through the metadata and append key-value pairs
  Object.entries(individualMetadata).forEach(([key, value]) => {
    demographicInfo.append("p").text(`${key}: ${value}`);
  });
}
