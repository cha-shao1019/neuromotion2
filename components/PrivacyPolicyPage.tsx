
import React from 'react';
import Button from './shared/Button';
import Card from './shared/Card';
import { Language, translations } from '../services/i18n';

interface PrivacyPolicyPageProps {
    onBack: () => void;
    language: Language;
    t: typeof translations;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack, language, t }) => {
    const p = t.privacyPolicy;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mesh-gradient figma-grid flex flex-col items-center p-4 py-24 sm:py-32 transition-colors">
            <Card className="w-full max-w-4xl bg-white dark:bg-slate-800 shadow-2xl border-slate-100 dark:border-slate-700">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">{p.title[language]}</h1>
                    <p className="text-slate-400 dark:text-slate-500 font-mono text-xs uppercase tracking-widest font-black">{p.lastUpdated[language]}</p>
                </div>

                <div className="space-y-12 text-left text-slate-600 dark:text-slate-300 leading-relaxed text-lg prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-xl font-light italic text-slate-500 dark:text-slate-400 border-l-4 border-brand-teal-500 pl-6">{p.introduction[language]}</p>

                    <section className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3"><span className="w-2 h-6 bg-brand-teal-500 rounded-full"></span>{p.infoWeCollect[language]}</h2>
                        <p className="mb-4">{p.infoWeCollectP1[language]}</p>
                        <p className="font-light">{p.infoWeCollectP2[language]}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">{p.howWeUseInfoTitle[language]}</h2>
                        <p className="mb-6">{p.howWeUseInfoP1[language]}</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[p.howWeUseInfoL1[language], p.howWeUseInfoL2[language], p.howWeUseInfoL3[language]].map((item, i) => (
                                <li key={i} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200">{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{p.dataRetention[language]}</h2>
                        <p className="font-light">{p.dataRetentionP1[language]}</p>
                    </section>
                </div>
                
                <div className="mt-16 text-center">
                    <Button onClick={onBack} variant="secondary" className="px-20">{t.infoPage.backToHome[language]}</Button>
                </div>
            </Card>
        </div>
    );
};

export default PrivacyPolicyPage;
