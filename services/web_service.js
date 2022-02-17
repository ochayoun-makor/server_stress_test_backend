const WebSocket = require('ws')
require('dotenv').config()
const massage_helper = require('../helpers/message_helper')
//const logger = Logger.create('src/services/ws_service.js')
const wss = new WebSocket.Server({ port: process.env.WS_PORT })
const get_wss_of_ws_service = () => wss
const ws_connection = async () => {
  try {
    console.log(`Creating WS server on port ${process.env.WS_PORT}`)
    wss.on('connection', async (ws, req) => {
      console.log('1 connected')
      ws.on('message', (message) => {
        massage_helper.handle_message(ws, message)
      })
      ws.on('close', () => {})
    })
    wss.on('close', () => clearInterval(interval))
    const interval = setInterval(() => {
      wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          return ws.close()
        }

        ws.isAlive = false
        ws.ping()
      })
    }, 30000)
    wss.on('error', (err) => {
      console.log('err', err)
    })
  } catch (error) {
    console.log('error', error)
  }
}

exports.ws_connection = ws_connection
exports.get_wss_of_ws_service = get_wss_of_ws_service
