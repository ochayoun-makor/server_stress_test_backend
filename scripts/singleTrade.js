const { exec } = require('child_process')
const calcTradeTime = (token, type, side, product_id, quantity) => {
  // console.log(`Bash ./singleTradeScript.sh ${token} ${type} ${side} ${product_id} ${quantity}`)
  let result = exec(`Bash singleTradeScript.sh  ${token} ${type} ${side} ${product_id} ${quantity}`)
  let data = result
  return data
}

module.exports = {
  calcTradeTime,
}
