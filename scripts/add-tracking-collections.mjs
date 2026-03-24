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

const createCollectionWithAttributes = async (name, id, attributes) => {
    try {
        console.log(`🔧 Creating collection: ${name} (${id})...`);
        await db.createCollection(dbId, id, name);
        console.log(`✅ Collection ${name} created.`);

        for (const attr of attributes) {
            console.log(`  Adding attribute: ${attr.key}...`);
            if (attr.type === 'string') {
                await db.createStringAttribute(dbId, id, attr.key, attr.size || 255, attr.required || false);
            } else if (attr.type === 'email') {
                await db.createEmailAttribute(dbId, id, attr.key, attr.required || false);
            }
        }
        console.log(`✅ Attributes added to ${name}.`);
    } catch (e) {
        if (e.code === 409) {
            console.log(`ℹ️  Collection ${name} already exists.`);
        } else {
            console.error(`❌ Error creating ${name}:`, e.message);
        }
    }
};

const setup = async () => {
    // Collect IDs from .env or use defaults if not present
    const submissionsId = 'form_submissions';
    const repliesId = 'replies';

    console.log('🚀 Setting up new tracking collections...\n');

    await createCollectionWithAttributes('Form Submissions', submissionsId, [
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'email', type: 'email', required: true },
        { key: 'message', type: 'string', size: 5000, required: true }
    ]);

    await createCollectionWithAttributes('Replies', repliesId, [
        { key: 'to', type: 'email', required: true },
        { key: 'reply', type: 'string', size: 5000, required: true }
    ]);

    console.log('\n🎉 Setup complete! Add these to your .env:\n');
    console.log(`VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID=${submissionsId}`);
    console.log(`VITE_APPWRITE_REPLIES_COLLECTION_ID=${repliesId}`);
    console.log('\nWait ~30s for indexing before testing.');
};

setup();
