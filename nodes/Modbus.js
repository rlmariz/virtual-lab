'use strict'

const modbus = require('jsmodbus')
const net = require('net')
const socket = new net.Socket()
const options = {
  'host': '192.168.5.143',
  'port': '502'
}
const client = new modbus.client.TCP(socket)

socket.on('connect', function () {
  client.readHoldingRegisters(12, 2)
    .then(function (resp) {
      console.log(resp.response._body.valuesAsArray)
      socket.end()
    }).catch(function () {
      console.error(require('util').inspect(arguments, {
        depth: null
      }))
      socket.end()
    })
})

socket.on('error', console.error)
socket.connect(options)