import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class SmartGuard extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    // 當子組件發生錯誤時，觸發此偵測
    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // 這裡就是你的「AI 工程師」日誌，之後可以接 Gemini API 分析
        console.error("【AI守護者】偵測到系統崩潰:", error, errorInfo);
    }

    handleReset = () => {
        // 清除可能導致卡死的暫存並重刷
        localStorage.clear();
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[9999] bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-red-100 dark:border-red-900/30 text-center">
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">系統自動修復啟動</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                            AI 工程師偵測到頁面邏輯異常（可能是組件重疊或變數遺失）。為了防止黑屏，我們已暫停該區塊運行。
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-teal-500 hover:bg-brand-teal-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-teal-500/20"
                            >
                                <RefreshCw className="w-5 h-5" /> 執行深度修復並重啟
                            </button>
                            <button
                                onClick={() => this.setState({ hasError: false })}
                                className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                            >
                                嘗試返回上一頁
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default SmartGuard;