const WebSocket = require('ws')
require('dotenv').config()
const message_helper = require('../helpers/message_helper')
//const logger = Logger.create('src/services/ws_service.js')
const wss = new WebSocket.Server({ port: process.env.WS_PORT })
const get_wss_of_ws_service = () => wss
const ws_connection = async () => {
  try {
    console.log(`Creating WS server on port ${process.env.WS_PORT}`)
    wss.on('connection', async (ws, req) => {
      console.log('1 connected')
      ws.on('message', (message) => {
        message_helper.handle_message(ws, message)
      })
      ws.on('close', () => {
        console.log('message closed')
      })
    })

    wss.on('close', () => {
      console.log('socket closed')
    })
    wss.on('error', (err) => {
      console.log('err', err)
    })
  } catch (error) {
    console.log('error', error)
  }
}

// module.exports = {
//   ws_connection,
//   get_wss_of_ws_service,
// }

module.exports.ws_connection = ws_connection
module.exports.get_wss_of_ws_service = get_wss_of_ws_service
