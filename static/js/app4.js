
var rawDataURL = '/data1';
var xField = 'Years';
var yField = 'Coal_prod';
// var x2Field = 'Years';
var y2Field = 'Gas_prod';
// var x3Field = 'Years';
var y3Field = 'Oil_prod';
// var x4Field = 'Years';
var y4Field = 'Renewable_en_prod';

var selectorOptions = {
    buttons: [{
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: 'Yearly'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 5,
        label: 'Five years'
    }, {
        step: 'year',
        stepmode: 'todate',
        count: 10,
        label: 'Ten Years'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 20,
        label: 'Twenty years'
    }, {
        step: 'all',
    }],
};

Plotly.d3.csv(rawDataURL, function (err, rawData) {
    // if(err) throw err;


    // var trace1 = prepData(rawData);
    var trace2 = prepData2(rawData);
    var trace3 = prepData3(rawData);
    var trace4 = prepData4(rawData);
    var data = prepData(rawData);

    // var data = [trace1, trace2, trace3, trace4];
    // console.log(data);
    var layout = {
        title: 'Energy production',
        xaxis: {
            rangeselector: selectorOptions,
            rangeslider: {}
        },
        yaxis: {
            fixedrange: true,
            title: 'Billions BTU',
            type: 'log'
        }
    };

    Plotly.plot('graph', data, layout);
    Plotly.addTraces(graph, trace2);
    Plotly.addTraces(graph, trace3);
    Plotly.addTraces(graph, trace4)
});


function prepData(rawData) {
    var x = [];
    var y = [];

    rawData.forEach(function (datum, i) {

        x.push(new Date(datum[xField]));
        y.push(datum[yField]);

    });

    return [{
        mode: 'lines',
        x: x,
        y: y,
        name: 'Coal Production'
    }];
}

function prepData2(rawData) {
    var x2 = [];
    var y2 = [];

    rawData.forEach(function (datum, i) {

        x2.push(new Date(datum[xField]));
        y2.push(datum[y2Field]);

    });

    return [{
        mode: 'lines',
        x: x2,
        y: y2,
        name: 'Gas production'
    }];
}

function prepData3(rawData) {
    var x3 = [];
    var y3 = [];

    rawData.forEach(function (datum, i) {

        x3.push(new Date(datum[xField]));
        y3.push(datum[y3Field]);

    });

    return [{
        mode: 'lines',
        x: x3,
        y: y3,
        name: 'Oil production'
    }];
}

function prepData4(rawData) {
    var x4 = [];
    var y4 = [];

    rawData.forEach(function (datum, i) {

        x4.push(new Date(datum[xField]));
        y4.push(datum[y4Field]);

    });

    return [{
        mode: 'lines',
        x: x4,
        y: y4,
        name: 'Renewable Energy production'
    }];
}

d3.csv("/data2", function (error, d) {
    console.log(d);
});

