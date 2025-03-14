const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketService = require("../src/services/socket.service");
const eventRoutes = require("../src/routes/event.routes");
const tradeRoutes = require("../src/routes/trade.routes");
const authRoutes = require("../src/routes/auth.routes");
const adminRoutes = require("../src/routes/admin.routes");
const { logger } = require("../src/utils/logger");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const cors = require("cors");
app.use(express.json());
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://your-other-frontend.com",
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
const io = socketService.setupSocket(server, {
  cors: corsOptions,
});
// const io = new socketService(server, {
//   cors: corsOptions,
// });
app.use(cors(corsOptions));

const router = express.Router();

router.get("/", (req, res) => {
  res.send("App is running..");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Netlify!" });
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

console.log(process.env.MONGODB_URI);

const tradeController = require("../src/controllers/trade.controller");
const adminController = require("../src/controllers/admin.controller");
const eventController = require("../src/controllers/event.controller");
tradeController.setIo(io); // Add a setter to the controller
adminController.setIo(io); // Add a setter to the controller
eventController.setIo(io); // Add a setter to the controller

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

module.exports.handler = serverless(app);
exports.io = io;
