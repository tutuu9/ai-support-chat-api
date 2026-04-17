const Chat = require('../models/Chat');
const AISettings = require('../models/AISettings');

const createChat = async (req,res) =>{
    try{
        const { title } = req.body || {};
        const userId = req.user._id;
        if(!title){
            return res.status(400).json({
                status: 'error',
                message: 'Title is required'
            });
        };
        if(!title.trim()){
            return res.status(400).json({
                status: 'error',
                message: 'Title is required'
            });
        };

        const chat = await Chat.create({
            title: title,
            user: userId
        });

        return res.status(201).json({
            status: 'success',
            message: 'Chat created successfully',
            chat
        });

    } catch (error){
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
       });
    };
};

const updateAISettings = async (req, res) =>{
    try{
        const { chatId } = req.params || {};
        const { aiEnabled } = req.body || {};
        if(!chatId){
            return res.status(400).json({
                status: 'error',
                message: 'Chat ID is required'
            });
        };

        if(aiEnabled === undefined){
            return res.status(400).json({
                status: 'error',
                message: 'AI Enabled params is required'
            });
        };

        if(typeof aiEnabled !== 'boolean'){
            return res.status(400).json({
                status: 'error',
                message: 'AI Enabled must be a boolean'
            });
        };
        const chat = await Chat.findByIdAndUpdate(chatId, { aiEnabled }, { new: true });
        if(!chat){
            return res.status(404).json({
                status: 'error',
                message: 'Chat not found'
            });
        };

        return res.status(200).json({
            status: 'success',
            message: 'AI setting updated successfully',
            chat
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
       });
    };
};

const assignedToSupport = async (req, res) =>{
    try{
        const { chatId } = req.params || {};
        const { supportId } = req.body || {};
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: "You don't have permission"
            });
        };
        if(!chatId){
            return res.status(400).json({
                status: 'error',
                message: 'Chat ID is required'
            });
        };
        if(!supportId){
            return res.status(400).json({
                status: 'error',
                message: 'Support ID is required'
            });
        };
        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.status(404).json({
                status: 'error',
                message: 'Chat not found'
            });
        };
        const support = await User.findById(supportId);
        if(!support){
            return res.status(404).json({
                status: 'error',
                message: 'Support not found'
            });
        };
        if(support.role !== 'support'){
            return res.status(403).json({
                status: 'error',
                message: 'User is not a support'
            });
        };
        chat.assignedTo = supportId;
        chat.status = 'in_progress';

        await chat.save();
        return res.status(200).json({
            status: 'success',
            message: 'Chat assigned to support successfully',
            chat
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
       });
    };
};
module.exports={
    createChat,
    updateAISettings,
    assignedToSupport
};