Plotly.d3.csv('/data2', function (err, data) {
    var lookup = {};
    //    Create a lookup table to sort and regroup the columns of data,
    // first by Years, then by prodType:
    function unpack(data, key) {
        return data.map(function (dat) { return dat[key]; });
    }
    console.log(data)
    var allStateNames = unpack(data, 'state'),
        allYear = unpack(data, 'Years'),
        allValues = unpack(data, 'prodValues'),
        allType = unpack(data, 'prodType'),
        allSubType = unpack(data, 'subType'),
        allComp = unpack(data, 'totalComp'),
        listofStates = [];
    // currentState,
    currentYear = [],
        currentValues = [],
        currentType = [],
        currentSubType = [],
        currentComp = [];

    //populate list of states
    for (var i = 0; i < allStateNames.length; i++) {
        if (listofStates.indexOf(allStateNames[i]) === -1) {
            listofStates.push(allStateNames[i]);
        }
    }
    console.log(listofStates)

    function getStateData(chosenState) {
        currentYear = [];
        currentValues = [];
        currentType = [];
        currentSubType = [];
        currentComp = [];
        for (var i = 0; i < allStateNames.length; i++) {
            if (allStateNames[i] === chosenState) {
                currentValues.push(allValues[i]);
                currentSubType.push(allSubType[i]);
                currentType.push(allType[i]);
                currentComp.push(allComp[i]);
                currentYear.push(allYear[i]);
            }
        }
    };

    console.log(currentSubType)
    console.log(currentComp)



    // Default Country Data
    setPlot('Texas');
    var lookup = {};
    function setPlot(chosenState) {
        getStateData(chosenState);
        // function getData() {
        // console.log(currentYear);
        var byYear, trace;

        //check this test
        if (!(byYear === lookup[currentYear])) {
            byYear = lookup[currentYear] === {};
        }
        // If a container for this Years + prodType doesn't exist yet,
        // then create one:
        if (!(trace = byYear[currentType])) {
            trace = byYear[currentType] = {
                x: [],
                y: [],
                id: [],
                text: [],
                marker: { size: [] }
            };
        }
        return trace;
    }
    // Go through each row, get the right trace, and append the data:
    for (var i = 0; i < chosenState.length; i++) {
        var datum = chosenState[i];
        var trace = getStateData(datum.currentYear, datum.currentType);
        trace.text.push(datum.currentSubType);
        trace.id.push(datum.currentSubType);
        trace.x.push(datum.currentValues);
        trace.y.push(datum.currentComp);
        trace.marker.size.push(datum.currentValues);
    }

    // Get the group names:
    var currentYears = Object.keys(lookup);
    // In this case, every Years includes every prodType, so we
    // can just infer the prodTypes from the *first* Years:
    var firstYears = lookup[currentYears[0]];
    var currentTypes = Object.keys(firstYears);

    // Create the main traces, one for each prodType:
    var traces = [];
    for (i = 0; i < currentTypes.length; i++) {
        var data = firstYears[currentTypes[i]];
        // One small note. We're creating a single trace here, to which
        // the frames will pass data for the different Yearss. It's
        // subtle, but to avoid data reference problems, we'll slice
        // the arrays to ensure we never write any new data into our
        // lookup table:
        traces.push({
            name: currentTypes[i],
            x: data.x.slice(),
            y: data.y.slice(),
            id: data.id.slice(),
            text: data.text.slice(),
            mode: 'markers',
            marker: {
                size: data.marker.size.slice(),
                sizemode: 'area',
                sizeref: 1000
            }
        });
    }

    // Create a frame for each Years. Frames are effectively just
    // traces, except they don't need to contain the *full* trace
    // definition (for example, appearance). The frames just need
    // the parts the traces that change (here, the data).
    var frames = [];
    for (i = 0; i < currentYears.length; i++) {
        frames.push({
            name: currentYears[i],
            data: currentTypes.map(function (currentType) {
                return getData(currentYears[i], currentType);
            })
        })
    }

    // Now create slider steps, one for each frame. The slider
    // executes a plotly.js API command (here, Plotly.animate).
    // In this example, we'll animate to one of the named frames
    // created in the above loop.
    var sliderSteps = [];
    for (i = 0; i < currentYears.length; i++) {
        sliderSteps.push({
            method: 'animate',
            label: currentYears[i],
            args: [[currentYears[i]], {
                mode: 'immediate',
                transition: { duration: 300 },
                frame: { duration: 300, redraw: false },
            }]
        });
    }

    var layout = {
        xaxis: {
            title: 'Total Production',
            // range: [10000, 10000000],
            type: 'log'
        },
        yaxis: {
            title: 'Total Consumption',
            type: 'log'
        },
        hovermode: 'closest',
        // We'll use updatemenus (whose functionality includes menus as
        // well as buttons) to create a play button and a pause button.
        // The play button works by passing `null`, which indicates that
        // Plotly should animate all frames. The pause button works by
        // passing `[null]`, which indicates we'd like to interrupt any
        // currently running animations with a new list of frames. Here
        // The new list of frames is empty, so it halts the animation.
        updatemenus: [{
            x: 0,
            y: 0,
            yanchor: 'top',
            xanchor: 'left',
            showactive: false,
            direction: 'left',
            type: 'buttons',
            pad: { t: 87, r: 10 },
            buttons: [{
                method: 'animate',
                args: [null, {
                    mode: 'immediate',
                    fromcurrent: true,
                    transition: { duration: 300 },
                    frame: { duration: 500, redraw: false }
                }],
                label: 'Play'
            }, {
                method: 'animate',
                args: [[null], {
                    mode: 'immediate',
                    transition: { duration: 0 },
                    frame: { duration: 0, redraw: false }
                }],
                label: 'Pause'
            }]
        }],
        // Finally, add the slider and use `pad` to position it
        // nicely next to the buttons.
        sliders: [{
            pad: { l: 130, t: 55 },
            currentvalue: {
                visible: true,
                prefix: 'Years:',
                xanchor: 'right',
                font: { size: 20, color: '#666' }
            },
            steps: sliderSteps
        }]
    };

    // Create the plot:
    Plotly.plot('myDiv', {
        data: traces,
        layout: layout,
        frames: frames,
    });
    var innerContainer = document.querySelector('[data-num="0"'),
        plotEl = innerContainer.querySelector('.plot'),
        stateSelector = innerContainer.querySelector('.statedata');

    function assignOptions(textArray, selector) {
        for (var i = 0; i < textArray.length; i++) {
            var currentOption = document.createElement('option');
            currentOption.text = textArray[i];
            selector.appendChild(currentOption);
        }
    }

    assignOptions(listofStates, stateSelector);

    function updateState() {
        setPlot(stateSelector.value);
    }

    stateSelector.addEventListener('change', updateState, false);
});
//   function getData(Years, prodType) {
//     var byYear, trace;
//     if (!(byYear = lookup[Years])) {;
//       byYear = lookup[Years] = {};
//     }
// 	 // If a container for this year + prodType doesn't exist yet,
// 	 // then create one:
//     if (!(trace = byYear[prodType])) {
//       trace = byYear[prodType] = {
//         x: [],
//         y: [],
//         id: [],
//         text: [],
//         marker: {size: []}
//       };
//     }
//     return trace;
//   }

