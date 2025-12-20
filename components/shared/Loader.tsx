
import React from 'react';

interface LoaderProps {
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "處理中..." }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-12 text-center py-20 relative">
            {/* v3.4 標誌性背景光暈 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-teal-500/20 blur-[100px] rounded-full animate-pulse pointer-events-none"></div>

            {/* 精密動力載入環 */}
            <div className="relative w-52 h-52 flex items-center justify-center">
                
                {/* 1. 外層：品牌色加厚軌道 (順時針) */}
                <div className="absolute inset-0 border-[8px] border-slate-200/10 dark:border-white/5 rounded-full"></div>
                <div className="absolute inset-0 border-[8px] border-transparent border-t-brand-teal-500 rounded-full animate-[spin_1.5s_cubic-bezier(0.4,0,0.2,1)_infinite] shadow-[0_0_20px_rgba(76,170,162,0.3)]"></div>

                {/* 2. 中層：輔助藍色軌道 (逆時針) */}
                <div className="absolute inset-4 border-[4px] border-transparent border-b-brand-blue-500/40 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>

                {/* 3. 核心：神經元脈衝球 (v3.4 風格) */}
                <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-full shadow-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 overflow-hidden">
                    {/* 內部流動漸層 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-teal-500/10 to-brand-blue-500/10"></div>
                    
                    {/* 呼吸核心 */}
                    <div className="w-14 h-14 bg-brand-teal-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(76,170,162,0.5)] animate-pulse">
                         <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    
                    {/* 擴散波紋 */}
                    <div className="absolute inset-0 border-4 border-brand-teal-500/20 rounded-full animate-[ping_3s_infinite]"></div>
                </div>
            </div>

            {/* 品牌字體排版 */}
            <div className="relative z-10">
                <p className="text-4xl font-[900] tracking-tighter uppercase text-slate-900 dark:text-white mb-3">
                    {text}
                </p>
                <div className="flex justify-center items-center gap-3">
                    <span className="text-[11px] font-black text-brand-teal-500 tracking-[0.5em] uppercase opacity-70">System Syncing</span>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-brand-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-brand-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-brand-teal-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
