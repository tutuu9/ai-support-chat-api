const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name?.trim() || !email?.trim() || !password){
            return res.status(400).json({
                status: 'error',
                message: 'Name, email and password are required',
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User already exists',
            });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        user.password = undefined;

        return res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        console.error('REGISTER ERROR:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error',
        });
    }
};

module.exports = {
    register,
};