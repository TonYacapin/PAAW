const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path to your User model
const AuditLog = require('../models/AuditLog.model'); // Import the AuditLog model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to translate URLs to resource names
const translateResource = (url) => {
    if (url.includes('/login')) return 'User Login';
    return 'Unknown Resource';
};

// Helper function to create an audit log
async function createAuditLog(action, resource, resourceId, user, outcome, description = '', details = {}) {
    try {
        const auditLog = new AuditLog({
            action,
            resource,
            resourceId,
            user,
            outcome,
            description,
            details,
        });
        await auditLog.save();
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
}

// Ensure default admin account exists
async function ensureAdminAccount() {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('defaultAdminPass123', 10); // Use a secure default password
        const defaultAdmin = new User({
            email: 'admin@default.com',
            password: hashedPassword,
            role: 'admin',
            isActive: true,
        });

        await defaultAdmin.save();
        console.log('Default admin account created with email: admin@default.com');
    }
}

// Call ensureAdminAccount on server startup
ensureAdminAccount();

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const details = { requestData: req.body }; // Include the request data

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Log failed login attempt
            await createAuditLog('Login Attempt', translateResource(req.originalUrl), null, email, 'failed', 'Invalid credentials', { ...details });
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Log failed login attempt
            await createAuditLog('Login Attempt', translateResource(req.originalUrl), user._id, email, 'failed', 'Invalid credentials', { ...details });
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            // Log failed login attempt due to inactive account
            await createAuditLog('Login Attempt', translateResource(req.originalUrl), user._id, email, 'failed', 'Account is inactive', { ...details });
            return res.status(403).json({ message: 'Account is inactive' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
        
        // Log successful login
        await createAuditLog('Login Attempt', translateResource(req.originalUrl), user._id, email, 'successful', 'Login successful', { ...details });

        res.json({ token, userRole: user.role, userEmail: user.email });
    } catch (error) {
        // Log unexpected error during login
        await createAuditLog('Login Attempt', translateResource(req.originalUrl), null, req.body.email, 'failed', error.message, { ...details });
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
