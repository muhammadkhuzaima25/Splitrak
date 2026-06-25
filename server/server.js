const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { getDBStatus } = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({ 
    origin: ['http://localhost:5173', 'https://splitrak.vercel.app'], 
    credentials: true 
}));

app.use(express.json());

app.get('/api/health', async (req, res) => {
    const dbConnected = getDBStatus();
    res.json({
        status: 'ok',
        api: 'connected',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api', require('./routes/quotationRoutes'));

let dbReady = false;
const ensureDB = async () => {
    if (!dbReady) {
        dbReady = await connectDB();
    }
};

app.use(async (req, res, next) => {
    await ensureDB();
    next();
});

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    ensureDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = app;