//   // Go through each row, get the right trace, and append the data:
//   for (var i = 0; i < data.length; i++) {
//     var datum = data[i];
//     var trace = getData(datum.year, datum.prodType);
//     trace.text.push(datum.subType);
//     trace.id.push(datum.subType);
//     trace.x.push(datum.totalProd);
//     trace.y.push(datum.totalComp);
//     trace.marker.size.push(datum.prodValues);
//   }

//   // Get the group names:
//   var Yearss = Object.keys(lookup);
//   // In this case, every year includes every prodType, so we
//   // can just infer the prodTypes from the *first* year:
//   var firstYear = lookup[Yearss[0]];
//   var prodTypes = Object.keys(firstYear);

//   // Create the main traces, one for each prodType:
//   var traces = [];
//   for (i = 0; i < prodTypes.length; i++) {
//     var data = firstYear[prodTypes[i]];
// 	 // One small note. We're creating a single trace here, to which
// 	 // the frames will pass data for the different years. It's
// 	 // subtle, but to avoid data reference problems, we'll slice
// 	 // the arrays to ensure we never write any new data into our
// 	 // lookup table:
//     traces.push({
//       name: prodTypes[i],
//       x: data.x.slice(),
//       y: data.y.slice(),
//       id: data.id.slice(),
//       text: data.text.slice(),
//       mode: 'markers',
//       marker: {
//         size: data.marker.size.slice(),
//         sizemode: 'area',
//         sizeref: 1000
//       }
//     });
//   }

//   // Create a frame for each year. Frames are effectively just
//   // traces, except they don't need to contain the *full* trace
//   // definition (for example, appearance). The frames just need
//   // the parts the traces that change (here, the data).
//   var frames = [];
//   for (i = 0; i < Yearss.length; i++) {
//     frames.push({
//       name: Yearss[i],
//       data: prodTypes.map(function (prodType) {
//         return getData(Yearss[i], prodType);
//       })
//     })
//   }

//   // Now create slider steps, one for each frame. The slider
//   // executes a plotly.js API command (here, Plotly.animate).
//   // In this example, we'll animate to one of the named frames
//   // created in the above loop.
//   var sliderSteps = [];
//   for (i = 0; i < Yearss.length; i++) {
//     sliderSteps.push({
//       method: 'animate',
//       label: Yearss[i],
//       args: [[Yearss[i]], {
//         mode: 'immediate',
//         transition: {duration: 300},
//         frame: {duration: 300, redraw: false},
//       }]
//     });
//   }

