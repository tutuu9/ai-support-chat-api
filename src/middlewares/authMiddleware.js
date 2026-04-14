const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            status: 'error',
            message: 'No token provided' });
    }
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token format' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;