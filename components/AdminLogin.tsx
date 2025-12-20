import React, { useState } from 'react';
import Button from './shared/Button';
import Card from './shared/Card';
import { getAdmins } from '../services/adminService';
import { Language, translations } from '../services/i18n';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';

interface AdminLoginProps {
    onLoginSuccess: (username: string) => void;
    onExit: () => void;
    onGoToRegister: () => void;
    language: Language;
    t: typeof translations;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onExit, onGoToRegister, language, t }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const admin = getAdmins()[username];
        if (admin && admin.password === password) onLoginSuccess(username);
        else setError('帳號或密碼錯誤。');
    };

    const inputClasses = "w-full px-6 py-4 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-brand-teal-500 transition-all";

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 mesh-gradient flex items-center justify-center p-4 transition-colors duration-500">
            <Card className="w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl border-slate-200 dark:border-slate-700">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <h1 className="text-4xl font-black text-center text-slate-900 dark:text-white tracking-tighter mb-10">{t.admin.loginTitle[language]}</h1>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t.admin.username[language]}</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClasses} placeholder="醫師/管理員帳號" />
                    </div>
                    <div className="space-y-2 relative">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t.admin.password[language]}</label>
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} placeholder="********" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-10 text-slate-400">
                            {showPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
                    <div className="flex flex-col gap-4">
                        <Button type="submit" className="w-full py-6">登入儀表板</Button>
                        <Button type="button" variant="secondary" onClick={onExit} className="w-full py-4 text-sm">返回首頁</Button>
                    </div>
                    <p className="text-center text-xs text-slate-400 font-bold">
                        {t.admin.noAccount[language]} <button type="button" onClick={onGoToRegister} className="text-brand-teal-600 underline">立刻註冊</button>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default AdminLogin;