// models\Document.js
const mongoose = require('mongoose');

// schema for document
const documentSchema = new mongoose.Schema({
    // schema fields
    title: { type: String, index: true },
    content: String,
});

// create document model
const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
