//read json file using D3.  *relative path is based on the html file location
d3.json("./data/samples.json").then((data) => {
    var testIDs = data.names;
    console.log(testIDs);

    //append testIDs to the dropdown menu
    var selected = d3.selectAll("#selDataset");
    Object.entries(testIDs).forEach(([key, value]) => {
        selected.append("option").text(value);
    })

});

// create a function that plots bar chart/bubble chart and update metadata of test ID's

function plottingAll (testID) {
    d3.json("./data/samples.json").then((data) => {
        var samples = data.samples;
        //console.log(samples);

        //to find the index of selected testID
        var indexTestId = samples.map(row => row.id).indexOf(testID);
        console.log(indexTestId);

        var otuIDs = samples.map(row => row.otu_ids)[indexTestId];  
        var sampleValues = samples.map(row => row.sample_values)[indexTestId];
        var otuLabels = samples.map(row => row.otu_labels)[indexTestId];
        console.log(otuIDs.length); 

        var top10valueOfsample = sampleValues.slice(0,10);
        console.log(top10valueOfsample);
        var top10otuidOfsample = otuIDs.slice(0,10);
        console.log(top10otuidOfsample); 
        var top10LabelsOfsample = otuLabels.slice(0,10);
        console.log(top10LabelsOfsample);


        //horizontal bar chart for a selection from the dropdown menu : "sample_values" as the values
        //"otu_ids" as the labels, "otu_labels" as the hovertext for the chart.
        var trace = {
            x:top10valueOfsample,
            y:top10otuidOfsample.map(row=>`OTU ${row}`), //backtick ``  used to concatenate text and value//
            type: 'bar',
            orientation: 'h',
            text: top10LabelsOfsample    
        }

        Plotly.newPlot('bar', [trace]);

        //plotting bubble chart

        var trace1 = {
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                color: ["darkblue","blue","royalblue","lightblue", "darkgreen", "green", "lightgreen", "yellow"],
                //colorscale:[[0, 'red'], [1, 'blue']],
                size: sampleValues.map(x=>x*20),
                sizemode: 'area'
            }
        }
        var data1=[trace1];
        
        var layout={
            xaxis:{
                autochange: true,
                height: 700,
                width: 1000,
                title: {
                    text: 'OTU ID'
                }
            },
        };
        Plotly.newPlot('bubble',data1,layout);   


        //updating meta data box
        //get the metadata
        var metaData = data.metadata; 

        var sampleMetaData = d3.select("#sample-metadata");
        //clear existing data
        sampleMetaData.html("");

        Object.entries(metaData[indexTestId]).forEach(([key, value])=>{
            sampleMetaData.append('p').text(`${key.toUpperCase()}: ${value}`);
        })    
    })
}

//Execute a JavaScript when a user changes the selected option of a <select> element:"onchange" event
function optionChanged(selection) {
    // Select the input value from the form
    plottingAll(selection);
}      


