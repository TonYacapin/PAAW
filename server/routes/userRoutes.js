const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path to your model
const bcrypt = require('bcryptjs');
const AuditLog = require('../models/AuditLog.model')
const authMiddleware = require('../middleware/authMiddleware');




// Function to create an audit log entry
const createAuditLog = async (action, collectionName, documentId, user, status, message = '') => {
    const auditLog = new AuditLog({
        action,
        collectionName,
        documentId,
        user,
        status,
        message,
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
        await createAuditLog('signup', 'User', newUser._id, email, 'success', 'User created successfully.');

        res.status(201).json({ message: 'User created successfully', userId: newUser._id });

    } catch (error) {
        await createAuditLog('signup', 'User', null, email, 'failure', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Get all users
router.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();

        // Log the successful retrieval of users
        await createAuditLog('get_users', 'User', req.user.userId, req.user.email, 'success', 'Retrieved user list.');

        res.json(users);
    } catch (error) {
        // Log the failed attempt to retrieve users
        await createAuditLog('get_users', 'User', null, req.user.email, 'failure', error.message);

        res.status(500).json({ message: error.message });
    }
});
// Get a user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
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
        await createAuditLog('update_user', 'User', req.user.userId, req.user.email, 'success', 
            `Updated user: ${JSON.stringify(originalUserData)} to ${JSON.stringify(req.body)}`);

        res.json(user);
    } catch (error) {
        // Log the failed attempt to update user
        await createAuditLog('update_user', 'User', req.params.id, req.user.email, 'failure', error.message);
        res.status(400).json({ message: error.message });
    }
});
 
// Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.remove();
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
