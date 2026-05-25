const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const logosDir = path.join(__dirname, '..', '..', 'uploads', 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, logosDir),
  filename: (req, file, cb) => cb(null, 'logo' + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.get('/', (req, res) => {
  const files = fs.readdirSync(logosDir).filter(f => /\.(png|jpg|jpeg|svg|webp)$/i.test(f));
  if (files.length === 0) {
    return res.json({ url: null });
  }
  res.json({ url: '/uploads/logos/' + files[0] });
});

router.post('/', upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: '/uploads/logos/' + req.file.filename });
});

module.exports = router;
