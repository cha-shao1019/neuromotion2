import React, { useState, useEffect, useCallback } from 'react';
import { AdminData, AdminUser, ChartDataPoint, Screen } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Button from './shared/Button';
import { MAX_SCORE } from '../constants';
import { getAdmins } from '../services/adminService';
import { Language, translations } from '../services/i18n';
import AdminAiAssistant from './AdminAiAssistant';
import { UserGroupIcon } from './icons/UserGroupIcon';

interface AdminDashboardProps {
    data: AdminData[];
    onExit: () => void;
    language: Language;
    t: typeof translations;
    loggedInAdmin: string | null;
    onNavigate: (screen: Screen) => void;
}

const colors = ['#4caaa2', '#6cc0b8', '#fbbf24', '#ef4444'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ data, onExit, language, t, loggedInAdmin, onNavigate }) => {
    const [admins, setAdmins] = useState<Record<string, AdminUser>>({});
    useEffect(() => { setAdmins(getAdmins()); }, []);

    const isSuperAdmin = loggedInAdmin ? admins[loggedInAdmin]?.role === 'super-admin' : false;

    const motorDist = data.reduce((acc, curr) => {
        acc[curr.motorTestResult] = (acc[curr.motorTestResult] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(motorDist).map(([name, value]) => ({ name, value }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-8 transition-colors duration-500">
            <div className="max-w-7xl mx-auto space-y-10">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.admin.dashboardTitle[language]}</h1>
                        <p className="text-slate-400 dark:text-slate-500 font-medium italic">歡迎回來，{loggedInAdmin}</p>
                    </div>
                    <div className="flex gap-3">
                        {isSuperAdmin && (
                            <Button onClick={() => onNavigate(Screen.ADMIN_MANAGE_USERS)} variant="secondary" className="!px-6 !py-3 text-xs flex items-center gap-2">
                                <UserGroupIcon className="w-4 h-4" /> 帳號管理
                            </Button>
                        )}
                        <Button onClick={onExit} variant="secondary" className="!px-6 !py-3 text-xs">退出後台</Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: '累計檢測次數', val: data.length, unit: '次' },
                        { label: '平均風險分數', val: (data.reduce((a, b) => a + b.questionnaireScore, 0) / (data.length || 1)).toFixed(1), unit: '/ 28' },
                        { label: '高風險個案佔比', val: (data.length > 0 ? (motorDist['High Risk'] || 0) / data.length * 100 : 0).toFixed(1), unit: '%' }
                    ].map((card, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{card.label}</p>
                            <p className="text-5xl font-black text-slate-900 dark:text-white">{card.val}<span className="text-xl text-slate-300 dark:text-slate-600 ml-2 font-light">{card.unit}</span></p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-xl font-black mb-10 text-slate-900 dark:text-white border-l-4 border-brand-teal-500 pl-4">風險級別分佈 (運動檢測)</h2>
                        <div className="h-80">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5}>
                                        {pieData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1e293b', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <h2 className="text-xl font-black mb-10 text-slate-900 dark:text-white border-l-4 border-brand-teal-500 pl-4">匿名受試者列表</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black border-b border-slate-100 dark:border-slate-700">
                                    <tr>
                                        <th className="py-4 px-2">受試 ID</th>
                                        <th className="py-4 px-2 text-center">問卷分數</th>
                                        <th className="py-4 px-2 text-right">運動判定</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                    {data.slice(0, 10).map((d, i) => (
                                        <tr key={i} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="py-4 px-2 font-mono text-xs">{d.userId.slice(0, 12)}...</td>
                                            <td className="py-4 px-2 text-center text-lg">{d.questionnaireScore}</td>
                                            <td className="py-4 px-2 text-right">
                                                <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black ${d.motorTestResult === 'Normal' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>{d.motorTestResult}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <AdminAiAssistant language={language} t={t} adminData={data} />
        </div>
    );
};

export default AdminDashboard;