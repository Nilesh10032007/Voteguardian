const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });
const { uploadBufferToR2 } = require('./config/r2');

const galleryDir = path.join(__dirname, '../client/public/images/gallery');

async function uploadImages() {
  const files = fs.readdirSync(galleryDir);
  const imageUrls = [];

  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      const filePath = path.join(galleryDir, file);
      console.log(`Uploading ${file}...`);
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const url = await uploadBufferToR2(fileBuffer, 'eventum_gallery');
        imageUrls.push(url);
        console.log(`Uploaded ${file}: ${url}`);
      } catch (err) {
        console.error(`Failed to upload ${file}:`, err);
      }
    }
  }

  console.log('\n--- URLs ---');
  console.log(JSON.stringify(imageUrls, null, 2));
}

uploadImages();
