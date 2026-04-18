const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const aiSettingsRoutes = require('./routes/aiSettingsRoutes');

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/chats', chatRoutes);

app.use('/api/messages', messageRoutes)

app.use('/api/ai-settings', aiSettingsRoutes);

module.exports = app;