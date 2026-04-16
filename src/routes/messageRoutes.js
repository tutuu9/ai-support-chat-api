const express = require('express');
const { sendMessage , getMessagesByChat} = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, sendMessage);
router.get('/:chatId/messages', authMiddleware, getMessagesByChat)

module.exports = router;