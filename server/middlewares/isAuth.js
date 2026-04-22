import jwt from "jsonwebtoken"


const isAuth = async (req, res, next) => {
    try {
        console.log("Cookies received:", req.cookies)
        let { token } = req.cookies

        if (!token) {
            console.log("No token found in cookies")
            return res.status(400).json({ message: "user does not have token" })
        }
        console.log("Token found, verifying...")
        const verifytoken = jwt.verify(token, process.env.JWT_SECRET)

        if (!verifytoken) {
            return res.status(400).json({ message: "user does not have valid token" })
        }

        req.UserId = verifytoken.userId
        console.log("Token verified, userId:", req.UserId)

        next()
    } catch (error) {
        console.log("Token verification error:", error.message)
        return res.status(500).json({ message: `isauth error ${error}` })
    }
}

export default isAuth