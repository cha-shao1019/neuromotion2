
import SmartGuard from './components/SmartGuard';
import React, { useState, useCallback, useEffect } from 'react';
import { Screen, ScreeningResults, AdminData } from './types';
import LandingPage from './components/LandingPage';
import InfoPage from './components/InfoPage';
import PreQuestionnaireInfo from './components/PreQuestionnaireInfo';
import Questionnaire from './components/Questionnaire';
import QuestionnaireResult from './components/QuestionnaireResult';
import TestSelectionPage from './components/TestSelectionPage';
import FingerTapTest from './components/FingerTapTest';
import MaskedFaceTest from './components/MaskedFaceTest';
import FinalReport from './components/FinalReport';
import AdminDashboard from './components/AdminDashboard';
import AiAssistant from './components/AiAssistant';
import MobileMenu from './components/MobileMenu';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';
import { AnimatedSpeakerIcon } from './components/icons/AnimatedSpeakerIcon';
import { translations, Language } from './services/i18n';
import audioService from './services/audioService';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import { runHealthCheck } from './services/healthCheckService';
import Loader from './components/shared/Loader';
import SystemStatusModal from './components/shared/SystemStatusModal';
import ChangelogPage from './components/ChangelogPage';
import ClinicalReferencePage from './components/ClinicalReferencePage';
import { LogoIcon } from './components/icons/LogoIcon';
import { CssHamburger } from './components/shared/CssHamburger';
import { UserIcon } from './components/icons/UserIcon';

