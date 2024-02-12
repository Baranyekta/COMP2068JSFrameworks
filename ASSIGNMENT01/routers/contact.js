/* routers/ contact.js */
const express = require('express');
const router = express.Router();

// Route for the Contact Me page
router.get('/', function(req, res, next) {
    res.render('contact', { title: 'Contact Me' });
});

module.exports = router;