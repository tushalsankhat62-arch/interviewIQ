import React, { useState } from 'react'
import { motion } from "motion/react"
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
    FaMicrophoneAlt,
    FaChartLine,
} from "react-icons/fa";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';


const Step1SetUp = ({ onstart }) => {


    const { userdata } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [role, setrole] = useState("");
    const [experience, setexperience] = useState("");
    const [mode, setmode] = useState("Technical");
    const [resumeFile, setresumeFile] = useState(null)
    const [loading, setloading] = useState(false)
    const [projects, setprojects] = useState([])
    const [skills, setskills] = useState([])
    const [resumeText, setresumeText] = useState("")
    const [analysisDone, setanalysisDone] = useState(false)
    const [analyzing, setanalyzing] = useState(false)
    const [error, seterror] = useState("")


    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        setanalyzing(true)
        seterror("")

        const formdata = new FormData()
        formdata.append("resume", resumeFile)
        try {
            const result = await axios.post("/api/interview/resume", formdata)

            console.log(result.data)

            setrole(result.data.role || "");
            setexperience(result.data.experience || "");
            setprojects(result.data.projects || []);
            setskills(result.data.skills || []);
            setresumeText(result.data.resumeText || "");
            setanalysisDone(true);

            setanalyzing(false);
        } catch (error) {
            console.error("Resume upload error:", error.message);
            const errorMsg = error.response?.data?.message || error.message || "Failed to analyze resume. Please check server connection.";
            seterror(errorMsg);
            setanalyzing(false);
        }
    }

    const handlestart = async () => {
        if (!role?.trim() || !experience?.trim()) {
            seterror("Please enter both role and experience");
            return;
        }
        setloading(true)
        seterror("")
        try {
            const result = await axios.post("/api/interview/generate-question", { role: role.trim(), experience: experience.trim(), mode, resumeText, projects, skills })
            console.log(result.data)

            if (userdata) {
                dispatch(setUserData({ ...userdata, credits: result.data.creditsleft }))
            }

            setloading(false)
            onstart(result.data)


        } catch (error) {
            console.error("Generate question error:", error.message);
            const errorMsg = error.response?.data?.message || error.message || "Failed to generate questions. Please check server connection.";
            seterror(errorMsg);
            setloading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4'
        >

            <div className='w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden'>

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='relative bg-gradient-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center'>

                    <h2 className=' text-4xl font-bold text-gray-800 mb-6 capitalize'>
                        start your ai interview
                    </h2>

                    <p className='text-gray-600 mb-10'>
                        pratice real interview scenarios powered by AI.
                        imporve communication, technical skills, and confidence.
                    </p>

                    <div className='space-y-5'>
                        {
                            [
                                {
                                    icon: <FaUserTie className='text-green-600 text-xl ' />,
                                    text: "choose role & experience",
                                },

                                {
                                    icon: <FaMicrophoneAlt className='text-green-600 text-xl ' />,
                                    text: "smart voice interview",
                                },

                                {
                                    icon: <FaChartLine className='text-green-600 text-xl ' />,
                                    text: "performance analytics",
                                },
                            ].map((item, index) => (
                                <motion.div key={index}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.15 }}
                                    whileHover={{ scale: 1.03 }}
                                    className='flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer'>
                                    {item.icon}
                                    <span className='text-gray-700 font-medium'>{item.text}</span>
                                </motion.div>
                            ))
                        }

                    </div>

                </motion.div>

                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='p-12 bg-white'>

                    <h2 className='text-3xl font-bold text-gray-800 mb-8 capitalize'>
                        interview setup
                    </h2>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4'
                        >
                            <p className='text-sm'>{error}</p>
                        </motion.div>
                    )}

                    <div className='space-y-6'>

                        <div className='relative'>
                            <FaUserTie className='absolute top-4 left-4 text-gray-400' />

                            <input type='text' placeholder='enter role'
                                className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition'
                                onChange={(e) => setrole(e.target.value)}
                                value={role}
                            />
                        </div>

                        <div className='relative'>
                            <FaBriefcase className='absolute top-4 left-4 text-gray-400' />

                            <input type='text' placeholder='experience (e.g. 2 years)'
                                className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition'
                                onChange={(e) => setexperience(e.target.value)}
                                value={experience}
                            />
                        </div>


                        <select value={mode}
                            onChange={(e) => setmode(e.target.value)}
                            className='w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition'
                        >
                            <option value="Technical">Technical Interview</option>

                            <option value="HR">HR Interview</option>

                        </select>

                        {!analysisDone && (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => document.getElementById("resumeupload").click()}
                                className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500
                            hover:bg-green-50 transition '>

                                <FaFileUpload className='text-4xl mx-auto text-green-600 mb-3' />

                                <input type='file'
                                    accept='application/pdf'
                                    id='resumeupload'
                                    className='hidden'
                                    onChange={(e) => setresumeFile(e.target.files[0])}
                                />

                                <p className='text-gray-600 font-medium'>
                                    {resumeFile ? resumeFile.name : "click to upload resume(optional)"}
                                </p>

                                {resumeFile && (<motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUploadResume()
                                    }}
                                    className='mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition'>

                                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                                </motion.button>)}

                            </motion.div>
                        )}

                        {analysisDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='bg-gray-50 border-gray-200 rounded-xl p-5 space-y-4'>
                                <h3 className='text-lg font-semibold text-gray-800 capitalize'>
                                    Resume analysis result
                                </h3>

                                {projects.length > 0 && (
                                    <div>
                                        <p className='font-medium text-gray-700 mb-1'>
                                            Projects:
                                        </p>

                                        <ul className='list-disc list-inside text-gray-600 space-y-1'>
                                            {projects.map((p, i) => (
                                                <li key={i}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {skills.length > 0 && (
                                    <div>
                                        <p className='font-medium text-gray-700 mb-1'>
                                            skills:
                                        </p>

                                        <div className='flex flex-wrap gap-2'>
                                            {skills.map((s, i) => (
                                                <span key={i} className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm'>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        <motion.button
                            onClick={handlestart}
                            disabled={!role || !experience || loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            className='w-full disabled:bg-gray-600 bg-green-600 hover:bg-green-700 text-white py-3 
                        rounded-full text-lg font-semibold transition duration-300 shadow-md'>
                            {loading ? "Starting..." : "Start Interview"}
                        </motion.button>
                    </div>

                </motion.div>

            </div>

        </motion.div>
    )
}

export default Step1SetUp