export type Theme = 'light' | 'dark';
export type MobileMenuAction = 'features' | 'changelog' | 'clinical_reference' | 'contact' | 'admin' | null;

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LANDING);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [language, setLanguage] = useState<Language>('zh-TW');
    const [theme, setTheme] = useState<Theme>('light');
    const [isMuted, setIsMuted] = useState(false);
    const [systemError, setSystemError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    const [results, setResults] = useState<ScreeningResults>({
        userId: `user_${Math.random().toString(36).substr(2, 9)}`,
        age: null, gender: null, medicalHistory: null, questionnaireScore: null,
        questionnaireAnalysis: null, fingerTapResult: null, fingerTapAnalysis: null,
        maskedFaceResult: null, maskedFaceAnalysis: null, finalAnalysis: null,
    });

    const t = translations;

    useEffect(() => {
        const handleAIRepair = (e: any) => {
            console.log("React 接收到 AI 修復指令:", e.detail);

            // 邏輯：如果用戶正在進行測試，則重置或優化當前測試
            if (currentScreen === Screen.FINGER_TAP_TEST) {
                // 這裡可以發送一個訊號給 FingerTapTest 組件
                // 或是簡單地彈出提示告知用戶正在校準
                console.log("正在校準指尖點按偵測...");
            }
        };

        window.addEventListener('ai-repair-trigger', handleAIRepair);
        return () => window.removeEventListener('ai-repair-trigger', handleAIRepair);
    }, [currentScreen]);

    // 穩定化主題與背景色
    useEffect(() => {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        document.body.style.backgroundColor = isDark ? '#0B1120' : '#f8fafc';
        document.body.className = isDark ? 'dark bg-[#0B1120] text-slate-100' : 'bg-slate-50 text-slate-900';
    }, [theme]);

    useEffect(() => {
        runHealthCheck().then(res => {
            if (!res.success) setSystemError(res.error);
            setIsChecking(false);
            audioService.init();
        });
    }, []);

    const navigate = useCallback((screen: Screen) => {
        setIsTransitioning(true);
        audioService.playTransition();
        setTimeout(() => {
            setCurrentScreen(screen);
            setIsTransitioning(false);
            window.scrollTo(0, 0);
        }, 300);
    }, []);

    const renderContent = () => {
        const p = { language, t };
        switch (currentScreen) {
            case Screen.LANDING: return <LandingPage 
                onStart={() => navigate(Screen.PRE_QUESTIONNAIRE_INFO)} 
                onLogoClick={() => navigate(Screen.LANDING)} 
                onAdminLoginClick={() => navigate(Screen.ADMIN_DASHBOARD)} 
                onMenuClick={() => setIsMobileMenuOpen(true)} 
                onLanguageChange={setLanguage} 
                onNavigate={navigate} 
                theme={theme} 
                toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
                isMuted={isMuted}
                onToggleMute={() => { setIsMuted(!isMuted); audioService.setMuted(!isMuted); }}
                {...p} 
            />;
            case Screen.PRE_QUESTIONNAIRE_INFO: return <PreQuestionnaireInfo onSubmit={(age, gender, medicalHistory) => { setResults(r => ({...r, age, gender, medicalHistory})); navigate(Screen.QUESTIONNAIRE); }} {...p} />;
            case Screen.QUESTIONNAIRE: return <Questionnaire onSubmit={(score) => { setResults(r => ({...r, questionnaireScore: score})); navigate(Screen.QUESTIONNAIRE_RESULT); }} {...p} />;
            case Screen.QUESTIONNAIRE_RESULT: return <QuestionnaireResult score={results.questionnaireScore!} onAnalysisComplete={a => setResults(r => ({...r, questionnaireAnalysis: a}))} onProceedToTestSelection={() => navigate(Screen.TEST_SELECTION)} {...p} />;
            case Screen.TEST_SELECTION: return <TestSelectionPage onStartTests={(tests) => { if (tests.length > 0) navigate(tests.includes('finger') ? Screen.FINGER_TAP_TEST : Screen.MASKED_FACE_TEST); else navigate(Screen.FINAL_REPORT); }} {...p} />;
            case Screen.FINGER_TAP_TEST: return <FingerTapTest onComplete={(res, analysis) => { setResults(r => ({...r, fingerTapResult: res, fingerTapAnalysis: analysis})); navigate(Screen.MASKED_FACE_TEST); }} {...p} />;
            case Screen.MASKED_FACE_TEST: return <MaskedFaceTest onComplete={(res, analysis) => { setResults(r => ({...r, maskedFaceResult: res, maskedFaceAnalysis: analysis})); navigate(Screen.FINAL_REPORT); }} {...p} />;
            case Screen.FINAL_REPORT: return <FinalReport results={results} onStartOver={() => navigate(Screen.LANDING)} onReportSaved={() => {}} {...p} />;
            case Screen.INFO_PAGE: return <InfoPage onBack={() => navigate(Screen.LANDING)} {...p} />;
            case Screen.CHANGELOG: return <ChangelogPage onBack={() => navigate(Screen.LANDING)} {...p} />;
            case Screen.CLINICAL_REFERENCE: return <ClinicalReferencePage onBack={() => navigate(Screen.LANDING)} {...p} />;
            case Screen.ADMIN_DASHBOARD: return <AdminDashboard data={[]} onExit={() => navigate(Screen.LANDING)} loggedInAdmin="Guest Doctor" onNavigate={navigate} {...p} />;
            case Screen.PRIVACY_POLICY: return <PrivacyPolicyPage onBack={() => navigate(Screen.LANDING)} {...p} />;
            case Screen.TERMS_OF_SERVICE: return <TermsOfServicePage onBack={() => navigate(Screen.LANDING)} {...p} />;
            default: return <LandingPage onStart={() => {}} onLogoClick={() => {}} onAdminLoginClick={() => {}} onMenuClick={() => {}} onLanguageChange={() => {}} onNavigate={() => {}} theme={theme} toggleTheme={() => {}} isMuted={isMuted} onToggleMute={() => {}} {...p} />;
        }
    };

    if (isChecking) return <div className="min-h-screen flex items-center justify-center dark:bg-[#0B1120]"><Loader text={t.app.initializing[language]} /></div>;

    return (
        <SmartGuard>
         <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'dark' : ''}`}>
            {systemError && <SystemStatusModal error={systemError} onRestart={() => window.location.reload()} onContinue={() => setSystemError(null)} />}
            
            {currentScreen !== Screen.LANDING && (
                <header className="fixed top-0 left-0 w-full px-4 sm:px-8 py-4 z-[100] flex justify-between items-center bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-all">
                    <div className="flex items-center gap-4 sm:gap-12">
                        {/* Logo 點擊一律返回首頁 */}
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(Screen.LANDING)}>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-teal-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg">
                                <LogoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <span className="font-black text-lg sm:text-2xl text-slate-900 dark:text-white uppercase hidden xs:inline tracking-tighter">NeuroMotion</span>
                        </div>
                        
                        {/* 電腦版選單 */}
                        <nav className="hidden lg:flex items-center gap-8">
                            <button onClick={() => navigate(Screen.INFO_PAGE)} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 transition-colors">運作原理</button>
                            <button onClick={() => navigate(Screen.CHANGELOG)} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 transition-colors">日誌</button>
                            <button 
                                onClick={() => navigate(Screen.ADMIN_DASHBOARD)} 
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-xl hover:scale-105 transition-all"
                            >
                                <UserIcon className="w-4 h-4" />
                                管理端
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                            <button onClick={() => { setIsMuted(!isMuted); audioService.setMuted(!isMuted); }} className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                                <AnimatedSpeakerIcon isMuted={isMuted} className="w-4 h-4" />
                            </button>
                            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="p-1.5 text-slate-500 hover:scale-110 transition-transform">
                                {theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4 text-brand-teal-400" />}
                            </button>
                        </div>
                        <div className="lg:hidden">
                            <CssHamburger isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(true)} className="text-slate-900 dark:text-white" />
                        </div>
                    </div>
                </header>
            )}

            <main className={`${currentScreen !== Screen.LANDING ? 'pt-24 pb-20' : ''} transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {renderContent()}
            </main>

            {currentScreen !== Screen.LANDING && currentScreen !== Screen.ADMIN_DASHBOARD && (
                <div className="fixed bottom-6 right-6 z-[150]">
                    <AiAssistant language={language} t={t} results={results} />
                </div>
            )}

            {isMobileMenuOpen && (
                <MobileMenu 
                    isExiting={false}
                    onClose={(action: MobileMenuAction) => {
                        setIsMobileMenuOpen(false);
                        if (!action) return;
                        if (action === 'admin') navigate(Screen.ADMIN_DASHBOARD);
                        else if (action === 'features') navigate(Screen.INFO_PAGE);
                        else if (action === 'changelog') navigate(Screen.CHANGELOG);
                    }}
                    onLanguageChange={setLanguage}
                    theme={theme}
                    onThemeChange={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                    language={language}
                    t={t}
                />
            )}
         </div>
        </SmartGuard>
    );
};

export default App;

