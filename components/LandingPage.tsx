
import React, { useState, useEffect } from 'react';
import Button from './shared/Button';
import Card from './shared/Card';
import { LogoIcon } from './icons/LogoIcon';
import { Language, translations } from '../services/i18n';
import { AiCoreIcon } from './icons/AiCoreIcon';
import { CssHamburger } from './shared/CssHamburger';
import { Screen } from '../types';
import HeroChangelog from './HeroChangelog';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { AnimatedSpeakerIcon } from './icons/AnimatedSpeakerIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

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
    const [isCoreAnimating, setIsCoreAnimating] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative bg-slate-50 dark:bg-[#0B1120] transition-colors duration-700 overflow-x-hidden font-sans">
            
            <HeroChangelog 
                language={language} 
                scrollY={scrollY} 
                onViewChangelog={() => onNavigate(Screen.CHANGELOG)}
            />

            <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 py-4 flex justify-between items-center ${
                scrollY > 500 
                ? 'bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm' 
                : 'bg-transparent'
            }`}>
                <div 
                    className={`flex items-center space-x-3 cursor-pointer transition-opacity duration-300 ${scrollY < 500 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
                    onClick={onLogoClick}
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4caaa2] to-[#3b82f6] rounded-xl flex items-center justify-center shadow-lg">
                        <LogoIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        Neuro<span className="text-[#4caaa2]">Motion</span>
                    </span>
                </div>
                
                <div className={`hidden md:flex items-center space-x-3 transition-opacity duration-300 ${scrollY < 500 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm mr-2">
                         <button 
                            onClick={onToggleMute} 
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                            title={isMuted ? "開啟音效" : "靜音"}
                        >
                            <AnimatedSpeakerIcon isMuted={isMuted} className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                        <button 
                            onClick={toggleTheme} 
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                            title="切換主題"
                        >
                            {theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4 text-brand-teal-500" />}
                        </button>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                        <button 
                            onClick={() => onLanguageChange(language === 'zh-TW' ? 'en' : 'zh-TW')} 
                            className="px-3 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-black text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            {language === 'zh-TW' ? 'EN' : '繁中'}
                        </button>
                    </div>

                    <button onClick={onAdminLoginClick} className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-200 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs transition-all shadow-md">
                        {t.landing.adminPortal[language]}
                    </button>
                </div>

                <div className="md:hidden p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                    <CssHamburger isOpen={false} onClick={onMenuClick} className="text-slate-900 dark:text-white" />
                </div>
            </nav>

            <div className="relative z-30 flex flex-col" style={{ marginTop: '100vh' }}> 
                
                <div className="bg-slate-50 dark:bg-slate-900 min-h-screen relative rounded-t-[3rem] -mt-20 shadow-[0_-20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_-20px_60px_rgba(0,0,0,0.2)] border-t border-slate-100 dark:border-slate-800 pt-24 px-4 pb-20">
                    
                    <div className="max-w-5xl mx-auto text-center space-y-12 mb-32">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-500 dark:text-slate-400 text-xs font-bold tracking-widest uppercase mb-4">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            {t.landing.aiPowered[language]}
                        </div>
                        
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
                            {t.landing.title2[language]}
                            <br/>
                            <span className="text-[#4caaa2]">
                                {t.landing.title1[language]}
                            </span>
                        </h2>

                        <p className="text-xl sm:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto font-medium">
                            {t.landing.subtitle[language]}
                        </p>

                        <div className="pt-8 flex flex-col items-center justify-center opacity-50">
                            <button onClick={() => onNavigate(Screen.INFO_PAGE)} className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-[#4caaa2] transition-colors">
                                <span className="text-sm font-bold uppercase tracking-widest">{t.landing.howItWorks[language]}</span>
                                <ArrowDownIcon className="w-6 h-6 animate-bounce" />
                            </button>
                        </div>
                    </div>

                    <div id="features-section" className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                        <div className="bg-white dark:bg-slate-800/50 p-8 sm:p-12 md:p-16 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4caaa2]/10 to-transparent rounded-bl-[10rem]"></div>
                            
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-8 relative z-10">
                                {t.landing.featureTitle[language]}
                                <span className="text-[#4caaa2] block">{t.landing.featureTitleHighlight[language]}</span>
                            </h3>
                            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium relative z-10">
                                {t.landing.featureDesc[language]}
                            </p>
                            
                            <div className="relative z-10 mb-10">
                                <button onClick={() => onNavigate(Screen.INFO_PAGE)} className="flex items-center gap-2 text-[#4caaa2] font-black text-sm uppercase tracking-widest hover:gap-4 transition-all">
                                    {t.landing.learnMore[language]} <span className="text-lg">→</span>
                                </button>
                            </div>

                            <ul className="space-y-6 relative z-10">
                                {t.landing.featureList[language].map((item, i) => (
                                    <li key={i} className="flex items-center gap-5 text-slate-700 dark:text-slate-300 font-bold text-lg group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#4caaa2] group-hover:bg-[#4caaa2] group-hover:text-white transition-colors">✓</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div 
                            className="bg-slate-100 dark:bg-slate-800/30 p-6 sm:p-10 rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center relative overflow-hidden group cursor-pointer"
                            onClick={() => { setIsCoreAnimating(true); setTimeout(() => setIsCoreAnimating(false), 1000); }}
                        >
                            <div className="absolute inset-0 figma-grid opacity-30"></div>
                            <div className="relative z-10 transition-transform duration-700 group-hover:scale-105">
                                <AiCoreIcon isAnimating={isCoreAnimating} className="w-72 h-72 drop-shadow-2xl" />
                            </div>
                            <p className="absolute bottom-8 text-slate-400 dark:text-slate-500 font-black tracking-[0.2em] uppercase text-xs bg-white/50 dark:bg-slate-900/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50 dark:border-slate-700">
                                {t.landing.aiCore[language]}
                            </p>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto mt-32 mb-20">
                        <Card className="bg-slate-900 text-center !p-8 sm:!p-16 !rounded-[4rem] relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 z-0"></div>
                             <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#4caaa2]/20 blur-[100px] rounded-full z-0"></div>

                             <div className="relative z-10">
                                <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tighter">
                                    {t.landing.ctaTitle[language]}
                                </h2>
                                <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-medium">
                                    {t.landing.subtitle[language]}
                                </p>
                                
                                <Button onClick={onStart} className="w-full sm:w-auto px-12 py-6 text-xl sm:px-16 sm:py-8 sm:text-2xl rounded-[2.5rem] bg-[#4caaa2] hover:bg-[#3d8b85] text-white shadow-[0_20px_50px_rgba(76,170,162,0.3)] hover:shadow-[0_30px_60px_rgba(76,170,162,0.5)] border-none transform hover:-translate-y-1 transition-all duration-300">
                                    {t.landing.startTest[language]}
                                </Button>
                                
                                <p className="mt-8 text-slate-500 text-sm font-bold tracking-wide uppercase">
                                    {t.landing.ctaDesc[language]}
                                </p>
                             </div>
                        </Card>
                    </div>

                </div>

                <footer className="bg-white dark:bg-slate-900 pt-24 pb-12 border-t border-slate-100 dark:border-slate-800">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
                        <div className="flex items-center gap-3 mb-8">
                             <div className="w-8 h-8 bg-[#4caaa2] rounded-lg flex items-center justify-center">
                                <LogoIcon className="w-5 h-5 text-white" />
                             </div>
                             <span className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tight">NeuroMotion</span>
                        </div>
                        <div className="flex gap-10 text-sm font-bold text-slate-500 dark:text-slate-400 mb-10">
                            <button onClick={() => onNavigate(Screen.PRIVACY_POLICY)} className="hover:text-[#4caaa2] transition-colors">{t.landing.privacyPolicy[language]}</button>
                            <button onClick={() => onNavigate(Screen.TERMS_OF_SERVICE)} className="hover:text-[#4caaa2] transition-colors">{t.landing.termsOfService[language]}</button>
                        </div>
                        <p className="text-slate-400 text-xs font-medium">
                            {t.landing.footerCopyright[language]}
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
