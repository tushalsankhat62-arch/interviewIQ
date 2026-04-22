import genToken from "../config/token.js"
import User from "../models/user.model.js"

export const googleAuth = async (req, res) => {
    try {
        console.log("Google auth called with body:", req.body)
        const { name, email } = req.body
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }
        
        let user = await User.findOne({ email })
        console.log("Existing user:", user)
        
        if (!user) {
            user = await User.create({
                name,
                email
            })
            console.log("Created new user:", user)
        }
        
        let token = await genToken(user._id)
        console.log("Generated token:", token ? "yes" : "no")
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            domain: process.env.NODE_ENV === "production" ? undefined : "localhost",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)
    } catch (error) {
        console.error("Google auth error:", error)
        return res.status(500).json({ message: `google auth error ${error}` })
    }
}

export const logout = async (req,res) =>{
    try {
        console.log("Logout called")
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
        })
        return res.status(200).json({message:"logout successfully"})
    } catch (error) {
         console.error("Logout error:", error)
         return res.status(500).json({ message: `logout error ${error}` })
    }
}