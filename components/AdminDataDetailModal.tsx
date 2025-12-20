import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { AdminData, ChartDataPoint } from '../types';
import { Language, translations } from '../services/i18n';
import { MEDICAL_STANDARDS } from '../constants';
import Button from './shared/Button';

interface AdminDataDetailModalProps {
    user: AdminData;
    realData?: { frequency: ChartDataPoint[], amplitude: ChartDataPoint[] };
    onClose: () => void;
    language: Language;
    t: typeof translations;
}

const AdminDataDetailModal: React.FC<AdminDataDetailModalProps> = ({ user, realData, onClose, language, t }) => {
    const isReal = !!realData;
    
    const StandardInfo = ({ label, standard, unit }: { label: string, standard: any, unit: string }) => (
        <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-mono">
            <span>{label} 臨床標準:</span>
            <span className="text-brand-teal-400">{standard.min || 0}{unit} - {standard.max || '∞'}{unit}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div className="bg-gray-900 border border-brand-teal-900/30 rounded-[3rem] p-6 sm:p-10 w-full max-w-5xl h-full sm:h-auto max-h-full overflow-y-auto shadow-2xl animate-slide-in-up relative" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal-500/5 blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="flex justify-between items-start mb-10 relative">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h2 className="text-3xl font-black text-white">{t.admin.detailModalTitle[language]}</h2>
                             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.motorTestResult === 'Normal' ? 'bg-brand-teal-500/10 text-brand-teal-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                {user.motorTestResult}
                             </span>
                        </div>
                        <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">Patient ID: {user.userId}</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white transition-all">&times;</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   {isReal ? (
                        <>
                            <div className="space-y-4">
                                <div className="bg-black/40 p-4 sm:p-8 rounded-[2rem] border border-white/5 shadow-inner">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8 text-center">{t.admin.frequencyChartTitle[language]}</h3>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <LineChart data={realData.frequency}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                            <XAxis dataKey="time" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                                            <YAxis stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                                            <ReferenceLine y={MEDICAL_STANDARDS.fingerTap.frequency.min} stroke="#4caaa2" strokeDasharray="3 3" label={{ position: 'right', value: 'Min', fill: '#4caaa2', fontSize: 10 }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px' }} />
                                            <Line type="monotone" dataKey="value" stroke="#4caaa2" strokeWidth={4} dot={{ r: 4, fill: '#4caaa2', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    <StandardInfo label="頻率" standard={MEDICAL_STANDARDS.fingerTap.frequency} unit="Hz" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-black/40 p-4 sm:p-8 rounded-[2rem] border border-white/5 shadow-inner">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8 text-center">{t.admin.amplitudeChartTitle[language]}</h3>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <LineChart data={realData.amplitude}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                            <XAxis dataKey="time" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                                            <YAxis stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                                            <ReferenceLine y={MEDICAL_STANDARDS.fingerTap.amplitude.min} stroke="#60a5fa" strokeDasharray="3 3" label={{ position: 'right', value: 'Min', fill: '#60a5fa', fontSize: 10 }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px' }} />
                                            <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={4} dot={{ r: 4, fill: '#60a5fa', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    <StandardInfo label="振幅" standard={MEDICAL_STANDARDS.fingerTap.amplitude} unit="%" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="lg:col-span-2 bg-black/40 p-8 rounded-[2rem] border border-white/5 shadow-inner flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                            <h3 className="text-xl font-bold text-gray-400">無詳細運動數據</h3>
                            <p className="text-gray-500 mt-2 max-w-sm">此筆紀錄沒有詳細的即時運動數據圖表。只有透過此裝置完成的當次檢測才會產生圖表以供分析。</p>
                        </div>
                    )}
                </div>

                <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-4">
                        <div className="text-xs text-gray-600 bg-white/5 px-4 py-2 rounded-lg">Age: {user.age}</div>
                        <div className="text-xs text-gray-600 bg-white/5 px-4 py-2 rounded-lg">Gender: {user.gender}</div>
                    </div>
                    <Button onClick={onClose} variant="secondary" className="px-12 py-3 w-full sm:w-auto">關閉詳情</Button>
                </div>
            </div>
        </div>
    );
};

export default AdminDataDetailModal;