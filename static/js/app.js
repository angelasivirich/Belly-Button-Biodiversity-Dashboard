function unpack(rows, index){
    return rows.map(row => row[index])
};


function options(){
    d3.json("samples.json").then(function(data){
        var sample_values = data.names;
        //var otu_ids = 
        //var otu_labels = 
        sample_values.forEach(element =>{
            var option = d3.select("#selDataset");
            option.append("option").attr("value", element).text(element);
        })
    });
};

function updatePlotly(){
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
                //console.log(values);

                //---------- Horizontal Bar Chart --------
                var topTenOtus = values.sort((a,b) => b.sample_values - a.sample_values).slice(0,10);
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
                    yaxis: {title:"OTU IDs"},
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
                      size: sampleValuesAll
                    }
                  }];
                var layout = {
                    title: 'Bubble Chart Hover Text',
                    showlegend: true,
                    xaxis: {
                        range: [outIdsAll[0], outIdsAll[-1]],
                    },
                    yaxis: {
                        range: [Math.min(...sampleValuesAll)-100, Math.max(...sampleValuesAll)*4],
                    },                      
                };
                Plotly.newPlot('bubble', data2, layout);  
            
                };
            });
        // ------- Demographics -------------    
        var individualDemographic = data.metadata;
        individualDemographic.forEach(function(element) {
            
            if(element.id == dataset){
                Object.entries(element).forEach(function([key, value]) {
                d3.select(".panel-body").append("p").text(`${key} ${value}`);
                });
            };
        });

    }); 
};   

options();
d3.selectAll("#selDataset").on("change", updatePlotly);

 