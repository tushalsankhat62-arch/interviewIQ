import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthModel from '../components/AuthModel'
import { setUserData } from '../redux/userSlice'
import { 
    BsRobot, 
    BsCoin,
    BsCheck,
    BsArrowLeft,
    BsLightning,
    BsShield,
    BsStar
} from "react-icons/bs"
import { HiSparkles } from "react-icons/hi"

const Pricing = () => {
    const { userData } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showAuth, setshowAuth] = useState(false)
    const [loading, setLoading] = useState(null)
    const [success, setSuccess] = useState(null)
    const [currentCredits, setCurrentCredits] = useState(userData?.credits || 0)

    useEffect(() => {
        if (userData) {
            setCurrentCredits(userData.credits)
        }
    }, [userData])

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            credits: 50,
            price: 199,
            features: [
                '5 Mock Interviews',
                'Resume Analysis',
                'Basic Feedback',
                '24/7 Access'
            ],
            popular: false,
            color: 'blue'
        },
        {
            id: 'pro',
            name: 'Pro',
            credits: 150,
            price: 499,
            features: [
                '15 Mock Interviews',
                'Resume Analysis',
                'Detailed Feedback',
                'Priority Support',
                'Question Bank Access'
            ],
            popular: true,
            color: 'green'
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            credits: 500,
            price: 1499,
            features: [
                '50 Mock Interviews',
                'Resume Analysis',
                'Advanced Analytics',
                'Premium Support',
                'Unlimited Question Bank',
                'Custom Interview Modes'
            ],
            popular: false,
            color: 'purple'
        }
    ]

    const handlePurchase = async (plan) => {
        if (!userData) {
            setshowAuth(true)
            return
        }

        try {
            setLoading(plan.id)
            const result = await axios.post("/api/user/purchase-credits", {
                credits: plan.credits,
                plan: plan.id
            })
            
            setCurrentCredits(result.data.credits)
            setSuccess(`Successfully purchased ${plan.credits} credits!`)
            
            setTimeout(() => {
                setSuccess(null)
            }, 3000)
        } catch (error) {
            console.error("Purchase error:", error)
            alert("Failed to purchase credits. Please try again.")
        } finally {
            setLoading(null)
        }
    }

    const getColorClasses = (color) => {
        const colors = {
            blue: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-600',
                button: 'from-blue-600 to-blue-500',
                check: 'text-blue-600'
            },
            green: {
                bg: 'bg-green-50',
                border: 'border-green-200',
                text: 'text-green-600',
                button: 'from-green-600 to-emerald-500',
                check: 'text-green-600'
            },
            purple: {
                bg: 'bg-purple-50',
                border: 'border-purple-200',
                text: 'text-purple-600',
                button: 'from-purple-600 to-purple-500',
                check: 'text-purple-600'
            }
        }
        return colors[color]
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
                            <BsCoin size={32} className='text-gray-400' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Sign In Required</h2>
                        <p className='text-gray-500 mb-6'>Please sign in to purchase credits</p>
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
                        className='text-center mb-12'
                    >
                        <div className='inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4'>
                            <HiSparkles size={16} />
                            Add more credits to continue practicing
                        </div>
                        <h1 className='text-4xl font-bold text-gray-800 mb-4'>
                            Get More Credits
                        </h1>
                        <p className='text-gray-500 max-w-2xl mx-auto mb-6'>
                            Choose a plan that works for you. Each interview costs 50 credits. 
                            Get started with more credits today!
                        </p>
                        
                        <div className='inline-flex items-center gap-3 bg-white border border-gray-200 px-6 py-3 rounded-2xl shadow-sm'>
                            <div className='w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center'>
                                <BsCoin size={20} className='text-yellow-500' />
                            </div>
                            <div className='text-left'>
                                <p className='text-xs text-gray-500'>Your Current Credits</p>
                                <p className='text-xl font-bold text-gray-800'>{currentCredits}</p>
                            </div>
                        </div>
                    </motion.div>

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='max-w-md mx-auto mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-3'
                        >
                            <BsCheck size={20} />
                            {success}
                        </motion.div>
                    )}

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
                        {plans.map((plan, index) => {
                            const colors = getColorClasses(plan.color)
                            const pricePerCredit = (plan.price / plan.credits).toFixed(2)
                            
                            return (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative bg-white rounded-3xl border-2 ${plan.popular ? 'border-green-500 shadow-xl' : colors.border} overflow-hidden`}
                                >
                                    {plan.popular && (
                                        <div className='absolute top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-500 text-white text-center py-2 text-sm font-medium'>
                                            <div className='flex items-center justify-center gap-1'>
                                                <BsStar size={14} /> Most Popular
                                            </div>
                                        </div>
                                    )}

                                    <div className={`p-8 ${plan.popular ? 'pt-14' : ''}`}>
                                        <h3 className={`text-2xl font-bold ${colors.text} mb-2`}>
                                            {plan.name}
                                        </h3>
                                        
                                        <div className='mb-6'>
                                            <span className='text-4xl font-bold text-gray-800'>₹{plan.price}</span>
                                            <span className='text-gray-500 ml-2'>for {plan.credits} credits</span>
                                            <p className='text-sm text-gray-400 mt-1'>
                                                Only ₹{pricePerCredit} per credit
                                            </p>
                                        </div>

                                        <ul className='space-y-3 mb-8'>
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className='flex items-center gap-3 text-gray-600'>
                                                    <div className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center`}>
                                                        <BsCheck size={12} className={colors.check} />
                                                    </div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <motion.button
                                            onClick={() => handlePurchase(plan)}
                                            disabled={loading === plan.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r ${colors.button} hover:opacity-90 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2`}
                                        >
                                            {loading === plan.id ? (
                                                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                            ) : (
                                                <>
                                                    <BsLightning size={18} />
                                                    Get {plan.credits} Credits
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className='bg-white rounded-3xl border border-gray-200 p-8'
                    >
                        <h3 className='text-xl font-semibold text-gray-800 mb-6 text-center'>
                            Why Choose InterviewIQ Credits?
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='text-center'>
                                <div className='w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                                    <BsRobot size={28} className='text-green-600' />
                                </div>
                                <h4 className='font-semibold text-gray-800 mb-2'>AI-Powered Interviews</h4>
                                <p className='text-gray-500 text-sm'>
                                    Practice with advanced AI that simulates real interview scenarios
                                </p>
                            </div>
                            <div className='text-center'>
                                <div className='w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                                    <BsShield size={28} className='text-blue-600' />
                                </div>
                                <h4 className='font-semibold text-gray-800 mb-2'>Instant Feedback</h4>
                                <p className='text-gray-500 text-sm'>
                                    Get detailed feedback on your answers and improve quickly
                                </p>
                            </div>
                            <div className='text-center'>
                                <div className='w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                                    <HiSparkles size={28} className='text-purple-600' />
                                </div>
                                <h4 className='font-semibold text-gray-800 mb-2'>Track Progress</h4>
                                <p className='text-gray-500 text-sm'>
                                    Monitor your improvement over time with detailed analytics
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className='mt-8 text-center'>
                        <button
                            onClick={() => navigate('/interview')}
                            className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition'
                        >
                            <BsArrowLeft size={18} />
                            Maybe later, start practicing now
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
            {showAuth && <AuthModel onClose={() => setshowAuth(false)} />}
        </div>
    )
}

export default Pricing