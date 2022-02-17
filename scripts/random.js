const timeRandom = (ws) => {
  setInterval(() => {
    let trade = {
      time: Math.random(),
      name: `index+${Math.random()}`,
      type: 'trade',
    }
    ws.send(JSON.stringify(trade))
  }, 1000)
}
module.exports = {
  timeRandom,
}
