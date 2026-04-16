const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { updateSystemPrompt } = require('../controllers/aiSettingsController');

const router = express.Router();

router.patch('/system-prompt', authMiddleware, updateSystemPrompt);

module.exports = router;