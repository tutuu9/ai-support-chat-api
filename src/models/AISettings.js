const mongoose = require('mongoose');

const AISettingsSchema = new mongoose.Schema({
    systemPrompt: {
        type: String,
        required: true,
        trim: true,
        default: 'You are a helpful support assistant',
    },
}, { timestamps: true });

const AISettings = mongoose.model('AISettings', AISettingsSchema);

module.exports = AISettings;