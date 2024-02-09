// routes/contact.js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('contact', { title: 'Contact' });
});

/* POST for my contact form submission. */
router.post('/', function(req, res, next) {
    // redirect user to home page with a success message
    res.render('home', { title: 'Home', successMessage: 'Your message has been sent successfully!' });
});

module.exports = router;

