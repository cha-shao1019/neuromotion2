
import React, { useState } from 'react';
import { AGE_RANGES, GENDERS } from '../constants';
import Button from './shared/Button';
import Card from './shared/Card';
import PrivacyStatement from './shared/PrivacyStatement';
import { Language, translations } from '../services/i18n';

interface PreQuestionnaireInfoProps {
    onSubmit: (age: string, gender: string, medicalHistory: string) => void;
    language: Language;
    t: typeof translations;
}

const PreQuestionnaireInfo: React.FC<PreQuestionnaireInfoProps> = ({ onSubmit, language, t }) => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [consent, setConsent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (age && gender && consent) onSubmit(age, gender, medicalHistory);
    };

    const inputClasses = "w-full px-6 py-4 text-xl text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-brand-teal-500 transition-all shadow-inner appearance-none";
    const textareaClasses = `${inputClasses} h-28 text-base`;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mesh-gradient figma-grid flex items-center justify-center p-4 py-24">
            <Card className="w-full max-w-2xl bg-white dark:bg-slate-800 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.preQuestionnaire.title[language]}</h1>
                        <p className="text-slate-400 dark:text-slate-500 mt-2 font-medium italic">{t.preQuestionnaire.subtitle[language]}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t.preQuestionnaire.ageLabel[language]}</label>
                            <select value={age} onChange={(e) => setAge(e.target.value)} className={inputClasses}>
                                <option value="" disabled>{t.preQuestionnaire.selectPlaceholder[language]}</option>
                                {AGE_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t.preQuestionnaire.genderLabel[language]}</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClasses}>
                                <option value="" disabled>{t.preQuestionnaire.selectPlaceholder[language]}</option>
                                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">簡易病史 (選填)</label>
                        <textarea 
                            value={medicalHistory} 
                            onChange={(e) => setMedicalHistory(e.target.value)} 
                            className={textareaClasses}
                            placeholder="例如：家族有手抖病史、高血壓、目前正服用安眠藥物... 此資訊有助於 AI 提供更精準的分析。"
                        />
                    </div>

                    <PrivacyStatement language={language} t={t} />

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                         <label className="flex items-center space-x-4 cursor-pointer">
                             <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="h-6 w-6 rounded border-slate-300 dark:border-slate-600 text-brand-teal-500 focus:ring-brand-teal-500 bg-white dark:bg-slate-800" />
                            <span className="text-slate-600 dark:text-slate-300 font-bold text-lg">{t.preQuestionnaire.consent[language]}</span>
                        </label>
                    </div>

                    <Button type="submit" disabled={!age || !gender || !consent} className="w-full py-8 text-3xl shadow-xl">
                        {t.preQuestionnaire.startQuestionnaire[language]}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default PreQuestionnaireInfo;
