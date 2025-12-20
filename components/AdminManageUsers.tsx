import React, { useState, useEffect, useCallback } from 'react';
import { AdminUser } from '../types';
import Button from './shared/Button';
import Card from './shared/Card';
import { getAdmins, approveAdmin, revokeApproval, deleteUser } from '../services/adminService';
import { Language, translations } from '../services/i18n';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';

interface AdminManageUsersProps {
    onBack: () => void;
    language: Language;
    t: typeof translations;
}

const AdminManageUsers: React.FC<AdminManageUsersProps> = ({ onBack, language, t }) => {
    const [users, setUsers] = useState<[string, AdminUser][]>([]);

    const fetchUsers = useCallback(() => {
        const adminData = getAdmins();
        setUsers(Object.entries(adminData));
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleApprove = (username: string) => {
        approveAdmin(username);
        fetchUsers();
    };
    
    const handleRevoke = (username: string) => {
        if (window.confirm(`您確定要撤銷 ${username} 的存取權限嗎？該帳號將需要重新審核。`)) {
            revokeApproval(username);
            fetchUsers();
        }
    };
    
    const handleDelete = (username: string) => {
        if (window.confirm(`您確定要永久刪除 ${username} 的帳號嗎？此操作無法復原。`)) {
            deleteUser(username);
            fetchUsers();
        }
    };

    const roleColors: { [key: string]: string } = {
        'super-admin': 'bg-red-100 text-red-600',
        'admin': 'bg-brand-blue-100 text-brand-blue-600',
        'physician': 'bg-brand-teal-100 text-brand-teal-600',
    };

    return (
        <div className="min-h-screen bg-slate-50 mesh-gradient figma-grid flex flex-col items-center p-4 py-24 sm:py-32">
            <Card className="w-full max-w-6xl animate-reveal bg-white shadow-2xl border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">帳號權限管理</h1>
                        <p className="text-slate-400 font-medium italic mt-1">審核醫療專業人員與系統管理員權限</p>
                    </div>
                    <Button onClick={onBack} variant="secondary">返回儀表板</Button>
                </div>

                <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-inner">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-200/50 text-slate-500 uppercase text-xs font-black tracking-widest">
                                <tr>
                                    <th className="p-6">使用者名稱</th>
                                    <th className="p-6">角色</th>
                                    <th className="p-6">當前狀態</th>
                                    <th className="p-6 hidden md:table-cell">證明 / Google 帳號</th>
                                    <th className="p-6 text-right">管理操作</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700 font-bold">
                                {users.map(([username, user]) => (
                                    <tr key={username} className="border-b border-slate-100 hover:bg-white transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black uppercase">{username[0]}</div>
                                                <span>{username}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${roleColors[user.role]}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${user.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                                                <span className={`text-sm ${user.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {user.status === 'approved' ? '已授權' : '待審核'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-xs text-slate-400 hidden md:table-cell max-w-xs">
                                            <p className="truncate font-mono">{user.proof || '無證明文件'}</p>
                                            <p className="text-brand-blue-500 truncate mt-1">{user.googleAccount || '未綁定 Google'}</p>
                                        </td>
                                        <td className="p-6 text-right">
                                            {user.role !== 'super-admin' ? (
                                                <div className="flex gap-2 justify-end">
                                                    {user.status === 'pending' && (
                                                        <Button onClick={() => handleApprove(username)} className="!px-5 !py-2 !text-xs !rounded-xl">批准</Button>
                                                    )}
                                                    {user.status === 'approved' && (
                                                        <Button onClick={() => handleRevoke(username)} variant="secondary" className="!px-5 !py-2 !text-xs !rounded-xl">撤銷</Button>
                                                    )}
                                                    <Button onClick={() => handleDelete(username)} variant="danger" className="!px-5 !py-2 !text-xs !rounded-xl">刪除</Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300 italic font-medium">系統保護</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                 <div className="mt-12 bg-red-50 border border-red-100 p-8 rounded-[2rem] flex items-start gap-5">
                    <ShieldExclamationIcon className="w-8 h-8 text-red-500 flex-shrink-0" />
                    <div className="space-y-2">
                        <h4 className="font-black text-red-600">管理安全性提示 (Security Advisory)</h4>
                        <p className="text-sm text-red-900/60 leading-relaxed font-medium">
                            「超級管理員」權限無法被其他帳號撤銷或刪除。授權新的「醫師」帳號前，請務必核對其執業證號與所屬機構。本平台所有數據均受加密保護，任何不當的權限變更都將被系統日誌完整紀錄。
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdminManageUsers;