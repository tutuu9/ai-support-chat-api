const express = require('express');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/chats', chatRoutes);

app.use('/api/messages', messageRoutes)

module.exports = app;