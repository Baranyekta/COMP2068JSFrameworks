// routes/index.js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('home', { title: 'Home' });
});

module.exports = router;

