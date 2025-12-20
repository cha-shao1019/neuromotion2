import React, { useState, useEffect } from 'react';
import { hasCamera } from '../services/hardwareService';
import Button from './shared/Button';
import Card from './shared/Card';
import Loader from './shared/Loader';
import { Language, translations } from '../services/i18n';

type TestType = 'finger' | 'face';

interface TestSelectionPageProps {
    onStartTests: (tests: TestType[]) => void;
    language: Language;
    t: typeof translations;
}

const TestSelectionPage: React.FC<TestSelectionPageProps> = ({ onStartTests, language, t }) => {
    const [selectedTests, setSelectedTests] = useState<TestType[]>(['finger', 'face']);
    const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null);

    useEffect(() => {
        hasCamera().then(setCameraAvailable);
    }, []);

    const handleToggleTest = (test: TestType) => {
        setSelectedTests(prev => prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]);
    };
    
    if (cameraAvailable === null) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader text="硬體檢測中..." /></div>;

    return (
        <div className="min-h-screen bg-slate-50 mesh-gradient figma-grid flex items-center justify-center p-6 py-24">
            <Card className="w-full max-w-3xl text-center bg-white shadow-2xl">
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{t.testSelection.title[language]}</h1>
                <p className="text-xl text-slate-400 mb-12 font-light">{t.testSelection.subtitle[language]}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {[
                        { id: 'finger' as TestType, title: t.testSelection.fingerTestTitle[language], desc: t.testSelection.fingerTestDesc[language] },
                        { id: 'face' as TestType, title: t.testSelection.faceTestTitle[language], desc: t.testSelection.faceTestDesc[language] }
                    ].map(test => (
                        <button
                            key={test.id}
                            onClick={() => handleToggleTest(test.id)}
                            className={`p-8 rounded-[2.5rem] border-4 transition-all text-left group ${
                                selectedTests.includes(test.id)
                                ? 'bg-brand-teal-500 border-brand-teal-400 text-white shadow-xl scale-[1.02]'
                                : 'bg-slate-50 border-transparent text-slate-900 hover:bg-slate-100 hover:border-slate-200'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center transition-colors ${
                                selectedTests.includes(test.id) ? 'bg-white text-brand-teal-500' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
                            }`}>
                                <span className="text-2xl"> {test.id === 'finger' ? '🖐️' : '👤'}</span>
                            </div>
                            <h2 className="text-2xl font-black mb-2">{test.title}</h2>
                            <p className={`text-sm font-medium ${selectedTests.includes(test.id) ? 'text-white/80' : 'text-slate-400'}`}>{test.desc}</p>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => onStartTests(selectedTests)} disabled={selectedTests.length === 0} className="px-16">
                        {t.testSelection.startNTests[language](selectedTests.length)}
                    </Button>
                    <Button onClick={() => onStartTests([])} variant="secondary" className="px-12">
                        {t.testSelection.skipButton[language]}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default TestSelectionPage;