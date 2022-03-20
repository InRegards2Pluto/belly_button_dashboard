function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleResult = samples.filter(sampleObj => sampleObj.id == sample);
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleResult[0];    
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    var washFreq = result.wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = sampleValues.sort((a, b) => a - b).reverse().slice(0,10);

    // 8. Create the trace for the bar chart. 
    var barData = {
      y: otuIDs.map(row => row),
      x: yticks.map(row => row),
      text: otuLabels.map(row => row),
      marker: {
        color: "mediumorchid"
      },
      type: "bar",
      orientation: "h"       
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacterial Cultures Found</b>",
      yaxis: {
        type: "category",
        categoryorder: "total ascending",
        title: "OTU ID"
      },
      xaxis: {
        title: "OTU Count"
      }    
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otuIDs.map(row => row),
      y: sampleValues.map(row => row),
      text: otuLabels.map(row => row),
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: "Rainbow"
      }      
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      yaxis: {
        title: "OTU Count"
      },
      xaxis: {
        title: "OTU ID"
      }    
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);

    // 4. Create the trace for the gauge chart.
    var gaugeData = {
      domain: {
        x: [0, 1],
        y: [0, 1]
      },
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [null, 10],
          dtick: 2 
        },
        bar: {color: "black"},
        steps: [
          {range: [0,  2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "yellowgreen"},
          {range: [8, 10], color: "green"}
        ]
      }
    };
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
}