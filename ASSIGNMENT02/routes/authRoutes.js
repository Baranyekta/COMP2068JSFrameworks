// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // check if pw matches
    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    // authentication successful
    req.session.user = user; // store user in session
    res.status(200).json({ message: 'Sign-in successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
