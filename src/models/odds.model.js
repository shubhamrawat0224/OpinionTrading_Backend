const mongoose = require("mongoose");

const oddsSchema = new mongoose.Schema({
  eventId: { type: String, ref: "Event", required: true },
  yesOdds: { type: Number, required: true },
  noOdds: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Odds", oddsSchema);
