const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const { getDBStatus } = require('./config/db')

dotenv.config()

const app = express()

app.use(cors({ origin: ['http://localhost:5173', 'https://splitrak.vercel.app'], credentials: true }))
app.use(express.json())

// Health check
app.get('/api/health', async (req, res) => {
  const dbConnected = getDBStatus()
  res.json({
    status: 'ok',
    api: 'connected',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/vendors', require('./routes/vendorRoutes'))
app.use('/api', require('./routes/quotationRoutes'))

// Connect DB on cold start (Vercel serverless)
let dbReady = false
const ensureDB = async () => {
  if (!dbReady) {
    dbReady = await connectDB()
  }
}

// Wrap every request to ensure DB is connected
app.use(async (req, res, next) => {
  await ensureDB()
  next()
})



// For local dev — listen only when not on Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000
  ensureDB().then(() => {
    app.listen(PORT, () => {
      console.log(`\nServer running on port ${PORT}`)
      console.log(`API:       http://localhost:${PORT}/api`)
      console.log(`Health:    http://localhost:${PORT}/api/health`)
      console.log(`Database:  ${getDBStatus() ? 'Connected' : 'Disconnected'}\n`)
    })
  })
}

// For Vercel serverless — export the app
module.exports = app