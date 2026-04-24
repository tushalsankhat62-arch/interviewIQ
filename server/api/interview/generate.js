import connectDb from "../../config/connectDb.js"

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
        try {
            const { role, experience, mode, resumeText, projects, skills } = req.body;

            // Basic validation
            if (!role || !experience || !mode) {
                return res.status(400).json({ message: "role, experience and mode are required." });
            }

            // For now, return mock questions to test the flow
            const mockQuestions = [
                "Can you tell me about your experience with this technology?",
                "What are your strengths and weaknesses?",
                "Why are you interested in this role?",
                "Describe a challenging project you worked on.",
                "Where do you see yourself in 5 years?"
            ];

            const mockResponse = {
                interviewid: "mock-" + Date.now(),
                creditsleft: 95,
                username: "Test User",
                questions: mockQuestions.map((q, index) => ({
                    questions: q,
                    difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
                    timelimit: [60, 60, 90, 90, 120][index],
                }))
            };

            res.status(200).json(mockResponse);
        } catch (error) {
            console.error('Generate question error:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
        return;
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}