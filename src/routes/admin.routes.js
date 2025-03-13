const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const tradeController = require("../controllers/trade.controller");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/auth.middleware");

router.get(
  "/trades",
  authenticateToken,
  authorizeRole(["admin"]),
  adminController.getTrades
);
router.put(
  "/trades/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  adminController.updateTradeStatus
);
router.get(
  "/events",
  authenticateToken,
  authorizeRole(["admin"]),
  adminController.getEvents
);
router.get(
  "/odds/:eventId",
  authenticateToken,
  authorizeRole(["admin"]),
  adminController.getOdds
);
router.post(
  "/odds",
  authenticateToken,
  authorizeRole(["admin"]),
  adminController.createOdds
);
router.get(
  "/users",
  authenticateToken,
  authorizeRole(["admin"]),
  adminController.getUsers
);

router.post(
  "/settletrades",
  authenticateToken,
  authorizeRole(["admin"]),
  tradeController.adminSettleTrades
);

module.exports = router;
