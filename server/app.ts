const express = require('express');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const DEFAULT_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://mychat-2ce41.web.app',
];

const getAllowedOrigins = () => process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
    : DEFAULT_ALLOWED_ORIGINS;

const createApp = (allowedOrigins = getAllowedOrigins()) => {
    const app = express();

    app.use((req, res, next) => {
        const origin = req.headers.origin;
        if (origin && allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Vary', 'Origin');
            res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        }
        if (req.method === 'OPTIONS') return res.sendStatus(204);
        next();
    });

    app.use(express.json());
    app.get('/', (_req, res) => res.send('API is running successfully'));
    app.use('/api/user', userRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/message', messageRoutes);
    app.use(notFound);
    app.use(errorHandler);

    return app;
};

module.exports = { createApp, getAllowedOrigins };
