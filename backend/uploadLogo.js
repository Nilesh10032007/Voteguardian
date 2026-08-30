require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');
const { uploadBufferToR2 } = require('./config/r2');

const logoPath = path.join(__dirname, '../client/src/logo/light logo .png');

async function run() {
  try {
    const fileBuffer = fs.readFileSync(logoPath);
    const url = await uploadBufferToR2(fileBuffer, 'eventum_assets');
    console.log("UPLOAD_SUCCESS:");
    console.log(url);
  } catch (error) {
    console.error("UPLOAD_ERROR:", error);
  }
}

run();
