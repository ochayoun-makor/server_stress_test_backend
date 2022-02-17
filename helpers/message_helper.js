const {timeRandom} = require("../scripts/random")
//const { get_order_book } = require('../helpers/handle_ob_generator_message')
const handle_message = async (ws, message) => {
  try {
    const data = JSON.parse(message)
    console.log("data",data.type)
    switch (data.type) {
      case 'getData':
        console.log('i am here', data.data)
        timeRandom(ws)
        break
     
      default:
        console.log(data.type)
        throw new Error('Invalid message type')
    }
  } catch (e) {
    console.log(e)
    ws.send(
      JSON.stringify({
        error: true,
        message: e.message,
      })
    )
  }
}

module.exports = {
  handle_message,
}
