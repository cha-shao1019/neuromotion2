
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';

interface HeroChangelogProps {
    language: 'zh-TW' | 'en';
    scrollY: number;
    onViewChangelog?: () => void;
}

const HeroChangelog: React.FC<HeroChangelogProps> = ({ language, scrollY }) => {
    // 簡化捲動淡出邏輯，移除位移與縮放，讓體驗更平穩
    const progress = Math.min(1, scrollY / 400); 
    const opacity = Math.max(0, 1 - progress); 

    if (opacity <= 0.01) return null;

    return (
        <div 
            className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden z-[50] bg-slate-50 dark:bg-[#0B1120]"
            style={{ opacity, pointerEvents: progress > 0.95 ? 'none' : 'auto' }}
        >
            {/* 背景層：Figma 風格網格 + 柔和醫療藍綠光暈 */}
            <div className="absolute inset-0 figma-grid opacity-60"></div>
            
            {/* 頂部光暈 - 模擬自然光 */}
            <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-[#4caaa2]/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-400/10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-lighten"></div>
            
            {/* 內容容器 */}
            <div 
                className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-7xl mx-auto"
            >
                {/* 頂部標籤 - 膠囊設計 (優化對比度) */}
                <div className="flex items-center gap-3 mb-12 px-6 py-3 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 shadow-md backdrop-blur-md">
                    <LogoIcon className="w-5 h-5 text-[#4caaa2]" />
                    <span className="text-xs font-black text-slate-600 dark:text-slate-300 tracking-[0.2em] uppercase">
                        {language === 'zh-TW' ? 'v3.4.6 · 臨床級居家篩檢' : 'v3.4.6 · Clinical Home Screening'}
                    </span>
                </div>

                {/* 主標題 - 修正顏色顯示問題，使用 Hex 色碼確保漸層可見 */}
                <h1 className="flex flex-col md:flex-row items-center justify-center text-center select-none mb-16 gap-0 md:gap-4">
                    <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-[900] text-slate-900 dark:text-white tracking-tighter leading-none">
                        NEURO
                    </span>
                    <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-[900] text-transparent bg-clip-text bg-gradient-to-r from-[#4caaa2] to-[#3b82f6] tracking-tighter leading-none pb-2">
                        MOTION
                    </span>
                </h1>

                {/* 捲動引導 - 懸浮按鈕 */}
                <div className="flex flex-col items-center gap-4 animate-bounce">
                    <div className="flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-slate-900 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-default group border border-slate-700">
                        <span className="text-xs sm:text-sm font-bold tracking-widest uppercase group-hover:text-[#4caaa2] transition-colors">
                            {language === 'zh-TW' ? '向下滑動了解詳情' : 'Scroll Down'}
                        </span>
                        <ArrowDownIcon className="w-4 h-4 text-[#4caaa2]" />
                    </div>
                </div>
            </div>
            
            {/* 底部漸層遮罩，讓捲動連接更自然 */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-[#0B1120] to-transparent pointer-events-none"></div>
        </div>
    );
};

export default HeroChangelog;
