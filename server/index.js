const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '.env'),
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3226bb8d-dcf5-4e14-b71b-e9e5cab1d50f', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                runId: 'pre-fix',
                hypothesisId: 'H1',
                location: 'server/index.js:MongoConnectSuccess',
                message: 'MongoDB connected',
                data: {},
                timestamp: Date.now(),
            }),
        }).catch(() => {});
        // #endregion
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3226bb8d-dcf5-4e14-b71b-e9e5cab1d50f', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                runId: 'pre-fix',
                hypothesisId: 'H1',
                location: 'server/index.js:MongoConnectError',
                message: 'MongoDB connection error',
                data: { error: String(err?.message || err) },
                timestamp: Date.now(),
            }),
        }).catch(() => {});
        // #endregion
    });

// Routes (will be added later)
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3226bb8d-dcf5-4e14-b71b-e9e5cab1d50f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            runId: 'pre-fix',
            hypothesisId: 'H2',
            location: 'server/index.js:ServerListen',
            message: 'Express server listening',
            data: { port: PORT },
            timestamp: Date.now(),
        }),
    }).catch(() => {});
    // #endregion
});
