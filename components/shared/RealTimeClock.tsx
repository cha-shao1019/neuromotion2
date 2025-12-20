
import React, { useState, useEffect } from 'react';

interface RealTimeClockProps {
    className?: string;
}

const RealTimeClock: React.FC<RealTimeClockProps> = ({ className }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formattedTime = new Intl.DateTimeFormat('zh-TW', {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(time);

    return (
        <div className={`font-mono text-slate-400 dark:text-slate-500 font-black ${className}`}>
            {formattedTime} (UTC+8)
        </div>
    );
};

export default RealTimeClock;
