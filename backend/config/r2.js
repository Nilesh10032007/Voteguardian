const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
const path = require('path');

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
const publicUrl = process.env.CLOUDFLARE_PUBLIC_URL || '';
const bucketName = process.env.CLOUDFLARE_BUCKET_NAME || 'eventum-media';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

// Memory storage for multer so we can compress with sharp before uploading
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Upload a buffer to Cloudflare R2 after optimizing with Sharp
 */
async function uploadBufferToR2(buffer, folder = 'uploads', customFilename = null) {
  try {
    let processedBuffer;
    let extension = 'webp';

    // Optimize image using Sharp
    try {
      processedBuffer = await sharp(buffer)
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (sharpErr) {
      console.warn('Sharp optimization failed, uploading raw buffer:', sharpErr.message);
      processedBuffer = buffer;
      extension = 'jpg';
    }

    const filename = customFilename || `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extension}`;
    const key = `${folder}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: processedBuffer,
      ContentType: `image/${extension}`,
    });

    await r2Client.send(command);
    const cleanPublicUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
    return `${cleanPublicUrl}/${key}`;
  } catch (err) {
    console.error('Cloudflare R2 Upload Error:', err);
    throw err;
  }
}

module.exports = {
  r2Client,
  upload,
  uploadBufferToR2,
  bucketName,
  publicUrl
};
