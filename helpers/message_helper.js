const { tradesController } = require('../controllers/tradesController')
const handle_message = async (ws, message) => {
  try {
    const req = JSON.parse(message)
    switch (req.type) {
      case 'getData':
        tradesController(ws, req.filters)
        break

      default:
        // console.log(req.type)
        throw new Error('Invalid message type')
    }
  } catch (e) {
    // console.log(e)
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

// {
//   type: "getData",
//   filters: {
//     type: 'MKT',
//     side: "BUY",
//     product_id: 2
//   }
// }
