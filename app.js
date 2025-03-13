const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketService = require("./src/services/socket.service");
const eventRoutes = require("./src/routes/event.routes");
const tradeRoutes = require("./src/routes/trade.routes");
const authRoutes = require("./src/routes/auth.routes");
const adminRoutes = require("./src/routes/admin.routes");
const { logger } = require("./src/utils/logger");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketService.setupSocket(server);

app.use(express.json());

const router = express.Router();

router.get("/", (req, res) => {
  res.send("App is running..");
});

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/admin", adminRoutes);
app.use("/", router);
app.use("/trades", tradeRoutes);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    errors: err.errors || undefined,
  });
});

const tradeController = require("./src/controllers/trade.controller");
const adminController = require("./src/controllers/admin.controller");
tradeController.setIo(io); // Add a setter to the controller
adminController.setIo(io); // Add a setter to the controller

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB");
    server.listen(process.env.PORT, () => {
      logger.info(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Could not connect to MongoDB", err);
  });

module.exports = serverless(app);
exports.io = io;
