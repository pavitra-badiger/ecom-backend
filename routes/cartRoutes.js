const express = require("express");

const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCart,
} = require("../controllers/cartController");

const { isAuth } = require("../middlewares/authMiddleWares");

const cartRoutes = express.Router();

cartRoutes.get("/cart", isAuth, getCart);

cartRoutes.post("/cart/add", isAuth, addToCart);

cartRoutes.post("cart", isAuth, updateQuantity);

cartRoutes.delete("/cart/product", isAuth, removeFromCart);

cartRoutes.delete("/cart", isAuth, clearCart);

module.exports = cartRoutes;
