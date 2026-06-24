const mongoose = require('mongoose')
const dns = require('dns')

dns.setServers(['8.8.8.8', '8.8.4.4'])

let isConnected = false

const connectDB = async () => {
  if (isConnected) return true
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    isConnected = true
    console.log(`MongoDB connected: ${conn.connection.host} | Database: ${conn.connection.name}`)
    return true
  } catch (error) {
    isConnected = false
    console.error(`MongoDB connection error: ${error.message}`)
    return false
  }
}

const getDBStatus = () => isConnected

module.exports = connectDB
module.exports.getDBStatus = getDBStatus
