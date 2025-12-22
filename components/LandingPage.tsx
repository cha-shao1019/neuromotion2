
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

    const principles = [
        { id: '01', icon: '📝', title: '臨床級問卷', desc: '對標 MDS-UPDRS 量表，初步評估主觀運動障礙。', color: 'bg-emerald-500' },
        { id: '02', icon: '🖐️', title: '影像動態捕捉', desc: 'Mediapipe 邊緣運算技術，即時提取運動特徵點。', color: 'bg-blue-500' },
        { id: '03', icon: '🧠', title: 'AI 臨床解析', desc: 'Gemini 模型深度分析震顫頻率與振幅衰減趨勢。', color: 'bg-purple-500' }
    ];

    return (
        <div className="relative bg-slate-50 dark:bg-[#0B1120] transition-colors duration-700 overflow-x-hidden">
            <HeroChangelog language={language} scrollY={scrollY} />

            <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-4 sm:px-8 py-4 flex justify-between items-center ${
                scrollY > 50 ? 'bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm' : 'bg-transparent'
            }`}>
                <div className="flex items-center gap-4 sm:gap-12">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={onLogoClick}>
                        <div className="w-8 h-8 bg-brand-teal-500 rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                            <LogoIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-black dark:text-white uppercase tracking-tighter hidden xs:inline">NeuroMotion</span>
                    </div>
                    
                    {/* 電腦版導覽文字按鈕 */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <button onClick={() => onNavigate(Screen.INFO_PAGE)} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 transition-colors">{t.landing.howItWorks[language]}</button>
                        <button onClick={() => onNavigate(Screen.CHANGELOG)} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 transition-colors">日誌</button>
                        <button onClick={() => onNavigate(Screen.CLINICAL_REFERENCE)} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 transition-colors">標準</button>
                    </nav>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 p-1 bg-white/50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
                        <button onClick={onToggleMute} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-brand-teal-500"><AnimatedSpeakerIcon isMuted={isMuted} className="w-4 h-4" /></button>
                        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-brand-teal-500">{theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4 text-brand-teal-500" />}</button>
                    </div>
                    
                    <button 
                        onClick={onAdminLoginClick} 
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs whitespace-nowrap min-w-max shadow-xl hover:scale-105 transition-all"
                    >
                        <UserIcon className="w-4 h-4" />
                        管理端入口
                    </button>
                    
                    <div className="lg:hidden">
                        <CssHamburger isOpen={false} onClick={onMenuClick} className="text-slate-900 dark:text-white" />
                    </div>
                </div>
            </nav>

            <div className="relative z-30" style={{ marginTop: '100vh' }}> 
                <div className="bg-slate-50 dark:bg-slate-900 min-h-screen rounded-t-[4rem] border-t border-slate-100 dark:border-slate-800 py-32 px-4 space-y-40">
                    
                    {/* Hero Intro */}
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <h2 className="text-6xl sm:text-8xl font-black dark:text-white tracking-tighter leading-none animate-reveal">
                            居家檢測<br/><span className="text-brand-teal-500">不再遙不可及</span>
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">運用 AI 視覺分析技術，讓帕金森初步篩檢更快速、更私密。為長者設計，操作極簡化。</p>
                        <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center">
                            <Button onClick={onStart} className="px-16 py-8 text-2xl animate-pulse">立即開始測試</Button>
                            <Button onClick={() => onNavigate(Screen.INFO_PAGE)} variant="secondary" className="px-12">詳細原理介紹</Button>
                        </div>
                    </div>

                    {/* 校正回歸：運作原理區段 */}
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-24">
                            <h3 className="text-xs font-black text-brand-teal-500 uppercase tracking-[0.5em] mb-4">Core Principles</h3>
                            <h4 className="text-4xl sm:text-5xl font-black dark:text-white tracking-tight">網站運作原理</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {principles.map((p, i) => (
                                <Card key={i} className="flex flex-col items-center text-center !p-12 hover:border-brand-teal-500/50 transition-all hover:translate-y-[-10px] duration-500 bg-white dark:bg-slate-800 shadow-2xl">
                                    <div className={`w-20 h-20 ${p.color} text-white text-4xl flex items-center justify-center rounded-[2rem] shadow-2xl mb-10`}>
                                        {p.icon}
                                    </div>
                                    <h5 className="text-2xl font-black mb-6 dark:text-white">{p.title}</h5>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{p.desc}</p>
                                    <span className="mt-8 font-mono text-brand-teal-500 font-bold opacity-30">{p.id}</span>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Trust/Privacy Section */}
                    <div className="max-w-5xl mx-auto bg-slate-900 dark:bg-brand-teal-500 rounded-[5rem] p-16 md:p-24 text-center text-white space-y-10 shadow-3xl relative overflow-hidden">
                        <div className="absolute inset-0 figma-grid opacity-10"></div>
                        <h4 className="text-5xl font-black tracking-tighter relative z-10">您的隱私，我們全力守護</h4>
                        <p className="text-2xl opacity-80 max-w-3xl mx-auto font-medium leading-relaxed relative z-10">我們採用邊緣運算技術，所有的影像檢測均在您的裝置本地處理，絕不儲存或傳輸任何原始畫面。</p>
                        <div className="flex justify-center gap-12 pt-8 relative z-10">
                            <div className="text-center"><p className="text-3xl font-black">100%</p><p className="text-xs uppercase opacity-50 font-bold">本地處理</p></div>
                            <div className="text-center"><p className="text-3xl font-black">0%</p><p className="text-xs uppercase opacity-50 font-bold">影像上傳</p></div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="pt-20 pb-16 text-center space-y-10 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-center gap-10 text-sm font-black text-slate-400 dark:text-slate-500">
                            <button onClick={() => onNavigate(Screen.PRIVACY_POLICY)} className="hover:text-brand-teal-500 transition-colors uppercase tracking-widest">Privacy</button>
                            <button onClick={() => onNavigate(Screen.TERMS_OF_SERVICE)} className="hover:text-brand-teal-500 transition-colors uppercase tracking-widest">Terms</button>
                            <button onClick={() => onNavigate(Screen.CHANGELOG)} className="hover:text-brand-teal-500 transition-colors uppercase tracking-widest">Changelog</button>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center"><LogoIcon className="w-5 h-5 opacity-40" /></div>
                            <p className="text-[10px] text-slate-300 dark:text-slate-600 font-black tracking-[0.4em] uppercase">© 2025 NEUROMOTION AI PROJECT. v3.4.6</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
