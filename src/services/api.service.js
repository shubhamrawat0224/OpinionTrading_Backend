const axios = require("axios");
const { logger } = require("../utils/logger");
require("dotenv").config();

async function fetchMockEvents() {
  try {
    const response = await axios.get(`${process.env.MOCK_API_URL}/event`);
    return response.data;
  } catch (error) {
    logger.error("Error fetching mock events:", error);
    throw error;
  }
}

async function fetchMockOdds(eventId) {
  try {
    const response = await axios.get(
      `${process.env.MOCK_API_URL}/odds/${eventId}`
    );
    return response.data;
  } catch (error) {
    logger.error("Error fetching mock odds:", error);
    throw error;
  }
}

module.exports = { fetchMockEvents, fetchMockOdds };
