
import React from 'react';
import Button from './shared/Button';
import Card from './shared/Card';
import { Language, translations } from '../services/i18n';

interface ChangelogPageProps {
    onBack: () => void;
    language: Language;
    t: typeof translations;
}

const changelogData = [
    {
        version: "3.4.1",
        date: "2025-12-20",
        day: "Saturday",
        title: { 'zh-TW': '系統穩定性與臨床標準對齊', 'en': 'System Stability & Clinical Alignment' },
        items: [
            { 'zh-TW': '【時區】同步國際台北標準時間 (UTC+8) 實時數位時鐘。', 'en': 'Synced Real-time Taipei Standard Time (UTC+8) digital clock.' },
            { 'zh-TW': '【鏡頭】修復鏡頭啟動掛載邏輯，增加強制硬體重新初始化功能。', 'en': 'Fixed camera mounting logic and added hard hardware reset function.' },
            { 'zh-TW': '【檢測】手指開合完全對齊 MDS-UPDRS 的 25 次計數臨床規範。', 'en': 'Aligned Finger Tapping with MDS-UPDRS 25-count clinical protocols.' },
            { 'zh-TW': '【影像】優化震顫偵測中的環境晃動抗干擾演算法。', 'en': 'Optimized anti-shake algorithms for tremor detection.' },
            { 'zh-TW': '【報告】AI 產出條列式臨床解析，並修復 PDF 分頁列印空白問題。', 'en': 'Structured AI clinical analysis and fixed blank PDF print pages.' },
        ]
    },
    {
        version: "3.3.8",
        date: "2025-12-18",
        day: "Thursday",
        title: { 'zh-TW': '視覺主題與模型優化', 'en': 'UI Theme & Model Optimization' },
        items: [
            { 'zh-TW': '【UI】全站遷移至醫療級高對比淺色主題。', 'en': 'Migrated to clinical-grade high-contrast light theme.' },
            { 'zh-TW': '【AI】升級手部偵測模型精度，提升微小震顫捕捉率。', 'en': 'Upgraded hand detection model precision for micro-tremor capture.' },
        ]
    }
];

const ChangelogPage: React.FC<ChangelogPageProps> = ({ onBack, language, t }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mesh-gradient figma-grid flex flex-col items-center p-4 py-24 sm:py-32 transition-colors">
            <Card className="w-full max-w-4xl bg-white dark:bg-slate-800 shadow-2xl border-slate-100 dark:border-slate-700">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">{t.changelogPage.title[language]}</h1>
                    <p className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] font-black">{t.changelogPage.subtitle[language]}</p>
                </div>

                <div className="relative border-l-4 border-slate-100 dark:border-slate-800 ml-4 sm:ml-8 pl-8 sm:pl-12 space-y-16">
                    {changelogData.map((entry) => (
                        <div key={entry.version} className="relative group">
                            <div className="absolute -left-[3.25rem] sm:-left-[4.25rem] top-2 w-6 h-6 bg-white dark:bg-slate-800 border-4 border-brand-teal-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 group-hover:shadow-lg transition-all duration-500">
                                <p className="text-[10px] font-black text-brand-teal-600 dark:text-brand-teal-400 font-mono mb-4 uppercase tracking-widest">{entry.date} ({entry.day})</p>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-4">
                                    <span className="bg-brand-teal-500 text-white px-3 py-1 rounded-xl text-xs uppercase">v{entry.version}</span>
                                    {entry.title[language]}
                                </h2>
                                <ul className="space-y-6">
                                    {entry.items.map((item, idx) => (
                                        <li key={idx} className="flex gap-4 leading-relaxed font-medium text-slate-600 dark:text-slate-300 text-sm">
                                            <span className="text-brand-teal-500 mt-1 shrink-0">•</span>
                                            {item[language]}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-20 text-center">
                    <Button onClick={onBack} variant="secondary" className="px-20 py-6">{t.infoPage.backToHome[language]}</Button>
                </div>
            </Card>
        </div>
    );
};

export default ChangelogPage;
