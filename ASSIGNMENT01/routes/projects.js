const express = require('express');
const router = express.Router();

// routes for projects
router.get('/', function(req, res, next) {
  res.render('projects', { title: 'Projects' });
});

module.exports = router;
