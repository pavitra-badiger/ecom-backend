const express = require("express");

const orderRoutes = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/orderController");
const { isAuth } = require("../middlewares/authMiddlewares");

orderRoutes.post("/create-razorpay-order", isAuth, createRazorpayOrder);
orderRoutes.post("/verify-payment", isAuth, verifyPayment);

module.exports = orderRoutes;
