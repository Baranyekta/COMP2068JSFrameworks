// routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// route to fetch data from collection
router.get('/data', async (req, res) => {
    try {
        const data = await User.find();
        res.json(data); 
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
