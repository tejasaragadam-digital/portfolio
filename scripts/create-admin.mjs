import { Client, Users, ID, Query } from 'node-appwrite';
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

const ADMIN_EMAIL = 'tejakumarsaragadam@gmail.com';
const TEMP_PASSWORD = 'Admin@Portfolio2025!';
const ADMIN_NAME = 'Teja Admin';

console.log('🔧 Setting up admin account with email/password auth...\n');

try {
    const existing = await users.list([Query.equal('email', ADMIN_EMAIL)]);

    if (existing.total > 0) {
        const userId = existing.users[0].$id;
        console.log(`✅ Admin user found (ID: ${userId}). Updating password...`);
        await users.updatePassword(userId, TEMP_PASSWORD);
        await users.updateName(userId, ADMIN_NAME);
        await users.updateStatus(userId, true); // ensure account is active
        console.log(`✅ Password updated!`);
    } else {
        const user = await users.create(ID.unique(), ADMIN_EMAIL, undefined, TEMP_PASSWORD, ADMIN_NAME);
        console.log(`✅ Admin account created! ID: ${user.$id}`);
    }

    console.log('\n🔑 Your login credentials:');
    console.log(`   Email   : ${ADMIN_EMAIL}`);
    console.log(`   Password: ${TEMP_PASSWORD}`);
    console.log('\n⚠️  Use "Forgot Password" in the login page to set your own password after first login!');
    console.log('📧 A reset link will be sent to your Gmail.\n');
} catch (e) {
    console.error('❌ Error:', e.message);
    if (e.code === 409) {
        console.log('💡 Account exists. Trying to update password directly...');
    }
}
