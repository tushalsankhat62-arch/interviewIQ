import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getCurrentUser, getInterviewHistory, getInterviewById, purchaseCredits } from "../controllers/user.controller.js"


const userRouter = express.Router()

userRouter.get("/current-user", isAuth, getCurrentUser)
userRouter.get("/interview-history", isAuth, getInterviewHistory)
userRouter.get("/interview/:id", isAuth, getInterviewById)
userRouter.post("/purchase-credits", isAuth, purchaseCredits)



export default userRouter