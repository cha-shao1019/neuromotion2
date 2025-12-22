
import React, { useState, useEffect } from 'react';
import Button from './shared/Button';
import { LogoIcon } from './icons/LogoIcon';
import { Language, translations } from '../services/i18n';
import { Screen } from '../types';
import HeroChangelog from './HeroChangelog';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { AnimatedSpeakerIcon } from './icons/AnimatedSpeakerIcon';
import { UserIcon } from './icons/UserIcon';
import { CssHamburger } from './shared/CssHamburger';

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
        <div className="relative bg-slate-50 dark:bg-[#0B1120] transition-colors duration-700 overflow-x-hidden">
            <HeroChangelog language={language} scrollY={scrollY} />

            <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-4 sm:px-8 py-4 flex justify-between items-center ${
                scrollY > 50 ? 'bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm' : 'bg-transparent'
            }`}>
                {/* 左側 Logo 與 電腦版選單 */}
                <div className="flex items-center gap-4 sm:gap-12">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={onLogoClick}>
                        <div className="w-8 h-8 bg-brand-teal-500 rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                            <LogoIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-black dark:text-white uppercase tracking-tighter hidden xs:inline">NeuroMotion</span>
                    </div>

                    {/* 電腦版導覽：只在 lg 以上顯示 */}
                    <div className="hidden lg:flex items-center gap-8">
                        <button onClick={() => onNavigate(Screen.INFO_PAGE)} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 transition-colors whitespace-nowrap">
                            {t.landing.howItWorks[language]}
                        </button>
                        <button onClick={() => onNavigate(Screen.CHANGELOG)} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 transition-colors whitespace-nowrap">
                            日誌
                        </button>
                    </div>
                </div>

                {/* 右側功能按鈕區 */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* 主題與靜音切換：手機版隱藏以節省空間 */}
                    <div className="hidden sm:flex items-center gap-2 p-1 bg-white/50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
                        <button onClick={onToggleMute} className="w-8 h-8 flex items-center justify-center text-slate-500 transition-colors hover:text-brand-teal-500">
                            <AnimatedSpeakerIcon isMuted={isMuted} className="w-4 h-4" />
                        </button>
                        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center text-slate-500 transition-colors hover:text-brand-teal-500">
                            {theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4 text-brand-teal-500" />}
                        </button>
                    </div>

                    {/* 管理端入口：修正為更專業的視覺樣式 */}
                    <button
                        onClick={onAdminLoginClick}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white rounded-lg whitespace-nowrap shadow-lg shadow-brand-teal-500/20 transition-all cursor-pointer border border-white/10"
                    >
                        <UserIcon className="w-4 h-4" />
                        <span className="text-sm font-bold tracking-tight">管理端入口</span>
                    </button>

                    {/* 手機版漢堡選單：僅在 lg 以下顯示，並解決重複問題 */}
                    <div className="lg:hidden flex items-center">
                        <CssHamburger isOpen={false} onClick={onMenuClick} className="text-slate-900 dark:text-white" />
                    </div>
                </div>
            </nav>

            {/* 下方 Hero 內容區 */}
            <div className="relative z-30" style={{ marginTop: '100vh' }}>
                <div className="bg-slate-50 dark:bg-[#0B1120] min-h-screen rounded-t-[3rem] sm:rounded-t-[4rem] border-t border-slate-100 dark:border-slate-800 py-24 sm:py-32 px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8 sm:y-12">
                        <h2 className="text-5xl sm:text-7xl font-black dark:text-white tracking-tighter leading-none animate-reveal">
                            居家檢測<br/><span className="text-brand-teal-500 font-extrabold">不再遙不可及</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto animate-reveal [animation-delay:200ms]">
                            運用 AI 視覺分析技術，為長者提供快速且具備隱私保護的帕金森初步篩檢方案。
                        </p>
                        <div className="pt-4 animate-reveal [animation-delay:400ms]">
                            <Button onClick={onStart} className="px-10 py-5 sm:px-12 sm:py-6 text-xl sm:text-2xl shadow-2xl shadow-brand-teal-500/30">
                                立即開始測試
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;