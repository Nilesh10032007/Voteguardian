const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function checkTargetUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const userId = "69d6ac1faf4bb2156bac9d5c";
    const userDoc = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
    console.log("=== USER DOC ===");
    console.log(JSON.stringify(userDoc, null, 2));

    const eventsWithOrganizer = await db.collection('events').find({
      $or: [
        { organizer: { $regex: /fit/i } },
        { createdBy: new mongoose.Types.ObjectId(userId) }
      ]
    }).toArray();
    console.log("\n=== EVENTS WITH FIT / CREATED BY USER ===");
    console.log(eventsWithOrganizer.map(e => ({ id: e._id, title: e.title, organizer: e.organizer })));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkTargetUser();
