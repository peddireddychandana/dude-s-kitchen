const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const compression = require('compression');
const { Server } = require('socket.io');
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
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      const allowed = [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.CLIENT_URL,
        process.env.ADMIN_URL,
      ].filter(Boolean);
      callback(null, true);
    },
    credentials: true,
  },
  maxHttpBufferSize: 1e6,
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(compression({ level: 6, threshold: 1024 }));
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.CLIENT_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean);
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  maxAge: '30d',
  immutable: true,
  etag: true,
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  next();
}, express.static(path.join(__dirname, '..', 'uploads'), { maxAge: '30d' }));

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

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const count = await Admin.countDocuments();
    if (count === 0) {
      await new Admin({ email: 'admin@dudeskitchen.com', password: 'admin123' }).save();
      console.log('Created default admin: admin@dudeskitchen.com');
    }
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
