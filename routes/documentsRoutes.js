// routes/documentsroutes.js
const express = require("express");
const router = express.Router();
const Document = require("../models/document");

// define route to display list of documents
router.get("/", async (req, res) => {
  try {
    // fetch documents from the Document collection
    const documents = await Document.find();
    // render the documents view with fetched documents
    res.render("documents", { documents });
  } catch (error) {
    // handle errors
    console.error("error fetching documents:", error);
    res.status(500).send("internal server error");
  }
});

module.exports = router;
