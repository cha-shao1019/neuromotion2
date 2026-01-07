import React, { useState, useEffect } from 'react';
import Button from './shared/Button';
import Card from './shared/Card';
import { LogoIcon } from './icons/LogoIcon';
import { Language, translations } from '../services/i18n';
import { Screen } from '../types';
import HeroChangelog from './HeroChangelog';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { AnimatedSpeakerIcon } from './icons/AnimatedSpeakerIcon';
import { AiCoreIcon } from './icons/AiCoreIcon';
// 假設你有一個 ClinicalIcon，若無可用 LogoIcon 代替
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface LandingPageProps {
    onStart: () => void;
    onLogoClick: () => void;
    onAdminLoginClick: () => void;
    onMenuClick: () => void;
    onLanguageChange: (lang: Language) => void;
    onNavigate: (screen: Screen) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    isMuted: boolean;
    onToggleMute: () => void;
    language: Language;
    t: typeof translations;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogoClick, onAdminLoginClick, onMenuClick, onLanguageChange, onNavigate, theme, toggleTheme, isMuted, onToggleMute, language, t }) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative bg-white dark:bg-[#0B1120] transition-colors duration-700 overflow-x-hidden font-sans">
            <HeroChangelog language={language} scrollY={scrollY} />

            {/* --- 專業導覽列 --- */}
            <nav className={`fixed top-0 w-full z-[100] px-8 py-5 flex justify-between items-center transition-all duration-500 ${
                scrollY > 50 ? 'bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
            }`}>
                <div className="flex items-center gap-8">
                    {/* 1. 左上角 Logo：引導進出介紹頁 */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-all"
                        onClick={() => onNavigate(Screen.INFO_PAGE)}
                    >
                        <div className="w-10 h-10 bg-brand-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all">
                            <LogoIcon className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black dark:text-white uppercase tracking-tighter leading-none">NeuroMotion</span>
                            <span className="text-[9px] font-bold text-brand-teal-500 tracking-widest uppercase opacity-80">
                                {language === 'zh' ? '系統導覽' : 'System Info'}
                            </span>
                        </div>
                    </div>

                    {/* 2. 臨床數據對照按鈕：修復語言切換與跳轉 */}
                    <div
                        className="hidden md:flex items-center gap-2 cursor-pointer group px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        onClick={() => onNavigate(Screen.CLINICAL_DATA)}
                    >
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-brand-teal-500 transition-colors">
                            <AiCoreIcon className="w-4 h-4 text-slate-500 group-hover:text-white" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                            {language === 'zh' ? '臨床數據對照' : 'Clinical Comparison'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-white/5">
                        <button onClick={onToggleMute} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-brand-teal-500"><AnimatedSpeakerIcon isMuted={isMuted} className="w-4 h-4" /></button>
                        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-brand-teal-500">{theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4 text-brand-teal-500" />}</button>
                        <button onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')} className="px-2 text-[10px] font-black hover:text-brand-teal-500 transition-colors">
                            {language === 'zh' ? 'EN' : '中文'}
                        </button>
                    </div>
                    <button onClick={onAdminLoginClick} className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-xl hover:bg-brand-teal-600 transition-all">醫護端登入</button>
                </div>
            </nav>

            {/* --- 主內容區段 --- */}
            <div className="relative z-30" style={{ marginTop: '100vh' }}>
                <div className="bg-white dark:bg-slate-900 min-h-screen rounded-t-[5rem] border-t border-slate-100 dark:border-white/5 py-40 px-6">
                    <div className="max-w-5xl mx-auto text-center">

                        {/* A. NeuroMotion 大標題 */}
                        <div className="space-y-8 mb-20">
                            <h2 className="text-7xl sm:text-9xl font-black dark:text-white tracking-tighter leading-[0.85] animate-reveal">
                                帕金森<br/><span className="text-brand-teal-500 font-black">數位精準篩檢</span>
                            </h2>
                            <p className="text-xl text-slate-400 dark:text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                                {language === 'zh'
                                    ? "結合 MDS-UPDRS 臨床量表標準與 Gemini 1.5 Flash 多模態分析。"
                                    : "Combining MDS-UPDRS clinical standards with Gemini 1.5 Flash multi-modal analysis."}
                            </p>
                        </div>

                        {/* B. 具有設計感與互動動畫的區塊 (原理裝飾區) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 px-4">
                            {[
                                { title: language === 'zh' ? "智慧量表" : "Smart Scale", icon: "📋", desc: "Digital MDS-UPDRS" },
                                { title: language === 'zh' ? "視覺辨識" : "Vision AI", icon: "📷", desc: "Edge AI Tracking" },
                                { title: language === 'zh' ? "深度解析" : "Deep Analysis", icon: "🧠", desc: "Tremor Evaluation" }
                            ].map((item, idx) => (
                                <div key={idx} className="group relative p-12 rounded-[3.5rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 cursor-pointer overflow-hidden">
                                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-brand-teal-500/5 rounded-full group-hover:scale-[3.5] transition-transform duration-1000"></div>
                                    <div className="text-6xl mb-8 transform group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500 relative z-10">{item.icon}</div>
                                    <h4 className="text-2xl font-black dark:text-white mb-4 relative z-10">{item.title}</h4>
                                    <p className="text-[10px] font-black text-brand-teal-500 uppercase tracking-[0.3em] relative z-10 opacity-60">{item.desc}</p>
                                    <div className="mt-8 w-12 h-1.5 bg-brand-teal-500/10 rounded-full overflow-hidden relative z-10 mx-auto">
                                        <div className="w-full h-full bg-brand-teal-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* C. 開始測驗按鍵區段 */}
                        <div className="flex flex-col items-center gap-10 pb-40">
                            <Button
                                onClick={onStart}
                                className="px-24 py-12 text-3xl font-black rounded-[3rem] shadow-3xl shadow-brand-teal-500/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                {language === 'zh' ? '啟動臨床檢測程序' : 'Start Clinical Testing'}
                            </Button>
                            <div className="flex items-center gap-4 text-slate-300 dark:text-slate-700">
                                <div className="w-12 h-[1px] bg-current"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.5em]">NeuroMotion Clinical Edition v3.4.6</span>
                                <div className="w-12 h-[1px] bg-current"></div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <footer className="mt-40 pt-20 pb-16 text-center border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">
                            <button onClick={() => onNavigate(Screen.PRIVACY_POLICY)} className="hover:text-brand-teal-500 transition-colors">Privacy Policy</button>
                            <button onClick={() => onNavigate(Screen.CHANGELOG)} className="hover:text-brand-teal-500 transition-colors">System Changelog</button>
                        </div>
                        <div className="flex flex-col items-center gap-4 opacity-30">
                            <LogoIcon className="w-5 h-5 grayscale" />
                            <p className="text-[9px] font-black tracking-[0.5em] uppercase">© 2025 NEUROMOTION AI PROJECT</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;