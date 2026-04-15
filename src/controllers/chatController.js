const Chat = require('../models/Chat');

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

module.exports={
    createChat
};