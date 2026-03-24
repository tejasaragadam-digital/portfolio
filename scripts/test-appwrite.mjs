import { Client, Databases, Account, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join('/Users/tejakumar/Desktop/Portfolio', '.env') });

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const account = new Account(client);

const dbId = process.env.VITE_APPWRITE_DATABASE_ID;
const leadsId = process.env.VITE_APPWRITE_LEADS_COLLECTION_ID;

console.log('🔍 Testing Appwrite connection...');
console.log('Endpoint:', process.env.VITE_APPWRITE_ENDPOINT);
console.log('Project:', process.env.VITE_APPWRITE_PROJECT_ID);
console.log('DB ID:', dbId);
console.log('Leads Collection:', leadsId);

// Test 1: List documents (server-side)
try {
    const r = await db.listDocuments(dbId, leadsId, [Query.limit(1)]);
    console.log('\n✅ DB read OK. Leads count:', r.total);
} catch (e) {
    console.error('\n❌ DB read failed:', e.message, '| Code:', e.code, '| Type:', e.type);
}

// Test 2: Leads collection attributes
try {
    const col = await db.getCollection(dbId, leadsId);
    console.log('\n✅ Leads collection attributes:');
    col.attributes.forEach(a => console.log('  -', a.key, a.type, a.required ? '[required]' : ''));
    console.log('\nPermissions:', JSON.stringify(col.$permissions));
} catch (e) {
    console.error('\n❌ Get collection failed:', e.message);
}

// Test 3: Try creating a test lead (server side with API key)
try {
    const doc = await db.createDocument(dbId, leadsId, 'unique()', {
        name: 'Test User', email: 'test@test.com', message: 'Test submission'
    });
    console.log('\n✅ Test lead created successfully! ID:', doc.$id);
    // Clean up
    await db.deleteDocument(dbId, leadsId, doc.$id);
    console.log('🧹 Test lead deleted.');
} catch (e) {
    console.error('\n❌ Create lead failed:', e.message, '| Code:', e.code, '| Type:', e.type);
}
