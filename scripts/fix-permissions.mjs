import { Client, Databases, Storage, Role, Permission } from 'node-appwrite';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const storage = new Storage(client);
const dbId = process.env.VITE_APPWRITE_DATABASE_ID;
const profileColId = process.env.VITE_APPWRITE_PROFILE_COLLECTION_ID;
const pdfBucketId = process.env.VITE_APPWRITE_PDF_BUCKET_ID;
const generalBucketId = process.env.VITE_APPWRITE_GENERAL_BUCKET_ID;

async function fixPermissions() {
    try {
        console.log('🔧 Updating collection permissions to allow public READ...');
        await db.updateCollection(dbId, profileColId, 'Profile', [
            Permission.read(Role.any()),
            // Keep existing admin permissions
            Permission.write(Role.users()), // Allow any logged in user (admin) to update
        ]);
        console.log('✅ Profile collection is now publicly readable.');

        // Also fix existing documents in the collection
        const docs = await db.listDocuments(dbId, profileColId);
        for (const doc of docs.documents) {
            console.log(`🔧 Updating permissions for document ${doc.$id}...`);
            await db.updateDocument(dbId, profileColId, doc.$id, undefined, [
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]);
        }
        if (pdfBucketId) {
            await storage.updateBucket(pdfBucketId, 'PDFs', [
                Permission.read(Role.any()),
                Permission.write(Role.users()),
            ]);
            console.log('✅ PDF bucket is now publicly readable.');
        }
        if (generalBucketId) {
            await storage.updateBucket(generalBucketId, 'General Assets', [
                Permission.read(Role.any()),
                Permission.write(Role.users()),
            ]);
            console.log('✅ General bucket (avatars) is now publicly readable.');
        }

        console.log('\n🎉 Permissions fixed! Now make sure to upload your resume in the Admin Panel.');
    } catch (e) {
        console.error('❌ Error fixing permissions:', e.message);
    }
}

fixPermissions();
