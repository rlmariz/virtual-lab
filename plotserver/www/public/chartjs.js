var listPlots = {};

function addDataPlant(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
    chart.update();
}

function addData(chart, dataset, data) {
    chart.data.datasets[dataset].data.push(data);
    chart.update();
}

function removeData(chart) {
    chart.data.labels = [0];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [0];
    });
    chart.update();
}

function createChart(ctx){
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'SC',
                lineTension: 0.2,
                pointRadius: 0,
                fill: false,
                borderColor: 'rgba(0,0,2)',
                data: []
            }],            
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function addPlots(){
    listPlots.forEach(function (plotItem) {        
        addPlot(plotItem)
    });
}

function addPlot(plotItem){
    let plotArea = document.getElementById('plotarea');
    let plotAreaContent = document.getElementById('plotarea-content');

    let a = document.createElement('a');
    a.setAttribute('href', '#' + plotItem.name);        
    a.className = 'nav-link';
    a.setAttribute('data-bs-toggle', 'tab')
    a.appendChild(document.createTextNode(plotItem.name));

    let li = document.createElement('li');
    li.className = 'nav-item';
    li.appendChild(a);        

    let canvas = document.createElement('canvas');
    canvas.id = plotItem.name + "-canvas";        

    let div = document.createElement('div');
    div.className = "tab-pane fade";
    div.id = plotItem.name;
    div.appendChild(canvas);        

    plotItem.graf = createChart(canvas.getContext('2d'))

    plotArea.appendChild(li);
    plotAreaContent.appendChild(div);    
}

function plotValue(message) {
    let plotValue = JSON.parse(message)

    if (listPlots[plotValue.name] == undefined){
        plotItem = {
            'name': plotValue.name
        }        
        plotValue.chart = addPlot(plotItem);
        listPlots[plotValue.name] = plotItem;
    }

    //listPlots[plotValue.name].chart.data.datasets[0].data.push(plotValue.value);
    //listPlots[plotValue.name].chart.update();

    addData(listPlots[plotValue.name].chart, 0, 1)

    // if (!listPlots.includes(plotValue.name)){
    //     plotItem = {
    //         'name': plotValue.name
    //     }        
    //     plotValue.chart = addPlot(plotItem);
    //     listPlots.push(plotValue.name);        
    // }
}

//addPlots()