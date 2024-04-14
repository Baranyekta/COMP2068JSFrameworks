const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const path = require('path');
const taskRoutes = require('./routes/taskRoutes');
const User = require('./models/user');

const app = express();

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: '4mRvr4J4',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// set up view engine n views directory
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// passport session setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// routes
app.get('/', (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect('/splash');
    } else {
        res.render('splash', { title: 'Welcome to AssignMate' });
    }
});

app.get('/login', (req, res) => {
    res.render('login', { 
        title: 'Login to AssignMate', 
        message: req.session.loginMessage,
        githubIcon: '/images/githublogin.png', 
        githubLoginUrl: '/auth/github' 
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const loginSuccessful = false;

    if (loginSuccessful) {
        res.redirect('/splash');
    } else {
        res.render('login', { title: 'Login', errorMessage: 'Invalid email or password' });
    }
});

app.get('/splash', (req, res) => {
    if (req.session.isLoggedIn) {
        res.render('splash', { title: 'Welcome to AssignMate' });
    } else {
        res.redirect('/login');
    }
});

// gitHub authentication
passport.use(new GitHubStrategy({
    clientID: '0a417d7aecd788d29d97',
    clientSecret: '896f87568fbddcb4e0aad3652cbe28d026a6f621',
    callbackURL: "http://localhost:5000/"
  },
  function(accessToken, refreshToken, profile, done) {
    // check if user exists in db
    // if user exists, pass user's email to session n call done(null, user)
    // if user doesn't exist, create a new user n pass user's email to session, then call done(null, newUser)
    const userEmail = profile.emails ? profile.emails[0].value : null; // take user's email from profile
    req.session.userEmail = userEmail; // pass user's email to session
    done(null, profile); // call done w/ user's profile
  }
));

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    if (req.session.userEmail) {
      res.redirect('/splash');
    } else {
      res.send('Welcome!');
    }
  }
);

// add routes for sign-up form n submission
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { title: 'Sign Up', errorMessage: 'User already exists with this email' });
        }
        // create a new user
        const newUser = new User({ email, password });
        await newUser.save();
        // redirect to login page or any other page as needed
        res.redirect('/login');
    } catch (error) {
        console.error('Error signing up:', error);
        res.render('signup', { title: 'Sign Up', errorMessage: 'An error occurred while signing up' });
    }
});

// mongoDB connection
mongoose.connect('mongodb://localhost/assignmate', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

//mongoose.connect('mongodb://localhost/assignmate')






// routes
app.use('/tasks', taskRoutes);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
