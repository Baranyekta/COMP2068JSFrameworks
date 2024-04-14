// app.js
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
//const session = require('express-session');
const path = require('path'); 
//const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser'); 
const session = require('express-session'); 

const app = express();

// serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// set up view engine n views directory
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// use bodyParser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// set up session middleware
app.use(session({
    secret: '4mRvr4J4',
    resave: false,
    saveUninitialized: false
}));

// define route handler for root url
app.get('/', (req, res) => {
    // check if user is logged in
    if (req.session.isLoggedIn) {
        // if user is logged in, redirect to splash page
        res.redirect('/splash');
    } else {
        // if user is not logged in, render splash page
        res.render('splash', { title: 'Welcome to AssignMate' });
    }
});

// define route handler for login page
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login to AssignMate', message: req.session.loginMessage });
});

// handle login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // check if email n pw are valid (as of rn, assume the login is unsuccessful)
    const loginSuccessful = false;

    if (loginSuccessful) {
        // if login is successful, redirect to splash page
        res.redirect('/splash');
    } else {
        // if login is unsuccessful, render the login page again w/ an error message
        res.render('login', { title: 'Login', errorMessage: 'Invalid email or password' });
    }
});


// define route handler for splash page
app.get('/splash', (req, res) => {
    // check if user is logged in
    if (req.session.isLoggedIn) {
        // if user is logged in, render splash page
        res.render('splash', { title: 'Welcome to AssignMate' });
    } else {
        // if user is not logged in, redirect to login page
        res.redirect('/login');
    }
});

// connection to MongoDB
mongoose.connect('mongodb://localhost/assignmate', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// routes
app.use('/tasks', taskRoutes);

// starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});