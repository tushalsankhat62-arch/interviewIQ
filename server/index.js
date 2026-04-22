import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import interviewRouter from "./routes/interview.routes.js"

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    "https://client-phi-orcin-29.vercel.app",
    process.env.FRONTEND_URL
].filter(Boolean);

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
}

app.use(cors(corsOptions))



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use("/public", express.static("public"))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)


const port = process.env.PORT || 6000

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
    connectDb()
})
