var rawDataURL2 = '/data5';
var x1Field = 'Years';
var y1Field = 'Cali_total_en_prod';
// var x2Field = 'Years';
var y12Field = 'Texas_total_en_prod';
// var x3Field = 'Years';
var y13Field = 'Cali_total_en_consumption';
// var x4Field = 'Years';
var y14Field = 'Texas_total_en_consumption';

var selectorOption = {
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

Plotly.d3.csv(rawDataURL2, function(err, rawData) {
    // if(err) throw err;

    
    // var trace1 = prepData(rawData);
    var trace12 = prepareData2(rawData);
    var trace13 = prepareData3(rawData);
    var trace14 = prepareData4(rawData);
    var data1 = prepareData(rawData);

    // var data = [trace1, trace2, trace3, trace4];
    // console.log(data);
    var layout = {
        title: 'Total Energy Production and Consumption in California and Texas',
        xaxis: {
            rangeselector: selectorOption,
            rangeslider: {}
        },
        yaxis: {
            fixedrange: true,
            title: 'Billion Btu',
            type: 'log'
        }
    };

    Plotly.plot('full', data1, layout);
    Plotly.addTraces('full', trace12);
    Plotly.addTraces('full', trace13);
    Plotly.addTraces('full', trace14)
});


function prepareData(rawData) {
    var xn = [];
    var yn = [];
    
    rawData.forEach(function(datum, i) {

        xn.push(new Date(datum[x1Field]));
        yn.push(datum[y1Field]);
        
    });

    return [{
        mode: 'lines',
        x: xn,
        y: yn,
        name: 'California Total Production'
    }];
}

function prepareData2(rawData) {
    var x2 = [];
    var y2 = [];
    
    rawData.forEach(function(datum, i) {

        x2.push(new Date(datum[x1Field]));
        y2.push(datum[y12Field]);
        
    });

    return [{
        mode: 'lines',
        x: x2,
        y: y2,
        name: 'California Total Consumption'
    }];
}

function prepareData3(rawData) {
    var x3 = [];
    var y3 = [];
    
    rawData.forEach(function(datum, i) {

        x3.push(new Date(datum[x1Field]));
        y3.push(datum[y13Field]);
        
    });

    return [{
        mode: 'lines',
        x: x3,
        y: y3,
        name: 'Texas Total Production'
    }];
}

function prepareData4(rawData) {
    var x4 = [];
    var y4 = [];
    
    rawData.forEach(function(datum, i) {

        x4.push(new Date(datum[x1Field]));
        y4.push(datum[y14Field]);
        
    });

    return [{
        mode: 'lines',
        x: x4,
        y: y4,
        name: 'Texas Total Consumption'
    }];
}