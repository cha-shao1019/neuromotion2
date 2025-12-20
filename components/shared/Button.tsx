import React from 'react';
import audioService from '../../services/audioService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', onClick, ...props }) => {
    const baseClasses = "px-10 py-5 text-xl font-black rounded-[2rem] transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.95]";

    const variantClasses = {
        primary: "bg-brand-teal-500 hover:bg-brand-teal-600 text-white shadow-[0_10px_40px_rgba(76,170,162,0.25)] hover:shadow-[0_15px_50px_rgba(76,170,162,0.4)] focus:ring-brand-teal-400 border-2 border-brand-teal-300/30",
        secondary: "bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:ring-slate-300 shadow-sm",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-[0_10px_40px_rgba(239,68,68,0.2)] focus:ring-red-400 border-2 border-red-300/30",
    };
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        audioService.playClick();
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} onClick={handleClick} {...props}>
            {children}
        </button>
    );
};

export default Button;