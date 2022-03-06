const { calcTradeTime } = require('./singleTrade')
const { parentPort } = require('worker_threads')
const { v4: uuidv4 } = require('uuid')
const res = require('express/lib/response')

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

    let productsToTrade = filters?.products ? products.filter((product) => filters.products.includes(product.product_name)) : products

    try {
      for (const product of productsToTrade) {
        const { product_id, min_quantity, product_name } = product
        let quantity = filters?.qty ? +filters.qty : min_quantity

        for (const type of types) {
          for (const side of sides) {
            const tradeResult = await calcTradeTime(token, type, side, product_id, +quantity)

            let status = tradeResult.data.result ? 200 : 400
            const data_to_return = {
              type: 'trade',
              data: {
                type, // EX. -> 'FOK'
                side, // EX. -> 'BUY'
                product_id,
                product_name,
                quantity,
                tradeTime: tradeResult.time,
                status,
                response: tradeResult.data,
                id: uuidv4(),
              },
            }
            parentPort.postMessage(JSON.stringify(data_to_return))
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

const singleTrade = async (token, products, filters) => {
  const types = filters?.types ? filters.types : ['MKT', 'FOK', 'RFQ']
  const sides = filters?.sides ? filters.sides : ['BUY', 'SELL']
  const products_names = filters?.products ? filters.products : products.map((product) => product.product_name)
  const random_type = types[Math.floor(Math.random() * types.length)]
  const random_side = sides[Math.floor(Math.random() * sides.length)]
  const random_product = products_names[Math.floor(Math.random() * products_names.length)]
  const product = products.filter((product) => product.product_name === random_product)[0]
  const quantity = filters?.qty ? +filters.qty : +product.min_quantity

  const tradeResult = await calcTradeTime(token, random_type, random_side, product.product_id, quantity)
  let status = tradeResult.data.result ? 200 : 400

  const data = {
    type: 'trade',
    data: {
      type: random_type, // EX. -> 'FOK'
      side: random_side, // EX. -> 'BUY'
      tradeTime: tradeResult.time,
      status,
      response: tradeResult.data,
      product_id: product.product_id,
      product_name: random_product,
      quantity,
      id: uuidv4(),
    },
  }

  parentPort.postMessage(JSON.stringify(data))
}

parentPort.on('message', async (data) => {
  const { token, products, req } = JSON.parse(data)
  const { filters, mode, power } = req

  if (mode === 'stress') {
    while (power) {
      await singleTrade(token, products, filters)
    }
  } else {
    await tradesController(token, products, filters)
  }
})
module.exports = {
  tradesController,
}
