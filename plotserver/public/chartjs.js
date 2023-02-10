// ------------- CHARTJS ------------- //

var listPlots = new Array();

listPlots.push({
    'name': 'plot_1'
});

console.log(listPlots);

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
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
    var lineChart = new Chart(ctx, {
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
    let plotArea = document.getElementById('plotarea');
    let plotAreaContent = document.getElementById('plotarea-content');
    listPlots.forEach(function (plotItem) {
        
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

        let h = document.createElement('h4');
        h.className = "mt-2";
        h.appendChild(document.createTextNode(plotItem.name));
        div.appendChild(h);        

        //<h4 class="mt-2">Profile tab content</h4>

        createChart(canvas.getContext('2d'))

        console.log('aaaa')
        console.log(div.outerHTML);

        

        plotArea.appendChild(li);
        plotAreaContent.appendChild(div);
        console.log(plotItem);

        console.log('--------body**************')
        console.log(document.body)
    });
}

addPlots()