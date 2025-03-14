const Trade = require("../models/trade.model");
const User = require("../models/user.model");
const Odds = require("../models/odds.model");
// const { io } = require("../../app");

let ioInstance;

function setIo(io) {
  ioInstance = io;
}

async function placeTrade(req, res) {
  try {
    const user = await User.findById(req.user.id);
    const odds = await Odds.findOne({ eventId: req.body.eventId }).sort({
      timestamp: -1,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }
    if (!odds) {
      return res.status(404).send("Odds not found");
    }

    const currentOdds =
      req.body.tradeType === "yes" ? odds.yesOdds : odds.noOdds;

    if (user.balance < req.body.amount) {
      return res.status(400).send("Insufficient balance");
    }

    const trade = new Trade({
      ...req.body,
      userId: user._id,
      odds: currentOdds,
    });
    await trade.save();

    user.balance -= req.body.amount;
    await user.save();

    ioInstance.emit("tradePlaced", trade); // Use the ioInstance
    res.status(201).json(trade);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

//Function to settle trades.
async function settleTrades(eventId, result) {
  try {
    const trades = await Trade.find({ eventId: eventId, status: "pending" });
    for (let trade of trades) {
      let win = false;
      if (trade.tradeType === "yes" && result.winner === "yes") {
        win = true;
      } else if (trade.tradeType === "no" && result.winner === "no") {
        win = true;
      }
      if (win) {
        const user = await User.findById(trade.userId);
        if (user) {
          user.balance += trade.amount * trade.odds;
          await user.save();
          trade.status = "settled";
          await trade.save();
          ioInstance.emit("tradeSettled", trade);
        }
      } else {
        trade.status = "settled";
        await trade.save();
        ioInstance.emit("tradeSettled", trade);
      }
    }
  } catch (error) {
    console.error("Error settling trades:", error);
  }
}

async function adminSettleTrades(req, res) {
  try {
    await settleTrades(req.body.eventId, req.body.result);
    res.status(200).send("Trades Settled");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = { placeTrade, settleTrades, adminSettleTrades, setIo };
