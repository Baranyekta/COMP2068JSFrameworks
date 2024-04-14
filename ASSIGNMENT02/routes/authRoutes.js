// routes/authRoutes.js
const User = require('../models/user');

// ex route for sign-up
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        // if the user already exists...
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { title: 'Sign Up', errorMessage: 'User already exists with this email' });
        }
        // create a new user
        const newUser = new User({ email, password });
        await newUser.save();
        // redirect
        res.redirect('/login');
    } catch (error) {
        console.error('Error signing up:', error);
        res.render('signup', { title: 'Sign Up', errorMessage: 'An error occurred while signing up' });
    }
});