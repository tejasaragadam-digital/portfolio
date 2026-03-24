import { Client, Databases, Account, ID, Storage, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'PENDING_PROJECT_ID');

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

// Auth Helpers — Password Based
export const loginWithPassword = async (email, password) => {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
};

export const sendPasswordReset = async (email) => {
    const resetUrl = `${window.location.origin}/reset-password`;
    await account.createRecovery(email, resetUrl);
};

export const confirmPasswordReset = async (userId, secret, newPassword) => {
    await account.updateRecovery(userId, secret, newPassword);
};

export const logoutAdmin = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.error("Appwrite logout failed:", error);
    }
};

export const getCurrentUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        throw error;
    }
};

// Generic CRUD Operations
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'PENDING_DATABASE_ID';

export const fetchCollection = async (collectionId) => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, collectionId, [
            Query.orderDesc('$createdAt')
        ]);
        return response.documents;
    } catch (error) {
        console.error(`Error fetching collection ${collectionId}:`, error);
        return [];
    }
};

export const createDoc = async (collectionId, data) => {
    try {
        return await databases.createDocument(DATABASE_ID, collectionId, ID.unique(), data);
    } catch (error) {
        console.error(`Error creating document in ${collectionId}:`, error);
        throw error;
    }
};

export const updateDoc = async (collectionId, documentId, data) => {
    try {
        return await databases.updateDocument(DATABASE_ID, collectionId, documentId, data);
    } catch (error) {
        console.error(`Error updating document ${documentId}:`, error);
        throw error;
    }
};

export const deleteDoc = async (collectionId, documentId) => {
    try {
        await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
    } catch (error) {
        console.error(`Error deleting document ${documentId}:`, error);
        throw error;
    }
};

// Helper function to submit contact form
export const submitContactForm = async (data) => {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'PENDING_DATABASE_ID';
    const collectionId = import.meta.env.VITE_APPWRITE_LEADS_COLLECTION_ID || 'PENDING_LEADS_ID';
    
    try {
        const response = await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            {
                name: data.name,
                email: data.email,
                message: data.message
            }
        );
        return response;
    } catch (error) {
        console.error("Appwrite error submitting form:", error);
        throw error;
    }
};

// Storage Helpers
export const uploadFile = async (bucketId, file) => {
    try {
        return await storage.createFile(bucketId, ID.unique(), file);
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

export const getFileViewUrl = (bucketId, fileId) => {
    if (!bucketId || !fileId) return null;
    return storage.getFileView(bucketId, fileId).href;
};

export const getFileDownloadUrl = (bucketId, fileId) => {
    if (!bucketId || !fileId) return null;
    return storage.getFileDownload(bucketId, fileId).href;
};
