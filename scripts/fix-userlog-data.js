const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection URL - update with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jetplay';

async function fixUserLogData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const userLogsCollection = db.collection('userlogs');
    
    // Find all UserLog documents
    const userLogs = await userLogsCollection.find({}).toArray();
    console.log(`Found ${userLogs.length} UserLog documents`);
    
    let fixedCount = 0;
    
    for (const log of userLogs) {
      let needsUpdate = false;
      const updates = {};
      
      // Check and fix user field
      if (typeof log.user === 'string' && log.user.includes('ObjectId')) {
        // Extract ObjectId from string representation
        const userIdMatch = log.user.match(/'([a-f\d]{24})'/);
        if (userIdMatch) {
          updates.user = new ObjectId(userIdMatch[1]);
          needsUpdate = true;
          console.log(`Fixing user field for log ${log._id}`);
        }
      } else if (typeof log.user === 'string' && log.user.length === 24) {
        // If it's a valid ObjectId string, convert it
        try {
          updates.user = new ObjectId(log.user);
          needsUpdate = true;
          console.log(`Converting user string to ObjectId for log ${log._id}`);
        } catch (e) {
          console.log(`Invalid user ObjectId for log ${log._id}: ${log.user}`);
        }
      }
      
      // Check and fix category field
      if (typeof log.category === 'string' && log.category.includes('ObjectId')) {
        const categoryIdMatch = log.category.match(/'([a-f\d]{24})'/);
        if (categoryIdMatch) {
          updates.category = new ObjectId(categoryIdMatch[1]);
          needsUpdate = true;
          console.log(`Fixing category field for log ${log._id}`);
        }
      } else if (typeof log.category === 'string' && log.category.length === 24) {
        // If it's a valid ObjectId string
        try {
          updates.category = new ObjectId(log.category);
          needsUpdate = true;
          console.log(`Converting category string to ObjectId for log ${log._id}`);
        } catch (e) {
          console.log(`Invalid category ObjectId for log ${log._id}: ${log.category}`);
        }
      }
      
      // Check and fix subCategory field
      if (typeof log.subCategory === 'string' && log.subCategory.includes('ObjectId')) {
        const subCategoryIdMatch = log.subCategory.match(/'([a-f\d]{24})'/);
        if (subCategoryIdMatch) {
          updates.subCategory = new ObjectId(subCategoryIdMatch[1]);
          needsUpdate = true;
          console.log(`Fixing subCategory field for log ${log._id}`);
        }
      } else if (typeof log.subCategory === 'string' && log.subCategory.length === 24) {
        // If it's a valid ObjectId string
        try {
          updates.subCategory = new ObjectId(log.subCategory);
          needsUpdate = true;
          console.log(`Converting subCategory string to ObjectId for log ${log._id}`);
        } catch (e) {
          console.log(`Invalid subCategory ObjectId for log ${log._id}: ${log.subCategory}`);
        }
      }
      
      // Apply updates if needed
      if (needsUpdate) {
        await userLogsCollection.updateOne(
          { _id: log._id },
          { $set: updates }
        );
        fixedCount++;
        console.log(`Fixed log ${log._id}`);
      }
    }
    
    console.log(`\nFixed ${fixedCount} UserLog documents`);
    
    // Verify the fixes
    const verifyLogs = await userLogsCollection.find({}).limit(5).toArray();
    console.log('\nSample documents after fix:');
    verifyLogs.forEach(log => {
      console.log(`Log ${log._id}:`);
      console.log(`  user: ${log.user} (${typeof log.user})`);
      console.log(`  category: ${log.category} (${typeof log.category})`);
      console.log(`  subCategory: ${log.subCategory} (${typeof log.subCategory})`);
    });
    
  } catch (error) {
    console.error('Error fixing UserLog data:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the fix
fixUserLogData().catch(console.error);
