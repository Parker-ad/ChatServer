const WebSocket = require('ws')
const ws = new WebSocket.Server({ port: 8080 }, () => {
  console.log('socket start')
})
let clients = []
ws.on('connection', client => {
  clients.push(client)
  client.on('message', msg => {
    sendAll(msg)
  })
})
function sendAll (msg) {
  for (let index = 0; index < clients.length; index++) {
    clients[index].send(msg)
  }
}
