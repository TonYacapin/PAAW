const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path to your model
const bcrypt = require('bcryptjs');

// Create a new user
router.post('/users', async (req, res) => {
    try {
        console.log(req.body)
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
        
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
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
router.put('/users/:id', async (req, res) => {
    try {
        const { firstname, lastname, middlename, email, password, role, isActive } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
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
        res.json(user);
    } catch (error) {
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
