/* routers/ index.js */
const express = require('express');
const router = express.Router();

// Route for the Home page
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Home' });
});

module.exports = router;
