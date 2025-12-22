
import React, { useState } from 'react';
import { Language, translations } from '../services/i18n';
import { MobileMenuAction, Theme } from '../App';
import { CssHamburger } from './shared/CssHamburger';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { UserIcon } from './icons/UserIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { TableCellsIcon } from './icons/TableCellsIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface MobileMenuProps {
    isExiting: boolean;
    onClose: (action: MobileMenuAction) => void;
    onLanguageChange: (lang: Language) => void;
    theme: Theme;
    onThemeChange: () => void;
    language: Language;
    t: typeof translations;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isExiting, onClose, onLanguageChange, theme, onThemeChange, language, t }) => {
    
    const animationClass = isExiting ? 'animate-slide-out-to-right' : 'animate-slide-in-from-right';
    const iconButtonClass = "flex flex-col items-center text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 space-y-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-400 rounded-2xl";
    const iconWrapperClass = "w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-brand-teal-500/20 group-hover:border-brand-teal-500 border-2 border-transparent transition-all duration-300 shadow-sm";

    return (
        <div className={`fixed inset-0 z-[200] bg-white dark:bg-slate-900 flex flex-col transition-colors duration-500 ${animationClass}`}>
            
            {/* Header with Close Button */}
            <div className="absolute top-0 w-full px-6 py-6 flex justify-between items-center z-10">
                <div className="text-sm font-black text-slate-300 uppercase tracking-widest">Menu</div>
                <div className="w-10 h-10 flex items-center justify-center">
                    <CssHamburger
                        isOpen={true} 
                        onClick={() => onClose(null)}
                        className="relative z-[101] text-slate-900 dark:text-white"
                    />
                </div>
            </div>
            
            {/* Main Menu Grid */}
            <div className="flex-1 flex flex-col justify-center px-8 pb-32">
                 <div className="grid grid-cols-2 gap-x-6 gap-y-10 max-w-sm mx-auto w-full">
                        <button onClick={() => onClose('features')} className={iconButtonClass}>
                            <div className={iconWrapperClass}>
                                <InformationCircleIcon className="w-8 h-8" />
                            </div>
                            <span className="font-bold text-xs tracking-wide">{t.landing.howItWorks[language]}</span>
                        </button>
                         <button onClick={() => onClose('changelog')} className={iconButtonClass}>
                            <div className={iconWrapperClass}>
                                <DocumentTextIcon className="w-8 h-8" />
                            </div>
                            <span className="font-bold text-xs tracking-wide">{t.app.changelog[language]}</span>
                        </button>
                         <button onClick={() => onClose('clinical_reference')} className={iconButtonClass}>
                            <div className={iconWrapperClass}>
                                <TableCellsIcon className="w-8 h-8" />
                            </div>
                            <span className="font-bold text-xs tracking-wide">臨床數據標準</span>
                        </button>
                         <button onClick={() => onClose('contact')} className={iconButtonClass}>
                            <div className={iconWrapperClass}>
                                <EnvelopeIcon className="w-8 h-8" />
                            </div>
                            <span className="font-bold text-xs tracking-wide">{t.landing.contactUs[language]}</span>
                        </button>
                         <button onClick={() => onClose('admin')} className={`${iconButtonClass} col-span-2`}>
                            <div className="w-full flex items-center justify-center gap-3 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl active:scale-95 transition-all">
                                <UserIcon className="w-5 h-5" />
                                <span className="font-bold text-sm tracking-wide">{t.landing.adminPortal[language]}</span>
                            </div>
                        </button>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 w-full p-8 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <div className="flex gap-4 max-w-sm mx-auto">
                    {/* Theme Toggle */}
                    <button 
                        onClick={onThemeChange}
                        className="flex-1 h-14 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform"
                    >
                        {theme === 'light' ? <SunIcon className="w-5 h-5 text-orange-500" /> : <MoonIcon className="w-5 h-5 text-brand-teal-400" />}
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{theme === 'light' ? 'Light' : 'Dark'}</span>
                    </button>

                    {/* Language Toggle */}
                    <div className="flex-1 h-14 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex p-1 shadow-sm">
                        <button 
                            onClick={() => onLanguageChange('zh-TW')}
                            className={`flex-1 rounded-xl text-xs font-black transition-all ${language === 'zh-TW' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
                        >
                            繁中
                        </button>
                        <button 
                            onClick={() => onLanguageChange('en')}
                            className={`flex-1 rounded-xl text-xs font-black transition-all ${language === 'en' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
                        >
                            EN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
