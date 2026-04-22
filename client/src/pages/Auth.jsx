import React from 'react'
import { FaRobot } from "react-icons/fa6";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { linkWithCredential, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const Auth = ({ isModel = false }) => {

  const dispatch = useDispatch()

  const handlegoogleauth = async () => {
    try {
      console.log("Starting Google sign-in...")
      const result = await signInWithPopup(auth, provider)
      console.log("Firebase response:", result.user)
      let User = result.user
      let name = User.displayName
      let email = User.email
      
      if (!email) {
        alert("Could not get email from Google. Please try again.")
        return
      }
      
      console.log("Sending to server:", { name, email })
      
      const serverResponse = await axios.post("/api/auth/google", { name, email })
      console.log("Server response:", serverResponse.data)
      
      if (serverResponse.data && serverResponse.data._id) {
        dispatch(setUserData(serverResponse.data))
        alert("Login successful!")
      } else {
        alert("Login failed: Invalid response from server")
      }
    } catch (error) {
      console.error("Auth error:", error)
      if (error.code === 'auth/popup-closed-by-user') {
        alert("Sign-in was cancelled. Please try again.")
      } else if (error.code === 'auth/cancelled-popup-request') {
        alert("Only one popup allowed at a time.")
      } else if (error.response) {
        console.error("Server error:", error.response.data)
        alert(`Server error: ${error.response.data?.message || error.message}`)
      } else if (error.request) {
        alert("No response from server. Please check if the server is running.")
      } else {
        alert(`Error: ${error.message}`)
      }
      dispatch(setUserData(null))
    }
  }
  return (
    <div className={`
      w-full 
      ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}
    `} >

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className={`
        w-full
        ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}`}>
        <div className='flex items-center justify-center gap-3 mb-6'>
          <div className='bg-black text-white p-2 rounded-lg'>
            <FaRobot size={18} />
          </div>
          <h2 className='font-semibold text-lg'>InterviewIQ.AI</h2>
        </div>
        <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
          Continue with
          <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
            <IoSparkles size={16} />
            AI Smart interview
          </span>
        </h1>

        <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
          sign in to start AI-powerd mock interviews,
          track your progress, and unlock detailed performance insights.
        </p>
        <motion.button
          onClick={handlegoogleauth}
          whileHover={{ opacity: 0.9, scale: 1.03 }}
          whileTap={{ opacity: 1, scale: 0.8 }}
          className='w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md'
        >
          <FcGoogle size={20} />
          continue with Google

        </motion.button>
      </motion.div>
    </div >
  )
}

export default Auth