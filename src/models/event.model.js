const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventId: { type: String, unique: true, required: true },
  eventName: { type: String, required: true },
  startTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["live", "completed", "upcoming"],
    default: "upcoming",
  },
  result: { type: Object },
});

module.exports = mongoose.model("Event", eventSchema);
