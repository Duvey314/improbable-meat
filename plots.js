function init() {
  var selector = d3.select("#selDataset");
  
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // initialize the page with the first subjects data
    buildMetadata(sampleNames[0]);
    
    
    // isolate the sample data object
    let sampleData = data.samples;
    // select the data corresponding to ID 904
    let subjectData = sampleData.filter (sampleObj => sampleObj.id == sampleNames[0]);
    // get the array element so it's not an array of one
    let subject = subjectData[0];
    
    // format the data
    let subjectTransposed = transposeArray(subject);
    let topTen = subjectTransposed.slice(0,10).reverse();
    
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sampleNames[0]);
    let result = resultArray[0];
    let washFreq = result.wfreq;
    
    let washArray = metadata.map(freq => freq.wfreq);
    const washAverage = washArray.reduce((a, b) => a + b) / washArray.length;

    createGraphs(topTen,subject,washFreq,washAverage);
  })
}

function createGraphs(barData,scatterData,gaugeData,gaugeAvg){
  //----------------------------------------
  // Build Bar Chart
  //----------------------------------------
  let bData = transposeArray(barData);
  let otcData = bData[0].map(i => 'OTC ' + i)
  console.log(bData)
  let trace = {
    x: bData[1],
    y: otcData,
    type: "bar",
    orientation: 'h'
  }
  let data = [trace]

  let layout = {
    title: "Belly Button Sample",
    xaxis: {title: "Number of Samples",
            type: 'category'},

    yaxis: {title: "OTC", 
            type: 'category'}
  };

  Plotly.newPlot("bar",data,layout);

  //----------------------------------------
  // Build Bubble Chart
  //----------------------------------------
  let sample_values = scatterData.sample_values;
  let otu_ids = scatterData.otu_ids;
  let otu_labels = scatterData.otu_labels;
  
  let trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: 'Portland'
    }

  };
  
  let data1 = [trace1];
  
  let layout1 = {
    title: 'Bacteria in Belly Button'
  };
  
  Plotly.newPlot('bubble', data1, layout1);

  //----------------------------------------
  // Build Gauge Chart
  //----------------------------------------
  var data2 = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: gaugeData,
      delta: { reference: gaugeAvg, relative: true},
      title: { text: "Washes Per Week <br> compared to the average" },
      type: "indicator",
      mode: "number+delta"
    }
  ];
  
  var layout2 = { width: 600, 
                height: 500, 
                margin: { t: 0, b: 0 },
                paper_bgcolor: '#f5f5dc',
                plot_bgcolor: '#f5f5dc'
              };

  Plotly.newPlot('gauge', data2, layout2);
}

function transposeArray(subject){
  let output = [];
  let subjectArray = Object.keys(subject).map(i => subject[i]);
  for (let j=0; j <= subjectArray[1].length; j++){
    var sample = [];
    for (let k=1; k < subjectArray.length; k++){
      sample.push(subjectArray[k][j]);
    }
  output.push(sample)
  }

  return output.sort(function(a, b){return b[1] - a[1]});
}


function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      let metadata = data.metadata;
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
      let PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text('ID: ' + result.id);
      PANEL.append("h6").text('ETHNICITY: ' + result.ethnicity)
      PANEL.append("h6").text('GENDER: ' + result.gender);
      PANEL.append("h6").text('AGE: ' + result.age);
      PANEL.append("h6").text('LOCATION: ' + result.location);
      PANEL.append("h6").text('BBTYPE: ' + result.bbtype);
      PANEL.append("h6").text('WFREQ: ' + result.wfreq);
    });
  }
  
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    // isolate the sample data object
    let sampleData = data.samples;
    // select the data corresponding to ID 904
    let subjectData = sampleData.filter(sampleObj => sampleObj.id == sample);
    // get the array element so it's not an array of one
    let subject = subjectData[0];
    // format the data
    let subjectTransposed = transposeArray(subject);
    let topTen = subjectTransposed.slice(0,10).reverse();
    let bData = transposeArray(topTen);
    let otcData = bData[0].map(i => 'OTC ' + i);

    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    let washFreq = result.wfreq;
    
    let trace = {
      x: [bData[1]],
      y: [otcData]
    };

    Plotly.restyle("bar", trace);
    
    let sample_values = subject.sample_values;
    let otu_ids = subject.otu_ids;
    let otu_labels = subject.otu_labels;
  
    let trace1 = {
      x: [otu_ids],
      y: [sample_values],
      text: [otu_labels]
    }
    Plotly.restyle("bubble", trace1);
    

    let trace2 = {
      value: [washFreq]
    }

    Plotly.restyle("gauge", trace2);
  });
}

init();