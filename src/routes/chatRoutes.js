const express = require('express');
const { createChat , updateAISettings , assignedToSupport , changeChatStatus , requestHuman , getMySupportChats , getAllChatsAdmin} = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createChat);
router.patch('/:chatId/ai-settings', authMiddleware, updateAISettings);
router.patch('/:chatId/assign-support', authMiddleware, assignedToSupport);
router.patch('/:chatId/status', authMiddleware, changeChatStatus);
router.patch('/:chatId/request-human', authMiddleware, requestHuman);
router.get('/support/my', authMiddleware, getMySupportChats);
router.get('/admin/all', authMiddleware, getAllChatsAdmin);

module.exports = router;