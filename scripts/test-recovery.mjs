import { Client, Account } from 'node-appwrite';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const account = new Account(client);

async function testRecovery() {
    const email = 'tejakumarsaragadam@gmail.com';
    const resetUrl = 'https://tejasaragadam.me/reset-password';
    try {
        console.log(`Testing recovery for: ${email}`);
        const response = await account.createRecovery(email, resetUrl);
        console.log('Recovery triggered successfully:', JSON.stringify(response, null, 2));
        console.log('\nIf you still dont see it, check your SPAM folder or Appwrite Console (Auth -> Settings -> SMTP).');
    } catch (e) {
        console.error('Error triggering recovery:', e.message);
        if (e.message.includes('user_not_found')) {
            console.log('TIP: The user does not exist in Appwrite yet. Run scripts/create-admin.mjs first.');
        }
    }
}

testRecovery();
