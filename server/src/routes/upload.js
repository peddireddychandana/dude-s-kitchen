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

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'dudes-kitchen/uploads' },
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

router.get('/', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'dudes-kitchen/uploads/',
      max_results: 100,
    });
    const urls = result.resources.map((r) => r.secure_url);
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
