module.exports = function (RED) {
    var socket = require('./socket')(RED);

    function PlotNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var plot = {};

        plot.name = node.name || `plot-${node.id}`;

        node.on('input', function (msg) {
            msg.payload = msg.payload;

            node.send(msg);        
           
            plot.value = msg.payload;
            plot.label = msg.label || plot.name;
            plot.time = msg.time;

            socket.emit('plot', plot)
        });
    }
    RED.nodes.registerType("plot", PlotNode);
}