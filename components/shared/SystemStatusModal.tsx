
import React from 'react';
import Card from './Card';
import Button from './Button';
import { WarningIcon } from '../icons/WarningIcon';

interface SystemStatusModalProps {
    error: string;
    onRestart: () => void;
    onContinue: () => void;
}

const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ error, onRestart, onContinue }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl flex items-center justify-center z-[999] p-4 animate-reveal">
            <Card className="w-full max-w-xl text-center bg-white border-red-100 p-12 md:p-16">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <WarningIcon className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter uppercase">系統檢測異常</h1>
                
                <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[2.5rem] mb-10">
                    <p className="text-red-600 font-black text-lg leading-relaxed">{error}</p>
                </div>
                
                <p className="text-slate-500 mb-12 font-medium">這可能會影響 AI 分析的準確度或導致鏡頭黑屏。建議您嘗試重啟服務，或檢查瀏覽器權限設定。</p>
                
                <div className="flex flex-col gap-4">
                    <Button onClick={onRestart} className="w-full !py-6 shadow-xl shadow-brand-teal-500/20">重啟核心服務</Button>
                    <Button onClick={onContinue} variant="secondary" className="w-full !py-4 !text-sm">暫時忽略並繼續</Button>
                </div>
            </Card>
        </div>
    );
};

export default SystemStatusModal;
