const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add to cart
const addToCart = async (req, res, next) => {
  try {
    // Get productId and quantity from request body
    const { productId, quantity } = req.body;

    // Get userId from request (assuming user is authenticated and userId is available)
    const userId = req.user._id;

    // Validate productId
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Find or create cart for the user
    let cart = await Cart.findOne({ userId });

    // If cart does not exist, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            quantity: quantity || 1,
          },
        ],
        totalPrice: product.price * (quantity || 1),
      });
    } else {
      // If cart exists, check if product is already in the cart
      const prodIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      // If product is already in the cart, update quantity
      if (prodIndex > -1) {
        cart.products[prodIndex].quantity += quantity || 1;
      } else {
        // If product is not in the cart, add it
        cart.products.push({ productId, quantity: quantity || 1 });
      }

      // Recalculate total price
      cart.totalPrice = await calculateTotalPrice(cart.products);
    }

    // Save the cart
    await cart.save();

    // Return the updated cart
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Helper to calculate total price
async function calculateTotalPrice(products) {
  let total = 0;
  for (const item of products) {
    // Fetch product details to get the price
    const product = await Product.findById(item.productId);

    // If product exists, calculate total
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
}
