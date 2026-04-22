import fs from "fs"
import { createRequire } from "module";
import { askAI } from "../services/openRouter.services.js";
import User from "../models/user.model.js"
import Interview from "../models/interview.model.js";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");


export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "resume required" });
        }

        const filepath = req.file.path

        const filebuffer = await fs.promises.readFile(filepath)

        const parser = new PDFParse({ data: filebuffer });
        const pdfData = await parser.getText();
        let resumeText = pdfData.text;

        if (!resumeText || resumeText.trim().length === 0) {
            fs.unlinkSync(filepath)
            return res.status(400).json({ message: "Could not extract text from PDF. Please ensure your resume is a valid PDF file." });
        }

        resumeText = resumeText
            .replace(/\s+/g, " ")
            .trim();

        const messages = [
            {
                role: "system",
                content: `
                Extract structured data from resume.

               Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`
            },
            {
                role: "user",
                content: resumeText
            }
        ];


        const airesponse = await askAI(messages)

        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = airesponse;
        const jsonMatch = airesponse.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        }

        let parsed;
        try {
            parsed = JSON.parse(jsonStr);
        } catch (parseError) {
            fs.unlinkSync(filepath)
            console.error("JSON parse error:", parseError.message);
            console.error("AI response was:", airesponse);
            return res.status(500).json({ 
                message: "Failed to parse resume data. Please try uploading a different resume file." 
            });
        }

        fs.unlinkSync(filepath)

        res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText
        });




    } catch (error) {
        console.error("Resume analysis error:", error.message);
        console.error("Error details:", error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ message: error.message, details: error.toString() });
    }
};

export const generatequestion = async (req, res) => {
    try {
        let { role, experience, mode, resumeText, projects, skills } = req.body

        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();

        if (!role || !experience || !mode) {
            return res.status(400).json({ message: "role,experience and mode are required." })
        }

        const user = await User.findById(req.UserId)

        if (!user) {
            return res.status(404).json({
                message: "user not found."
            });
        }

        if (user.credits < 50) {
            return res.status(400).json({
                message: "not enough credits. minimum 50 required"
            });
        }

        const projectText = Array.isArray(projects) && projects.length ? projects.join(",") : "none";

        const skillsText = Array.isArray(skills) && skills.length ? skills.join(",") : "none";

        const saferesume = resumeText?.trim() || "none";

        const userprompt = `
        Role:${role}
        Experience:${experience}
        Interviewmode:${mode}
        Projects:${projectText}
        Skills:${skillsText}
        Resume:${saferesume}
        `;

        if (!userprompt.trim()) {
            return res.status(404).json({
                message: "prompt content is empty."
            });
        }
        const messages = [

            {
                role: "system",
                content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard  

Make questions based on the candidates role, experience,interviewMode, projects, skills, and resume details.
`
            }
            ,
            {
                role: "user",
                content: userprompt
            }
        ];

        const airesponse = await askAI(messages)

        if (!airesponse || !airesponse.trim()) {
            return res.status(500).json({
                messages: "ai returned empty response."
            });
        }

        const questionArray = airesponse
            .split("\n")
            .map(q => q.trim())
            .filter(q => q.length > 0)
            .slice(0, 5);

        if (questionArray.length === 0) {
            return res.status(500).json({
                messages: "ai failed to generate questions."
            });
        }

        user.credits -= 50;
        await user.save();

        const interview = await Interview.create({
            userid: user._id,
            role,
            experience,
            mode,
            resumetext: saferesume,
            questions: questionArray.map((q, index) => ({
                questions: q,
                difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
                timelimit: [60, 60, 90, 90, 120][index],
            }))
        })

        res.json({
            interviewid: interview._id,
            creditsleft: user.credits,
            username: user.name,
            questions: interview.questions
        });





    } catch (error) {
        return res.status(500).json({ message: `failed to create interview. ${error}` })
    }

}

export const submitAnswer = async (req, res) => {
    try {
        const { interviewid, questionindex, answer, timetaken } = req.body

        const interview = await Interview.findById(interviewid)
        const question = interview.questions[questionindex]

        // if no answer

        if (!answer) {
            question.score = 0;
            question.feedback = "you did not submit an answer.";
            question.answer = "";

            await interview.save();

            return res.json({
                feedback: question.feedback
            });
        }

        // if time exceeded
        if (timetaken > question.timelimit) {
            question.score = 0;
            question.feedback = "time limit exceeded. answer not evaluated.";
            question.answer = answer;

            await interview.save();

            return res.json({
                feedback: question.feedback
            });
        }


        const messages = [
            {
                role: "system",
                content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence - Does the answer sound clear, confident, and well-presented?
2. Communication - Is the language simple, clear, and easy to understand?
3. Correctness - Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
`
            }
            ,
            {
                role: "user",
                content: `
                            Question: ${question.question}
                            Answer: ${answer}
                        `
            }
        ];


        const airesponse = await askAI(messages)

        let parsed;
        try {
            const jsonMatch = airesponse.match(/```(?:json)?\s*([\s\S]*?)```/);
            const jsonStr = jsonMatch ? jsonMatch[1] : airesponse;
            parsed = JSON.parse(jsonStr);
        } catch (parseError) {
            question.answer = answer;
            question.score = 5;
            question.feedback = "Good attempt. Consider providing more detailed answers.";
            await interview.save();
            return res.status(200).json({ feedback: question.feedback });
        }

        question.answer = answer;
        question.confidence = parsed.confidence;
        question.communication = parsed.communication;
        question.correctness = parsed.correctness;
        question.score = parsed.finalScore;
        question.feedback = parsed.feedback;

        await interview.save();

        return res.status(200).json({ feedback: parsed.feedback })



    } catch (error) {
        return res.status(500).json({ message: `Error occurred while submitting answer. ${error}` })
    }
}


export const finishInterview = async (req, res) => {
    try {
        const { interviewid } = req.body

        const interview = await Interview.findById(interviewid)

        if (!interview) {
            return res.status(404).json({ message: " failed to find interview" })
        }

        const totalquestions = interview.questions.length;

        let totalscore = 0;
        let totalconfidence = 0;
        let totalcommunication = 0;
        let totalcorrectness = 0;


        interview.questions.forEach((q) => {
            totalscore += q.score || 0;
            totalconfidence += q.confidence || 0;
            totalcommunication += q.communication || 0;
            totalcorrectness += q.correctness || 0;
        });


        const finalscore = totalquestions ? totalscore / totalquestions : 0;

        const avgconfidence = totalquestions ? totalconfidence / totalquestions : 0;

        const avgcommunication = totalquestions ? totalcommunication / totalquestions : 0;

        const avgcorrectness = totalquestions ? totalcorrectness / totalquestions : 0;

        interview.finalscore = finalscore;
        interview.status = "completed";

        await interview.save();

        return res.status(200).json({
            finalscore: Number(finalscore.toFixed(1)),
            avgconfidence: Number(avgconfidence.toFixed(1)),
            avgcommunication: Number(avgcommunication.toFixed(1)),
            avgcorrectness: Number(avgcorrectness.toFixed(1)),
            questions: interview.questions.map((q) => ({
                question: q.questions,
                score: q.score || 0,
                feedback: q.feedback || "",
                confidence: q.confidence || 0,
                communication: q.communication || 0,
                correctness: q.correctness || 0,
            })),

        })

    } catch (error) {
        return res.status(500).json({ message: `failed to finishing interview. ${error}` })
    }
}