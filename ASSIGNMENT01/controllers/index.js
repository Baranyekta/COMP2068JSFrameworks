/* controllers/ index.js */
const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('home', { title: 'Home' });
});

router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About' });
});

router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Contact' });
});

router.post('/contact', function(req, res, next) {
    // handling form submission n success message in home page
    res.render('home', { title: 'Home', successMessage: 'Your message has been sent successfully!' });
});

router.get('/projects', function(req, res, next) {
    res.render('projects', { title: 'Projects' });
});

router.get('/users', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
