import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({ timeleft, totaltime }) => {
    const percentage = (timeleft / totaltime) * 100;
    
    const getColor = () => {
        if (percentage > 50) return "#10b981";
        if (percentage > 25) return "#f59e0b";
        return "#ef4444";
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs.toString();
    };

    return (
        <div className='relative'>
            <div className='w-24 h-24'>
                <CircularProgressbar 
                    value={percentage} 
                    text={formatTime(timeleft)}
                    strokeWidth={8}
                    styles={buildStyles({
                        textSize: "28px",
                        pathColor: getColor(),
                        textColor: "#374151",
                        trailColor: "#e5e7eb",
                        pathTransitionDuration: 0.5,
                    })} 
                />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 whitespace-nowrap">
                {totaltime >= 60 ? `${Math.floor(totaltime / 60)}m ${totaltime % 60}s` : `${totaltime}s`} limit
            </div>
        </div>
    )
}

export default Timer