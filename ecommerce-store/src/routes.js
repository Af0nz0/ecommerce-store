const express = require("express");
const router = express.Router();
const authController = require("./src/controllers/authController");

// Home route
router.get("/", (req, res) => {
  res.render("home");
});

// Authentication routes
router.use("/", authController);

// Dashboard route (protected)
router.get("/dashboard", (req, res) => {
  // Check if the user is authenticated
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  res.render("dashboard");
});

// Shopping cart route (protected)
router.get("/cart", (req, res) => {
  // Check if the user is authenticated
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  // Retrieve the user's cart items from the database or any other logic

  const cartItems = [
    { name: "Item 1", price: 10 },
    { name: "Item 2", price: 15 },
    { name: "Item 3", price: 20 },
  ];

  // Calculate the total price
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  res.render("cart", { cartItems, total });
});

module.exports = router;
