module.exports = function(RED) {
    "use strict";

    function ProcessoNode(config) {
        RED.nodes.createNode(this,config);
        
        var node = this;
        this.interval_id = null;
        this.repeat = 1000;
        //this.var_current = 0;
        this.var_start = config.var_start;
        
        this.var_current = parseFloat(config.var_start);
        if (isNaN(this.var_current )) {
            this.var_current = 0
        }
        //this.var_current = 0;

        node.repeaterSetup = function () {            
            this.interval_id = setInterval(function() {
                node.var_current = node.var_current + 1;
                node.emit("input", {});
            }, this.repeat);
        };
        
        node.repeaterSetup();
        
        this.on("input", function(msg, send, done) {
            msg.payload = this.var_current;
            send(msg);
            done();
        });

    }
    RED.nodes.registerType("processo",ProcessoNode);

    ProcessoNode.prototype.close = function() {
        if (this.interval_id != null) {
            clearInterval(this.interval_id);
        }
    };

}
