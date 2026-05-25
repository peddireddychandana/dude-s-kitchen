const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { router: authRoutes } = require('./routes/auth');
const foodRoutes = require('./routes/foods');
const categoryRoutes = require('./routes/categories');
const offerRoutes = require('./routes/offers');
const galleryRoutes = require('./routes/gallery');
const uploadRoutes = require('./routes/upload');
const logoRoutes = require('./routes/logo');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:3001';

app.use(cors({
  origin: [CLIENT_URL, ADMIN_URL],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
