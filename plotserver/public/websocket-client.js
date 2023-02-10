const WebSocket = require('ws');

const codeDesc = {
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

const readystateDesc = {
  0: "CONNECTING",
  1: "OPEN",
  2: "CLOSING",
  3: "CLOSED"
};

var username = "";
var appliedusername = "";

function load() {
  ws = addwebsocket("ws");
  ws.onmessage = function (e) { receiveMessage(e.data) }
}

async function connection(socket, timeout = 10000) {
  const isOpened = () => (socket.readyState === WebSocket.OPEN)

  if (socket.readyState !== WebSocket.CONNECTING) {
    return isOpened()
  }
  else {
    const intrasleep = 100
    const ttl = timeout / intrasleep // time to loop
    let loop = 0
    while (socket.readyState === WebSocket.CONNECTING && loop < ttl) {
      await new Promise(resolve => setTimeout(resolve, intrasleep))
      loop++
      console.log(`timeout: ${timeout}`)
      console.log(`intrasleep: ${intrasleep}`)
      console.log(`ttl: ${ttl}`)
      console.log(`loop: ${loop}`)
    }
    return isOpened()
  }
}

function receiveMessage(msgdata) {
  if (username == "") {
    if (msgdata == appliedusername) {
      username = msgdata;
      console.log(`username ${username}`)
    } else {
      if (msgdata == "Username taken!") {
        addContent(msgdata)
      }
    }
  } else {
    addContent("received: " + msgdata)
  }
}

function addWebSocket(instancename) {
    var wsuri = 'ws://localhost:2812';
  ws = new WebSocket(wsuri)
  ws.mmynam = instancename;
  ws.onerror = function (e) {
    addContent("WebSocket " + instancename + ".onerror: " +
      "Websocket state is now " + e.target.readyState +
      " " + readystateDesc[e.target.readyState])
  }
  ws.onopen = function (e) {
    addContent("WebSocket " + instancename + ".onopen: " +
      "Websocket state is now " + e.target.readyState +
      " " + readystateDesc[e.target.readyState])
  }
  ws.onclose = function (e) {
    addContent("WebSocket " + instancename + ".onclose: Reload page to chat again.");
  }

  ws.onmessage = function (e) {
    console.log(e.data)
  }

  return ws
} 

function addContent(html) {
  //var div = document.createElement("div");
  //div.innerHTML = html;
  //document.getElementById("content").appendChild(div);
  console.log(html);
} // addContent

function applyUserName(applyfor) {
  if (!applyfor.replace(/\s/gi, '').length) {
    //alert("Please select a valid user name")
    console.log('alert: Please select a valid user name')
  } else {
    if (sendonws(ws, "userName:" + applyfor)) {
      appliedusername = applyfor
    }
  }
} // applyUserName

function sendonws(websocket, msg) {
  if (websocket.readyState == 1) {
    websocket.send(msg);
    return true;
  } else {
    //alert("WebSocket not ready. Reload page or check server!");
    console.log('WebSocket not ready. Reload page or check server!')
    return false
  } // if
} // sendonws


////////////Teste///////////////////
async function start(tfs) {

  console.log('**** Inicio ****** ');

  let ws = addWebSocket("ws");

  console.log(`readystate: ${readystateDesc[ws.readyState]}`)

  await new Promise(r => setTimeout(r, 3000));

  console.log(`readystate: ${readystateDesc[ws.readyState]}`)

  const opened = await connection(ws, 10000)
  if (opened) {
    console.log("opened true")
  }
  else {
    console.log("the socket is closed OR couldn't have the socket in time, program crashed");
  }

  sendonws(ws, `tfs:${tfs}`)

  for (let index = 0; index <= 60; index++) {
    sendonws(ws, `tfc:${index}`)
  }

  console.log('**** Fim ****** ');
}

start("8 / (8s + 1)")
start("4 / (4s + 1)")