// Function to initialize the page
function init() {
  // Load the data from the JSON file
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    // Get the dropdown select element
    var dropdown = d3.select("#selDataset");

    // Populate the dropdown with the sample names
    data.names.forEach(function(sample) {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Initialize the page with the first sample
    var initialSample = data.names[0];
    updateCharts(initialSample);
  });
}

// Initialize the page
init();

// Function to update the charts
function updateCharts(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    // Find the selected sample data
    var selectedSample = data.samples.find(function(d) {
      return d.id === sample;
    });

    // Take the top 10 values, labels, and hovertext for the bar chart
    var top10Values = selectedSample.sample_values.slice(0, 10).reverse();
    var top10Labels = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var top10HoverText = selectedSample.otu_labels.slice(0, 10).reverse();

    // Create the horizontal bar chart
    var barChart = {
      x: top10Values,
      y: top10Labels,
      text: top10HoverText,
      type: "bar",
      orientation: "h"
    };

    var barData = [barChart];

    var barLayout = {
      title: "Top 10 OTUs Found",
      xaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Create the bubble chart
    var bubbleTrace = {
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      text: selectedSample.otu_labels,
      mode: "markers",
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: "Earth"
      }
    };

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      title: "OTU ID vs. Sample Values",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Display sample metadata
    var metadata = data.metadata.find(function(d) {
      return d.id === parseInt(sample);
    });

    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");

    // Display each key-value pair from the metadata
    Object.entries(metadata).forEach(function([key, value]) {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });

    // Get the washing frequency from metadata
    var washingFrequency = metadata.wfreq;

    // Update the gauge chart
    updateGaugeChart(washingFrequency);
  });
}

// Function to update the gauge chart
function updateGaugeChart(washingFrequency) {
  // Create the gauge chart
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washingFrequency,
      title: { text: "Weekly Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 9], tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
        steps: [
          { range: [0, 1], color: "lightgray" },
          { range: [1, 2], color: "yellowgreen" },
          { range: [2, 3], color: "green" },
          { range: [3, 4], color: "lightblue" },
          { range: [4, 5], color: "blue" },
          { range: [5, 6], color: "purple" },
          { range: [6, 7], color: "orange" },
          { range: [7, 8], color: "red" },
          { range: [8, 9], color: "maroon" },
        ],
      },
    },
  ];

  var layout = { width: 400, height: 300, margin: { t: 0, b: 0 } };

  Plotly.newPlot("gauge", data, layout);
}

// Function to handle dropdown change
function optionChanged(newSample) {
  updateCharts(newSample);
}
