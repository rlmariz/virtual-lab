module.exports = function(RED) {
    "use strict";
    function TransfFuncNode(n) {
        RED.nodes.createNode(this, n);

        this.inputMin = n.inputMin * 1.0;
        this.inputMax = n.inputMax * 1.0;
        this.outputMin = n.outputMin * 1.0;
        this.outputMax = n.outputMax * 1.0;

        var node = this;

        const utl = require('./utils')

        node.on('input', function(msg) {
            let valueInput = msg.payload;

            msg.payload = valueInput * 5;
            node.send(msg);

            node.status({fill:"blue",shape:"dot",text:"out:" + valueInput});
        });
    }

    RED.nodes.registerType("Transfer Function", TransfFuncNode);
}
