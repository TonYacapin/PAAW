const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path to your model
const bcrypt = require('bcryptjs');
const AuditLog = require('../models/AuditLog.model');
const authMiddleware = require('../middleware/authMiddleware');

// Function to translate URLs to resource names
const translateResource = (url) => {
    if (url.includes('/api/users')) return 'User Information';
    return 'Unknown Resource';
};

// Function to create an audit log entry
const createAuditLog = async (action, resource, resourceId, user, outcome, description = '', details = {}) => {
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
};

router.post('/users', async (req, res) => {
    try {
        console.log(req.body);
        const { firstname, lastname, middlename, email, password, role } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstname,
            lastname,
            middlename,
            email,
            password: hashedPassword,
            role
        });

        const newUser = await user.save(); // Ensure you're awaiting the save operation

        // Log the successful signup action
        await createAuditLog('Added', translateResource(req.originalUrl), newUser._id, email, 'successful', 'User created successfully.');

        res.status(201).json({ message: 'User created successfully', userId: newUser._id });

    } catch (error) {
        await createAuditLog('Added', translateResource(req.originalUrl), null, req.body.email, 'failed', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Get all users
router.get('/users', authMiddleware, async (req, res) => {
    console.log('this is req user: ' + JSON.stringify(req.user, null, 2));
    try {
        const users = await User.find();

        // Log the successful retrieval of users
        await createAuditLog('Viewed', translateResource(req.originalUrl), req.user.userId, req.user.email, 'successful', 'Retrieved user list.');

        res.json(users);
    } catch (error) {
        // Log the failed attempt to retrieve users
        await createAuditLog('Viewed', translateResource(req.originalUrl), req.user._id, req.user.email, 'failed', error.message);

        res.status(500).json({ message: error.message });
    }
});

// Get a user by ID
router.get('/users/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Log the successful retrieval of user
        await createAuditLog('Viewed', translateResource(req.originalUrl),  req.user.userId, req.user.email, 'successful' , `Retrieved details for user ID: ${user.email}.`);

        res.json(user);
    } catch (error) {
        await createAuditLog('Viewed', translateResource(req.originalUrl), null, req.user.email, 'failed', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Update a user
router.put('/users/:id', authMiddleware, async (req, res) => {
    try {
        const { firstname, lastname, middlename, email, password, role, isActive } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Store the original user information for logging
        const originalUserData = {
            firstname: user.firstname,
            lastname: user.lastname,
            middlename: user.middlename,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        };

        // Update user fields
        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.middlename = middlename || user.middlename;
        user.email = email || user.email;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        user.role = role || user.role;
        user.isActive = isActive !== undefined ? isActive : user.isActive;

        await user.save();

        // Log the successful update action
        await createAuditLog('Updated', translateResource(req.originalUrl), user._id, req.user.email, 'successful', 
            `Updated user: ${JSON.stringify(originalUserData)} to ${JSON.stringify(req.body)}`);

        res.json(user);
    } catch (error) {
        // Log the failed attempt to update user
        await createAuditLog('Updated', translateResource(req.originalUrl), req.params.id, req.user.email, 'failed', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Delete a user
router.delete('/users/:id',authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.remove();

        // Log the successful deletion action
        await createAuditLog('Removed', translateResource(req.originalUrl), user._id, req.user.email, 'successful', 'User deleted successfully.');

        res.json({ message: 'User deleted' });
    } catch (error) {
        // Log the failed attempt to delete user
        await createAuditLog('Removed', translateResource(req.originalUrl), req.params.id, req.user.email, 'failed', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
