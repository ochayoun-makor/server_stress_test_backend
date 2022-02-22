// const { tradesController } = require('../controllers/tradesController')
const axios = require('axios')
const { Worker } = require('worker_threads')
const path = require('path')
var workers = []
let globalWorker = {}

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
        if (req.power === true) {
          globalWorker = new Worker(path.resolve('controllers/tradesController.js'))
          const regular_data = {
            type: req.type,
            token,
            products,
            filters: req.filters,
          }
          globalWorker.postMessage(JSON.stringify(regular_data))
          
          globalWorker.on('message', (data) => {
            ws.send(data)
          })
        } else if (req.power === false) {
          if (Object.entries(globalWorker).length) {
            globalWorker.terminate()
            console.log('global worker terminated')
          }
        }
        break
      case 'stress':
        if (req.power === true) {
          const stressed_data = {
            type: req.type,
            token,
            products,
            filters: req.filters,
          }

          for (let i = 0; i < req.threads; i++) {
            const worker = new Worker(path.resolve('controllers/tradesController.js'))
            worker.postMessage(JSON.stringify(stressed_data))
            worker.on('message', (data) => {
              const newData = { ...JSON.parse(data), thread: i }
              ws.send(JSON.stringify(newData))
            })
            workers.push(worker)
          }
        } else if (req.power === false) {
          if (workers.length) {
            workers.forEach((worker) => {
              worker.terminate()
              console.log('worker killed')
            })
          }
        }
        break
      case 'products':
        ws.send(JSON.stringify({ type: 'products', data: products }))
        break
      default:
        // console.log(req.type)
        throw new Error('Invalid message type')
    }
  } catch (err) {
    // console.log(e)
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
