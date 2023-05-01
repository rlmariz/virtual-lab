module.exports = function (RED) {

    "use strict";

    const WebSocket = require('ws');
    const io = require("socket.io-client");

    function TransferFunctionNode(n) {
        RED.nodes.createNode(this, n);

        var node = this;

        node.function = n.function;

        node.time = 0;

        var tf = {
            name: 'tf-' + node.id,
            func: '8/(8*s**2+s)'
        }

        var tfinput = {
            name: tf.name,
            t: 0,
            y: 0
        }

        node.log("socker connecting...");

        node.codeDesc = {
            1000: "Normal",
            1001: "Going Away",
            1002: "Protocol Error",
            1003: "Unsupported Data",
            1004: "Reserved",
            1005: "No Status Recvd- reserved",
            1006: "Abnormal Closure- reserved",
            1007: "Invalid frame payload data",
            1008: "Policy Violation",
            1009: "Message too big",
            1010: "Missing Extension",
            1011: "Internal Error",
            1012: "Service Restart",
            1013: "Try Again Later",
            1014: "Bad Gateway",
            1015: "TLS Handshake"
        };

        node.readystateDesc = {
            0: "CONNECTING",
            1: "OPEN",
            2: "CLOSING",
            3: "CLOSED"
        };

        node.ws = new WebSocket('ws://host.docker.internal:2812')

        node.ws.mynam = node.id;

        node.ws.onerror = function (e) {
            node.log(`WebSocket onerror: state is now ${e.target.readyState}-${node.readystateDesc[e.target.readyState]}`);
        }

        node.ws.onopen = function (e) {
            node.log(`WebSocket onopen: state is now ${e.target.readyState}-${node.readystateDesc[e.target.readyState]}`);
            node.status({ fill: "green", shape: "dot", text: "connected" });
            node.sendonws(`tfs:${node.function}`)
            //node.sendonws(`tfn:${node.id}`)
            node.sendonws(`tfn:${"Teste"}`)
        }

        node.ws.onclose = function (e) {
            node.log(`WebSocket onclose: state is now ${e.target.readyState}-${node.readystateDesc[e.target.readyState]}`);
            node.status({ fill: "red", shape: "ring", text: "disconnected" });
        }

        node.ws.onmessage = function (e) {
            node.log(`WebSocket message: ${e.data}`);
            node.send({payload: parseFloat(e.data)});
        }

        node.sendonws = function (msg) {
            if (node.ws.readyState == 1) {
                node.ws.send(msg);
                return true;
            } else {
                node.log('WebSocket not ready.')
                return false
            }
        }

        // node.log("*** log ***");
        // node.warn("*** warn ***");
        // node.error("*** error ***");

        this.status({ fill: "red", shape: "ring", text: "disconnected" });

        node.on('input', function (msg) {
            let valueInput = msg.payload;

            msg.payload = valueInput;

            node.sendonws(`tfc:${node.time++}`)
        });
    }

    RED.nodes.registerType("transfer-function", TransferFunctionNode);
}
