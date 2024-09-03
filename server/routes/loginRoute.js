const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path to your User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is inactive' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        const userRole = user.role
        res.json({ token, userRole });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
