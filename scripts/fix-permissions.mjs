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
        const submissionsId = process.env.VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID || 'form_submissions';
        const repliesId = process.env.VITE_APPWRITE_REPLIES_COLLECTION_ID || 'replies';
        const leadsId = process.env.VITE_APPWRITE_LEADS_COLLECTION_ID;

        console.log(`🔧 Updating ${submissionsId} permissions (Any: Create)...`);
        await db.updateCollection(dbId, submissionsId, 'Form Submissions', [
            Permission.create(Role.any()),
            Permission.read(Role.users()),
            Permission.write(Role.users()),
        ]);

        console.log(`🔧 Updating ${repliesId} permissions (Users: Create)...`);
        await db.updateCollection(dbId, repliesId, 'Replies', [
            Permission.create(Role.users()),
            Permission.read(Role.users()),
            Permission.write(Role.users()),
        ]);

        if (leadsId) {
            console.log(`🔧 Ensuring ${leadsId} allows public CREATE...`);
            await db.updateCollection(dbId, leadsId, 'Leads', [
                Permission.create(Role.any()),
                Permission.read(Role.users()),
                Permission.write(Role.users()),
            ]);
        }

        console.log('\n🎉 All tracking permissions fixed!');
    } catch (e) {
        console.error('❌ Error fixing permissions:', e.message);
    }
}

fixPermissions();
