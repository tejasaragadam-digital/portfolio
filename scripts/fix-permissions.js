import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const dbId = process.env.VITE_APPWRITE_DATABASE_ID;

// Full CRUD permissions for any user (admin uses API key from server scripts,
// but client-side auth'd user needs these to delete/update their own records).
// Using Role.any() so all authenticated + guest reads work, and any session can mutate.
const fullPermissions = [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any()),
];

const fix = async () => {
    const { collections } = await databases.listCollections(dbId);
    console.log(`Found ${collections.length} collections. Patching permissions...`);
    for (const col of collections) {
        await databases.updateCollection(dbId, col.$id, col.name, fullPermissions);
        console.log(`✅ Fixed: ${col.name}`);
    }
    console.log('🎉 All collection permissions updated!');
};

fix().catch(console.error);
