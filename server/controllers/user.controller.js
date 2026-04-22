import User from "../models/user.model.js"
import Interview from "../models/interview.model.js"


export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.UserId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user does not found" })
        }
        return res.status(200).json(user)
    } catch (error) {

        return res.status(500).json({ message: `failed to get currentuser ${error}` })
    }
}

export const getInterviewHistory = async (req, res) => {
    try {
        const userId = req.UserId
        
        const interviews = await Interview.find({ userid: userId })
            .sort({ createdAt: -1 })
            .select('role mode finalscore status createdAt questions');
        
        const history = interviews.map(interview => ({
            _id: interview._id,
            role: interview.role,
            mode: interview.mode,
            finalscore: interview.finalscore,
            status: interview.status,
            date: interview.createdAt,
            totalQuestions: interview.questions.length,
            completedQuestions: interview.questions.filter(q => q.answer && q.answer.length > 0).length
        }));
        
        return res.status(200).json(history);
    } catch (error) {
        console.error("History error:", error);
        return res.status(500).json({ message: `failed to get interview history ${error}` })
    }
}

export const getInterviewById = async (req, res) => {
    try {
        const userId = req.UserId;
        const { id } = req.params;
        
        const interview = await Interview.findOne({ _id: id, userid: userId });
        
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }
        
        return res.status(200).json(interview);
    } catch (error) {
        console.error("Get interview error:", error);
        return res.status(500).json({ message: `failed to get interview ${error}` });
    }
}

export const purchaseCredits = async (req, res) => {
    try {
        const userId = req.UserId;
        const { credits, plan } = req.body;
        
        if (!credits || credits <= 0) {
            return res.status(400).json({ message: "Invalid credits amount" });
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        user.credits += credits;
        await user.save();
        
        return res.status(200).json({ 
            message: "Credits purchased successfully",
            credits: user.credits,
            purchasedCredits: credits,
            plan: plan || 'custom'
        });
    } catch (error) {
        console.error("Purchase credits error:", error);
        return res.status(500).json({ message: `failed to purchase credits ${error}` });
    }
}