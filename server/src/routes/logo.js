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
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'dudes-kitchen/logos',
      public_id: 'logo',
      overwrite: true,
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Logo upload to Cloudinary failed:', err);
    console.error('Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).json({ error: true, details: String(err) });
  }
});

module.exports = router;
