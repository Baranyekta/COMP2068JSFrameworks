/* routers/ about.js */
const express = require('express');
const router = express.Router();

// Route for the About Me page
router.get('/', function(req, res, next) {
    res.render('about', { title: 'About Me' });
});

module.exports = router;
