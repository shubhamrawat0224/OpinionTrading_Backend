const Event = require("../models/event.model");
const Trade = require("../models/trade.model");
const User = require("../models/user.model");
const Odds = require("../models/odds.model");
//const { io } = require("../../app");

let ioInstance;

function setIo(io) {
  ioInstance = io;
}

async function getTrades(req, res) {
  try {
    const trades = await Trade.find().populate("userId", "username");
    res.json(trades);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function updateTradeStatus(req, res) {
  try {
    const trade = await Trade.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!trade) {
      return res.status(404).send("Trade not found");
    }
    ioInstance.emit("tradeUpdated", trade); // Use the ioInstance
    res.status(201).json(trade);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getEvents(req, res) {
  try {
    const events = await Event.find();
    console.log(events);
    res.json(events);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getOdds(req, res) {
  try {
    const odds = await Odds.find({ eventId: req.params.eventId });
    res.json(odds);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function createOdds(req, res) {
  try {
    const odds = new Odds(req.body);
    await odds.save();
    io.emit("oddsCreated", odds);
    res.status(201).json(odds);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  getTrades,
  updateTradeStatus,
  getEvents,
  getOdds,
  createOdds,
  getUsers,
  setIo,
};
