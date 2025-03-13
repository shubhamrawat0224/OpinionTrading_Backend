const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/auth.middleware");

router.get("/", eventController.getEvents);
router.post(
  "/",
  authenticateToken,
  authorizeRole(["admin"]),
  eventController.createEvent
);

module.exports = router;
