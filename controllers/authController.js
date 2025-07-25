const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "please provide both email and password",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(404).json({
        message: "email already exists",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedpassword,
    });

    res.status(201).json({
      message: "registration Done",
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "please provide both email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isvalidpassword = await bcrypt.compare(password, user.password);

    if (!isvalidpassword) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.jwt_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, {
      maxAge: 3600000,
      httpOnly: true,
    });

    res.json({
      message: "login done",
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwt");

  res.json({
    message: "Logout successful",
  });
};

module.exports = {
  register,
  login,
  logout,
};
