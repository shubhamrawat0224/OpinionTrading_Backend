const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: String, ref: "Event", required: true },
  tradeType: { type: String, enum: ["yes", "no"], required: true },
  amount: { type: Number, required: true },
  odds: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "settled", "cancelled"],
    default: "pending",
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trade", tradeSchema);
