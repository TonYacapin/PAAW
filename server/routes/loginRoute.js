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
    try {
        // Try to find an admin user
        const adminExists = await User.findOne({ role: 'admin' });

        // If no admin user exists, create one
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin', 10); // Use a secure default password
            const defaultAdmin = new User({
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin',
                isActive: true,
                firstname: 'Default', // Add firstname
                lastname: 'Admin'      // Add lastname
            });

            await defaultAdmin.save();
            console.log('Default admin account created with email: admin@gmail.com');
        }
    } catch (error) {
        console.error('Error ensuring admin account:', error);
    }
}

// Call ensureAdminAccount on server startup
ensureAdminAccount();

/// Login route with detailed error handling
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const details = { requestData: req.body }; // Include request data for logging

    try {
        // Check if email is provided
        if (!email) {
            throw new Error("Email is required");
        }

        // Check if password is provided
        if (!password) {
            throw new Error("Password is required");
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Log and send detailed error message
            await createAuditLog('Login Attempt', translateResource(req.originalUrl), null, email, 'failed', 'User not found', { ...details });
            return res.status(400).json({ message: 'User with this email does not exist' });
        }

        // Check password validity
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await createAuditLog('Login Attempt', translateResource(req.originalUrl), user._id, email, 'failed', 'Incorrect password', { ...details });
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Check user active status
        if (!user.isActive) {
            await createAuditLog('Login Attempt', translateResource(req.originalUrl), user._id, email, 'failed', 'Inactive account', { ...details });
            return res.status(403).json({ message: 'Your account is currently inactive. Please contact support.' });
        }

        // Generate and return JWT
        const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
        await createAuditLog('Login Attempt', translateResource(req.originalUrl), user._id, email, 'successful', 'Login successful', { ...details });
        res.json({ token, userRole: user.role, userEmail: user.email });
    } catch (error) {
        // Catch unexpected errors
        console.error('Login error:', error);
        await createAuditLog('Login Attempt', translateResource(req.originalUrl), null, email, 'failed', error.message, { ...details });
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});


module.exports = router;
