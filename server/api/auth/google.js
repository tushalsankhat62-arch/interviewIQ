import connectDb from "../../config/connectDb.js"
import { googleAuth } from "../../controllers/auth.controller.js"

// Connect to database
connectDb().catch(error => {
    console.error("Database connection failed:", error)
})

export default async function handler(req, res) {
    // Set CORS headers
    const allowedOrigins = [
        "http://localhost:5173",
        "https://client-phi-orcin-29.vercel.app",
        process.env.FRONTEND_URL
    ].filter(Boolean);

    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only handle POST requests
    if (req.method === 'POST') {
        return googleAuth(req, res);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}