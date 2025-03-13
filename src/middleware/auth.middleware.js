const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);
    try {
      const user = await User.findById(decoded.id);
      if (!user) return res.sendStatus(404);
      req.user = user; // Attach the full user object
      next();
    } catch (error) {
      next(error);
    }
  });
}

function authorizeRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
