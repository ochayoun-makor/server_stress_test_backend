const axios = require('axios')
const { calcTradeTime } = require('./singleTrade')

const tradesController = async (ws, reqData) => {
  // let types = 'MKT'
  // let sides = 'BUY'
  // console.log(reqData, 'REQ DATA !')
  try {
    // console.log('HERE 1')
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

    // check if data ...
    // if(reqData && reqData !== undefined && reqData !== null){
    //   types = reqData.filters.types
    //   sides = reqData.filters.side
    // }

    const types = reqData?.filters.type ? reqData.filters.type : 'MKT'
    const sides = reqData?.filters.side ? reqData.filters.side : 'BUY'
    // console.log(types, 'TUPES', sides, 'SIDES')

    if (reqData?.filters.product_id) {
      // bash single proudct
    } else {
      try {
        const productsRes = await axios.get('https://sb20.rest-api.enigma-securities.io/product')

        const { data: products } = productsRes
        for (const product of products.slice(1,3)) {
          const tradeTime = await calcTradeTime(token, types, sides, product.product_id, product.min_quantity)
          console.log(tradeTime ,"TRADE TIME")
        }
  

        // } else {
        //   const types = ['MKT']
        //   const sides = ['BUY']
        // }
      } catch (error) {
        console.log(error.message)
        throw new Error('data not found')
      }
    }
  } catch (error) {
    // ws.send({})
  }
}
tradesController('test')
module.exports = {
  tradesController,
}
