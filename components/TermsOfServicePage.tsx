
import React from 'react';
import Button from './shared/Button';
import Card from './shared/Card';
import { Language, translations } from '../services/i18n';
import { LogoIcon } from './icons/LogoIcon';

interface TermsOfServicePageProps {
    onBack: () => void;
    language: Language;
    t: typeof translations;
}

const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onBack, language, t }) => {
    const tos = t.termsOfService;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mesh-gradient figma-grid flex flex-col items-center p-4 py-24 sm:py-32 transition-colors">
            <Card className="w-full max-w-4xl animate-reveal bg-white dark:bg-slate-800 shadow-2xl border-slate-100 dark:border-slate-700 p-12 md:p-24 rounded-[4rem]">
                <div className="flex flex-col items-center text-center mb-20">
                    <LogoIcon className="w-24 h-24 mb-8 text-slate-800 dark:text-white" />
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none uppercase">
                        {tos.title[language]}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-brand-teal-500/20"></div>
                        <p className="text-slate-400 dark:text-slate-500 font-mono text-xs uppercase tracking-[0.4em] font-black">
                            {tos.lastUpdated[language]}
                        </p>
                        <div className="h-[2px] w-12 bg-brand-teal-500/20"></div>
                    </div>
                </div>

                <div className="space-y-20 text-left">
                    <section className="bg-slate-50 dark:bg-slate-900/50 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-700 italic text-slate-500 dark:text-slate-400 text-2xl font-light leading-relaxed border-l-[12px] border-l-brand-teal-500 shadow-inner">
                        {tos.acceptanceP1[language]}
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-6">
                            <span className="w-3 h-10 bg-brand-teal-500 rounded-full"></span>
                            {tos.serviceDescription[language]}
                        </h2>
                        <div className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-9 border-l-2 border-slate-100 dark:border-slate-800 ml-1 space-y-6">
                            <p dangerouslySetInnerHTML={{ __html: tos.serviceDescriptionP1[language].replace(/\*\*(.*?)\*\*/g, '<span class="text-brand-teal-600 dark:text-brand-teal-400 font-black px-1">$1</span>') }}></p>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-6">
                            <span className="w-3 h-10 bg-brand-teal-500 rounded-full"></span>
                            {tos.userConduct[language]}
                        </h2>
                        <div className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-9 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                            <p>{tos.userConductP1[language]}</p>
                        </div>
                    </section>
                    
                    <section className="space-y-8">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-6">
                            <span className="w-3 h-10 bg-brand-teal-500 rounded-full"></span>
                            {tos.disclaimer[language]}
                        </h2>
                        <div className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-9 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                            <p className="bg-red-50 dark:bg-red-900/20 text-red-900/70 dark:text-red-300/80 p-8 rounded-3xl border border-red-100 dark:border-red-500/20 italic">
                                {tos.disclaimerP1[language]}
                            </p>
                        </div>
                    </section>
                    
                    <section className="space-y-8">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-6">
                            <span className="w-3 h-10 bg-brand-teal-500 rounded-full"></span>
                            {tos.liability[language]}
                        </h2>
                        <div className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-9 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                            <p>{tos.liabilityP1[language]}</p>
                        </div>
                    </section>

                    <div className="pt-20 border-t-2 border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.5em] mb-12 opacity-50">
                            © 2025 NEUROMOTION CORE v3.4.1 FINAL
                        </p>
                        <Button onClick={onBack} variant="secondary" className="px-24 py-6 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                            {t.infoPage.backToHome[language]}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TermsOfServicePage;
