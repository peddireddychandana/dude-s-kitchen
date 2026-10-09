const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Food = require('../models/Food');
const Offer = require('../models/Offer');

const MONGO_URI = process.env.MONGO_URI;
const REMOTE = 'https://dude-s-kitchen-server.onrender.com/api';

async function getJSON(path) {
  const res = await fetch(`${REMOTE}${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.foods)) return data.foods;
  if (data && Array.isArray(data.offers)) return data.offers;
  if (data && Array.isArray(data.categories)) return data.categories;
  return data;
}

function strip(doc) {
  const clone = { ...doc };
  delete clone.__v;
  return clone;
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to local MongoDB:', MONGO_URI);

    const [foods, categories, offers] = await Promise.all([
      getJSON('/foods'),
      getJSON('/categories'),
      getJSON('/offers'),
    ]);

    await Food.deleteMany({});
    await Category.deleteMany({});
    await Offer.deleteMany({});

    if (Array.isArray(categories) && categories.length) {
      await Category.insertMany(categories.map(strip));
      console.log(`Imported ${categories.length} categories`);
    }
    if (Array.isArray(foods) && foods.length) {
      await Food.insertMany(foods.map(strip));
      console.log(`Imported ${foods.length} foods`);
    }
    if (Array.isArray(offers) && offers.length) {
      await Offer.insertMany(offers.map(strip));
      console.log(`Imported ${offers.length} offers`);
    }

    const existingAdmin = await Admin.findOne({ email: 'admin@dudeskitchen.com' });
    if (!existingAdmin) {
      const admin = new Admin({ email: 'admin@dudeskitchen.com', password: 'admin123' });
      await admin.save();
      console.log('Created admin user: admin@dudeskitchen.com');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Remote seed completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
