const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'dudes-kitchen/logos/',
      max_results: 1,
    });
    if (result.resources.length === 0) {
      return res.json({ url: null });
    }
    res.json({ url: result.resources[0].secure_url });
  } catch {
    res.json({ url: null });
  }
});

router.post('/', upload.single('logo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'dudes-kitchen/logos', public_id: 'logo', overwrite: true },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      const stream = Readable.from(req.file.buffer);
      stream.pipe(uploadStream);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
