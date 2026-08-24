const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Event = require('../models/Event');
const connectDB = require('../db');

async function checkEvents() {
  await connectDB();
  const events = await Event.find({});
  console.log('Events in database:');
  console.log(`${events.length} events found in database.`);
  process.exit(0);
}

checkEvents();
