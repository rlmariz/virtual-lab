module.exports = function (RED) {
    "use strict";
    function TanqueNode(n) {
        RED.nodes.createNode(this, n);

        this.timeOut_id = null;
        this.socket = null;
        this.client = null;

        this.area = n.area * 1.0;
        this.valveK = n.valveK * 1.0;
        this.valveOpen = n.valveOpen * 1.0;
        this.integrationInterval = n.integrationInterval * 1.0;
        this.modbusHost = n.modbusHost;
        this.modbusPort = n.modbusPort * 1.0;
        this.modbusRegister = n.modbusRegister * 1.0;
        this.intervalUpdate = n.intervalUpdate * 1.0;

        this.startLevel = n.startLevel * 1.0;
        this.startInputFlow = n.startInputFlow * 1.0;
        this.startOutputFlow = n.startOutputFlow * 1.0;        

        this.level = this.startLevel;
        this.inputFlow = this.startInputFlow;
        this.outputFlow = this.startOutputFlow;

        var node = this;        

        // create a tcp modbus client
        const Modbus = require('jsmodbus')
        const net = require('net')

        node.on('input', function (msg) {
            node.inputFlow = msg.payload;
        });

        node.loadProcess = function () {
            node.timeOut_id = setTimeout(function () {
                node.level = node.Tanque_rk(node.level, node.inputFlow, node.integrationInterval);
                node.level = Math.round(node.level * 1000) / 1000;
                var msg1 = { payload: node.level };
                var msg2 = { payload: node.outputFlow };
                node.send([msg1, msg2]);

                node.status({fill:"blue",shape:"dot",text:"level:" + node.level});

                node.loadProcess();
            }, node.intervalUpdate);
        }

        node.loadFromModbus = function () {

            if (node.socket === null) {
                node.socket = new net.Socket();

                node.socket.on('error', function (socket) {
                    node.modbusConnected = false;
                    node.error(socket);
                });

                node.socket.on("connect", function (socket) {
                    node.modbusConnected = true;
                });

                node.socket.on("close", err => {
                    node.modbusConnected = false;
                });
            }

            if (node.socket !== null && node.client === null) {
                node.client = new Modbus.client.TCP(node.socket, 1)
            }

            if (!node.modbusConnected) {
                try {
                    node.socket.connect({
                        'host': node.modbusHost,
                        'port': node.modbusPort,
                        'autoReconnect': true
                    })
                } catch (e) {
                    node.error(e); //'Erro on Modbus connect', 
                }
            }

            if (node.socket !== null && node.modbusConnected) {
                node.client.readHoldingRegisters(12, 1).then(function (resp) {
                    node.valveOpen = resp.response._body.valuesAsArray[0];
                }).catch(function () {
                    node.warn(require('util').inspect(arguments, { depth: null }))
                })
            }

            setTimeout(() => {
                node.loadFromModbus();
            }, 500);

        }

        node.Tanque_rk = function (x0, u, h) {
            //1a chamada
            var xd = node.Tanque_xdot(x0, u);
            var savex0 = x0;
            var phi = xd;
            var x0 = savex0 + 0.5 * h * xd;

            //2a chamada
            xd = node.Tanque_xdot(x0, u);
            phi = phi + 2 * xd;
            x0 = savex0 + 0.5 * h * xd;

            //3a chamada
            xd = node.Tanque_xdot(x0, u);
            phi = phi + 2 * xd;
            x0 = savex0 + h * xd;

            //4a chamada
            xd = node.Tanque_xdot(x0, u);
            var x = savex0 + (phi + xd) * h / 6;

            return x;
        }

        node.Tanque_xdot = function (x, u) {
            //Differential equations
            node.outputFlow = node.valveK * (node.valveOpen / 100) * Math.sqrt(x);
            var xd = (u - node.outputFlow) / node.area;

            //node.warn([u, node.outputFlow, xd]);

            //para evitar erros numéricos (o nivel nao pode ser negativo!)
            if (Math.abs(x) < 0.01) {
                xd = 0.01;
            }

            return xd;
        }

        if(node.modbusHost !== "" && node.modbusPort !== null && node.modbusPort > 0 && node.modbusRegister !== null && node.modbusRegister > 0){
            node.loadFromModbus();
        }
        node.loadProcess();
    }

    RED.nodes.registerType("tanque", TanqueNode);
}
