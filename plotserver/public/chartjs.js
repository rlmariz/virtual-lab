var listPlots = new Array();

listPlots.push({
    'name': 'plot_1'
});

listPlots.push({
    'name': 'plot_2'
});

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
                label: 'PV',
                lineTension: 0.2,
                pointRadius: 0,
                fill: false,
                borderColor: 'rgba(75,72,192)',
                data: []
            }, {
                label: 'SC',
                lineTension: 0.2,
                pointRadius: 0,
                fill: false,
                borderColor: 'rgba(0,0,2)',
                data: []
            }, {
                label: 'SP',
                lineTension: 0.2,
                pointRadius: 0,
                fill: false,
                borderColor: 'rgba(200,0,2)',
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

//addPlots()