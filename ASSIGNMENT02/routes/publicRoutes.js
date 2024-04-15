// routes/publicRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");

// route to fetch data from collection
router.get("/data", async (req, res) => {
  try {
    // fetch data from the User collection
    const data = await User.find();
    // send response with fetched data
    res.json(data);
  } catch (error) {
    // handle errors
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
