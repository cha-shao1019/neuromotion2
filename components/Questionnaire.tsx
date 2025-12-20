import React, { useState } from 'react';
import Button from './shared/Button';
import Card from './shared/Card';
import { Language, translations, getTranslatedQuestions } from '../services/i18n';
import audioService from '../services/audioService';

interface QuestionnaireProps {
    onSubmit: (score: number) => void;
    language: Language;
    t: typeof translations;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ language, t, onSubmit }) => {
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const questions = getTranslatedQuestions(language);

    const handleAnswer = (val: number) => {
        setAnswers({ ...answers, [questions[currentIndex].id]: val });
        audioService.playClick();
        if (currentIndex < questions.length - 1) {
            setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
        }
    };

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mesh-gradient figma-grid flex flex-col items-center justify-center p-6 transition-colors duration-500">
            <div className="w-full max-w-3xl space-y-10">
                <div className="flex justify-between items-end px-2">
                    <h2 className="text-brand-teal-600 dark:text-brand-teal-400 font-black text-2xl uppercase tracking-widest">
                        {language === 'zh-TW' ? '檢測進度' : 'Progress'} {currentIndex + 1} / {questions.length}
                    </h2>
                    <button 
                        onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                        className="text-slate-400 hover:text-brand-teal-600 dark:hover:text-brand-teal-400 font-bold transition-colors"
                    >
                        ← {language === 'zh-TW' ? '上一題' : 'Previous'}
                    </button>
                </div>
                
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-brand-teal-500 transition-all duration-700 shadow-lg" 
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>

                <Card className="animate-reveal !p-8 md:!p-20 bg-white dark:bg-slate-800 shadow-xl border-slate-100 dark:border-slate-700">
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white text-center mb-16 leading-tight tracking-tighter">
                        {currentQuestion.text}
                    </h3>
                    
                    <div className="space-y-4">
                        {currentQuestion.options.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handleAnswer(opt.value)}
                                className={`tap-target w-full text-left p-8 rounded-[2.5rem] border-4 flex items-center gap-8 transition-all duration-300 ${
                                    answers[currentQuestion.id] === opt.value
                                    ? 'bg-brand-teal-500 border-brand-teal-400 text-white shadow-xl scale-[1.02]'
                                    : 'bg-slate-50 dark:bg-slate-900/50 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-full border-4 flex-shrink-0 flex items-center justify-center transition-colors ${
                                    answers[currentQuestion.id] === opt.value ? 'bg-white border-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                }`}>
                                    {answers[currentQuestion.id] === opt.value && <div className="w-4 h-4 bg-brand-teal-500 rounded-full"></div>}
                                </div>
                                <span className={`text-2xl font-black tracking-tight ${answers[currentQuestion.id] === opt.value ? 'text-white' : 'text-slate-900 dark:text-slate-200'}`}>{opt.text}</span>
                            </button>
                        ))}
                    </div>
                </Card>

                {currentIndex === questions.length - 1 && (
                    <div className="flex justify-center pt-8">
                        <Button 
                            onClick={() => onSubmit(Object.values(answers).reduce((a: number, b: number) => a + b, 0))}
                            disabled={Object.keys(answers).length < questions.length}
                            className="w-full py-10 text-4xl shadow-2xl"
                        >
                            {language === 'zh-TW' ? '生成初步分析報告' : 'Generate Analysis Report'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Questionnaire;