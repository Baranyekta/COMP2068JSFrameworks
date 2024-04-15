// routes/documentsRoutes.js
const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

// Define route to display list of documents
router.get('/', async (req, res) => {
    try {
        const documents = await Document.find();
        res.render('documents', { documents });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
