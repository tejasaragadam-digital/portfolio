import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const dbId = process.env.VITE_APPWRITE_DATABASE_ID;
const envPath = path.resolve(process.cwd(), '.env');

const appendEnv = (key, value) => {
    const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    if (!content.includes(key)) fs.appendFileSync(envPath, `\n${key}=${value}`);
};

const fullPermissions = [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any()),
];

const patch = async () => {
    const { collections } = await databases.listCollections(dbId);
    const existing = collections.find(c => c.name === 'announcements');
    
    if (existing) {
        console.log('✅ announcements collection already exists:', existing.$id);
        appendEnv('VITE_APPWRITE_ANNOUNCEMENTS_COLLECTION_ID', existing.$id);
        return;
    }

    console.log('Creating announcements collection...');
    const col = await databases.createCollection(dbId, ID.unique(), 'announcements', fullPermissions);
    
    const attrs = [
        { key: 'message', size: 500 },
        { key: 'link', size: 500 },
        { key: 'link_text', size: 100 },
        { key: 'expires_at', size: 50 },
        { key: 'bg_color', size: 50 },
    ];
    for (const attr of attrs) {
        await databases.createStringAttribute(dbId, col.$id, attr.key, attr.size, false);
        console.log(`  + attribute: ${attr.key}`);
    }
    appendEnv('VITE_APPWRITE_ANNOUNCEMENTS_COLLECTION_ID', col.$id);
    console.log('🎉 announcements collection created:', col.$id);
};

patch().catch(console.error);
