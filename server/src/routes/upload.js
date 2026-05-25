const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

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
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'dudes-kitchen/uploads',
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload to Cloudinary failed:', err);
    console.error('Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).json({ error: true, details: String(err) });
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
