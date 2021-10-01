require("dotenv").config()
import log from "./helpers/pino"
import Server from "./server"

new Server()

process.on("uncaughtException", (error: Error) => {
  log.error("Uncaught Exception | " + error.message)
})

process.on("unhandledRejection", (error: Error) => {
  log.error("Unhandled Promise Rejection | " + error)
})

module.exports = Server;