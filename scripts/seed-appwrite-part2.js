import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const dbId = process.env.VITE_APPWRITE_DATABASE_ID;

const blogs = [
    { title: "The Future of React and 3D Web", readTime: "5 min read", excerpt: "Exploring the bleeding edge of WebGL integration with React Three Fiber.", content: "# The Future of React\n\nWebGL is amazing." },
    { title: "SEO Optimization Secrets", readTime: "8 min read", excerpt: "A robust guide on core web vitals and semantic structure mapping.", content: "# SEO Guide\n\nCore web vitals matter." },
    { title: "Why Framer Motion is the Best Animation Library", readTime: "4 min read", excerpt: "A deep dive into declarative spring physics for modern interfaces.", content: "# Framer Motion\n\nSprings are awesome." },
];

const reviews = [
    { name: "Alex R.", role: "SaaS Rocket", content: "Teja completely transformed our online presence. Not only is the web app incredibly fast and 3D-enabled, but the organic traffic shot up by 200%. True double threat." },
    { name: "Samantha L.", role: "E-Commerce Plus", content: "Finding a developer who actually understands conversion rates is rare. Teja built our storefront and scaled our paid ads seamlessly. Highly recommend!" },
    { name: "Michael J.", role: "Future Tech Inc.", content: "The 3D configurator built for our main product line increased engagement time by 4x. Brilliant engineering and flawless execution." }
];

const services = [
    { title: "Technical SEO Audit", price: "$1,500", desc: "A comprehensive deep-dive into your application's Core Web Vitals, semantic structuring, and indexation bottlenecks." },
    { title: "Full-Stack MVP Build", price: "Custom", desc: "From zero to production. I will architect, design, and deploy a blazing fast React/Node.js MVP designed to scale." },
    { title: "Fractional CMO / CTO", price: "$4,000/mo", desc: "Continuous elite-level technical and strategic guidance for growing startups requiring bleeding-edge expertise without massive headcount." }
];

const seedPart2 = async () => {
    try {
        console.log("Seeding Blogs...");
        for (const p of blogs) await databases.createDocument(dbId, process.env.VITE_APPWRITE_BLOGS_COLLECTION_ID, ID.unique(), p);
        
        console.log("Seeding Reviews...");
        for (const p of reviews) await databases.createDocument(dbId, process.env.VITE_APPWRITE_REVIEWS_COLLECTION_ID, ID.unique(), p);
        
        console.log("Seeding Services...");
        for (const p of services) await databases.createDocument(dbId, process.env.VITE_APPWRITE_SERVICES_COLLECTION_ID, ID.unique(), p);
        
        console.log("Secondary Seeding Complete!");
    } catch (error) {
        console.error("Seeding failed:", error);
    }
};

seedPart2();
