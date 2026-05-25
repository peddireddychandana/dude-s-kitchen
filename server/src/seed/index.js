const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Food = require('../models/Food');

const MONGO_URI = process.env.MONGO_URI;

const categoryNames = [
  'Fried Chicken',
  'Burgers',
  'Pizza',
  'Wraps',
  'Hotdogs',
  'Sandwiches',
  'Mojitos',
  'Milkshakes',
  'Quick Bites',
  "DUDE'S KITCHEN SPECIAL",
];

const vegItems = new Set([
  'Veg Burger',
  'Paneer Tikka Burger',
  'Veg Pizza (M)',
  'Veg Pizza (L)',
  'Paneer Pizza (M)',
  'Paneer Pizza (L)',
  'Veg Wrap',
  'Paneer Wrap',
  'Veg Hotdog',
  'Paneer Hotdog',
  'Veg Sandwich',
  'Paneer Sandwich',
  'French Fries',
  'Smilees',
  'Peri Peri Fries',
  'Paneer Popcorn',
  'Mint',
  'Lime & Mint',
  'Masala Lemonade',
  'Strawberry',
  'Blue Ocean',
  'Watermelon',
  'Berry Blast',
  'Vanilla',
  'Butterscotch',
  'KitKat',
  'Oreo',
  'Strawberry',
  'Chocolate',
  'Mango',
  'Black Current',
]);

const foodsData = [
  { name: '2 Leg Pieces', price: 139, category: 'Fried Chicken' },
  { name: '2 Thigh Pieces', price: 149, category: 'Fried Chicken' },
  { name: '6 Chicken Lollipops', price: 139, category: 'Fried Chicken' },
  { name: '10 Chicken Wings', price: 139, category: 'Fried Chicken' },
  { name: 'Chicken Popcorn (Regular)', price: 129, category: 'Fried Chicken' },
  { name: 'Chicken Popcorn (Large)', price: 149, category: 'Fried Chicken' },
  { name: 'French Fries', price: 79, category: 'Quick Bites' },
  { name: 'Smilees', price: 89, category: 'Quick Bites' },
  { name: 'Peri Peri Fries', price: 99, category: 'Quick Bites' },
  { name: 'Paneer Popcorn', price: 169, category: 'Quick Bites' },
  { name: 'Veg Burger', price: 89, category: 'Burgers' },
  { name: 'Paneer Tikka Burger', price: 109, category: 'Burgers' },
  { name: 'Chicken Burger', price: 109, category: 'Burgers' },
  { name: 'Crispy Chicken Burger', price: 149, category: 'Burgers' },
  { name: 'Veg Pizza (M)', price: 169, category: 'Pizza' },
  { name: 'Veg Pizza (L)', price: 219, category: 'Pizza' },
  { name: 'Paneer Pizza (M)', price: 219, category: 'Pizza' },
  { name: 'Paneer Pizza (L)', price: 269, category: 'Pizza' },
  { name: 'Chicken Pizza (M)', price: 219, category: 'Pizza' },
  { name: 'Chicken Pizza (L)', price: 269, category: 'Pizza' },
  { name: 'Chicken Cheese Burst (M)', price: 249, category: 'Pizza' },
  { name: 'Chicken Cheese Burst (L)', price: 319, category: 'Pizza' },
  { name: 'Veg Wrap', price: 89, category: 'Wraps' },
  { name: 'Paneer Wrap', price: 109, category: 'Wraps' },
  { name: 'Chicken Wrap', price: 119, category: 'Wraps' },
  { name: 'Veg Hotdog', price: 89, category: 'Hotdogs' },
  { name: 'Paneer Hotdog', price: 119, category: 'Hotdogs' },
  { name: 'Chicken Hotdog', price: 139, category: 'Hotdogs' },
  { name: 'Veg Sandwich', price: 89, category: 'Sandwiches' },
  { name: 'Paneer Sandwich', price: 109, category: 'Sandwiches' },
  { name: 'Chicken Sandwich', price: 129, category: 'Sandwiches' },
  { name: 'Mint', price: 69, category: 'Mojitos' },
  { name: 'Lime & Mint', price: 69, category: 'Mojitos' },
  { name: 'Masala Lemonade', price: 69, category: 'Mojitos' },
  { name: 'Strawberry', price: 69, category: 'Mojitos' },
  { name: 'Blue Ocean', price: 69, category: 'Mojitos' },
  { name: 'Watermelon', price: 69, category: 'Mojitos' },
  { name: 'Berry Blast', price: 69, category: 'Mojitos' },
  { name: 'Vanilla', price: 89, category: 'Milkshakes' },
  { name: 'Butterscotch', price: 89, category: 'Milkshakes' },
  { name: 'KitKat', price: 99, category: 'Milkshakes' },
  { name: 'Oreo', price: 99, category: 'Milkshakes' },
  { name: 'Strawberry', price: 89, category: 'Milkshakes' },
  { name: 'Chocolate', price: 89, category: 'Milkshakes' },
  { name: 'Mango', price: 89, category: 'Milkshakes' },
  { name: 'Black Current', price: 89, category: 'Milkshakes' },
  { name: 'Cheese Loaded Fries', price: 100, category: "DUDE'S KITCHEN SPECIAL" },
  { name: 'Chicken Ball (10 pcs)', price: 100, category: "DUDE'S KITCHEN SPECIAL" },
  { name: 'Choose Your Own Packet', price: 100, category: "DUDE'S KITCHEN SPECIAL" },
  { name: 'Chicken Feast', price: 100, category: "DUDE'S KITCHEN SPECIAL" },
  { name: 'Cheese Chicken Feast', price: 150, category: "DUDE'S KITCHEN SPECIAL" },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Food.deleteMany({});
    await Category.deleteMany({});
    await Admin.deleteMany({});
    console.log('Dropped existing foods, categories, and admins');

    const admin = new Admin({ email: 'admin@dudeskitchen.com', password: 'admin123' });
    await admin.save();
    console.log('Created admin user: admin@dudeskitchen.com');

    const categories = [];
    for (const name of categoryNames) {
      const category = new Category({ name });
      await category.save();
      categories.push(category);
    }
    console.log(`Created ${categories.length} categories`);

    const foodDocs = [];
    for (const item of foodsData) {
      const food = new Food({
        name: item.name,
        description: `Delicious ${item.name}`,
        price: item.price,
        image: '',
        category: item.category,
        veg: vegItems.has(item.name),
        popular: false,
        available: true,
      });
      await food.save();
      foodDocs.push(food);
    }
    console.log(`Created ${foodDocs.length} food items`);

    console.log('Seed completed successfully!');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
