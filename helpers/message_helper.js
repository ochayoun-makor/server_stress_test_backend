const axios = require('axios')
const { Worker } = require('worker_threads')
const path = require('path')
let clients = {}

const handle_message = async (ws, message) => {
  try {
    const login_data = {
      username: process.env.USER_NAME,
      password: process.env.PASSWORD,
    }
    // Check the time and insert it to the object
    const res = await axios.put(process.env.AUTH_URL, login_data)
    const { key: token } = res.data

    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
    const productsRes = await axios.get(process.env.PRODUCT_URL)
    const { data: products } = productsRes
    const req = JSON.parse(message)
    switch (req.type) {
      case 'get_data': // regular
        switch (req.mode) {
          case 'regular':
            if (req.power === true) {
              let worker = new Worker(path.resolve('controllers/tradesController.js'))
              const regular_data = {
                req,
                token,
                products,
              }
              worker.postMessage(JSON.stringify(regular_data))

              worker.on('message', (data) => {
                const newData = JSON.parse(data)
                newData.data.location = req.server.name
                ws.send(JSON.stringify(newData))
              })
              clients[ws.id] = worker
            } else if (req.power === false) {
              if (clients[ws.id]) {
                clients[ws.id].terminate()
              }
              delete clients[ws.id]
            }
            break
          case 'stress':
            if (req.power === true) {
              const stressed_data = {
                req,
                token,
                products,
              }
              const threads = req.threads ? +req.threads : 1
              for (let i = 1; i <= threads; i++) {
                const worker = new Worker(path.resolve('controllers/tradesController.js'))
                worker.postMessage(JSON.stringify(stressed_data))
                worker.on('message', (data) => {
                  const newData = JSON.parse(data)
                  newData.data.thread = i
                  newData.data.location = req.server.name
                  ws.send(JSON.stringify(newData))
                })
                clients[ws.id] = clients[ws.id] ? [...clients[ws.id], worker] : [worker]
              }
            } else if (req.power === false) {
              if (clients[ws.id]) {
                clients[ws.id].forEach((worker) => {
                  worker.terminate()
                })
                delete clients[ws.id]
              }
            }
            break
        }
        break
      case 'products':
        ws.send(JSON.stringify({ type: 'products', data: products.map((product) => product.product_name) }))
        break
      default:
        throw new Error('Invalid message type')
    }
  } catch (err) {
    ws.send(
      JSON.stringify({
        error: true,
        message: err.message,
      })
    )
  }
}

module.exports = {
  handle_message,
}

// {
//   type: "getData",
//   filters: {
//     type: 'MKT',
//     side: "BUY",
//     product_id: 2
//   }
// }
