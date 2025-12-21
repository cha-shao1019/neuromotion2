
import React, { useState, useEffect } from 'react';
import Button from './shared/Button';
import Card from './shared/Card';
import { LogoIcon } from './icons/LogoIcon';
import { Language, translations } from '../services/i18n';
import { AiCoreIcon } from './icons/AiCoreIcon';
import { Screen } from '../types';
import HeroChangelog from './HeroChangelog';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { AnimatedSpeakerIcon } from './icons/AnimatedSpeakerIcon';

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
                <div className={`flex items-center gap-3 cursor-pointer transition-opacity ${scrollY > 100 ? 'opacity-100' : 'opacity-0'}`} onClick={onLogoClick}>
                    <div className="w-8 h-8 bg-brand-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                        <LogoIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-black dark:text-white uppercase tracking-tighter">NeuroMotion</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 p-1 bg-white/50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
                        <button onClick={onToggleMute} className="w-8 h-8 flex items-center justify-center text-slate-500"><AnimatedSpeakerIcon isMuted={isMuted} className="w-4 h-4" /></button>
                        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center text-slate-500">{theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4 text-brand-teal-500" />}</button>
                    </div>
                    <button onClick={onAdminLoginClick} className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs">後台儀表板</button>
                    <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-900 dark:text-white">選單</button>
                </div>
            </nav>

            <div className="relative z-30" style={{ marginTop: '100vh' }}> 
                <div className="bg-slate-50 dark:bg-slate-900 min-h-screen rounded-t-[4rem] border-t border-slate-100 dark:border-slate-800 py-32 px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <h2 className="text-5xl sm:text-7xl font-black dark:text-white tracking-tighter leading-none">
                            居家檢測<br/><span className="text-brand-teal-500">不再遙不可及</span>
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">運用 AI 視覺分析技術，讓帕金森初步篩檢更快速、更私密。</p>
                        <Button onClick={onStart} className="px-12 py-6 text-2xl">立即開始測試</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
