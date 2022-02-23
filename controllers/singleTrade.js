const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

module.exports.calcTradeTime = async function calcTradeTime(token, type, side, product_id, quantity) {
  // Exec output contains both stderr and stdout outputs
  const timeOut = await exec(`Bash controllers/singleTradeScript.sh ${token} ${type} ${side} ${product_id} ${quantity}`)
  // if (timeOut.stderr) {
  //   console.log(timeOut.stderr)
  // }
  // const emailOutput = await exec('git config --global user.email');

  console.log(timeOut.stdout)
  return timeOut.stdout.trim()
}
