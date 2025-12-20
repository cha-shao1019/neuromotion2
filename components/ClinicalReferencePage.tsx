
import React from 'react';
import Button from './shared/Button';
import Card from './shared/Card';
import { Language, translations } from '../services/i18n';
import { MEDICAL_STANDARDS } from '../constants';

interface ClinicalReferencePageProps {
    onBack: () => void;
    language: Language;
    t: typeof translations;
}

const ClinicalReferencePage: React.FC<ClinicalReferencePageProps> = ({ onBack, language, t }) => {
    const p = t.clinicalReferencePage;
    
    const standardsData = [
        { item: '手指開合 (Tapping)', metric: '敲擊頻率', range: `${MEDICAL_STANDARDS.fingerTap.frequency.min} - ${MEDICAL_STANDARDS.fingerTap.frequency.max}`, unit: 'Hz', description: '評估快速交替運動的能力，過慢可能表示運動遲緩。', icon: '⚡' },
        { item: '手掌開合 (Open/Close)', metric: '幅度衰減率', range: `< ${MEDICAL_STANDARDS.fingerTap.decrement.max}`, unit: '%', description: '用於觀察動作是否隨時間疲勞變小。', icon: '📉' },
        { item: '靜止性震顫 (Tremor)', metric: '主要頻率', range: `< ${MEDICAL_STANDARDS.staticTremor.frequency.max}`, unit: 'Hz', description: '典型帕金森震顫頻率介於 4-6 Hz 之間。', icon: '〰️' },
        { item: '靜止性震顫 (Tremor)', metric: '震顫強度', range: `< ${MEDICAL_STANDARDS.staticTremor.amplitude.max}`, unit: '%', description: '量化震顫的幅度，與嚴重程度相關。', icon: '📊' },
        { item: '面部表情 (Face)', metric: '表情符合度', range: `> ${MEDICAL_STANDARDS.faceTest.matchScore.min}`, unit: '%', description: '評估面部肌肉活動能力，分數低可能表示面具臉。', icon: '🎭' },
        { item: '面部表情 (Face)', metric: '面部對稱性', range: `> ${MEDICAL_STANDARDS.faceTest.symmetry.min}`, unit: 'index', description: '比較左右臉部肌肉運動的一致性。', icon: '⚖️' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mesh-gradient figma-grid flex flex-col items-center p-4 py-24 sm:py-32 transition-colors">
            <Card className="w-full max-w-6xl bg-white dark:bg-slate-800 shadow-2xl border-slate-100 dark:border-slate-700 rounded-[4rem]">
                <div className="text-center mb-20">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">{p.title[language]}</h1>
                    <p className="text-brand-teal-600 dark:text-brand-teal-400 font-black uppercase tracking-[0.4em] text-[10px]">VERIFIED CLINICAL STANDARDS v3.4.1</p>
                    <p className="text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mt-6">{p.subtitle[language]}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {standardsData.map((row, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                                {row.icon}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{row.item}</h3>
                            <p className="text-xs font-bold text-brand-teal-600 dark:text-brand-teal-400 uppercase tracking-widest mb-6">{row.metric}</p>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-mono font-black text-slate-900 dark:text-white">{row.range}</span>
                                <span className="text-xs font-black text-slate-400 uppercase">{row.unit}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">{row.description}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-12 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-10">
                    <div className="shrink-0 w-24 h-24 bg-brand-teal-500 rounded-3xl flex items-center justify-center text-white text-4xl shadow-xl shadow-brand-teal-500/20">📚</div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{p.dataSourceTitle[language]}</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic text-sm">{p.dataSourceContent[language]}</p>
                    </div>
                </div>
                
                <div className="mt-20 text-center">
                    <Button onClick={onBack} variant="secondary" className="px-24 py-6">{t.infoPage.backToHome[language]}</Button>
                </div>
            </Card>
        </div>
    );
};

export default ClinicalReferencePage;