//     var layout = {
//       xaxis: {
//         title: 'Total Production',
//         // range: [10000, 10000000],
//         type: 'log'
//       },
//       yaxis: {
//         title: 'Total Consumption',
//         type: 'log'
//       },
//       hovermode: 'closest',
// 	 // We'll use updatemenus (whose functionality includes menus as
// 	 // well as buttons) to create a play button and a pause button.
// 	 // The play button works by passing `null`, which indicates that
// 	 // Plotly should animate all frames. The pause button works by
// 	 // passing `[null]`, which indicates we'd like to interrupt any
// 	 // currently running animations with a new list of frames. Here
// 	 // The new list of frames is empty, so it halts the animation.
//     updatemenus: [{
//       x: 0,
//       y: 0,
//       yanchor: 'top',
//       xanchor: 'left',
//       showactive: false,
//       direction: 'left',
//       type: 'buttons',
//       pad: {t: 87, r: 10},
//       buttons: [{
//         method: 'animate',
//         args: [null, {
//           mode: 'immediate',
//           fromcurrent: true,
//           transition: {duration: 300},
//           frame: {duration: 500, redraw: false}
//         }],
//         label: 'Play'
//       }, {
//         method: 'animate',
//         args: [[null], {
//           mode: 'immediate',
//           transition: {duration: 0},
//           frame: {duration: 0, redraw: false}
//         }],
//         label: 'Pause'
//       }]
//     }],
// 	 // Finally, add the slider and use `pad` to position it
// 	 // nicely next to the buttons.
//     sliders: [{
//       pad: {l: 130, t: 55},
//       currentvalue: {
//         visible: true,
//         prefix: 'Year:',
//         xanchor: 'right',
//         font: {size: 20, color: '#666'}
//       },
//       steps: sliderSteps
//     }]
//   };

//   // Create the plot:
//   Plotly.plot('myDiv', {
//     data: traces,
//     layout: layout,
//     frames: frames,
//   });
// });






    // Create a lookup table to sort and regroup the columns of data,
    // first by Years, then by prodType:
//     function unpack(data, key) {
//         return data.map(function(dat) { return dat[key]; });
//     }
//     console.log(data)
//     var allStateNames = unpack(data, 'state'),
//         allYear = unpack(data, 'Years'),
//         allValues = unpack(data, 'prodValues'),
//         allType = unpack(data, 'prodType'),
//         allSubType = unpack(data, 'subType'),
//         allComp = unpack(data, 'totalComp'),
//         listofStates = [];
//         // currentState,
//         currentYear = [],
//         currentValues = [],
//         currentType = [],
//         currentSubType = [],
//         currentComp = [];


//         for (var i = 0; i < allStateNames.length; i++ ){
//             if (listofStates.indexOf(allStateNames[i]) === -1 ){
//                 listofStates.push(allStateNames[i]);
//             }
//         }
//         console.log(listofStates)

//         function getStateData(chosenState) {
//             currentYear = [];
//             currentValues = [];
//             currentType = [];
//             currentSubType = [];
//             currentComp = [];
//             for (var i = 0 ; i < allStateNames.length ; i++){
//                 if ( allStateNames[i] === chosenState ) {
//                     currentValues.push(allValues[i]);
//                     currentSubType.push(allSubType[i]);
//                     currentType.push(allType[i]);
//                     currentComp.push(allComp[i]);
//                     currentYear.push(allYear[i]);
//                 }
//             }
//         };

//         console.log(currentSubType)
//         console.log(currentComp)



//         // Default Country Data
//         setPlot('Texas');
//         var lookup = {};
//         function setPlot(chosenState) {
//             getStateData(chosenState);
//     // function getData() {
//         // console.log(currentYear);
//         var byYear, trace;
//         if (!(byYear = lookup[currentYear])) {
//             byYear = lookup[currentYear] = {};
//         }
//        // If a container for this Years + prodType doesn't exist yet,
//        // then create one:
//         if (!(trace = byYear[currentType])) {
//          trace = byYear[currentType] = {
//             x: [],
//             y: [],
//             id: [],
//             text: [],
//             marker: {size: []}
//             };
//         }
//         return trace;
//         }
//     // Go through each row, get the right trace, and append the data:
//     for (var i = 0; i < chosenState.length; i++) {
//       var datum = chosenState[i];
//       var trace = getStateData(datum.currentYear, datum.currentType);
//       trace.text.push(datum.currentSubType);
//       trace.id.push(datum.currentSubType);
//       trace.x.push(datum.currentValues);
//       trace.y.push(datum.currentComp);
//       trace.marker.size.push(datum.currentValues);
//     }

//     // Get the group names:
//     var currentYears = Object.keys(lookup);
//     // In this case, every Years includes every prodType, so we
//     // can just infer the prodTypes from the *first* Years:
//     var firstYears = lookup[currentYears[0]];
//     var currentTypes = Object.keys(firstYears);

