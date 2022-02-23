const { calcTradeTime } = require('./singleTrade')
const { parentPort } = require('worker_threads')
const { v4: uuidv4 } = require('uuid')

const tradesController = async (token, products, filters) => {
  try {
    let types = ['MKT', 'FOK', 'RFQ']
    let sides = ['BUY', 'SELL']

    if (filters && Object.entries(filters).length) {
      if (filters.types && filters.types.length) {
        types = filters.types
      }
      if (filters.sides && filters.sides.length) {
        sides = filters.sides
      }
    }

    try {
      if (filters?.products?.length) {
        let filteredProduct = products.filter((product) => filters.products.includes(product.product_name))
        const { product_id, min_quantity, max_quantity, product_name } = filteredProduct

        const separator = (max_quantity - min_quantity) / 5.0
        // creating array of quantities between max and min
        const quantities = [min_quantity, separator + min_quantity, separator * 2 + min_quantity, separator * 3 + min_quantity, max_quantity]
        console.log('trade created :)')
        for (const type of types) {
          for (const side of sides) {
            for (const quantity of quantities) {
              let result = await calcTradeTime(token, type, side, product_id, quantity)
              let tradeTime = result.slice(0, 5)
              const data_to_return = {
                type: 'trade',
                data: {
                  type, // EX. -> 'FOK'
                  side, // EX. -> 'BUY'
                  product_id,
                  product_name,
                  quantity,
                  tradeTime,
                  id: uuidv4(),
                },
              }
              parentPort.postMessage(JSON.stringify(data_to_return))
            }
          }
        }
      } else {
        for (const product of products) {
          const { product_id, min_quantity, max_quantity, product_name } = product
          const separator = +((max_quantity - min_quantity) / 5.0).toFixed(2)
          // creating array of quantities between max and min
          const quantities = [min_quantity, separator + min_quantity, separator * 2 + min_quantity, separator * 3 + min_quantity, max_quantity]
          console.log('trade created :)')

          for (const type of types) {
            for (const side of sides) {
              for (const quantity of quantities) {
                let result = await calcTradeTime(token, type, side, product_id, quantity)
                let tradeTime = result.slice(0, 5)
                const data_to_return = {
                  type: 'trade',
                  data: {
                    type, // EX. -> 'FOK'
                    side, // EX. -> 'BUY'
                    product_id,
                    product_name,
                    quantity,
                    tradeTime,
                    id: uuidv4(),
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
  const { token, products, filters, type } = JSON.parse(data)
  if (type === 'stress') {
    while (true) {
      await tradesController(token, products, filters)
    }
  } else {
    await tradesController(token, products, filters)
  }
})
module.exports = {
  tradesController,
}
