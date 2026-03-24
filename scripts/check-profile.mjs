import { Client, Databases } from 'node-appwrite';
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
const profileColId = process.env.VITE_APPWRITE_PROFILE_COLLECTION_ID;

async function checkProfile() {
    try {
        console.log(`Checking profile collection: ${profileColId}`);
        const docs = await db.listDocuments(dbId, profileColId);
        console.log(`Found ${docs.total} documents.`);
        if (docs.total > 0) {
            console.log('First document:', JSON.stringify(docs.documents[0], null, 2));
        } else {
            console.log('No profile document found.');
        }
    } catch (e) {
        console.error('Error checking profile:', e.message);
    }
}

checkProfile();
