import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/interviewPage'
import History from './pages/History'
import Pricing from './pages/Pricing'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";
axios.defaults.withCredentials = true;

const App = () => {

  const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async () => {
      try {
        console.log("Making request to current user endpoint")
        const result = await axios.get("/api/user/current-user")
        console.log("Response:", result.data)
        if (result.data && result.data._id) {
          dispatch(setUserData(result.data))
        }
      } catch (error) {
        console.log("Error details:", error.message, error.code, error.status)
        if (error.response?.status === 400 || error.response?.status === 401) {
          dispatch(setUserData(null))
        }
      }
    }
    getUser()
  }, [dispatch])
  return (
    <Routes>

      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/interview' element={<InterviewPage />} />
      <Route path='/history' element={<History />} />
      <Route path='/pricing' element={<Pricing />} />

    </Routes>

  )
}

export default App