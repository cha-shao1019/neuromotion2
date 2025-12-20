import React, { useState } from 'react';
import Button from './shared/Button';
import Card from './shared/Card';
import { registerAdmin, getAdmins } from '../services/adminService';
import { Language, translations } from '../services/i18n';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

interface AdminRegisterProps {
    onRegisterSuccess: () => void;
    onGoToLogin: () => void;
    language: Language;
    t: typeof translations;
}

const AdminRegister: React.FC<AdminRegisterProps> = ({ onRegisterSuccess, onGoToLogin, language, t }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'admin' | 'physician'>('physician');
    const [proof, setProof] = useState('');
    const [googleAccount, setGoogleAccount] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username || !password || !confirmPassword || (role === 'physician' && (!proof || !googleAccount))) {
            setError('所有欄位皆為必填項。'); return;
        }
        if (!agreedToTerms) { setError('您必須同意管理員條款。'); return; }
        if (password !== confirmPassword) { setError('兩次輸入的密碼不一致。'); return; }
        if (password.length < 6) { setError('密碼長度至少需要6個字元。'); return; }

        const admins = getAdmins();
        if (admins[username]) { setError('此使用者名稱已被註冊。'); return; }

        const registrationStatus = registerAdmin(username, password, proof, role, googleAccount);
        if (registrationStatus === 'approved') onRegisterSuccess();
        else setIsPending(true);
    };

    if (isPending) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center bg-white shadow-2xl">
                    <h1 className="text-3xl font-black text-brand-teal-600 mb-6">{t.admin.pendingTitle[language]}</h1>
                    <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                        {t.admin.pendingBody[language]('neuromotion.screening@gmail.com')}
                    </p>
                    <Button onClick={onGoToLogin} className="w-full">{t.admin.goToLogin[language]}</Button>
                </Card>
            </div>
        );
    }

    const inputClasses = "w-full px-6 py-4 text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-brand-teal-500 transition-all shadow-inner";

    return (
        <div className="min-h-screen bg-slate-100 mesh-gradient flex items-center justify-center p-4 py-20">
            <Card className="w-full max-w-md bg-white shadow-2xl">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-4xl font-black text-center text-slate-900 tracking-tighter mb-10">{t.admin.registerTitle[language]}</h1>
                    
                    <div className="bg-brand-teal-50 border border-brand-teal-100 p-6 rounded-[2rem] mb-10 flex items-start gap-4">
                        <InformationCircleIcon className="w-6 h-6 text-brand-teal-600 shrink-0 mt-1" />
                        <p className="text-sm text-brand-teal-900/60 leading-relaxed font-medium">註冊前請先聯繫管理員 <span className="font-black underline text-brand-teal-700">neuromotion.screening@gmail.com</span> 以獲取快速審核權限。</p>
                    </div>

                    <div className="mb-8">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">註冊身份</label>
                        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                            <button type="button" onClick={() => setRole('physician')} className={`flex-1 py-3 rounded-xl transition-all font-black text-sm ${role === 'physician' ? 'bg-white text-brand-teal-600 shadow-sm' : 'text-slate-400'}`}>醫師</button>
                            <button type="button" onClick={() => setRole('admin')} className={`flex-1 py-3 rounded-xl transition-all font-black text-sm ${role === 'admin' ? 'bg-white text-brand-teal-600 shadow-sm' : 'text-slate-400'}`}>管理員</button>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClasses} placeholder={t.admin.username[language]} />
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} placeholder="設定密碼 (至少6碼)" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-5 text-slate-400">
                                {showPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
                            </button>
                        </div>
                        <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClasses} placeholder={t.admin.confirmPassword[language]} />
                        
                        {role === 'physician' && (
                            <div className="space-y-4 animate-reveal">
                                <textarea value={proof} onChange={(e) => setProof(e.target.value)} className={`${inputClasses} h-24`} placeholder="執業證號或所屬醫療機構證明"></textarea>
                                <input type="email" value={googleAccount} onChange={(e) => setGoogleAccount(e.target.value)} className={inputClasses} placeholder="Google 帳號電子郵件" />
                            </div>
                        )}
                    </div>

                    <div className="mt-10 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <label className="flex items-start gap-4 cursor-pointer">
                            <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 h-6 w-6 rounded border-slate-300 text-brand-teal-500 focus:ring-brand-teal-500" />
                            <span className="text-sm text-slate-500 font-medium">我同意遵守醫療數據保密條款與 NeuroMotion 的服務協定。</span>
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-sm font-black text-center mt-6">{error}</p>}
                    <Button type="submit" className="w-full py-6 mt-10 shadow-xl">{t.admin.registerButton[language]}</Button>
                    <p className="text-center text-sm text-slate-400 mt-8 font-black">
                        {t.admin.haveAccount[language]} <button type="button" onClick={onGoToLogin} className="text-brand-teal-600 underline">立刻登入</button>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default AdminRegister;