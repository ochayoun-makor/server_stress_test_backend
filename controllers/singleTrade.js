const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

module.exports.calcTradeTime = async function calcTradeTime(token, type, side, product_id, quantity) {
  const timeOut = await exec(`bash controllers/singleTradeScript.sh ${token} ${type} ${side} ${product_id} ${quantity}`)

  return +timeOut.stdout.trim()
}
