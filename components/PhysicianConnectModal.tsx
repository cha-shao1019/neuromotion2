
import React, { useState, useEffect } from 'react';
import { getApprovedPhysicians } from '../services/adminService';
import { AdminUser, ScreeningResults } from '../types';
import Button from './shared/Button';
import { Language, translations } from '../services/i18n';
import { submitReportToPhysician } from '../services/reportService';
import { UserIcon } from './icons/UserIcon';

interface PhysicianConnectModalProps {
    results: ScreeningResults;
    onClose: () => void;
    onSuccess: () => void;
    language: Language;
    t: typeof translations;
}

const PhysicianConnectModal: React.FC<PhysicianConnectModalProps> = ({ results, onClose, onSuccess, language, t }) => {
    const [physicians, setPhysicians] = useState<(Omit<AdminUser, 'password'> & { username: string })[]>([]);
    const [selectedPhysician, setSelectedPhysician] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setPhysicians(getApprovedPhysicians());
    }, []);

    const handleSubmit = () => {
        if (!selectedPhysician) return;
        setIsSubmitting(true);
        submitReportToPhysician(selectedPhysician, results);
        setTimeout(() => {
            setIsSubmitting(false);
            onSuccess();
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-reveal" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[3rem] p-8 sm:p-12 w-full max-w-lg shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="text-center">
                    <div className="w-16 h-16 bg-brand-teal-500/10 dark:bg-brand-teal-500/20 text-brand-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <UserIcon className="w-8 h-8"/>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">連接您的醫師</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-sm mx-auto">選擇一位已註冊的醫療專業人員，安全地傳送您的匿名篩檢報告以供專業參考。</p>
                </div>
                
                {physicians.length > 0 ? (
                    <div className="space-y-8">
                        <div>
                             <label htmlFor="physician-select" className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">選擇醫師</label>
                             <select 
                                id="physician-select"
                                value={selectedPhysician} 
                                onChange={(e) => setSelectedPhysician(e.target.value)}
                                className="w-full px-6 py-4 text-xl text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-brand-teal-500 transition-all shadow-inner appearance-none"
                            >
                                <option value="" disabled>請從列表中選擇...</option>
                                {physicians.map(p => (
                                    <option key={p.username} value={p.username}>
                                        Dr. {p.username} - {p.proof}
                                    </option>
                                ))}
                            </select>
                        </div>
                         <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={onClose} variant="secondary" className="w-full py-4 text-lg">取消</Button>
                            <Button onClick={handleSubmit} disabled={!selectedPhysician || isSubmitting} className="w-full py-4 text-lg">
                                {isSubmitting ? '傳送中...' : '確認並傳送報告'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
                        <p className="font-bold text-slate-600 dark:text-slate-300">目前沒有已註冊的醫師。</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">請稍後再試，或聯繫您的醫師在本平台註冊。</p>
                        <Button onClick={onClose} variant="secondary" className="mt-6">關閉</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhysicianConnectModal;