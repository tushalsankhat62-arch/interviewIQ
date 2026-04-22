import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { 
    BsRobot, 
    BsArrowLeft, 
    BsArrowRight, 
    BsCheckCircle, 
    BsBarChart,
    BsEmojiSmile,
    BsTrophy,
    BsCloudDownload
} from "react-icons/bs"

const Step3Report = ({ report }) => {
    const navigate = useNavigate()

    const { 
        finalscore = 0, 
        avgconfidence = 0, 
        avgcommunication = 0, 
        avgcorrectness = 0, 
        questions = [] 
    } = report || {}

    const getScoreColor = (score) => {
        if (score >= 8) return { color: '#10b981', label: 'Excellent', bg: 'bg-green-50', border: 'border-green-200' }
        if (score >= 6) return { color: '#f59e0b', label: 'Good', bg: 'bg-yellow-50', border: 'border-yellow-200' }
        if (score >= 4) return { color: '#3b82f6', label: 'Average', bg: 'bg-blue-50', border: 'border-blue-200' }
        return { color: '#ef4444', label: 'Needs Work', bg: 'bg-red-50', border: 'border-red-200' }
    }

    const scoreStyle = getScoreColor(finalscore)

    const getEmoji = (score) => {
        if (score >= 8) return '🏆'
        if (score >= 6) return '😊'
        if (score >= 4) return '🙂'
        return '💪'
    }

    const getMessage = (score) => {
        if (score >= 8) return "Outstanding performance! You're well-prepared for interviews."
        if (score >= 6) return "Great job! You have solid interview skills."
        if (score >= 4) return "Good effort! Keep practicing to improve further."
        return "Keep practicing! Every interview makes you better."
    }

    const handleNewInterview = () => {
        navigate('/interview')
    }

    const handleGoHome = () => {
        navigate('/')
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 sm:p-6'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='w-full max-w-4xl'
            >
                <div className='bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden'>
                    <div className='bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-center'>
                        <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <span className='text-4xl'>{getEmoji(finalscore)}</span>
                        </div>
                        <h1 className='text-3xl font-bold text-white mb-2'>Interview Complete!</h1>
                        <p className='text-green-100'>{getMessage(finalscore)}</p>
                    </div>

                    <div className='p-8'>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                            <div className={`p-5 rounded-2xl ${scoreStyle.bg} border ${scoreStyle.border} text-center`}>
                                <BsTrophy className="mx-auto mb-2" size={24} style={{ color: scoreStyle.color }} />
                                <p className='text-3xl font-bold' style={{ color: scoreStyle.color }}>{finalscore}</p>
                                <p className='text-sm text-gray-500'>Final Score</p>
                            </div>
                            <div className='bg-blue-50 border border-blue-200 p-5 rounded-2xl text-center'>
                                <BsEmojiSmile className="mx-auto mb-2 text-blue-600" size={24} />
                                <p className='text-3xl font-bold text-blue-600'>{avgconfidence}</p>
                                <p className='text-sm text-gray-500'>Confidence</p>
                            </div>
                            <div className='bg-purple-50 border border-purple-200 p-5 rounded-2xl text-center'>
                                <BsCheckCircle className="mx-auto mb-2 text-purple-600" size={24} />
                                <p className='text-3xl font-bold text-purple-600'>{avgcommunication}</p>
                                <p className='text-sm text-gray-500'>Communication</p>
                            </div>
                            <div className='bg-orange-50 border border-orange-200 p-5 rounded-2xl text-center'>
                                <BsBarChart className="mx-auto mb-2 text-orange-600" size={24} />
                                <p className='text-3xl font-bold text-orange-600'>{avgcorrectness}</p>
                                <p className='text-sm text-gray-500'>Correctness</p>
                            </div>
                        </div>

                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                                <BsBarChart className="text-green-600" />
                                Question Analysis
                            </h2>
                            <div className='space-y-4'>
                                {questions.map((q, index) => {
                                    const qScore = getScoreColor(q.score || 0)
                                    return (
                                        <div key={index} className='bg-gray-50 rounded-2xl p-5 border border-gray-200'>
                                            <div className='flex items-start justify-between gap-4 mb-3'>
                                                <div className='flex-1'>
                                                    <span className='text-xs font-medium text-gray-500 mb-2 block'>
                                                        Question {index + 1}
                                                    </span>
                                                    <p className='font-medium text-gray-800'>{q.question}</p>
                                                </div>
                                                <div className={`px-4 py-2 rounded-xl ${qScore.bg} border ${qScore.border}`}>
                                                    <span className={`text-xl font-bold`} style={{ color: qScore.color }}>
                                                        {q.score || 0}
                                                    </span>
                                                    <span className='text-gray-500'>/10</span>
                                                </div>
                                            </div>

                                            {q.feedback && (
                                                <div className={`p-3 rounded-lg ${qScore.bg} border ${qScore.border}`}>
                                                    <span className='text-xs font-medium text-gray-500'>Feedback:</span>
                                                    <p className={`text-sm mt-1`} style={{ color: qScore.color }}>{q.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4'>
                            <button
                                onClick={handleGoHome}
                                className='flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2'
                            >
                                <BsArrowLeft size={20} /> Back to Home
                            </button>
                            <button
                                onClick={handleNewInterview}
                                className='flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2'
                            >
                                Start New Interview <BsArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Step3Report