// ------------- CHARTJS ------------- //
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
            borderColor: "rgba(75,72,192)",
            data: []
        }, {
            label: 'SC',
            lineTension: 0.2,
            pointRadius: 0,
            fill: false,
            borderColor: "rgba(0,0,2)",
            data: []
        }, {
            label: 'SP',
            lineTension: 0.2,
            pointRadius: 0,
            fill: false,
            borderColor: "rgba(200,0,2)",
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