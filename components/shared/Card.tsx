import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-16 shadow-[0_40px_80px_rgba(15,23,42,0.08)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 transition-all duration-1000 relative overflow-hidden group ${className}`}>
            {/* 裝飾微光 */}
            <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-brand-teal-500/5 dark:bg-brand-teal-500/10 blur-[100px] pointer-events-none group-hover:bg-brand-teal-500/10 transition-all duration-1000"></div>
            
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Card;