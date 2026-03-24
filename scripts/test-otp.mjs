import { Client, Databases, Account, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join('/Users/tejakumar/Desktop/Portfolio', '.env') });

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const account = new Account(client);

// Test OTP email token creation
console.log('🔍 Testing OTP email token creation...');
try {
    const token = await account.createEmailToken(ID.unique(), 'tejakumarsaragadam@gmail.com');
    console.log('✅ OTP token created! userId:', token.userId, '| expire:', token.expire);
} catch (e) {
    console.error('❌ OTP failed:', e.message, '| Code:', e.code, '| Type:', e.type);
    console.error('Full error:', JSON.stringify(e, null, 2));
}
