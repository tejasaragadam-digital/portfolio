import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const patch = async () => {
    try {
        console.log("Patching Collection...");
        await databases.createStringAttribute(
            process.env.VITE_APPWRITE_DATABASE_ID, 
            process.env.VITE_APPWRITE_PROFILE_COLLECTION_ID, 
            'linkedin', 
            1000, 
            false
        );
        await databases.createStringAttribute(
            process.env.VITE_APPWRITE_DATABASE_ID, 
            process.env.VITE_APPWRITE_PROFILE_COLLECTION_ID, 
            'instagram', 
            1000, 
            false
        );
        console.log("Attributes added!");
    } catch (e) {
        if (e.code === 409) {
            console.log("Attributes already exist securely.");
        } else {
            console.error(e);
        }
    }
};

patch();
