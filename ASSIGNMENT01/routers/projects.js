/* routers/ projects.js */
const express = require('express');
const router = express.Router();

// Route for the Projects page
router.get('/', function(req, res, next) {
    res.render('projects', { title: 'Projects' });
});

module.exports = router;
