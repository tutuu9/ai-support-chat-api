const express = require('express');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes')
const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/chats', chatRoutes);

module.exports = app;