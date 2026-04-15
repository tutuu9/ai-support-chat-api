const express = require('express');
const { create } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/',authMiddleware, create);

module.exports = router;