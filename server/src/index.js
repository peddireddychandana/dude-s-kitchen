const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { router: authRoutes } = require('./routes/auth');
const foodRoutes = require('./routes/foods');
const categoryRoutes = require('./routes/categories');
const offerRoutes = require('./routes/offers');
const galleryRoutes = require('./routes/gallery');
const uploadRoutes = require('./routes/upload');
const logoRoutes = require('./routes/logo');

const Admin = require('./models/Admin');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.CLIENT_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean);
    if (!origin || allowed.includes(origin) || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/logo', logoRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DUDE\'S KITCHEN server is running' });
});

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const count = await Admin.countDocuments();
    if (count === 0) {
      await new Admin({ email: 'admin@dudeskitchen.com', password: 'admin123' }).save();
      console.log('Created default admin: admin@dudeskitchen.com');
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
