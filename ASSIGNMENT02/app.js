// app.js
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const path = require('path'); // Add path module to handle file paths

const app = express();

// middleware
app.use(express.json());

// serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// connection to MongoDB
mongoose.connect('mongodb://localhost/assignmate', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// routes
app.use('/tasks', taskRoutes);

// set up view engine n views directory
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// defining route handler for root URL
app.get('/', (req, res) => {
    res.render('index', { title: 'AssignMate' }); // Render index.hbs
});

// starting the server (localhost5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
