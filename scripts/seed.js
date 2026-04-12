const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jetplay';

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();

    // ── 1. Admin User ────────────────────────────────────────────────
    const usersCol = db.collection('users');
    const existingAdmin = await usersCol.findOne({ email: 'admin@jetplay.pro' });

    if (existingAdmin) {
      console.log('Admin user already exists – skipping');
    } else {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await usersCol.insertOne({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@jetplay.pro',
        phone: '+1234567890',
        address: '123 Admin St',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        password: hashedPassword,
        role: 'admin',
        balance: 0,
        spent: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('Admin user created (admin@jetplay.pro / Admin@123)');
    }

    // ── 2. Sample regular user ───────────────────────────────────────
    const existingUser = await usersCol.findOne({ email: 'user@jetplay.pro' });
    let sampleUserId;

    if (existingUser) {
      sampleUserId = existingUser._id;
      console.log('Sample user already exists – skipping');
    } else {
      const hashedPassword = await bcrypt.hash('User@123', 10);
      const result = await usersCol.insertOne({
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@jetplay.pro',
        phone: '+1987654321',
        address: '456 User Ave',
        city: 'Abuja',
        state: 'FCT',
        country: 'Nigeria',
        password: hashedPassword,
        role: 'user',
        balance: 5000,
        spent: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      sampleUserId = result.insertedId;
      console.log('Sample user created (user@jetplay.pro / User@123)');
    }

    // ── 3. Categories ────────────────────────────────────────────────
    const categoriesCol = db.collection('categories');
    const categoryData = [
      { name: 'Facebook', logoUrl: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' },
      { name: 'Instagram', logoUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
      { name: 'Twitter', logoUrl: 'https://cdn-icons-png.flaticon.com/512/733/733579.png' },
      { name: 'TikTok', logoUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' },
      { name: 'Snapchat', logoUrl: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png' },
    ];

    const categoryIds = {};
    for (const cat of categoryData) {
      const existing = await categoriesCol.findOne({ name: cat.name });
      if (existing) {
        categoryIds[cat.name] = existing._id;
        console.log(`Category "${cat.name}" already exists – skipping`);
      } else {
        const result = await categoriesCol.insertOne({
          ...cat,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        categoryIds[cat.name] = result.insertedId;
        console.log(`Category "${cat.name}" created`);
      }
    }

    // ── 4. SubCategories ─────────────────────────────────────────────
    const subCategoriesCol = db.collection('subcategories');
    const subCategoryData = [
      { name: 'Facebook USA Aged', description: 'Aged USA Facebook accounts with full access', price: 1500, category: 'Facebook' },
      { name: 'Facebook UK Fresh', description: 'Fresh UK Facebook accounts', price: 800, category: 'Facebook' },
      { name: 'Instagram USA Verified', description: 'Verified USA Instagram accounts', price: 2500, category: 'Instagram' },
      { name: 'Instagram UK Aged', description: 'Aged UK Instagram accounts', price: 1200, category: 'Instagram' },
      { name: 'Twitter USA Aged', description: 'Aged USA Twitter/X accounts', price: 1000, category: 'Twitter' },
      { name: 'Twitter UK Fresh', description: 'Fresh UK Twitter/X accounts', price: 600, category: 'Twitter' },
      { name: 'TikTok USA Monetized', description: 'Monetized USA TikTok accounts', price: 3000, category: 'TikTok' },
      { name: 'TikTok UK Fresh', description: 'Fresh UK TikTok accounts', price: 500, category: 'TikTok' },
      { name: 'Snapchat USA Aged', description: 'Aged USA Snapchat accounts', price: 900, category: 'Snapchat' },
      { name: 'Snapchat UK Fresh', description: 'Fresh UK Snapchat accounts', price: 400, category: 'Snapchat' },
    ];

    const subCategoryIds = {};
    for (const sub of subCategoryData) {
      const existing = await subCategoriesCol.findOne({ name: sub.name });
      if (existing) {
        subCategoryIds[sub.name] = existing._id;
        console.log(`SubCategory "${sub.name}" already exists – skipping`);
      } else {
        const result = await subCategoriesCol.insertOne({
          name: sub.name,
          description: sub.description,
          price: sub.price,
          logoUrl: '',
          category: categoryIds[sub.category],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        subCategoryIds[sub.name] = result.insertedId;
        console.log(`SubCategory "${sub.name}" created`);
      }
    }

    // ── 5. Logs (products for sale) ──────────────────────────────────
    const logsCol = db.collection('logs');
    const existingLogCount = await logsCol.countDocuments();

    if (existingLogCount > 0) {
      console.log(`${existingLogCount} logs already exist – skipping log seeding`);
    } else {
      const logEntries = [
        { logDetails: 'email:password123 | DOB: 01/15/1990 | Friends: 450 | Created: 2018', price: 1500, category: 'Facebook', subCategory: 'Facebook USA Aged' },
        { logDetails: 'email:pass456 | DOB: 03/22/1995 | Friends: 120 | Created: 2024', price: 800, category: 'Facebook', subCategory: 'Facebook UK Fresh' },
        { logDetails: 'email:pass789 | DOB: 07/10/1988 | Friends: 300 | Created: 2019', price: 1500, category: 'Facebook', subCategory: 'Facebook USA Aged' },
        { logDetails: 'email:insta001 | Followers: 5200 | Verified: Yes | Created: 2020', price: 2500, category: 'Instagram', subCategory: 'Instagram USA Verified' },
        { logDetails: 'email:insta002 | Followers: 1800 | Created: 2021', price: 1200, category: 'Instagram', subCategory: 'Instagram UK Aged' },
        { logDetails: 'email:insta003 | Followers: 8300 | Verified: Yes | Created: 2019', price: 2500, category: 'Instagram', subCategory: 'Instagram USA Verified' },
        { logDetails: 'email:twit001 | Followers: 2100 | Created: 2017', price: 1000, category: 'Twitter', subCategory: 'Twitter USA Aged' },
        { logDetails: 'email:twit002 | Followers: 340 | Created: 2024', price: 600, category: 'Twitter', subCategory: 'Twitter UK Fresh' },
        { logDetails: 'email:tiktok001 | Followers: 15000 | Monetized: Yes', price: 3000, category: 'TikTok', subCategory: 'TikTok USA Monetized' },
        { logDetails: 'email:tiktok002 | Followers: 200 | Created: 2024', price: 500, category: 'TikTok', subCategory: 'TikTok UK Fresh' },
        { logDetails: 'email:snap001 | Score: 85000 | Created: 2019', price: 900, category: 'Snapchat', subCategory: 'Snapchat USA Aged' },
        { logDetails: 'email:snap002 | Score: 5000 | Created: 2024', price: 400, category: 'Snapchat', subCategory: 'Snapchat UK Fresh' },
      ];

      const logDocs = logEntries.map((entry) => ({
        previewLink: '',
        logoUrl: '',
        logDetails: entry.logDetails,
        price: entry.price,
        sold: false,
        category: categoryIds[entry.category].toString(),
        subCategory: (subCategoryIds[entry.subCategory] || '').toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await logsCol.insertMany(logDocs);
      console.log(`${logDocs.length} sample logs created`);
    }

    // ── 6. Sample Transaction ────────────────────────────────────────
    const txCol = db.collection('transactions');
    const existingTxCount = await txCol.countDocuments();

    if (existingTxCount > 0) {
      console.log(`${existingTxCount} transactions already exist – skipping`);
    } else if (sampleUserId) {
      await txCol.insertOne({
        user: sampleUserId.toString(),
        type: 'credit',
        amount: 5000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('Sample credit transaction created');
    }

    console.log('\n✅ Seed complete!');
    console.log('─────────────────────────────────────');
    console.log('Admin  → admin@jetplay.pro / Admin@123');
    console.log('User   → user@jetplay.pro  / User@123');
    console.log(`Categories: ${Object.keys(categoryIds).length}`);
    console.log(`SubCategories: ${Object.keys(subCategoryIds).length}`);
    console.log('─────────────────────────────────────');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

seed().catch(console.error);
