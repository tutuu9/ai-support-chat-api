const express = require('express');
const { register , login} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authMiddleware, (req, res) => {
    res.json({
        status: 'success',
        user: req.user,
    });
});
module.exports = router;