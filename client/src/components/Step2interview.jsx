import React, { useEffect, useRef, useState } from 'react'
import malevideo from '../assets/Videos/male-ai.mp4'
import femalevideo from '../assets/Videos/female-ai.mp4'
import Timer from './Timer'
import { motion } from "motion/react"
import { FaMicrophone, FaMicrophoneAlt } from "react-icons/fa";
import axios from 'axios';
import { BsArrowLeft } from "react-icons/bs";

const Step2interview = ({ interviewData, onfinish }) => {
    const interviewid = interviewData?.interviewid;
    const questions = interviewData?.questions || [];
    const username = interviewData?.username || "User";
    
    const [isIntroPhase, setisIntroPhase] = useState(true);
    const [isMicOn, setisMicOn] = useState(true);
    const [isAIPlaying, setisAIPlaying] = useState(false);
    const [currentIndex, setcurrentIndex] = useState(0);
    const [answer, setanswer] = useState("");
    const [feedback, setfeedback] = useState("");
    const [timeLeft, settimeLeft] = useState(60);
    const [selectedVoice, setselectedVoice] = useState(null);
    const [isSubmitting, setisSubmitting] = useState(false);
    const [voiceGender, setvoiceGender] = useState("female");
    const [subtitle, setsubtitle] = useState("");
    
    const recognitionref = useRef(null);
    const videoref = useRef(null);
    
    const currentQuestion = questions && questions.length > 0 ? questions[currentIndex] : null;
    const videosource = voiceGender === "male" ? malevideo : femalevideo;

    useEffect(() => {
        const loadvoices = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log("Available voices:", voices.map(v => v.name));
            
            if (voices.length === 0) {
                setTimeout(loadvoices, 100);
                return;
            }
            
            const femaleVoices = voices.find(v =>
                v.name.toLowerCase().includes("zira") ||
                v.name.toLowerCase().includes("samantha") ||
                v.name.toLowerCase().includes("victoria") ||
                v.name.toLowerCase().includes("karen") ||
                v.name.toLowerCase().includes("moira") ||
                v.name.toLowerCase().includes("female")
            );
            
            if (femaleVoices) {
                setselectedVoice(femaleVoices);
                setvoiceGender("female");
                console.log("Selected female voice:", femaleVoices.name);
                return;
            }
            
            const maleVoices = voices.find(v =>
                v.name.toLowerCase().includes("david") ||
                v.name.toLowerCase().includes("mark") ||
                v.name.toLowerCase().includes("daniel") ||
                v.name.toLowerCase().includes("male")
            );
            
            if (maleVoices) {
                setselectedVoice(maleVoices);
                setvoiceGender("male");
                console.log("Selected male voice:", maleVoices.name);
                return;
            }
            
            setselectedVoice(voices[0]);
            setvoiceGender("female");
            console.log("Selected default voice:", voices[0].name);
        };
        
        loadvoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadvoices;
        }
    }, []);
    
    const runintro = async () => {
        if (isIntroPhase && questions && questions.length > 0) {
            const firstQuestion = questions[0]?.questions;
            const intro = `Hello ${username}, welcome to your interview. We have ${questions.length} questions for you. Please answer each question to the best of your ability. Let's begin with the first question. ${firstQuestion}`;
            await speaktext(intro);
            setisIntroPhase(false);
            settimeLeft(questions[0]?.timelimit || 60);
            setsubtitle(firstQuestion);
        }
    };
    
    useEffect(() => {
        if (selectedVoice) {
            runintro();
        }
    }, [selectedVoice]);
    
    useEffect(() => {
        if (isIntroPhase || !currentQuestion || isSubmitting) return;
        
        const timer = setInterval(() => {
            settimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, [isIntroPhase, currentQuestion, isSubmitting, currentIndex]);
    
    useEffect(() => {
        if (!("webkitSpeechRecognition" in window)) return;
        
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            setanswer((prev) => prev + " " + transcript);
        };
        
        recognitionref.current = recognition;
    }, []);
    
    useEffect(() => {
        if (isIntroPhase) return;
        if (!currentQuestion) return;
        
        if (timeLeft === 0 && !isSubmitting && !feedback) {
            submitanswer();
        }
    }, [timeLeft]);
    
    useEffect(() => {
        return () => {
            if (recognitionref.current) {
                recognitionref.current.stop();
                recognitionref.current.abort();
            }
            window.speechSynthesis.cancel();
        };
    }, []);
    
    const startmic = () => {
        if (recognitionref.current && !isAIPlaying) {
            try {
                recognitionref.current.start();
            } catch (e) {
                console.log("Mic start error:", e);
            }
        }
    };
    
    const stopmic = () => {
        if (recognitionref.current) {
            recognitionref.current.stop();
        }
    };
    
    const togglemic = () => {
        if (isMicOn) {
            stopmic();
            setisMicOn(false);
        } else {
            startmic();
            setisMicOn(true);
        }
    };
    
    const speaktext = (text) => {
        return new Promise((resolve) => {
            setsubtitle(text);
            
            if (!window.speechSynthesis) {
                console.log("Speech synthesis not supported");
                setTimeout(resolve, 3000);
                return;
            }
            
            if (!selectedVoice) {
                console.log("No voice selected, showing subtitle only");
                setTimeout(resolve, 3000);
                return;
            }
            
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice;
            utterance.rate = 0.92;
            utterance.pitch = 1.05;
            utterance.volume = 1;
            
            utterance.onstart = () => {
                console.log("Speech started");
                setisAIPlaying(true);
                stopmic();
                videoref.current?.play();
            };
            
            utterance.onend = () => {
                console.log("Speech ended");
                videoref.current?.pause();
                videoref.current.currentTime = 0;
                setisAIPlaying(false);
                setsubtitle("");
                if (isMicOn) startmic();
                resolve();
            };
            
            utterance.onerror = (event) => {
                console.log("Speech error:", event.error);
                setisAIPlaying(false);
                videoref.current?.pause();
                if (isMicOn) startmic();
                resolve();
            };
            
            window.speechSynthesis.speak(utterance);
        });
    };
    
    const submitanswer = async () => {
        if (isSubmitting) return;
        
        stopmic();
        setisSubmitting(true);
        
        try {
            const result = await axios.post("/api/interview/submit-answer", {
                interviewid,
                questionindex: currentIndex,
                answer,
                timetaken: currentQuestion.timelimit - timeLeft,
            });
            
            setfeedback(result.data.feedback);
            speaktext(result.data.feedback);
            setisSubmitting(false);
        } catch (error) {
            console.log(error);
            setisSubmitting(false);
        }
    };
    
    const handlenext = async () => {
        setfeedback("");
        
        if (currentIndex + 1 >= questions.length) {
            await finishinterview();
            return;
        }
        
        const nextQuestion = questions[currentIndex + 1]?.questions;
        const transitionText = currentIndex === 0 
            ? `Here is your first question. ${nextQuestion}` 
            : `Alright. Here is the next question. ${nextQuestion}`;
        
        await speaktext(transitionText);
        
        setcurrentIndex(currentIndex + 1);
        settimeLeft(questions[currentIndex + 1]?.timelimit || 60);
        setsubtitle(nextQuestion);
        
        setTimeout(() => {
            if (isMicOn) startmic();
        }, 1000);
    };
    
    const handleFinish = async () => {
        await speaktext("Thank you for completing the interview. Let's see your results.");
        await finishinterview();
    };
    
    const isLastQuestion = currentIndex + 1 >= questions.length;
    
    const finishinterview = async () => {
        stopmic();
        setisMicOn(false);
        
        try {
            const result = await axios.post("/api/interview/finish", {
                interviewid
            });
            
            onfinish(result.data);
        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 sm:p-6'>
            <div className='w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col md:flex-row overflow-hidden'>
                <div className='w-full md:w-[40%] bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
                    <div className='w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border-4 border-white'>
                        <video src={videosource} key={videosource} ref={videoref} muted playsInline preload='auto' className='w-full h-auto object-cover' />
                    </div>
                    
                    {subtitle && (
                        <div className='w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm'>
                            <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
                        </div>
                    )}
                    
                    <div className='w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-md p-5 space-y-4'>
                        <div className='flex justify-between items-center'>
                            <span className='text-gray-500 text-sm font-medium'>Interview Status</span>
                            {isAIPlaying && <span className='text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full'>AI Speaking</span>}
                        </div>
                        <div className='h-px bg-gray-200'></div>
                        <div className='flex justify-center'>
                            <Timer timeleft={timeLeft} totaltime={currentQuestion?.timelimit} />
                        </div>
                        <div className='h-px bg-gray-200'></div>
                        <div className='grid grid-cols-2 gap-4 text-center'>
                            <div className='bg-gray-50 rounded-lg p-3'>
                                <span className='text-2xl font-bold text-green-600'>{currentIndex + 1}</span>
                                <span className='block text-xs text-gray-500 mt-1'>Current Question</span>
                            </div>
                            <div className='bg-gray-50 rounded-lg p-3'>
                                <span className='text-2xl font-bold text-green-600'>{questions.length}</span>
                                <span className='block text-xs text-gray-500 mt-1'>Total Questions</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='flex-1 flex flex-col p-6 sm:p-8 md:p-10 relative'>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='w-10 h-10 bg-green-600 rounded-full flex items-center justify-center'>
                            <span className='text-white font-bold text-sm'>AI</span>
                        </div>
                        <h2 className='text-xl sm:text-2xl font-bold text-gray-800 capitalize'>Smart Interview</h2>
                    </div>
                    
                    {!isIntroPhase && (
                        <div className='relative mb-6 bg-gray-50 p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
                            <p className='text-xs sm:text-sm text-gray-500 mb-2 font-medium'>
                                Question {currentIndex + 1} of {questions.length}
                            </p>
                            <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed mb-4'>
                                {currentQuestion?.questions || 'Loading questions...'}
                            </div>
                        </div>
                    )}
                    
                    <div className='flex-1 flex flex-col'>
                        <label className='text-sm font-medium text-gray-700 mb-3'>Your Answer</label>
                        <textarea
                            placeholder='Type your answer here...'
                            onChange={(e) => setanswer(e.target.value)}
                            value={answer}
                            className='flex-1 min-h-[200px] bg-gray-50 p-4 sm:p-5 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-gray-700 text-base'
                        />
                        
                        {!feedback ? (
                            <div className='flex items-center justify-between mt-6 gap-4'>
                                <motion.button
                                    onClick={togglemic}
                                    whileTap={{ scale: 0.95 }}
                                    className='w-14 h-14 flex items-center justify-center rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-900 transition'
                                >
                                    {isMicOn ? <FaMicrophone size={22} /> : <FaMicrophoneAlt size={22} />}
                                </motion.button>
                                
                                <motion.button
                                    onClick={submitanswer}
                                    disabled={isSubmitting}
                                    whileTap={{ scale: 0.95 }}
                                    className='flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-8 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold capitalize text-base disabled:bg-gray-500'
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                                </motion.button>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='mt-6 bg-emerald-50 border-emerald-200 p-5 rounded-2xl shadow-md'
                            >
                                <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>
                                {isLastQuestion ? (
                                    <button 
                                        onClick={handleFinish}
                                        className='w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 font-semibold'
                                    >
                                        View Results <BsArrowLeft size={18} className="rotate-180" />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handlenext}
                                        className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-2'
                                    >
                                        Next Question <BsArrowLeft size={18} />
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2interview;