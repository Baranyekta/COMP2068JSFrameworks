const express = require('express');
const router = express.Router();

// routes for index page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

// about me page route
router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About Me' });
  });
  
  // projects page route
  router.get('/projects', function(req, res, next) {
    res.render('projects', { title: 'Projects' });
  });
  
  // contact me page route
  router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Contact Me' });
  });
  
  module.exports = router;