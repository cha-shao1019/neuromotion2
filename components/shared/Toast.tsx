import React, { useEffect } from 'react';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface ToastProps {
    message: string;
    show: boolean;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, show, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    return (
        <div 
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[250] transition-all duration-300 ease-in-out ${
                show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
            <div className="flex items-center gap-3 bg-gray-900/80 backdrop-blur-md border border-brand-teal-500/50 text-white px-6 py-3 rounded-full shadow-2xl">
                <CheckCircleIcon className="w-6 h-6 text-brand-teal-400" />
                <span className="font-semibold">{message}</span>
            </div>
        </div>
    );
};

export default Toast;
