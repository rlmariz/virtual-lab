module.exports = function(RED) {
    "use strict";
    function TanqueNode(n) {
        RED.nodes.createNode(this, n);

        this.timeOut_id = null;
        this.flowIndex = 0;
        this.area = 1;
        this.valveK = 0.5;
        this.valveOpen = 0;
        this.level = 8;
        this.integrationInterval = 0.2;
        this.inputFlow = 0;
        this.outputFlow = 0;

        var node = this;

        // create a tcp modbus client
        //https://github.com/Cloud-Automation/node-modbus/blob/v4.0-dev/examples/javascript/tcp/ReadHoldingRegisters.js
        const Modbus = require('jsmodbus')
        const net = require('net')
        this.socket = new net.Socket()
        this.client = new Modbus.client.TCP(node.socket, 1)
        this.options = {
            'host' : '192.168.5.143',
            'port' : '502'
        }
        
        try {
            node.socket.on('error', function (socket){
                node.error(socket);
            }); // console.error


            node.socket.connect(node.options)        
        } catch (e) {
            node.error(e); //'Erro on Modbus connect', 
        } 
        
        try {
            this.flow = JSON.parse(n.flow);
        } catch (e) {
            this.flow = null;
        }                

        node.on('input', function(msg) {
            node.inputFlow = msg.payload;
        });  
        
        node.load = function () {
            this.timeOut_id = setTimeout(function() {
                if (node.flow != null){
                    node.flowIndex++;
                    if (node.flowIndex >= node.flow.length){
                        node.flowIndex = 0;
                    }
                    node.level = node.Tanque_rk(node.level, node.inputFlow, node.integrationInterval);
                    node.level = Math.round(node.level * 1000) / 1000;
                    var msg1 = { payload: node.level};
                    var msg2 = { payload: node.outputFlow};
                    node.send([msg1, msg2]);
                }


                node.client.readHoldingRegisters(12, 2).then(function (resp) {
                //    node.warn(resp.response._body.valuesAsArray[0])
                   node.valveOpen = resp.response._body.valuesAsArray[0] / 100.0;
                }).catch(function () {
                     node.warn(require('util').inspect(arguments, {
                      depth: null
                    }))
                })


                node.load();
            //}, node.flow[node.flowIndex].duration*1000);
        }, 1000);
        }

        node.Tanque_rk = function (x0,u,h){
            //1a chamada
            var xd = node.Tanque_xdot(x0,u);
            var savex0 = x0;
            var phi = xd;
            var x0 = savex0 + 0.5 * h * xd;    
        
            //2a chamada
            xd = node.Tanque_xdot(x0,u);
            phi = phi + 2 * xd;
            x0 = savex0 + 0.5 * h * xd;    
        
            //3a chamada
            xd = node.Tanque_xdot(x0,u);
            phi = phi + 2 * xd;
            x0 = savex0 + h * xd;
        
            //4a chamada
            xd = node.Tanque_xdot(x0,u);
            var x = savex0+(phi+xd)*h/6;
        
            return x;
        }

        node.Tanque_xdot = function (x, u) {        
            //Differential equations
            node.outputFlow = node.valveK * node.valveOpen * Math.sqrt(x);
            var xd = (u - node.outputFlow) / node.area;
        
            //para evitar erros numéricos (o nivel nao pode ser negativo!)
            if (Math.abs(x) < 0.01){
                xd = 0.01;
            }
        
            return xd;
        }        

        node.load();
    }

    RED.nodes.registerType("tanque", TanqueNode);
}
