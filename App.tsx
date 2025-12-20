
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
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
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
import { getReports } from './services/reportService';
import AdminManageUsers from './components/AdminManageUsers';

export type Theme = 'light' | 'dark';
export type MobileMenuAction = 'features' | 'changelog' | 'clinical_reference' | 'contact' | 'admin' | null;

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LANDING);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [language, setLanguage] = useState<Language>('zh-TW');
    const [theme, setTheme] = useState<Theme>('light'); // 預設為 light
    const [isMuted, setIsMuted] = useState(false);
    const [systemError, setSystemError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const [loggedInAdmin, setLoggedInAdmin] = useState<string | null>(null);
    const [adminData, setAdminData] = useState<AdminData[]>([]);

    const [results, setResults] = useState<ScreeningResults>({
        userId: `user_${Math.random().toString(36).substr(2, 9)}`,
        age: null, gender: null, medicalHistory: null, questionnaireScore: null,
        questionnaireAnalysis: null, fingerTapResult: null, fingerTapAnalysis: null,
        maskedFaceResult: null, maskedFaceAnalysis: null, finalAnalysis: null,
    });

    const t = translations;

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.body.style.backgroundColor = theme === 'dark' ? '#0B1120' : '#F8FAFC';
    }, [theme]);

    useEffect(() => {
        runHealthCheck().then(res => {
            if (!res.success) setSystemError(res.error);
            setIsChecking(false);
            audioService.init();
        });
        setAdminData(getReports());
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

    const toggleMute = () => {
        setIsMuted(!isMuted); 
        audioService.setMuted(!isMuted);
    };

    const renderContent = () => {
        const p = { language, t };
        switch (currentScreen) {
            case Screen.LANDING: return <LandingPage 
                onStart={() => navigate(Screen.PRE_QUESTIONNAIRE_INFO)} 
                onLogoClick={() => navigate(Screen.INFO_PAGE)} 
                onAdminLoginClick={() => navigate(Screen.ADMIN_LOGIN)} 
                onMenuClick={() => setIsMobileMenuOpen(true)} 
                onLanguageChange={setLanguage} 
                onNavigate={navigate} 
                theme={theme} 
                toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
                isMuted={isMuted}
                onToggleMute={toggleMute}
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
            case Screen.ADMIN_LOGIN: return <AdminLogin onLoginSuccess={(username) => { setLoggedInAdmin(username); navigate(Screen.ADMIN_DASHBOARD); }} onExit={() => navigate(Screen.LANDING)} onGoToRegister={() => navigate(Screen.ADMIN_REGISTER)} {...p} />;
            case Screen.ADMIN_REGISTER: return <AdminRegister onRegisterSuccess={() => navigate(Screen.ADMIN_DASHBOARD)} onGoToLogin={() => navigate(Screen.ADMIN_LOGIN)} {...p} />;
            case Screen.ADMIN_DASHBOARD: return <AdminDashboard data={adminData} onExit={() => { setLoggedInAdmin(null); navigate(Screen.LANDING); }} loggedInAdmin={loggedInAdmin} onNavigate={navigate} {...p} />;
            case Screen.ADMIN_MANAGE_USERS: return <AdminManageUsers onBack={() => navigate(Screen.ADMIN_DASHBOARD)} {...p} />;
            case Screen.PRIVACY_POLICY: return <PrivacyPolicyPage onBack={() => navigate(Screen.LANDING)} {...p} />;
            case Screen.TERMS_OF_SERVICE: return <TermsOfServicePage onBack={() => navigate(Screen.LANDING)} {...p} />;
            default: return <LandingPage onStart={() => {}} onLogoClick={() => {}} onAdminLoginClick={() => {}} onMenuClick={() => {}} onLanguageChange={() => {}} onNavigate={() => {}} theme={theme} toggleTheme={() => {}} isMuted={isMuted} onToggleMute={toggleMute} {...p} />;
        }
    };

    if (isChecking) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-1000">
            <Loader text={t.app.initializing[language]} />
        </div>
    );

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#0B1120]' : 'bg-slate-50'}`}>
            {systemError && <SystemStatusModal error={systemError} onRestart={() => window.location.reload()} onContinue={() => setSystemError(null)} />}
            
            {currentScreen !== Screen.LANDING && (
                <header className="fixed top-0 left-0 w-full px-6 py-4 z-[100] flex justify-between items-center bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-all shadow-sm">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(Screen.INFO_PAGE)}>
                            <div className="w-8 h-8 bg-brand-teal-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <LogoIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-black tracking-tight text-xl text-slate-900 dark:text-white uppercase hidden sm:inline">NeuroMotion</span>
                        </div>
                        
                        <nav className="hidden md:flex items-center gap-6">
                            <button onClick={() => navigate(Screen.INFO_PAGE)} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 dark:hover:text-brand-teal-400 transition-colors">{t.landing.howItWorks[language]}</button>
                            <button onClick={() => navigate(Screen.CHANGELOG)} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 dark:hover:text-brand-teal-400 transition-colors">{t.app.changelog[language]}</button>
                            <button onClick={() => navigate(Screen.CLINICAL_REFERENCE)} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 dark:hover:text-brand-teal-400 transition-colors">{t.app.clinicalReference[language]}</button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                            <button onClick={toggleMute} className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <AnimatedSpeakerIcon isMuted={isMuted} className="w-4 h-4" />
                            </button>
                            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="p-1.5 text-slate-500 hover:scale-110 transition-transform">
                                {theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4 text-brand-teal-400" />}
                            </button>
                        </div>
                        <div className="md:hidden">
                            <CssHamburger isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(true)} className="text-slate-900 dark:text-white" />
                        </div>
                    </div>
                </header>
            )}

            <main className={`${currentScreen !== Screen.LANDING ? 'pt-[80px]' : ''} transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {renderContent()}
            </main>

            {currentScreen !== Screen.LANDING && (
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
                        if (action === 'features') {
                            navigate(Screen.INFO_PAGE);
                        } else if (action === 'changelog') {
                            navigate(Screen.CHANGELOG);
                        } else if (action === 'clinical_reference') {
                            navigate(Screen.CLINICAL_REFERENCE);
                        } else if (action === 'admin') {
                            navigate(Screen.ADMIN_LOGIN);
                        } else if (action === 'contact') {
                            window.location.href = 'mailto:neuromotion.screening@gmail.com';
                        }
                    }}
                    onLanguageChange={setLanguage}
                    theme={theme}
                    onThemeChange={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                    language={language}
                    t={t}
                />
            )}
        </div>
    );
};

export default App;
