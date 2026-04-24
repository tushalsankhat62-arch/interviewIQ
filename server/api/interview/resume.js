import connectDb from "../../config/connectDb.js"
import isAuth from "../../middlewares/isAuth.js"
import { upload } from "../../middlewares/multer.js"
import { analyzeResume } from "../../controllers/interview.controller.js"

// Connect to database
connectDb().catch(error => {
    console.error("Database connection failed:", error)
})

export default async function handler(req, res) {
    // Set CORS headers - always set for preflight to work
    const allowedOrigins = [
        "http://localhost:5173",
        "https://client-phi-orcin-29.vercel.app",
        process.env.FRONTEND_URL
    ].filter(Boolean);

    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
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
        // Handle file upload
        const multerUpload = upload.single('resume');
        return multerUpload(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            return isAuth(req, res, () => analyzeResume(req, res));
        });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
