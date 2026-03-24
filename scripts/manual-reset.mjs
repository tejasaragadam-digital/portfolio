import { Client, Users } from 'node-appwrite';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const users = new Users(client);

async function manualReset() {
    const userId = '69bf83bd000f8e635464'; // Your admin user ID
    const newPassword = 'Admin@Portfolio2025!'; // Default password set in previous session
    try {
        console.log(`🔧 Manually resetting password for User ID: ${userId}...`);
        await users.updatePassword(userId, newPassword);
        console.log('✅ Password successfully reset to: ' + newPassword);
        console.log('\nYou can now log in at /login with:');
        console.log('Email: tejakumarsaragadam@gmail.com');
        console.log('Password: ' + newPassword);
    } catch (e) {
        console.error('❌ Error resetting password:', e.message);
    }
}

manualReset();
