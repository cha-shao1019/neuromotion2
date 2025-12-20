import React, { useState, useRef, useEffect } from 'react';
import { ChatIcon } from './icons/ChatIcon';
import { ChatMessage, AdminData } from '../types';
import { streamAdminAIAssistantResponse } from '../services/geminiService';
import { LogoIcon } from './icons/LogoIcon';
import { Language, translations } from '../services/i18n';
import audioService from '../services/audioService';

interface AdminAiAssistantProps {
    language: Language;
    t: typeof translations;
    adminData: AdminData[];
}

const AdminAiAssistant: React.FC<AdminAiAssistantProps> = ({ language, t, adminData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([{ role: 'model', text: t.adminAi.initialGreeting[language] }]);
    }, [language, t.adminAi.initialGreeting]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleToggleOpen = () => {
        audioService.playClick();
        setIsOpen(prev => !prev);
    };

    const handleClose = () => {
        audioService.playClick();
        setIsOpen(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage || isLoading) return;

        audioService.playClick();

        const currentHistory: ChatMessage[] = [...messages, { role: 'user', text: userMessage }];
        setMessages([...currentHistory, { role: 'model', text: '' }]);
        setInputValue('');
        setIsLoading(true);

        // 確保調用的是專為醫師設計的分析接口
        await streamAdminAIAssistantResponse(
            currentHistory.slice(0, -1),
            userMessage,
            adminData,
            (chunk) => {
                setMessages(prev => {
                    const latestMessages = [...prev];
                    const lastMessage = latestMessages[latestMessages.length - 1];
                    if (lastMessage.role === 'model') {
                        lastMessage.text += chunk;
                    }
                    return latestMessages;
                });
            },
            () => {
                setIsLoading(false);
            },
            (error) => {
                 setMessages(prev => {
                    const latestMessages = [...prev];
                    const lastMessage = latestMessages[latestMessages.length - 1];
                    if (lastMessage.role === 'model') {
                        lastMessage.text = error;
                    }
                    return latestMessages;
                });
                setIsLoading(false);
            }
        );
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                onClick={handleToggleOpen}
                className="w-16 h-16 bg-brand-blue-600 text-white rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex items-center justify-center hover:bg-brand-blue-700 transition-all transform hover:scale-110 active:scale-95"
                aria-label={t.adminAi.header[language]}
            >
                <ChatIcon className="w-8 h-8" />
            </button>

            <div
                className={`absolute bottom-[80px] right-0 z-50 w-[calc(100vw-2rem)] max-w-md h-[70vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_30px_80px_rgba(15,23,42,0.2)] flex flex-col transition-all duration-500 ease-out overflow-hidden ${
                    isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
                }`}
            >
                <header className="flex items-center justify-between p-6 bg-slate-900 text-white border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-blue-500 rounded-full flex items-center justify-center">
                            <LogoIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tighter leading-none">{t.adminAi.header[language]}</h2>
                            <p className="text-[10px] font-black text-brand-blue-300 uppercase tracking-widest mt-1">Doctor's AI Analytics</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors p-2">&times;</button>
                </header>

                <div className="flex-1 p-6 overflow-y-auto bg-slate-50 figma-grid space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm font-bold shadow-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-brand-blue-600 text-white rounded-br-none' 
                                : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                            }`}>
                                {msg.text ? (
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                ) : (
                                    <div className="flex items-center space-x-2 py-2">
                                       <div className="w-2 h-2 bg-brand-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                       <div className="w-2 h-2 bg-brand-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                       <div className="w-2 h-2 bg-brand-blue-500 rounded-full animate-bounce"></div>
                                   </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200">
                    <div className="flex items-center space-x-2 bg-slate-100 rounded-full border border-slate-200 p-1 pl-5">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={t.adminAi.placeholder[language]}
                            className="flex-1 py-2 text-slate-900 bg-transparent focus:outline-none text-sm font-medium"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-10 h-10 flex items-center justify-center text-white bg-brand-blue-600 rounded-full hover:bg-brand-blue-700 disabled:opacity-50 transition-all"
                        >
                            <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAiAssistant;