import React, { useState, useEffect } from 'react';
import { getAIResponseNonStreaming } from '../services/geminiService';
import { MAX_SCORE } from '../constants';
import Button from './shared/Button';
import Card from './shared/Card';
import Loader from './shared/Loader';
import DelayedAnalysisTip from './shared/DelayedAnalysisTip';
import { Language, translations } from '../services/i18n';

interface QuestionnaireResultProps {
    score: number;
    onAnalysisComplete: (analysis: string) => void;
    onProceedToTestSelection: () => void;
    language: Language;
    t: typeof translations;
}

const QuestionnaireResult: React.FC<QuestionnaireResultProps> = ({ score, onAnalysisComplete, onProceedToTestSelection, language, t }) => {
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            setIsLoading(true);
            const riskLevel = score < MAX_SCORE / 4 ? '低' : score < MAX_SCORE / 2 ? '中低' : score < (MAX_SCORE * 3) / 4 ? '中高' : '高';
            const prompt = `一位使用者完成了帕金森症狀的初步篩檢問卷，最高指數是 ${MAX_SCORE}，他的風險指數是 ${score}。這代表他的風險等級為「${riskLevel}」。請根據這個指數，提供一段簡短（約100-150字）、溫和且鼓勵人心的初步分析與建議。請強調這不是正式診斷，並建議在需要時諮詢醫生。請用${language === 'en' ? 'English' : '繁體中文'}回答。`;
            
            const result = await getAIResponseNonStreaming(prompt);
            setAnalysis(result);
            onAnalysisComplete(result);
            setIsLoading(false);
        };

        fetchAnalysis();
    }, [score, language]);
    
    const scorePercentage = (score / MAX_SCORE) * 100;
    let scoreColor = 'text-green-600 dark:text-green-400';
    if (scorePercentage > 25) scoreColor = 'text-yellow-600 dark:text-yellow-400';
    if (scorePercentage > 50) scoreColor = 'text-orange-600 dark:text-orange-400';
    if (scorePercentage > 75) scoreColor = 'text-red-600 dark:text-red-400';


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mesh-gradient figma-grid flex items-center justify-center p-6 transition-colors duration-500">
            <Card className="w-full max-w-3xl text-center animate-slide-in-up bg-white dark:bg-slate-800 shadow-2xl border-slate-100 dark:border-slate-700">
                <h1 className="text-4xl font-black text-brand-teal-600 dark:text-brand-teal-400 mb-8 uppercase tracking-tighter">{t.questionnaireResult.title[language]}</h1>
                
                <div className="mb-16">
                    <p className="text-xl text-slate-400 dark:text-slate-500 mb-6 font-medium">{t.questionnaireResult.riskIndex[language]}</p>
                    <p className={`text-[8rem] font-black leading-none tracking-tighter ${scoreColor}`}>
                        {score} <span className="text-4xl text-slate-300 dark:text-slate-600 font-light">/ {MAX_SCORE}</span>
                    </p>
                </div>

                <div className="text-left bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 min-h-[250px] flex flex-col items-center justify-center">
                    {isLoading ? (
                        <div className="text-center">
                            <Loader text={t.questionnaireResult.analyzing[language]} />
                            <DelayedAnalysisTip isAnalyzing={isLoading} />
                        </div>
                    ) : (
                        <div className="w-full">
                            <h2 className="text-2xl font-black mb-6 text-brand-teal-600 dark:text-brand-teal-400 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-brand-teal-500 rounded-full"></span>
                                {t.questionnaireResult.aiSuggestion[language]}
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-light">{analysis}</p>
                        </div>
                    )}
                </div>

                <div className="mt-16 space-y-10">
                    <p className="text-xl text-slate-400 dark:text-slate-500 font-medium">{t.questionnaireResult.getComprehensive[language]}<br/>{t.questionnaireResult.proceedToMotorTest[language]}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={onProceedToTestSelection} disabled={isLoading} className="px-16">
                           {t.questionnaireResult.nextStepButton[language]}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default QuestionnaireResult;