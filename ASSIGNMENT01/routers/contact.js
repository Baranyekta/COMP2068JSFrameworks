/* routers/ contact.js */
const express = require('express');
const router = express.Router();

// Route for the Contact Me page
router.get('/', function(req, res, next) {
    res.render('contact', { title: 'Contact Me' });
});

// POST route for handling contact form submission
router.post('/', function(req, res, next) {
    // Handle form submission logic here
});

module.exports = router;
