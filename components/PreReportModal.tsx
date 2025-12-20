import React from 'react';
import Card from './shared/Card';
import Button from './shared/Button';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { Language, translations } from '../services/i18n';

interface PreReportModalProps {
    onConfirm: () => void;
    language: Language;
    t: typeof translations;
}

const PreReportModal: React.FC<PreReportModalProps> = ({ onConfirm, language, t }) => {
    const p = t.preReportModal;

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-[999] p-4 animate-fade-in">
            <Card className="w-full max-w-lg text-center">
                <InformationCircleIcon className="w-20 h-20 mx-auto text-brand-teal-400 mb-6" />
                <h1 className="text-2xl font-bold text-white mb-4">{p.title[language]}</h1>
                <p className="text-gray-300 mb-8 leading-relaxed whitespace-pre-wrap">
                    {p.body[language]}
                </p>
                <Button onClick={onConfirm} variant="primary">{p.confirmButton[language]}</Button>
            </Card>
        </div>
    );
};

export default PreReportModal;
