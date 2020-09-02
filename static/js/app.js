function init(){
    //add values to the dropdown menu
    d3.json("samples.json").then(function(data){
        var sample_values = data.names;
        sample_values.forEach(element =>{
            var option = d3.select("#selDataset");
            option.append("option").attr("value", element).text(element);
        })

        var defaultID = "940";
        var samplesArray = data.samples;
        var values = [];
        samplesArray.forEach(function(element) {
            
            if(element.id == defaultID){
                var values = [];
                for(var i = 0; i < element.otu_ids.length; i++){
                    values.push({otuIds:element.otu_ids[i], sampleValues:element.sample_values[i], otuLabels:element.otu_labels[i]})
                }
                //---------- Horizontal Bar Chart --------
                var topTenOtus = values.sort((a,b) => b.sample_values - a.sample_values).slice(0,10).reverse();
                var data1 = [{
                    type: "bar",
                    x: topTenOtus.map(element => element.sampleValues),
                    y: topTenOtus.map(element => `OTU ${element.otuIds}`),
                    hovertext:topTenOtus.map(element=>element.otuLabels),
                    orientation: "h"
                }];
                var layout = {
                    title: `Top Ten OUTs Found In Individual ID# ${element.id}`,
                    xaxis: {title:"Count"},
                    yaxis: {title:"OTU ID"},
                } 
                Plotly.newPlot('bar', data1, layout);

                //----- Bubble Chart-----------

                var sortedOtus = values.sort((a,b) => a.otu_ids - b.otu_ids);
                var outIdsAll = sortedOtus.map(element => element.otuIds);
                var sampleValuesAll = sortedOtus.map(element => element.sampleValues);
                var otuLabelsAll = sortedOtus.map(element => element.otuLabels);    

                var data2 = [{
                    x: outIdsAll,
                    y: sampleValuesAll,
                    text: otuLabelsAll,
                    mode: 'markers',
                    marker: {
                    color: outIdsAll,
                    size: sampleValuesAll,
                    }
                }];
                var layout = {

                    title: `OUTs Found In Individual ID# ${element.id}`,
                    showlegend: false,
                    autosize: true,
                    automargin:true, 
                    xaxis: {title:"OTU ID"},
                    yaxis: {title:"Count"},                   
                };
                Plotly.newPlot('bubble', data2, layout);  
            }
        });
        // ------- Demographics -------------    

        var individualDemographic = data.metadata;
        individualDemographic.forEach(function(element) {
            if(element.id == defaultID){
                //d3.select(".panel-body").html(" ");
                Object.entries(element).forEach(function([key, value]) {
                d3.select(".panel-body").append("p").text(`${key} ${value}`);
                });
            };
        });

    });     
}

d3.select("#selDataset").on("change", updatePlotly);

function updatePlotly(){
    // Get the selected value
    var dropdownMenu = d3.select("#selDataset");
    var dataset = dropdownMenu.node().value;

    d3.json("samples.json").then(function(data){

        var samplesArray = data.samples;
        samplesArray.forEach(function(element) {
            
            if(element.id == dataset){
                var values = [];
                for(var i = 0; i < element.otu_ids.length; i++){
                    values.push({otuIds:element.otu_ids[i], sampleValues:element.sample_values[i], otuLabels:element.otu_labels[i]})
                }

                //---------- Horizontal Bar Chart --------
                var topTenOtus = values.sort((a,b) => b.sample_values - a.sample_values).slice(0,10).reverse();
                var data1 = [{
                    type: "bar",
                    x: topTenOtus.map(element => element.sampleValues),
                    y: topTenOtus.map(element => `OTU ${element.otuIds}`),
                    hovertext:topTenOtus.map(element=>element.otuLabels),
                    orientation: "h"
                  }];
                var layout = {
                    title: `Top Ten OUTs Found In Individual ID# ${element.id}`,
                    xaxis: {title:"Count"},
                    yaxis: {title:"OTU ID"},
                } 
                Plotly.newPlot('bar', data1, layout);

                //----- Bubble Chart-----------

                var sortedOtus = values.sort((a,b) => a.otu_ids - b.otu_ids);
                var outIdsAll = sortedOtus.map(element => element.otuIds);
                var sampleValuesAll = sortedOtus.map(element => element.sampleValues);
                var otuLabelsAll = sortedOtus.map(element => element.otuLabels);
                
                var maxY = Math.max(...sampleValuesAll)*10;
                var minY = Math.min(...sampleValuesAll)-100;

                var data2 = [{
                    x: outIdsAll,
                    y: sampleValuesAll,
                    text: otuLabelsAll,
                    mode: 'markers',
                    marker: {
                      color: outIdsAll,
                      size: sampleValuesAll,
                    }
                  }];
                var layout = {
    
                    title: `OUTs Found In Individual ID# ${element.id}`,
                    showlegend: false,
                    autosize: true,
                    automargin:true,  
                    xaxis: {title:"OTU ID"},
                    yaxis: {title:"Count"},                    
                };
                Plotly.newPlot('bubble', data2, layout);  
            
            };
        });




        // 
        var individualDemographic = data.metadata;
        individualDemographic.forEach(function(element) {
    
        if(element.id == dataset){
            d3.select(".panel-body").html(" ");                      //clears previous data displayed
            Object.entries(element).forEach(function([key, value]) {
            d3.select(".panel-body").append("p").text(`${key} ${value}`);
            });
        };
        });

    });
  
};

init();
