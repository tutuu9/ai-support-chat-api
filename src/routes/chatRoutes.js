const express = require('express');
const { createChat , updateAISettings , assignedToSupport , changeChatStatus , requestHuman} = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createChat);
router.patch('/:chatId/ai-settings', authMiddleware, updateAISettings);
router.patch('/:chatId/assign-support', authMiddleware, assignedToSupport);
router.patch('/:chatId/status', authMiddleware, changeChatStatus);
router.patch('/:chatId/request-human', authMiddleware, requestHuman);
module.exports = router;