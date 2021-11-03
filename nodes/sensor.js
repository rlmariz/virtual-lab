module.exports = function(RED) {
    "use strict";
    function SensorNode(n) {
        RED.nodes.createNode(this, n);

        this.inputMin = n.inputMin;
        this.inputMax = n.inputMax;
        this.outputMin = n.inputMin;
        this.outputMax = n.outputMax;

        var node = this;

        node.on('input', function(msg) {
            let valueInput = msg.payload;

            if(valueInput < this.inputMin){
                valueInput = this.inputMin;
            }

            if(valueInput > this.inputMax){
                valueInput = this.inputMax;
            }

            //faz a interpolação linear
            let valueOutput = (((valueInput - this.inputMin) / (this.inputMax - this.inputMin)) * (this.outputMax - this.outputMin)) + this.outputMin;
            msg.payload = valueOutput;
            node.send(msg);
        });
    }

    RED.nodes.registerType("sensor", SensorNode);
}
