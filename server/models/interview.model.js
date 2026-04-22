import mongoose from "mongoose";


const questionsschema = new mongoose.Schema({
    questions: String,
    difficulty: String,
    timelimit: Number,
    answer: String,
    feedback: String,
    score: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    correctness: { type: Number, default: 0 },
})

const interviewschema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true

    },

    role: {
        type: String,
        required: true,

    },

    experience: {
        type: String,
        required: true,
    },

    mode: {
        type: String,
        enum: ["HR", "Technical"],
        required: true,
    },

    resumetext: {
        type: String
    },

    questions: [questionsschema],

    finalscore: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["incompleted", "completed"],
        default: "incompleted",
    }


}, { timestamps: true })

const interview = mongoose.model("interview",interviewschema)


export default interview