//     // Create the main traces, one for each prodType:
//     var traces = [];
//     for (i = 0; i < currentTypes.length; i++) {
//       var data = firstYears[currentTypes[i]];
//        // One small note. We're creating a single trace here, to which
//        // the frames will pass data for the different Yearss. It's
//        // subtle, but to avoid data reference problems, we'll slice
//        // the arrays to ensure we never write any new data into our
//        // lookup table:
//       traces.push({
//         name: currentTypes[i],
//         x: data.x.slice(),
//         y: data.y.slice(),
//         id: data.id.slice(),
//         text: data.text.slice(),
//         mode: 'markers',
//         marker: {
//           size: data.marker.size.slice(),
//           sizemode: 'area',
//           sizeref: 1000
//         }
//       });
//     }

//     // Create a frame for each Years. Frames are effectively just
//     // traces, except they don't need to contain the *full* trace
//     // definition (for example, appearance). The frames just need
//     // the parts the traces that change (here, the data).
//     var frames = [];
//     for (i = 0; i < currentYears.length; i++) {
//       frames.push({
//         name: currentYears[i],
//         data: currentTypes.map(function (currentType) {
//           return getData(currentYears[i], currentType);
//         })
//       })
//     }

//     // Now create slider steps, one for each frame. The slider
//     // executes a plotly.js API command (here, Plotly.animate).
//     // In this example, we'll animate to one of the named frames
//     // created in the above loop.
//     var sliderSteps = [];
//     for (i = 0; i < currentYears.length; i++) {
//       sliderSteps.push({
//         method: 'animate',
//         label: currentYears[i],
//         args: [[currentYears[i]], {
//           mode: 'immediate',
//           transition: {duration: 300},
//           frame: {duration: 300, redraw: false},
//         }]
//       });
//     }

//     var layout = {
//       xaxis: {
//         title: 'Total Production',
//         // range: [10000, 10000000],
//         type: 'log'
//       },
//       yaxis: {
//         title: 'Total Consumption',
//         type: 'log'
//       },
//       hovermode: 'closest',
//        // We'll use updatemenus (whose functionality includes menus as
//        // well as buttons) to create a play button and a pause button.
//        // The play button works by passing `null`, which indicates that
//        // Plotly should animate all frames. The pause button works by
//        // passing `[null]`, which indicates we'd like to interrupt any
//        // currently running animations with a new list of frames. Here
//        // The new list of frames is empty, so it halts the animation.
//       updatemenus: [{
//         x: 0,
//         y: 0,
//         yanchor: 'top',
//         xanchor: 'left',
//         showactive: false,
//         direction: 'left',
//         type: 'buttons',
//         pad: {t: 87, r: 10},
//         buttons: [{
//           method: 'animate',
//           args: [null, {
//             mode: 'immediate',
//             fromcurrent: true,
//             transition: {duration: 300},
//             frame: {duration: 500, redraw: false}
//           }],
//           label: 'Play'
//         }, {
//           method: 'animate',
//           args: [[null], {
//             mode: 'immediate',
//             transition: {duration: 0},
//             frame: {duration: 0, redraw: false}
//           }],
//           label: 'Pause'
//         }]
//       }],
//        // Finally, add the slider and use `pad` to position it
//        // nicely next to the buttons.
//       sliders: [{
//         pad: {l: 130, t: 55},
//         currentvalue: {
//           visible: true,
//           prefix: 'Years:',
//           xanchor: 'right',
//           font: {size: 20, color: '#666'}
//         },
//         steps: sliderSteps
//       }]
//     };

//     // Create the plot:
//     Plotly.plot('myDiv', {
//       data: traces,
//       layout: layout,
//       frames: frames,
//     });
//     var innerContainer = document.querySelector('[data-num="0"'),
//         plotEl = innerContainer.querySelector('.plot'),
//         stateSelector = innerContainer.querySelector('.statedata');

//     function assignOptions(textArray, selector) {
//         for (var i = 0; i < textArray.length;  i++) {
//             var currentOption = document.createElement('option');
//             currentOption.text = textArray[i];
//             selector.appendChild(currentOption);
//         }
//     }

//     assignOptions(listofStates, stateSelector);

//     function updateState(){
//         setPlot(stateSelector.value);
//     }

//     stateSelector.addEventListener('change', updateState, false);
//   });