let interval = null
let isRunning = false
const stressController = async (ws, req) => {
  if (req.power) {
    interval = setInterval(() => {
      if (!isRunning) {
        isRunning = true
        for (let i = 0; i < 9000; i++) {
          console.log('hey')
        }
        isRunning = false
      }
    }, 1000)
  } else {
    console.log('power off')
    clearInterval(interval)
  }
}
module.exports = {
  stressController,
}
