const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/trade.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.post("/", authenticateToken, tradeController.placeTrade);

module.exports = router;
