const axios = require('axios')
const { calcTradeTime } = require('./singleTrade')

const tradesController = async (ws, filters) => {
  try {
    const login_data = {
      username: 'client_test_2',
      password: 'Test123!',
    }
    // Check the time and insert it to the object
    const res = await axios.put('https://sb20.rest-api.enigma-securities.io/auth', login_data)
    // console.log(tokenTime)
    // console.log(res.data, 'RES DATA')
    const { key: token } = res.data

    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    } else {
      delete axios.defaults.headers.common['Authorization']
    }

    const types = filters?.type ? filters.type : ['MKT', 'FOK', 'RFQ']
    const sides = filters?.side ? filters.side : ['BUY', 'SELL']

    try {
      const productsRes = await axios.get('https://sb20.rest-api.enigma-securities.io/product')
      const { data: products } = productsRes
      if (filters?.product_id) {
        let filteredProduct = products.filter((product) => (product.product_id = filters?.product_id))[0]
        const { product_id, min_quantity } = filteredProduct
        if (typeof types === 'string' && typeof sides === 'string') {
          const tradeTime = await calcTradeTime(token, types, sides, product_id, min_quantity)
          const data_to_return = {
            type: 'trade',
            data: {
              type: types, // EX. -> 'FOK'
              side: sides, // EX. -> 'BUY'
              product_id,
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
                type: types,
                side,
                product_id,
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
                type,
                side: sides,
                product_id,
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
                  type,
                  side,
                  product_id,
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
          const { product_id, min_quantity } = product

          if (typeof types === 'string' && typeof sides === 'string') {
            const tradeTime = await calcTradeTime(token, types, sides, product_id, min_quantity)
            const data_to_return = {
              type: 'trade',
              data: {
                type: types,
                side: sides,
                product_id,
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
                  type: types,
                  side,
                  product_id,
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
                  type,
                  side: sides,
                  product_id,
                  quantity: min_quantity,
                  tradeTime,
                },
              }
              ws.send(JSON.stringify(data_to_return))
            }
          } else {
            for (const type of types) {
              for (const side of sides) {
                console.log(type, side)
                const tradeTime = await calcTradeTime(token, type, side, product_id, min_quantity)
                const data_to_return = {
                  type: 'trade',
                  data: {
                    type,
                    side,
                    product_id,
                    quantity: min_quantity,
                    tradeTime,
                  },
                }
                ws.send(JSON.stringify(data_to_return))
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
module.exports = {
  tradesController,
}
