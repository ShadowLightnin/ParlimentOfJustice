const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

admin.initializeApp();
const storage = new Storage();
const db = admin.firestore();

const COLLECTIONS = [
  'skinwalkers',
  'statues',
  'oni',
  'aliens',
  'robots',
  'ghosts',
  'bugs',
  'pirates',
  'villain',
  'samArmory',
  'rangerSquad',
  'members',
  'ships',
  'infantry',
  'villainShips',
  'hero',
  'bigbad',
];

async function cleanupOrphanedImages() {
  console.log('Starting orphaned images cleanup for collections:', COLLECTIONS);
  const bucket = storage.bucket(admin.storage().bucket().name);
  const imageUrlsInFirestore = new Set();

  // Verify collections exist
  const existingCollections = [];
  for (const collection of COLLECTIONS) {
    try {
      const querySnapshot = await db.collection(collection).limit(1).get();
      existingCollections.push(collection);
    } catch (error) {
      console.warn(`Collection ${collection} does not exist or is inaccessible, skipping:`, error.message);
    }
  }
  console.log('Existing collections:', existingCollections);

  // Collect all imageUrls from existing Firestore collections
  for (const collection of existingCollections) {
    try {
      const querySnapshot = await db.collection(collection).get();
      console.log(`Processing collection: ${collection}, found ${querySnapshot.size} documents`);
      querySnapshot.forEach(doc => {
        const imageUrl = doc.data().imageUrl;
        if (imageUrl && imageUrl !== 'placeholder') {
          imageUrlsInFirestore.add(imageUrl);
          console.log(`Found imageUrl in ${collection}/${doc.id}: ${imageUrl}`);
        }
      });
    } catch (error) {
      console.error(`Error querying collection ${collection}:`, error.message);
    }
  }

  console.log(`Total unique imageUrls found in Firestore: ${imageUrlsInFirestore.size}`);

  // Get all files in Storage
  const [files] = await bucket.getFiles();
  console.log(`Found ${files.length} files in Storage`);

  // Check each file in Storage
  let deletedCount = 0;
  let skippedCount = 0;
  for (const file of files) {
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    if (!imageUrlsInFirestore.has(fileUrl)) {
      try {
        await file.delete();
        console.log(`Deleted orphaned file: ${file.name}`);
        deletedCount++;
      } catch (error) {
        if (error.code !== 404) {
          console.error(`Error deleting file ${file.name}:`, error.message);
        }
      }
    } else {
      console.log(`File ${file.name} is referenced, skipping`);
      skippedCount++;
    }
  }

  console.log(`Cleanup completed. Deleted ${deletedCount} orphaned files, skipped ${skippedCount} referenced files.`);
}

cleanupOrphanedImages().then(() => {
  console.log('Cleanup process finished successfully');
}).catch(error => {
  console.error('Cleanup failed:', error.message);
});