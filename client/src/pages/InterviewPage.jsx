import React, { useState } from 'react'
import Step1SetUp from '../components/Step1SetUp'
import Step2interview from '../components/Step2interview'
import Step3Report from '../components/Step3Report'

const interviewPage = () => {

    const [step, setstep] = useState(1);
    const [interviewData, setinterviewData] = useState(null)


    return (
        <div className='min-h-screen bg-gray-50'>

            {step === 1 && (
                <Step1SetUp onstart={(data) => {
                    setinterviewData(data);
                    setstep(2)
                }} />
            )}

            {step === 2 && (
                <Step2interview interviewData={interviewData}
                    onfinish={(report) => {
                        setinterviewData(report);
                        setstep(3)
                    }} />
            )}

            {step === 3 && (
                <Step3Report report={interviewData} />
            )}
        </div>
    )
}

export default interviewPage