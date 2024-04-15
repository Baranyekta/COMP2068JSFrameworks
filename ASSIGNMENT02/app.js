// app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const path = require("path");
const taskRoutes = require("./routes/taskRoutes");
const User = require("./models/user");
const Task = require("./models/Task");
const publicRoutes = require("./routes/publicRoutes");
const documentsRoutes = require("./routes/documentsRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "4mRvr4J4",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/assignmate",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Define the route handler for adding a new task
app.get("/addTask", requireLogin, (req, res) => {
  res.render("addTask", { title: "Add Task" });
});

// setting up view engine n views directory
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/privacyPolicy", (req, res) => {
    res.render("privacyPolicy", { title: "Privacy Policy" });
  });
  

// passport session setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use("/documents", documentsRoutes); // Corrected route usage

// route definitions
app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect("/splash");
  } else {
    res.render("splash", { title: "Welcome to AssignMate" });
  }
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login to AssignMate",
    message: req.session.loginMessage,
    githubIcon: "/images/githublogin.png",
    githubLoginUrl: "/auth/github",
  });
});

const hardcodedUsers = [{ email: "testing@gmail.com", password: "hello123" }];

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = hardcodedUsers.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    req.session.isLoggedIn = true;
    req.session.userEmail = email;
    res.redirect("/addTask");
  } else {
    res.render("login", {
      title: "Login",
      errorMessage: "Invalid email or password",
    });
  }
});

app.get("/splash", (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("splash", { title: "Welcome to AssignMate" });
  } else {
    res.redirect("/login");
  }
});

// gitHub authentication
passport.use(
  new GitHubStrategy(
    {
      clientID: "0a417d7aecd788d29d97",
      clientSecret: "896f87568fbddcb4e0aad3652cbe28d026a6f621",
      callbackURL: "http://localhost:5000/",
    },
    function (accessToken, refreshToken, profile, done) {
      const userEmail = profile.emails ? profile.emails[0].value : null;
      req.session.userEmail = userEmail;
      done(null, profile);
    }
  )
);

app.get("/auth/github", passport.authenticate("github"));
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.isLoggedIn = true;
    req.session.userEmail = req.user.email;
    res.redirect("/addTask");
  }
);

app.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up" });
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", {
        title: "Sign Up",
        errorMessage: "User already exists with this email",
      });
    }
    const newUser = new User({ email, password });
    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.error("Error signing up:", error);
    res.render("signup", {
      title: "Sign Up",
      errorMessage: "An error occurred while signing up",
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// MongoDB connection
mongoose
  .connect("mongodb://localhost/assignmate", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false // Disable buffering
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
