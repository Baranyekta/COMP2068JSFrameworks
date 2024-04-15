// app.js
// importing necessary modules
const express = require("express"); // express framework
const mongoose = require("mongoose"); // mongoose for mongoDB
const bodyParser = require("body-parser"); // body-parser for parsing request bodies
const session = require("express-session"); // express-session for session management
const MongoStore = require("connect-mongo"); // connect-mongo for storing sessions in mongoDB
const passport = require("passport"); // passport for authentication
const GitHubStrategy = require("passport-github").Strategy; // Github authentication strategy
const path = require("path"); // path module for working w/ file n directory paths
const taskRoutes = require("./routes/taskRoutes"); // task routes
const User = require("./models/user"); // user model
const Task = require("./models/Task"); // task model
const publicRoutes = require("./routes/publicRoutes"); // public routes
const documentsRoutes = require("./routes/documentsRoutes"); // documents routes
const authRoutes = require("./routes/authRoutes"); // authentication routes

const app = express(); // create an express application

// middleware
app.use(express.static(path.join(__dirname, "public"))); // serve static files from 'public' directory
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json
app.use(
  // set up session middleware
  session({
    secret: "4mRvr4J4", // secret used to sign session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something is stored
    store: MongoStore.create({
      // store sessions in mongoDB
      mongoUrl: "mongodb://localhost/assignmate", // mongoDB connection URI
    }),
  })
);

app.use(passport.initialize()); // initialize passport middleware
app.use(passport.session()); // use passport for session management

// middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (req.session.userId) {
    // if user is logged in
    next(); // continue to the next middleware or route handler
  } else {
    res.redirect("/login"); // redirect to login page if not logged in
  }
}

// define the route handler for adding a new task
app.get("/addTask", requireLogin, (req, res) => {
  res.render("addTask", { title: "Add Task" }); //render the addTask view
});

// setting up view engine n views directory
app.set("view engine", "hbs"); // set view engine to handlebars
app.set("views", path.join(__dirname, "views")); // set views directory

// route for rendering the privacy policy page
app.get("/privacyPolicy", (req, res) => {
  res.render("privacyPolicy", { title: "Privacy Policy" }); // render the privacyPolicy view
});

// passport session setup
passport.serializeUser((user, done) => done(null, user)); // serialize user object
passport.deserializeUser((obj, done) => done(null, obj)); // deserialize user object

app.use("/documents", documentsRoutes); // use documents routes

// route definitions
app.get("/", (req, res) => {
  // root route
  if (req.session.isLoggedIn) {
    // check if user is logged in
    res.redirect("/splash"); // redirect to splash page if logged in
  } else {
    res.render("splash", { title: "Welcome to AssignMate" }); // render splash page if not logged in
  }
});

app.get("/login", (req, res) => {
  // login route
  res.render("login", {
    // render login page
    title: "Login to AssignMate",
    message: req.session.loginMessage, // display login message if exists
    githubIcon: "/images/githublogin.png",
    githubLoginUrl: "/auth/github", // GitHub login URL
  });
});

const hardcodedUsers = [{ email: "testing@gmail.com", password: "hello123" }]; // hardcoded user credentials for testing

app.post("/login", (req, res) => {
  // login post route
  const { email, password } = req.body; // extract email n password from request body
  const user = hardcodedUsers.find(
    // find user with matching credentials
    (user) => user.email === email && user.password === password
  );

  if (user) {
    // if user exists
    req.session.isLoggedIn = true; // set user as logged in
    req.session.userEmail = email; // store user email in session
    res.redirect("/addTask"); // redirect to addTask page
  } else {
    // if user does not exist
    res.render("login", {
      // render login page with error message
      title: "Login",
      errorMessage: "Invalid email or password", // display error message
    });
  }
});

app.get("/splash", (req, res) => {
  // splash route
  if (req.session.isLoggedIn) {
    // check if user is logged in
    res.render("splash", { title: "Welcome to AssignMate" }); // render splash page
  } else {
    res.redirect("/login"); // redirect to login page if not logged in
  }
});

// gitHub authentication
passport.use(
  new GitHubStrategy(
    {
      clientID: "0a417d7aecd788d29d97", // Github client ID
      clientSecret: "896f87568fbddcb4e0aad3652cbe28d026a6f621", // Github client secret
      callbackURL: "http://localhost:5000/", // Github callback URL
    },
    function (accessToken, refreshToken, profile, done) {
      // Github authentication callback
      const userEmail = profile.emails ? profile.emails[0].value : null; // extract user email
      req.session.userEmail = userEmail; // store user email in session
      done(null, profile); // callback with user profile
    }
  )
);

app.get("/auth/github", passport.authenticate("github")); // Github authentication route
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.isLoggedIn = true; // set user as logged in
    req.session.userEmail = req.user.email; // store user email in session
    res.redirect("/addTask"); // redirect to addTask page
  }
);

app.get("/signup", (req, res) => {
  // signup route
  res.render("signup", { title: "Sign Up" }); // render signup page
});

app.post("/signup", async (req, res) => {
  // signup post route
  const { email, password } = req.body; // extract email n password from request body
  try {
    const existingUser = await User.findOne({ email }); // check if user already exists
    if (existingUser) {
      // if user already exists
      return res.render("signup", {
        // render signup page with error message
        title: "Sign Up",
        errorMessage: "User already exists with this email",
      });
    }
    const newUser = new User({ email, password }); // create new user
    await newUser.save(); // save new user to database
    res.redirect("/login"); // redirect to login page after signup
  } catch (error) {
    // error handling
    console.error("Error signing up:", error); // log error
    res.render("signup", {
      // render signup page with error message
      title: "Sign Up",
      errorMessage: "An error occurred while signing up",
    });
  }
});

app.get("/logout", (req, res) => {
  // logout route
  req.session.destroy(); // destroy session
  res.redirect("/login"); // redirect to login page after logout
});

// mongoDB connection
mongoose
  .connect("mongodb://localhost/assignmate", {
    // connecting
    useNewUrlParser: true, // use new url parser
    useUnifiedTopology: true, // use new server discoverer/ monitor engine
    bufferCommands: false, // disable buffering
  })
  .then(() => console.log("Connected to MongoDB")) // log success
  .catch((err) => console.error("Error connecting to MongoDB:", err)); // log connection error

// server
const PORT = process.env.PORT || 5000; // server port
app.listen(PORT, () => {
  // start
  console.log(`Server is running on port ${PORT}`); // log running
});
