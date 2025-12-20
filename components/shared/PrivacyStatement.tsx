import React from 'react';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { CpuChipIcon } from '../icons/CpuChipIcon';
import { LockClosedIcon } from '../icons/LockClosedIcon';
import { FireIcon } from '../icons/FireIcon';
import { Language, translations } from '../../services/i18n';

interface PrivacyStatementProps {
    language: Language;
    t: typeof translations;
}

const PrivacyStatement: React.FC<PrivacyStatementProps> = ({ language, t }) => {
    const policies = [
        { icon: ShieldCheckIcon, title: { 'zh-TW': '匿名資料收集', 'en': 'Anonymous' }, text: { 'zh-TW': '僅收集去識別化資料。', 'en': 'Anonymous only.' } },
        { icon: CpuChipIcon, title: { 'zh-TW': '邊緣端運算', 'en': 'Edge Computing' }, text: { 'zh-TW': '影像不離開裝置。', 'en': 'On-device processing.' } },
        { icon: LockClosedIcon, title: { 'zh-TW': '數據傳輸加密', 'en': 'SSL Encrypted' }, text: { 'zh-TW': '通訊全程最高規加密。', 'en': 'Secure transmission.' } },
        { icon: FireIcon, title: { 'zh-TW': '閱後即焚', 'en': 'Auto Delete' }, text: { 'zh-TW': '關閉網頁即清除數據。', 'en': 'Wiped on close.' } },
    ];

    return (
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] text-center mb-8">
                {language === 'zh-TW' ? '您的隱私與資料安全' : 'Security Protocols'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {policies.map((p, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                           <p.icon className="w-5 h-5 text-brand-teal-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">{p.title[language]}</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.text[language]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrivacyStatement;