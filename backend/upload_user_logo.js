const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');
const mongoose = require('mongoose');
const { uploadBufferToR2 } = require('./config/r2');

const imgPath = `C:/Users/Lenovo/.gemini/antigravity/brain/ad6d7b65-34d5-48ab-8c0c-f688cb5a363f/.user_uploaded/media_1789045194440.png`;

async function uploadAndUpdate() {
  try {
    console.log("Reading image from:", imgPath);
    const fileBuffer = fs.readFileSync(imgPath);
    console.log("Uploading to Cloudflare R2...");
    const logoUrl = await uploadBufferToR2(fileBuffer, 'logos', null, 'image/png', 'ju_fitlife_logo.png');
    console.log("Uploaded Logo URL:", logoUrl);

    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const eventId = "6aa2a347ca2132d6da49baa6";

    // Update event 6aa2a347ca2132d6da49baa6 in 'events' collection
    const result = await db.collection('events').updateOne(
      { _id: new mongoose.Types.ObjectId(eventId) },
      {
        $set: {
          organizer: "Ju FitLife",
          organizerLogo: logoUrl
        }
      }
    );
    console.log("Updated event document:", result);

    // Also update any other events or clubs or users if needed
    const allEventsUpdate = await db.collection('events').updateMany(
      { organizer: { $regex: /^ju fit ?life$/i } },
      {
        $set: {
          organizer: "Ju FitLife",
          organizerLogo: logoUrl
        }
      }
    );
    console.log("Updated matching events:", allEventsUpdate);

    const eventSubmissionsUpdate = await db.collection('eventsubmissions').updateMany(
      { organizer: { $regex: /^ju fit ?life$/i } },
      {
        $set: {
          organizer: "Ju FitLife",
          organizerLogo: logoUrl
        }
      }
    );
    console.log("Updated matching event submissions:", eventSubmissionsUpdate);

    const clubsEventsUpdate = await db.collection('clubsevents').updateMany(
      { organizer: { $regex: /^ju fit ?life$/i } },
      {
        $set: {
          organizer: "Ju FitLife",
          organizerLogo: logoUrl
        }
      }
    );
    console.log("Updated matching clubs events:", clubsEventsUpdate);

    // Check if there is a club document for Ju FitLife in 'clubs' collection
    const clubDoc = await db.collection('clubs').findOne({ name: { $regex: /fit/i } });
    if (clubDoc) {
      console.log("Found club doc:", clubDoc._id);
      await db.collection('clubs').updateOne(
        { _id: clubDoc._id },
        {
          $set: {
            name: "Ju FitLife",
            logo: logoUrl
          }
        }
      );
      console.log("Updated club doc logo and name");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error during upload & update:", err);
    process.exit(1);
  }
}

uploadAndUpdate();
