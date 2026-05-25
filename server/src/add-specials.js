require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Food = require('./models/Food');
const Category = require('./models/Category');

const specialItems = [
  { name: 'Cheese Loaded Fries', price: 100, veg: false },
  { name: 'Chicken Ball (10 pcs)', price: 100, veg: false },
  { name: 'Choose Your Own Packet', price: 100, veg: false },
  { name: 'Chicken Feast', price: 100, veg: false },
  { name: 'Cheese Chicken Feast', price: 150, veg: false },
];

async function addSpecials() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await Category.findOne({ name: "DUDE'S KITCHEN SPECIAL" });
    if (!existing) {
      const cat = new Category({ name: "DUDE'S KITCHEN SPECIAL" });
      await cat.save();
      console.log('Created category: DUDE\'S KITCHEN SPECIAL');
    } else {
      console.log('Category already exists');
    }

    for (const item of specialItems) {
      const exists = await Food.findOne({ name: item.name });
      if (!exists) {
        const food = new Food({
          name: item.name,
          description: `Delicious ${item.name}`,
          price: item.price,
          image: '',
          category: "DUDE'S KITCHEN SPECIAL",
          veg: item.veg,
          popular: true,
          available: true,
        });
        await food.save();
        console.log(`Added: ${item.name}`);
      } else {
        console.log(`Already exists: ${item.name}`);
      }
    }

    console.log('Done!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

addSpecials();
