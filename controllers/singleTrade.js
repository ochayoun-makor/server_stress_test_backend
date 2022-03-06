const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

module.exports.calcTradeTime = async function calcTradeTime(token, type, side, product_id, quantity) {
  const timeOut = await exec(`bash controllers/singleTradeScript.sh ${token} ${type} ${side} ${product_id} ${quantity}`)

  let time = timeOut.stdout.substring(0, timeOut.stdout.indexOf(' '))
  let data = JSON.parse(timeOut.stdout.substring(timeOut.stdout.indexOf(' ') + 1))

  return {
    time: +time.trim(),
    data,
  }
}
