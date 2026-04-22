import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthModel from '../components/AuthModel'
import { 
    BsRobot, 
    BsBarChart, 
    BsCalendar, 
    BsClock, 
    BsArrowLeft,
    BsArrowRight,
    BsCheckCircle,
    BsXCircle,
    BsEye,
    BsAward
} from "react-icons/bs"
import { HiSparkles } from "react-icons/hi"

const History = () => {
    const { userData } = useSelector((state) => state.user)
    const navigate = useNavigate()
    const [showAuth, setshowAuth] = useState(false)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedInterview, setSelectedInterview] = useState(null)
    const [interviewDetails, setInterviewDetails] = useState(null)
    const [loadingDetails, setLoadingDetails] = useState(false)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        if (!userData) {
            setLoading(false)
            return
        }
        fetchHistory()
    }, [userData])

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const result = await axios.get("/api/user/interview-history")
            setHistory(result.data)
        } catch (error) {
            console.error("Failed to fetch history:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchInterviewDetails = async (id) => {
        try {
            setLoadingDetails(true)
            const result = await axios.get(`/api/user/interview/${id}`)
            setInterviewDetails(result.data)
        } catch (error) {
            console.error("Failed to fetch interview details:", error)
        } finally {
            setLoadingDetails(false)
        }
    }

    const handleViewDetails = async (interview) => {
        setSelectedInterview(interview)
        await fetchInterviewDetails(interview._id)
    }

    const closeDetails = () => {
        setSelectedInterview(null)
        setInterviewDetails(null)
    }

    const filteredHistory = history.filter(item => {
        if (filter === 'all') return true
        if (filter === 'completed') return item.status === 'completed'
        if (filter === 'incompleted') return item.status === 'incompleted'
        return true
    })

    const getScoreColor = (score) => {
        if (score >= 8) return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
        if (score >= 6) return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' }
        return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
    }

    const getScoreLabel = (score) => {
        if (score >= 8) return 'Excellent'
        if (score >= 6) return 'Good'
        if (score >= 4) return 'Average'
        return 'Needs Improvement'
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getModeIcon = (mode) => {
        return mode === 'Technical' ? <BsRobot size={16} /> : <BsBarChart size={16} />
    }

    const stats = {
        total: history.length,
        completed: history.filter(h => h.status === 'completed').length,
        averageScore: history.length > 0 
            ? (history.reduce((sum, h) => sum + (h.finalscore || 0), 0) / history.filter(h => h.finalscore).length || 0).toFixed(1)
            : 0
    }

    if (!userData) {
        return (
            <div className='min-h-screen bg-[#f3f3f3] flex flex-col'>
                <Navbar />
                <div className='flex-1 flex items-center justify-center px-6'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-white rounded-3xl shadow-lg p-12 text-center max-w-md'
                    >
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <BsBarChart size={32} className='text-gray-400' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Sign In Required</h2>
                        <p className='text-gray-500 mb-6'>Please sign in to view your interview history</p>
                        <button
                            onClick={() => setshowAuth(true)}
                            className='bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition'
                        >
                            Sign In
                        </button>
                    </motion.div>
                </div>
                <Footer />
                {showAuth && <AuthModel onClose={() => setshowAuth(false)} />}
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-[#f3f3f3] flex flex-col'>
            <Navbar />

            <div className='flex-1 px-4 sm:px-6 py-8'>
                <div className='max-w-6xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-8'
                    >
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='bg-green-50 p-2 rounded-lg'>
                                <BsBarChart className='text-green-600' size={24} />
                            </div>
                            <h1 className='text-3xl font-bold text-gray-800'>Interview History</h1>
                        </div>
                        <p className='text-gray-500 ml-14'>Track your progress and review past performance</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'
                    >
                        <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center'>
                                    <BsBarChart className='text-blue-600' size={24} />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Total Interviews</p>
                                    <p className='text-2xl font-bold text-gray-800'>{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center'>
                                    <BsCheckCircle className='text-green-600' size={24} />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Completed</p>
                                    <p className='text-2xl font-bold text-gray-800'>{stats.completed}</p>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center'>
                                    <BsAward className='text-yellow-600' size={24} />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Average Score</p>
                                    <p className='text-2xl font-bold text-gray-800'>{stats.averageScore}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'
                    >
                        <div className='p-6 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between'>
                            <h2 className='text-lg font-semibold text-gray-800'>All Interviews</h2>
                            <div className='flex gap-2'>
                                {['all', 'completed', 'incompleted'].map((filterOption) => (
                                    <button
                                        key={filterOption}
                                        onClick={() => setFilter(filterOption)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                            filter === filterOption
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {filterOption === 'all' ? 'All' : 
                                         filterOption === 'completed' ? 'Completed' : 'Incomplete'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className='p-12 text-center'>
                                <div className='w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4'></div>
                                <p className='text-gray-500'>Loading your interviews...</p>
                            </div>
                        ) : filteredHistory.length === 0 ? (
                            <div className='p-12 text-center'>
                                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <BsBarChart size={32} className='text-gray-400' />
                                </div>
                                <h3 className='text-lg font-semibold text-gray-800 mb-2'>No Interviews Yet</h3>
                                <p className='text-gray-500 mb-6'>Start your first interview to see your history here</p>
                                <button
                                    onClick={() => navigate('/interview')}
                                    className='bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition font-medium'
                                >
                                    Start Interview
                                </button>
                            </div>
                        ) : (
                            <div className='divide-y divide-gray-100'>
                                {filteredHistory.map((interview, index) => {
                                    const scoreStyle = getScoreColor(interview.finalscore || 0)
                                    return (
                                        <motion.div
                                            key={interview._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className='p-6 hover:bg-gray-50 transition cursor-pointer'
                                            onClick={() => handleViewDetails(interview)}
                                        >
                                            <div className='flex flex-wrap items-center justify-between gap-4'>
                                                <div className='flex items-center gap-4'>
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                                        interview.mode === 'Technical' 
                                                            ? 'bg-blue-50 text-blue-600' 
                                                            : 'bg-purple-50 text-purple-600'
                                                    }`}>
                                                        {getModeIcon(interview.mode)}
                                                    </div>
                                                    <div>
                                                        <h3 className='font-semibold text-gray-800 capitalize'>{interview.role}</h3>
                                                        <div className='flex items-center gap-3 text-sm text-gray-500 mt-1'>
                                                            <span className='flex items-center gap-1'>
                                                                {getModeIcon(interview.mode)}
                                                                {interview.mode}
                                                            </span>
                                                            <span className='flex items-center gap-1'>
                                                                <BsCalendar size={14} />
                                                                {formatDate(interview.date)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='flex items-center gap-4'>
                                                    <div className='text-right'>
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                                            interview.status === 'completed' 
                                                                ? 'bg-green-50 text-green-600 border border-green-200' 
                                                                : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                                                        }`}>
                                                            {interview.status === 'completed' ? (
                                                                <><BsCheckCircle size={14} /> Completed</>
                                                            ) : (
                                                                <><BsClock size={14} /> In Progress</>
                                                            )}
                                                        </div>
                                                        <p className='text-xs text-gray-500 mt-1'>
                                                            {interview.completedQuestions}/{interview.totalQuestions} questions
                                                        </p>
                                                    </div>

                                                    {interview.finalscore > 0 && (
                                                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${scoreStyle.bg} border ${scoreStyle.border}`}>
                                                            <span className={`text-xl font-bold ${scoreStyle.color}`}>
                                                                {interview.finalscore}
                                                            </span>
                                                            <span className='text-[10px] text-gray-500'>out of 10</span>
                                                        </div>
                                                    )}

                                                    <button className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition'>
                                                        <BsEye size={18} className='text-gray-600' />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <Footer />

            <AnimatePresence>
                {selectedInterview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
                        onClick={closeDetails}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className='bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto'
                            onClick={(e) => e.stopPropagation()}
                        >
                            {loadingDetails ? (
                                <div className='p-12 text-center'>
                                    <div className='w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4'></div>
                                    <p className='text-gray-500'>Loading interview details...</p>
                                </div>
                            ) : interviewDetails ? (
                                <>
                                    <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-3xl'>
                                        <div>
                                            <h2 className='text-2xl font-bold text-gray-800 capitalize'>
                                                {interviewDetails.role} Interview
                                            </h2>
                                            <p className='text-gray-500 flex items-center gap-2 mt-1'>
                                                {getModeIcon(interviewDetails.mode)} {interviewDetails.mode} • {formatDate(interviewDetails.date)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={closeDetails}
                                            className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition'
                                        >
                                            <BsXCircle size={20} className='text-gray-600' />
                                        </button>
                                    </div>

                                    <div className='p-6'>
                                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                                            <div className={`p-4 rounded-2xl ${getScoreColor(interviewDetails.finalscore || 0).bg} border ${getScoreColor(interviewDetails.finalscore || 0).border}`}>
                                                <p className='text-sm text-gray-500 mb-1'>Final Score</p>
                                                <p className={`text-2xl font-bold ${getScoreColor(interviewDetails.finalscore || 0).color}`}>
                                                    {interviewDetails.finalscore || 0}/10
                                                </p>
                                                <p className={`text-xs ${getScoreColor(interviewDetails.finalscore || 0).color}`}>
                                                    {getScoreLabel(interviewDetails.finalscore || 0)}
                                                </p>
                                            </div>
                                            <div className='bg-blue-50 p-4 rounded-2xl border border-blue-200'>
                                                <p className='text-sm text-gray-500 mb-1'>Status</p>
                                                <p className='text-lg font-bold text-blue-600 capitalize'>
                                                    {interviewDetails.status}
                                                </p>
                                            </div>
                                            <div className='bg-purple-50 p-4 rounded-2xl border border-purple-200'>
                                                <p className='text-sm text-gray-500 mb-1'>Questions</p>
                                                <p className='text-2xl font-bold text-purple-600'>
                                                    {interviewDetails.questions?.length || 0}
                                                </p>
                                            </div>
                                            <div className='bg-gray-50 p-4 rounded-2xl border border-gray-200'>
                                                <p className='text-sm text-gray-500 mb-1'>Mode</p>
                                                <p className='text-lg font-bold text-gray-700 capitalize'>
                                                    {interviewDetails.mode}
                                                </p>
                                            </div>
                                        </div>

                                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Question Analysis</h3>
                                        <div className='space-y-4'>
                                            {interviewDetails.questions?.map((q, index) => {
                                                const qScore = getScoreColor(q.score || 0)
                                                return (
                                                    <div key={index} className='bg-gray-50 rounded-2xl p-5 border border-gray-200'>
                                                        <div className='flex items-start justify-between gap-4 mb-3'>
                                                            <div className='flex-1'>
                                                                <span className='text-xs font-medium text-gray-500 mb-2 block'>
                                                                    Question {index + 1}
                                                                </span>
                                                                <p className='font-medium text-gray-800'>{q.questions}</p>
                                                            </div>
                                                            <div className={`px-3 py-2 rounded-xl ${qScore.bg} border ${qScore.border}`}>
                                                                <span className={`text-lg font-bold ${qScore.color}`}>
                                                                    {q.score || 0}
                                                                </span>
                                                                <span className='text-xs text-gray-500'>/10</span>
                                                            </div>
                                                        </div>

                                                        {q.answer && (
                                                            <div className='mb-3'>
                                                                <span className='text-xs font-medium text-gray-500'>Your Answer:</span>
                                                                <p className='text-gray-700 text-sm mt-1 bg-white p-3 rounded-lg border border-gray-200'>
                                                                    {q.answer}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {q.feedback && (
                                                            <div className={`p-3 rounded-lg ${qScore.bg} border ${qScore.border}`}>
                                                                <span className='text-xs font-medium'>Feedback:</span>
                                                                <p className={`text-sm mt-1 ${qScore.color}`}>{q.feedback}</p>
                                                            </div>
                                                        )}

                                                        <div className='flex flex-wrap gap-2 mt-3'>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                                q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                                q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                                {q.difficulty}
                                                            </span>
                                                            {q.confidence > 0 && (
                                                                <span className='text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700'>
                                                                    Confidence: {q.confidence}/10
                                                                </span>
                                                            )}
                                                            {q.communication > 0 && (
                                                                <span className='text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700'>
                                                                    Communication: {q.communication}/10
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className='mt-6 flex gap-4'>
                                            <button
                                                onClick={closeDetails}
                                                className='flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2'
                                            >
                                                <BsArrowLeft size={18} /> Back
                                            </button>
                                            <button
                                                onClick={() => {
                                                    closeDetails()
                                                    navigate('/interview')
                                                }}
                                                className='flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center gap-2'
                                            >
                                                New Interview <BsArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='p-12 text-center'>
                                    <p className='text-gray-500'>Failed to load interview details</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default History
