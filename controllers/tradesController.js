const { calcTradeTime } = require('./singleTrade')
const { parentPort } = require('worker_threads')

const tradesController = async (ws, token, products, filters) => {
  try {
    const types = filters?.type ? filters.type : ['MKT', 'FOK', 'RFQ']
    const sides = filters?.side ? filters.side : ['BUY', 'SELL']

    try {
      if (filters?.product_id) {
        let filteredProduct = products.filter((product) => (product.product_id = filters?.product_id))[0]
        const { product_id, min_quantity, product_name } = filteredProduct
        if (typeof types === 'string' && typeof sides === 'string') {
          const tradeTime = await calcTradeTime(token, types, sides, product_id, min_quantity)
          const data_to_return = {
            type: 'trade',
            data: {
              type: types, // EX. -> 'FOK'
              side: sides, // EX. -> 'BUY'
              product_id,
              product_name,
              quantity: min_quantity,
              tradeTime,
            },
          }
          ws.send(JSON.stringify(data_to_return))
        } else if (typeof types === 'string') {
          for (const side of sides) {
            const tradeTime = await calcTradeTime(token, types, side, product_id, min_quantity)
            const data_to_return = {
              type: 'trade',
              data: {
                type: types, // EX. -> 'FOK'
                side: sides, // EX. -> 'BUY'
                product_id,
                product_name,
                quantity: min_quantity,
                tradeTime,
              },
            }
            ws.send(JSON.stringify(data_to_return))
          }
        } else if (typeof sides === 'string') {
          for (const type of types) {
            const tradeTime = await calcTradeTime(token, type, sides, product_id, min_quantity)
            const data_to_return = {
              type: 'trade',
              data: {
                type: types, // EX. -> 'FOK'
                side: sides, // EX. -> 'BUY'
                product_id,
                product_name,
                quantity: min_quantity,
                tradeTime,
              },
            }
            ws.send(JSON.stringify(data_to_return))
          }
        } else {
          for (const type of types) {
            for (const side of sides) {
              const tradeTime = await calcTradeTime(token, type, side, product_id, min_quantity)
              const data_to_return = {
                type: 'trade',
                data: {
                  type: types, // EX. -> 'FOK'
                  side: sides, // EX. -> 'BUY'
                  product_id,
                  product_name,
                  quantity: min_quantity,
                  tradeTime,
                },
              }
              ws.send(JSON.stringify(data_to_return))
            }
          }
        }
      } else {
        for (const product of products) {
          console.log('trade created ! :)')
          const { product_id, min_quantity, product_name } = product

          if (typeof types === 'string' && typeof sides === 'string') {
            const tradeTime = await calcTradeTime(token, types, sides, product_id, min_quantity)
            const data_to_return = {
              type: 'trade',
              data: {
                type: types, // EX. -> 'FOK'
                side: sides, // EX. -> 'BUY'
                product_id,
                product_name,
                quantity: min_quantity,
                tradeTime,
              },
            }
            ws.send(JSON.stringify(data_to_return))
          } else if (typeof types === 'string') {
            for (const side of sides) {
              const tradeTime = await calcTradeTime(token, types, side, product_id, min_quantity)
              const data_to_return = {
                type: 'trade',
                data: {
                  type: types, // EX. -> 'FOK'
                  side: sides, // EX. -> 'BUY'
                  product_id,
                  product_name,
                  quantity: min_quantity,
                  tradeTime,
                },
              }
              ws.send(JSON.stringify(data_to_return))
            }
          } else if (typeof sides === 'string') {
            for (const type of types) {
              const tradeTime = await calcTradeTime(token, type, sides, product_id, min_quantity)
              const data_to_return = {
                type: 'trade',
                data: {
                  type: types, // EX. -> 'FOK'
                  side: sides, // EX. -> 'BUY'
                  product_id,
                  product_name,
                  quantity: min_quantity,
                  tradeTime,
                },
              }
              ws.send(JSON.stringify(data_to_return))
            }
          } else {
            for (const type of types) {
              for (const side of sides) {
                const tradeTime = await calcTradeTime(token, type, side, product_id, min_quantity)
                const data_to_return = {
                  type: 'trade',
                  data: {
                    type, // EX. -> 'FOK'
                    side, // EX. -> 'BUY'
                    product_id,
                    product_name,
                    quantity: min_quantity,
                    tradeTime,
                  },
                }
                parentPort.postMessage(JSON.stringify(data_to_return))
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message)
      throw new Error('data not found')
    }
  } catch (error) {
    // ws.send({})
  }
}

parentPort.on('message', async (data) => {
  const { ws, token, products, filters, type } = JSON.parse(data)
  if (type === 'stress') {
    while (true) {
      await tradesController(ws, token, products, filters)
    }
  } else {
    await tradesController(ws, token, products, filters)
  }
})
module.exports = {
  tradesController,
}
