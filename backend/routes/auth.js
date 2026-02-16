const express = require('express');
const router = express.Router();
const User = require('../models/User');
// In a real app, use bcrypt and jwt. For simplicity/demo, straightforward logic.

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Simple check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, email, password });
        await user.save();

        // Mock token
        res.json({ token: 'mock-jwt-token-' + user._id, user: { id: user._id, username: user.username } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        if (password !== user.password) return res.status(400).json({ msg: 'Invalid Credentials' });

        res.json({ token: 'mock-jwt-token-' + user._id, user: { id: user._id, username: user.username } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
