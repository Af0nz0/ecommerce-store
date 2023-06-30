const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models");

// Display the registration form
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle the registration form submission
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await db.User.findOne({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      return res.render("register", { error: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await db.User.create({
      username: username,
      password: hashedPassword,
    });

    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.render("register", { error: "Registration failed" });
  }
});

// Display the login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle the login form submission
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await db.User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.render("login", { error: "Invalid username or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.render("login", { error: "Invalid username or password" });
    }

    // Store the user ID in the session
    req.session.userId = user.id;

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.render("login", { error: "Login failed" });
  }
});

// Handle the logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("logout");
});

module.exports = router;
