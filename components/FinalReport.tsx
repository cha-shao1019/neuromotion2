
import React, { useState, useEffect, useMemo } from 'react';
import { ScreeningResults, MotorTestMetric } from '../types';
import { getAIResponseNonStreaming } from '../services/geminiService';
import Button from './shared/Button';
import Card from './shared/Card';
import Loader from './shared/Loader';
import { MAX_SCORE, MEDICAL_STANDARDS } from '../constants';
import DelayedAnalysisTip from './shared/DelayedAnalysisTip';
import { Language, translations } from '../services/i18n';
import { CalendarIcon } from './icons/CalendarIcon';
import PhysicianConnectModal from './PhysicianConnectModal';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import Toast from './shared/Toast';
import RealTimeClock from './shared/RealTimeClock';

interface FinalReportProps {
    results: ScreeningResults;
    onStartOver: () => void;
    onReportSaved: () => void;
    language: Language;
    t: typeof translations;
}

interface MetricDisplayProps {
    label: string;
    value?: number;
    unit: string;
    standard: { min?: number; max?: number };
    isInverted?: boolean; // True if lower values are better
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, unit, standard, isInverted = false }) => {
    if (value === undefined || value === null) return null;

    const { min = -Infinity, max = Infinity } = standard;
    const isNormal = value >= min && value <= max;
    const indicatorColor = (isInverted ? !isNormal : isNormal) ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {value.toFixed(1)} <span className="text-lg text-slate-400 dark:text-slate-500">{unit}</span>
                </p>
            </div>
            <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${indicatorColor}`}></div>
                <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {(isInverted ? !isNormal : isNormal) ? '正常範圍' : '超出範圍'}
                </span>
            </div>
        </div>
    );
};

const FinalReport: React.FC<FinalReportProps> = ({ results, onStartOver, language, t }) => {
    const [finalAnalysis, setFinalAnalysis] = useState<string | null>(results.finalAnalysis);
    const [isLoading, setIsLoading] = useState(!results.finalAnalysis);
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (!results.finalAnalysis) {
            const prompt = `你現在是一個醫療數據轉換器。請將以下混亂的民眾問卷內容，轉換為給醫師看的專業臨床摘要。
            
            原始數據:
            - 年齡: ${results.age}, 性別: ${results.gender}
            - 問卷分數: ${results.questionnaireScore} / ${MAX_SCORE}
            - 簡易病史: ${results.medicalHistory || '未提供'}
            - 手指開合數據 (Bradykinesia): ${JSON.stringify(results.fingerTapResult?.fingerTapping)}
            - 靜止性震顫數據 (Resting Tremor): ${JSON.stringify(results.fingerTapResult?.staticTremor)}
            - 面部表情數據 (Masked Face): ${JSON.stringify(results.maskedFaceResult)}

            輸出格式要求：
            - 必須包含 [主要症狀]、[風險評估(1-10分)]、[建議醫師優先確認事項] 三個段落標題。
            - 請使用醫療專業術語（例如：將『手抖』改為『靜止性震顫』）。
            - 不要包含任何開場白（例如：『好的，我幫您整理好了』），直接輸出內容。
            - 語言：${language === 'en' ? 'English' : '繁體中文'}。`;

            getAIResponseNonStreaming(prompt).then(res => {
                setFinalAnalysis(res);
                setIsLoading(false);
            });
        }
    }, [results, language]);

    const structuredAnalysis = useMemo(() => {
        if (!finalAnalysis) return [];
        // Use regex that handles both brackets for more robust splitting
        const sections = finalAnalysis.split(/\[|\]/).filter(s => s.trim().length > 0);
        const result = [];
        for (let i = 0; i < sections.length; i += 2) {
            if (sections[i+1]) {
                result.push({
                    title: sections[i].trim(),
                    lines: sections[i+1].trim().split('\n').filter(l => l.trim().length > 0).map(l => l.replace(/^[-*•\d.]+\s*/, ''))
                });
            }
        }
        return result.length > 0 ? result : [{ title: "綜合評估", lines: [finalAnalysis] }];
    }, [finalAnalysis]);

    const { fingerTapping, staticTremor } = results.fingerTapResult || {};

    return (
        <div id="clinical-report-root" className="min-h-screen bg-slate-50 dark:bg-slate-900 mesh-gradient figma-grid flex flex-col items-center p-4 py-16 sm:py-24 print:p-0">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print { /* styles... */ }
            `}} />

            <Card className="w-full max-w-5xl bg-white dark:bg-slate-800 shadow-2xl printable-report-card rounded-[4rem]">
                 <div className="print-only-header justify-between items-center">
                    {/* ... print header ... */}
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 print-hide">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">篩檢結果總覽</h1>
                        <div className="flex items-center gap-4 mt-2">
                             <p className="text-brand-teal-600 dark:text-brand-teal-400 font-black uppercase tracking-[0.4em] text-[10px]">v3.4.5 REAL-TIME SYNC</p>
                             <RealTimeClock className="text-[10px] tracking-widest" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-start md:justify-end">
                        <Button onClick={onStartOver} variant="secondary" className="!px-6 !py-3 !text-xs sm:!text-sm">重新施測</Button>
                        <Button onClick={() => setShowConnectModal(true)} disabled={isLoading} className="!px-5 !py-3 !text-xs sm:!text-sm flex items-center gap-2">
                            <PaperAirplaneIcon className="w-4 h-4" />
                            傳送報告給醫師
                        </Button>
                        <Button onClick={() => window.print()} className="!px-6 !py-3 !text-xs sm:!text-sm shadow-xl shadow-brand-teal-500/20">生成 PDF</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-700 text-center report-section">
                        <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">問卷風險分數</p>
                        <p className="text-7xl sm:text-8xl font-black text-brand-teal-600 dark:text-brand-teal-500 leading-none">{results.questionnaireScore} <span className="text-xl text-slate-300 dark:text-slate-600">/ {MAX_SCORE}</span></p>
                    </div>
                     <div className="bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-700 flex flex-col justify-center report-section">
                        <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">雲端同步狀態</p>
                        <div className="flex items-center gap-4 text-brand-teal-600 dark:text-brand-teal-400 font-black text-2xl">
                            <div className="w-4 h-4 bg-brand-teal-500 rounded-full animate-pulse"></div>
                            已連接至雲端資料庫
                        </div>
                    </div>
                </div>
                
                {results.fingerTapResult && (
                    <div className="mb-16">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4 border-l-8 border-brand-teal-500 pl-6 mb-10">運動技能指標詳解</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700">
                                <h3 className="font-black text-lg text-slate-900 dark:text-white">👆 手指開合 (Bradykinesia)</h3>
                                <MetricDisplay label="敲擊頻率" value={fingerTapping?.tremorFrequency} unit="Hz" standard={MEDICAL_STANDARDS.fingerTap.frequency} />
                                <MetricDisplay label="振幅衰減率" value={fingerTapping?.amplitudeDecrement} unit="%" standard={MEDICAL_STANDARDS.fingerTap.decrement} isInverted={true} />
                                <MetricDisplay label="節律變異度" value={fingerTapping?.rhythmVariability} unit="CV" standard={MEDICAL_STANDARDS.fingerTap.rhythmVariability} isInverted={true} />
                            </div>
                            <div className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700">
                                <h3 className="font-black text-lg text-slate-900 dark:text-white">✋ 靜止性震顫 (Resting Tremor)</h3>
                                <MetricDisplay label="主要震顫頻率" value={staticTremor?.tremorFrequency} unit="Hz" standard={MEDICAL_STANDARDS.staticTremor.frequency} isInverted={true} />
                                <MetricDisplay label="平均位移強度" value={staticTremor?.tremorAmplitude} unit="%" standard={MEDICAL_STANDARDS.staticTremor.amplitude} isInverted={true}/>
                            </div>
                        </div>
                    </div>
                )}


                <div className="space-y-12">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4 border-l-8 border-brand-teal-500 pl-6">
                        AI 結構化臨床解析
                    </h2>

                    {isLoading ? (
                        <div className="py-20 text-center"><Loader text="臨床數據同步中" /><DelayedAnalysisTip isAnalyzing={true} /></div>
                    ) : (
                        <div className="grid grid-cols-1 gap-10">
                            {structuredAnalysis.map((section, idx) => (
                                <div key={idx} className="report-section bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-xl sm:text-2xl font-black text-brand-teal-600 dark:text-brand-teal-400 mb-8 flex items-center gap-4">
                                        <span className="w-10 h-10 bg-brand-teal-500 rounded-2xl flex items-center justify-center text-white text-lg">{idx + 1}</span>
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-6">
                                        {section.lines.map((line, lIdx) => (
                                            <li key={lIdx} className="flex items-start gap-6 text-slate-700 dark:text-slate-300 text-lg sm:text-xl font-medium leading-relaxed">
                                                <div className="w-2.5 h-2.5 rounded-full bg-brand-teal-500 mt-2.5 shrink-0"></div>
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-20 pt-16 border-t-2 border-slate-100 dark:border-slate-800 print-hide flex flex-col items-center">
                    <Button onClick={() => window.location.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=NeuroMotion醫師複診`} className="px-12 py-6 text-xl sm:px-16 sm:py-8 sm:text-2xl shadow-2xl flex items-center gap-4 sm:gap-6">
                        <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                        安排神經內科諮詢
                    </Button>
                </div>
            </Card>
            {showConnectModal && (
                <PhysicianConnectModal 
                    results={results} 
                    aiSummary={finalAnalysis || ''}
                    onClose={() => setShowConnectModal(false)} 
                    onSuccess={(reportId) => setToastMessage(`報告 (ID: ...${reportId.slice(-6)}) 已成功傳送！`)}
                    language={language} 
                    t={t} />
            )}
            <Toast message={toastMessage} show={!!toastMessage} onClose={() => setToastMessage('')} />
        </div>
    );
};

export default FinalReport;