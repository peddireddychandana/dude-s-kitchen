require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Food = require('./models/Food');
const Category = require('./models/Category');

async function removeShawarma() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const catResult = await Category.deleteOne({ name: 'Shawarma' });
    console.log(`Removed ${catResult.deletedCount} Shawarma category`);

    const foodResult = await Food.deleteMany({ category: 'Shawarma' });
    console.log(`Removed ${foodResult.deletedCount} Shawarma food items`);

    await mongoose.disconnect();
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

removeShawarma();
