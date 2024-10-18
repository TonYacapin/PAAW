const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path to your User model
const AuditLog = require('../models/AuditLog.model'); // Import the AuditLog model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to create an audit log
async function createAuditLog(action, collectionName, documentId, user, status, message = '') {
    try {
        const auditLog = new AuditLog({
            action,
            collectionName,
            documentId,
            user,
            status,
            message,
        });
        await auditLog.save();
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
}

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Log failed login attempt
            await createAuditLog('login', 'User', null, email, 'failure', 'Invalid credentials');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Log failed login attempt
            await createAuditLog('login', 'User', user._id, email, 'failure', 'Invalid credentials');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            // Log failed login attempt due to inactive account
            await createAuditLog('login', 'User', user._id, email, 'failure', 'Account is inactive');
            return res.status(403).json({ message: 'Account is inactive' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
        const userRole = user.role;
        const userEmail = user.email;

        // Log successful login
        await createAuditLog('login', 'User', user._id, email, 'success', 'Login successful');

        res.json({ token, userRole, userEmail });
    } catch (error) {
        // Log unexpected error during login
        await createAuditLog('login', 'User', null, req.body.email, 'failure', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
