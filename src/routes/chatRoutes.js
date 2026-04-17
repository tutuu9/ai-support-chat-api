const express = require('express');
const { createChat , updateAISettings , assignedToSupport } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createChat);
router.patch('/:chatId/ai-settings', authMiddleware, updateAISettings);
router.patch('/:chatId/assign-support', authMiddleware, assignedToSupport);

module.exports = router;