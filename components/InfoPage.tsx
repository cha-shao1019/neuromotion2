import React from 'react';
import Button from './shared/Button';
import Card from './shared/Card';
import { LogoIcon } from './icons/LogoIcon';
import { Language, translations } from '../services/i18n';

interface InfoPageProps {
    onBack: () => void;
    language: Language;
    t: typeof translations;
}

const InfoPage: React.FC<InfoPageProps> = ({ onBack, language, t }) => {
    return (
        /* 1. 確保背景是純色不透明 bg-white，層級 z-[200] 蓋過所有東西 */
        <div className="fixed inset-0 min-h-screen bg-white dark:bg-slate-900 z-[200] overflow-y-auto flex flex-col items-center p-4 py-32 md:py-40 transition-colors duration-500">

            {/* 2. 修正後的返回 Logo 容器 */}
            <div
                className="fixed top-8 left-8 z-[210] flex items-center gap-3 cursor-pointer group active:scale-90 transition-all"
                onClick={onBack}
            >
                <div className="w-10 h-10 bg-brand-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all duration-300">
                    <LogoIcon className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="hidden sm:flex flex-col">
                    <span className="text-sm font-black dark:text-slate-900 dark:text-white uppercase tracking-tighter leading-none">NeuroMotion</span>
                    <span className="text-[9px] font-bold text-brand-teal-500 tracking-widest uppercase opacity-80">Back to Portal</span>
                </div>
            </div>
            <Card className="w-full max-w-4xl animate-reveal bg-white dark:bg-slate-800 shadow-2xl border-slate-200 dark:border-slate-700 relative z-[205]">                <div className="flex flex-col items-center text-center mb-16">
                    <LogoIcon className="w-24 h-24 mb-6" />
                    <h1 className="text-5xl font-black tracking-tighter">
                        <span className="text-slate-900 dark:text-white">NeuroMotion</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal-500 to-brand-blue-600">Screen</span>
                    </h1>
                    <div className="w-20 h-1 bg-brand-teal-500 mt-6 rounded-full opacity-50"></div>
                </div>

                <div className="space-y-20 text-left">
                    {/* General About */}
                    <section>
                        <h2 className="text-3xl font-black text-brand-teal-600 dark:text-brand-teal-400 mb-6 flex items-center gap-4">
                            <span className="w-2 h-10 bg-brand-teal-500 rounded-full"></span>
                            {t.infoPage.title[language]}
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                           {t.infoPage.aboutText[language]}
                        </p>
                    </section>

                    {/* About PD */}
                     <section>
                        <h2 className="text-3xl font-black text-brand-teal-600 dark:text-brand-teal-400 mb-6 flex items-center gap-4">
                            <span className="w-2 h-10 bg-brand-teal-500 rounded-full"></span>
                            {t.infoPage.aboutPDTitle[language]}
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10 font-light">
                            {t.infoPage.aboutPDText[language]}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">{t.infoPage.motorSymptoms[language]}</h3>
                                <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-3 font-medium">
                                    <li>{t.infoPage.tremor[language]}</li>
                                    <li>{t.infoPage.bradykinesia[language]}</li>
                                    <li>{t.infoPage.rigidity[language]}</li>
                                    <li>{t.infoPage.posturalInstability[language]}</li>
                                </ul>
                            </div>
                             <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">{t.infoPage.nonMotorSymptoms[language]}</h3>
                                <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-3 font-medium">
                                     <li>{t.infoPage.anosmia[language]}</li>
                                     <li>{t.infoPage.sleepDisorder[language]}</li>
                                     <li>{t.infoPage.constipation[language]}</li>
                                     <li>{t.infoPage.maskedFace[language]}</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Detailed Hand Motor Tests */}
                    <section className="border-t border-slate-100 dark:border-slate-700 pt-16">
                        <h2 className="text-3xl font-black text-brand-teal-600 dark:text-brand-teal-400 mb-6 flex items-center gap-4">
                             <span className="w-2 h-10 bg-brand-teal-500 rounded-full"></span>
                             {t.infoPage.handMotorTestTitle[language]}
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 font-light">
                            {t.infoPage.handMotorTestIntro[language]}
                        </p>
                        
                        <div className="space-y-6">
                            {[
                                { title: t.infoPage.fingerTapDetailTitle[language], desc: t.infoPage.fingerTapDetailText[language], standards: t.infoPage.fingerTapStandardsList[language] },
                                { title: t.infoPage.handOpenCloseTitle[language], desc: t.infoPage.handOpenCloseText[language], standards: t.infoPage.handOpenCloseStandardsList[language] },
                                { title: t.infoPage.staticTremorTitle[language], desc: t.infoPage.staticTremorText[language], standards: t.infoPage.staticTremorStandardsList[language] }
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 transition-all hover:shadow-lg">
                                    <h3 className="font-black text-brand-teal-600 dark:text-brand-teal-400 mb-4 text-2xl">{item.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-light text-lg">{item.desc}</p>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs opacity-50">{t.infoPage.assessmentStandards[language]}</h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {item.standards.map((std, idx) => (
                                            <li key={idx} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                                <span className="w-8 h-8 rounded-full bg-brand-teal-500 flex items-center justify-center text-xs font-black text-white shrink-0">{idx + 1}</span>
                                                <span className="text-slate-700 dark:text-slate-200 font-bold">{std}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    {/* Disclaimer */}
                    <section className="text-center bg-brand-teal-50 dark:bg-brand-teal-900/20 p-12 rounded-[2.5rem] border border-brand-teal-100 dark:border-brand-teal-800">
                         <h2 className="text-2xl font-black text-brand-teal-600 dark:text-brand-teal-400 mb-4 uppercase tracking-tighter">Medical Disclaimer</h2>
                        <p className="text-lg text-brand-teal-800/70 dark:text-brand-teal-200/60 leading-relaxed font-medium italic">
                           {t.infoPage.disclaimerText[language]}
                        </p>
                    </section>
                </div>
                
                <div className="mt-16 text-center">
                    <Button onClick={onBack} variant="secondary" className="px-20">{t.infoPage.backToHome[language]}</Button>
                </div>
            </Card>
        </div>
    );
};

export default InfoPage;