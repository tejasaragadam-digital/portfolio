import { Client, Databases, Query } from 'node-appwrite';
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
const dbId = process.env.VITE_APPWRITE_DATABASE_ID;
const expColId = process.env.VITE_APPWRITE_EXPERIENCE_COLLECTION_ID;
const profileColId = process.env.VITE_APPWRITE_PROFILE_COLLECTION_ID;

console.log('🔧 Adding new fields to collections...\n');

// Add display_order to experiences
try {
    await db.createIntegerAttribute(dbId, expColId, 'display_order', false, 0, 9999, 0);
    console.log('✅ Added display_order to experiences collection');
} catch (e) {
    if (e.code === 409) {
        console.log('ℹ️  display_order already exists in experiences');
    } else {
        console.error('❌ Experience order field error:', e.message);
    }
}

// Add resume_id to profile
try {
    await db.createStringAttribute(dbId, profileColId, 'resume_id', 255, false, null);
    console.log('✅ Added resume_id to profile collection');
} catch (e) {
    if (e.code === 409) {
        console.log('ℹ️  resume_id already exists in profile');
    } else {
        console.error('❌ Profile resume field error:', e.message);
    }
}

// Add is_archived to leads (for archive feature)
const leadsColId = process.env.VITE_APPWRITE_LEADS_COLLECTION_ID;
try {
    await db.createBooleanAttribute(dbId, leadsColId, 'is_archived', false, false);
    console.log('✅ Added is_archived to leads collection');
} catch (e) {
    if (e.code === 409) {
        console.log('ℹ️  is_archived already exists in leads');
    } else {
        console.error('❌ Leads archived field error:', e.message);
    }
}

console.log('\n🎉 Schema update complete! Wait ~30 seconds for Appwrite to index new attributes before using them.\n');
