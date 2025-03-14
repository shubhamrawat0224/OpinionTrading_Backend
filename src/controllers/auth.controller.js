const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function register(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    res.status(201).send("User created");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function login(req, res) {
  const user = await User.findOne({ username: req.body.username });
  if (user == null) return res.status(400).send("Cannot find user");

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(
        {
          username: user.username,
          role: user.role,
          id: user._id, // Include user ID
        },
        process.env.JWT_SECRET
      );
      res.json({ accessToken: accessToken });
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
}

module.exports = { register, login };
