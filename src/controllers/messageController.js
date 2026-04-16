const Chat = require('../models/Chat');
const Message = require('../models/Message')
const { generateAiReply } = require('../services/aiService');
const AISettings = require('../models/AISettings');

const sendMessage = async (req, res) =>{
    try{
        const { chatId, text } = req.body || {}

        if(!chatId){
            return res.status(400).json({
                status: 'error',
                message: 'Chat ID is required'
            });
        };

        if(!text){
            return res.status(400).json({
                status: 'error',
                message: 'Text is required'
            });
        };
        if(!text.trim()){
            return res.status(400).json({
                status: 'error',
                message: 'Text is required'
            });
        };

        const chat = await Chat.findById(chatId);

        if(!chat){
            return res.status(404).json({
                status: 'error',
                message: 'Chat not found'
            });
        };

        if(chat.user.toString() !== req.user._id.toString() && req.user.role !== 'admin'){
            return res.status(403).json({
                status: 'error',
                message: "You don't have permission"
            });
        };

        const senderType = req.user.role === 'admin' ? 'admin' : 'user';

        const message = await Message.create({
            chat: chatId,
            sender: req.user._id,
            text: text,
            senderType: senderType
        });

        if(chat.aiEnabled){
            const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });
            const aiResponse = await generateAiReply({
                messages,
                systemPrompt: 'You are a helpful support assistant'
            });
            const aiMessage = await Message.create({
                chat: chatId,
                sender: null,
                senderType: 'ai',
                text: aiResponse.reply
            });
            return res.status(201).json({
                status: 'success',
                message: 'Message sent successfully',
                userMessage: message,
                aiMessage
            });
        };

        return res.status(201).json({
            status: 'success',
            message: 'Message sent successfully',
            userMessage: message
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
       });
    };
};

const getMessagesByChat = async (req, res) =>{
    try{
        const chatId = req.params.chatId;
        if(!chatId){
            return res.status(400).json({
                status: 'error',
                message: 'Chat ID is required'
            })
        };
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: "You don't have permission"
            });  
        };
        const chat = await Chat.findById(chatId);

        if(!chat){
            return res.status(404).json({
                status: 'error',
                message: 'Chat not found'
            });
        };
        
        if(chat.user.toString() !== req.user._id.toString() && req.user.role !== 'admin'){
            return res.status(403).json({
                status: 'error',
                message: "You don't have permission"
            });
        };

        const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });
        return res.status(200).json({
            status: 'success',
            messages
        });

    } catch (error){
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        })
    };
};
module.exports={
    sendMessage, getMessagesByChat
};