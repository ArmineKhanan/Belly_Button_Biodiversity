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

    var wash = result.wfreq;
    console.log(wash);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: 'gauge+number',
      value: wash,
      gauge: {
        bar: { color: "#9c27b0", width: 5},
        bgcolor: "white",
        borderwidth: 0.5,
        axis: {range: [0,10]},
        steps: [
          {range: [0,2], color: "#c5cae9"},
          {range: [2,4], color: "#9fa8da"},
          {range: [4,6], color: "#7986cb"},
          {range: [6,8], color: "#5c6bc0"},
          {range: [8,10], color: "#3f51b5"}

        ]
      }
    }];
        
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {font: { size: 20,
        family: "Sans-Serif"},
      text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week'}
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);  

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesData = data.samples;
    //var metaData = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samplesData.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var results = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = results.otu_ids;
    var otuLabels = results.otu_labels;
    var sampleValues = results.sample_values;



    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).map(str => "OTU ".concat(String(str))).map(str =>String(str).concat("  "));

    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: "bar", 
      y: yticks,
      x: sampleValues.slice(0,10),
      marker: {
        color: "#3949ab"
      },
      opacity: 0.9,
      hovertext: otuLabels.slice(0,10),
      hoverinfo: 'hovertext',
      orientation: "h",
      transforms: [{
        type: 'sort',
        target: 'y',
        order: 'descending'
      }]
  }];
    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: {
              font: { 
                  size: 20,
                  family: "Sans-Serif"
                },
              text: "<b>Top 10 Bacterial Cultures Found</b>"},
      xaxis: {
        title: ""
      },
      yaxis: {
        title: ""
      },
      hovermode: 'closest',
      xaxis: {
        showgrid: false
      },
      yaxis: {
        showgrid: false
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      colorscale: 'YlGnBu',
      text: otuLabels,
      mode: 'markers',
      marker: {
        size:sampleValues.map(dt => dt * 0.5),
        color: otuIds,
        colorscale: 'YlGnBu'
      }
    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {font: { 
              size: 20,
              family: "Sans-Serif"
            },
              text: "<b>Bacteria Cultures Per Sample</b>"},
      hovermode: "closest",
      xaxis: {
        title: {font: { 
               family: "Sans-Serif"
            },
        text:"OTU ID"},
        showgrid: false
      },
      yaxis: {
        showgrid: false
      },
      modebar: {
        activecolor: "#e3f2fd"
      }
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 


  });
    
}
