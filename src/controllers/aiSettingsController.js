const AISettings = require('../models/AISettings');
const updateSystemPrompt = async (req, res) =>{
    try{
        const { systemPrompt } = req.body || {};
        if(req.user.role !== 'admin'){
            return res.status(403).json({
                status: 'error',
                message: "You don't have permission"
            });
        };
        if(!systemPrompt){
            return res.status(400).json({
                status: 'error',
                message: 'System Prompt is required'
            });
        };
        if(!systemPrompt.trim()){
            return res.status(400).json({
                status: 'error',
                message: 'System Prompt is required'
            });
        };
        const trimmedPrompt = systemPrompt.trim();
        const settings = await AISettings.findOneAndUpdate({}, { systemPrompt: trimmedPrompt }, { new: true, upsert: true });
        return res.status(200).json({
            status: 'success',
            message: 'AI Settings updated successfully',
            data: settings
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
       });
    };
};

module.exports = {
    updateSystemPrompt
};    