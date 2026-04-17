const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'in_progress'],
        default: 'open',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    aiEnabled:{
        type: Boolean,
        default: true,  
    },
    needsHuman: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;