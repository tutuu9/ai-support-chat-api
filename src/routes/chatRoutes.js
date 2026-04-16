const express = require('express');
const { createChat , updateAISettings } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createChat);
router.patch('/:chatId/ai-settings', authMiddleware, updateAISettings);

module.exports = router;