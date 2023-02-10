//import {addWebSocket} from "./websocket-client.js";
//const ws = require('./websocket-client');
require('./websocket-client.js')


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