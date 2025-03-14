const Event = require("../models/event.model");
const apiService = require("../services/api.service");
const { io } = require("../../functions/express-app");

let ioInstance;

function setIo(io) {
  ioInstance = io;
}

async function getEvents(req, res) {
  try {
    let events = await Event.find();
    if (events.length === 0) {
      events = await apiService.fetchMockEvents();
      await Event.insertMany(events);
      events = await Event.find();
    }
    res.json(events);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function createEvent(req, res) {
  try {
    const event = new Event(req.body);
    console.log(event);
    await event.save();
    ioInstance.emit("eventCreated", event);
    res.status(201).json(event);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
}

module.exports = { getEvents, createEvent, setIo };
