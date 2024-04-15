// /routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const app = express();

// middleware to parse request body
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// function to perform user lookup with a timeout (due to timeout)
const findOneWithTimeout = (email) => {
  return Promise.race([
    User.findOne({ email }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout while waiting for user lookup"));
      }, 20000);
    }),
  ]);
};

// route for sign-up
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    // if the user already exists
    const existingUser = await findOneWithTimeout(email);
    if (existingUser) {
      return res.status(400).send("User already exists with this email");
    }
    // hash the pw
    const hashedPassword = await bcrypt.hash(password, 10);
    // create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    // redirect
    res.redirect("/splash");
  } catch (error) {
    console.error("Error signing up:", error);
    if (error.message === "Timeout while waiting for user lookup") {
      return res
        .status(500)
        .send("Timeout occurred while checking for existing user");
    }
    res.status(500).send("An error occurred while signing up");
  }
});

module.exports = router;
