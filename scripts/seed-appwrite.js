import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const marketing = [
    { title: "SaaS Launch Campaign", metric: "+300% MRR", desc: "End-to-end go-to-market strategy including SEO, content, and paid social." },
    { title: "Organic Growth Revamp", metric: "2M+ Views", desc: "Technical SEO overhaul and content silos restructure resulting in massive traffic spikes." },
    { title: "B2B Lead Generation", metric: "500+ Leads", desc: "Highly targeted LinkedIn Ads and optimized landing page funnels." }
];

const web = [
    { title: "E-Commerce Platform", category: "React, Node.js, Stripe", link: "#" },
    { title: "3D Product Configurator", category: "Three.js, React Three Fiber", link: "#" },
    { title: "Real-time Dashboard", category: "Vue.js, Firebase, Tailwind", link: "#" }
];

const experience = [
    { role: "Senior Full-Stack Developer", company: "TechNexus Inc.", period: "2024 - Present", description: "Architected modern WebGL interfaces with React Three Fiber, scaling performance by 40% for 2M+ users." },
    { role: "Digital Marketing Lead", company: "Growth Labs", period: "2021 - 2024", description: "Directed SaaS GTM strategies encompassing SEO, paid social funnels, and conversion rate optimization (CRO) scaling MRR by 300%." },
    { role: "Web Developer", company: "Digital Studio Agency", period: "2019 - 2021", description: "Built bespoke responsive websites and e-commerce platforms specializing in clean UI and accessibility." }
];

const dbId = process.env.VITE_APPWRITE_DATABASE_ID;

const seed = async () => {
    try {
        console.log("Seeding Marketing Projects...");
        for (const p of marketing) {
            await databases.createDocument(dbId, process.env.VITE_APPWRITE_MARKETING_PROJECTS_COLLECTION_ID, ID.unique(), p);
        }
        console.log("Seeding Web Projects...");
        for (const p of web) {
            await databases.createDocument(dbId, process.env.VITE_APPWRITE_WEB_PROJECTS_COLLECTION_ID, ID.unique(), p);
        }
        console.log("Seeding Experience...");
        for (const p of experience) {
            await databases.createDocument(dbId, process.env.VITE_APPWRITE_EXPERIENCE_COLLECTION_ID, ID.unique(), p);
        }
        console.log("Successfully seeded your database! Go check your Admin Dashboard.");
    } catch (error) {
        console.error("Seeding failed:", error);
    }
};

seed();
