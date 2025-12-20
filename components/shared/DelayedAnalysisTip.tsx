
import React, { useState, useEffect } from 'react';
import { ClockIcon } from '../icons/ClockIcon';

interface DelayedAnalysisTipProps {
    isAnalyzing: boolean;
    delay?: number; // in ms
}

const DelayedAnalysisTip: React.FC<DelayedAnalysisTipProps> = ({ isAnalyzing, delay = 6000 }) => {
    const [showTip, setShowTip] = useState(false);

    useEffect(() => {
        let timer: any;
        if (isAnalyzing) {
            timer = setTimeout(() => setShowTip(true), delay);
        } else {
            setShowTip(false);
        }
        return () => clearTimeout(timer);
    }, [isAnalyzing, delay]);

    if (!showTip) return null;

    return (
        <div className="mt-8 p-10 bg-brand-teal-50/90 backdrop-blur-md border-2 border-brand-teal-500/20 rounded-[3rem] text-center animate-reveal max-w-md mx-auto shadow-2xl">
            <div className="flex items-center justify-center gap-6">
                <div className="relative">
                    <ClockIcon className="w-12 h-12 text-brand-teal-600 animate-pulse" />
                    <div className="absolute inset-0 bg-brand-teal-500/20 blur-2xl rounded-full"></div>
                </div>
                <div className="text-left">
                    <h4 className="font-black text-slate-900 dark:text-slate-900 text-xl tracking-tight">AI 深度連線運算中...</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-500 font-bold mt-1">臨床數據已同步至雲端核心引擎。</p>
                </div>
            </div>
        </div>
    );
};

export default DelayedAnalysisTip;
