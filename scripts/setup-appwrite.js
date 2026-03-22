import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const { VITE_APPWRITE_PROJECT_ID, APPWRITE_API_KEY, VITE_APPWRITE_ENDPOINT } = process.env;

if (!VITE_APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error("Missing Appwrite Credentials in .env!");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(VITE_APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);
const envPath = path.resolve(process.cwd(), '.env');

const appendEnv = (key, value) => {
    const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    if (!content.includes(key)) {
        fs.appendFileSync(envPath, `\n${key}=${value}`);
    }
};

const setup = async () => {
    console.log("🚀 Initializing Idempotent Appwrite Schema Deployment...");
    const publicRead = [Permission.read(Role.any()), Permission.create(Role.any())];

    try {
        let dbId;
        const dbList = await databases.list();
        const existingDb = dbList.databases.find(d => d.name === 'PortfolioDB');
        
        if (existingDb) {
            dbId = existingDb.$id;
            console.log(`⚡ Attached to existing Database: ${dbId}`);
        } else {
            const db = await databases.create(ID.unique(), 'PortfolioDB');
            dbId = db.$id;
            console.log(`✅ Created Database: ${dbId}`);
        }
        appendEnv('VITE_APPWRITE_DATABASE_ID', dbId);

        const collectionsInfo = [
            { name: 'leads', attrs: [{ key: 'name', type: 'string', size: 255 }, { key: 'email', type: 'string', size: 255 }, { key: 'message', type: 'string', size: 5000 }] },
            { name: 'services', attrs: [{ key: 'title', type: 'string', size: 255 }, { key: 'price', type: 'string', size: 255 }, { key: 'desc', type: 'string', size: 1000 }] },
            { name: 'experience', attrs: [{ key: 'role', type: 'string', size: 255 }, { key: 'company', type: 'string', size: 255 }, { key: 'period', type: 'string', size: 100 }, { key: 'description', type: 'string', size: 5000 }] },
            { name: 'reviews', attrs: [{ key: 'name', type: 'string', size: 255 }, { key: 'role', type: 'string', size: 255 }, { key: 'content', type: 'string', size: 2000 }] },
            { name: 'blogs', attrs: [{ key: 'title', type: 'string', size: 255 }, { key: 'excerpt', type: 'string', size: 1000 }, { key: 'content', type: 'string', size: 10000 }, { key: 'readTime', type: 'string', size: 50 }] },
            { name: 'web_projects', attrs: [{ key: 'title', type: 'string', size: 255 }, { key: 'category', type: 'string', size: 255 }, { key: 'link', type: 'string', size: 500 }, { key: 'imageId', type: 'string', size: 255 }] },
            { name: 'marketing_projects', attrs: [{ key: 'title', type: 'string', size: 255 }, { key: 'metric', type: 'string', size: 255 }, { key: 'desc', type: 'string', size: 1000 }, { key: 'pdf_id', type: 'string', size: 255 }] },
            { name: 'profile', attrs: [{ key: 'avatar_id', type: 'string', size: 255 }, { key: 'name', type: 'string', size: 255 }, { key: 'linkedin', type: 'string', size: 1000 }, { key: 'instagram', type: 'string', size: 1000 }] }
        ];

        const existingColls = await databases.listCollections(dbId);
        
        for (const col of collectionsInfo) {
            const extCol = existingColls.collections.find(c => c.name === col.name);
            let collId;
            if (extCol) {
                collId = extCol.$id;
                console.log(`⚡ Attached to existing collection: ${col.name}`);
            } else {
                const coll = await databases.createCollection(dbId, ID.unique(), col.name, publicRead);
                collId = coll.$id;
                console.log(`✅ Created ${col.name} Collection!`);
                for (const attr of col.attrs) {
                    await databases.createStringAttribute(dbId, collId, attr.key, attr.size, false);
                }
            }
            appendEnv(`VITE_APPWRITE_${col.name.toUpperCase()}_COLLECTION_ID`, collId);
        }

        let bucketId;
        const bucketList = await storage.listBuckets();
        const extBucket = bucketList.buckets.find(b => b.name === 'Portfolio Assets');
        
        if (extBucket) {
            bucketId = extBucket.$id;
            console.log(`⚡ Attached to existing Generic Bucket: ${bucketId}`);
        } else {
            console.log(`Attempting to create generic bucket...`);
            const bucket = await storage.createBucket(ID.unique(), 'Portfolio Assets', [Permission.read(Role.any())], false, false, 50000000, ['jpg', 'png', 'webp', 'svg', 'pdf']);
            bucketId = bucket.$id;
            console.log(`✅ Generic Bucket Created!`);
        }
        
        appendEnv('VITE_APPWRITE_GENERAL_BUCKET_ID', bucketId);
        appendEnv('VITE_APPWRITE_PDF_BUCKET_ID', bucketId); // using same bucket natively

        console.log(`🎉 Success! Infrastructure synchronized idempotently to .env.`);
    } catch (error) {
        if (error.code === 403 && error.type === 'additional_resource_not_allowed') {
             console.log("⚠️ Bucket Limit reached. We will use whatever existing bucket you have fallback.");
        } else {
             console.error("Database schema generation failed:", error);
        }
    }
};

setup();
