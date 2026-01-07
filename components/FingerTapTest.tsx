
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FingerTapResult, MotorTestMetric } from '../types';
import { getAIResponseNonStreaming } from '../services/geminiService';
import Button from './shared/Button';
import Card from './shared/Card';
import Loader from './shared/Loader';
import DelayedAnalysisTip from './shared/DelayedAnalysisTip';
import { Language, translations } from '../services/i18n';
import audioService from '../services/audioService';
import { FilesetResolver, HandLandmarker, DrawingUtils, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { BradykinesiaAnalyzer } from '../services/bradykinesiaAnalyzer';
import { TremorAnalyzer } from '../services/tremorAnalyzer';
import WaveformCanvas from './shared/WaveformCanvas';

interface FingerTapTestProps {
    onComplete: (result: FingerTapResult, analysis: string) => void;
    language: Language;
    t: typeof translations;
}

const REQUIRED_TAPS = 25;
const STATIC_TREMOR_TIME = 10;
type HandTestType = 'fingerTapping' | 'handOpeningClosing' | 'staticTremor';
const handTests: HandTestType[] = ['fingerTapping', 'handOpeningClosing', 'staticTremor'];

const FingerTapTest: React.FC<FingerTapTestProps> = ({ onComplete, language, t }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isTesting, setIsTesting] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const [countdown, setCountdown] = useState(STATIC_TREMOR_TIME);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentTestIndex, setCurrentTestIndex] = useState(0);
    const [results, setResults] = useState<Partial<Record<HandTestType, MotorTestMetric>>>({});
    const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
    const [showInstruction, setShowInstruction] = useState(true);
    const [isEnvShaking, setIsEnvShaking] = useState(false); 
    const [waveformData, setWaveformData] = useState<number[]>([]);
    const [aiTip, setAiTip] = useState<string>('系統就緒，點擊按鈕開始。');

    const bradykinesiaAnalyzerRef = useRef(new BradykinesiaAnalyzer());
    const tremorAnalyzerRef = useRef(new TremorAnalyzer());

    const currentTest = handTests[currentTestIndex];

    const initAIModel = useCallback(async () => {
        try {
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
            const landmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: { 
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`, 
                    delegate: "GPU" 
                },
                runningMode: "VIDEO", numHands: 1,
            });
            setHandLandmarker(landmarker);
        } catch (err) { console.error("AI Model Init Failed", err); }
    }, []);

    const startCamera = useCallback(async () => {
        try {
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 1280, height: 720 } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) { console.error("Camera startup failed", err); }
    }, []);

    useEffect(() => { initAIModel(); }, [initAIModel]);
    useEffect(() => {
        const handleGlobalAIRepair = () => {
            // 執行組件內的重啟或校準邏輯
            handleRestartCamera();

            // 如果正在測試，重設分析器以修復誤差
            if (isTesting) {
                bradykinesiaAnalyzerRef.current.reset();
                setTapCount(0);
                setAiTip("AI 已重新校準，請重新開始動作。");
            }
        };

        window.addEventListener('ai-repair-trigger', handleGlobalAIRepair);
        return () => window.removeEventListener('ai-repair-trigger', handleGlobalAIRepair);
    }, [isTesting]);
    useEffect(() => {
        const handleGlobalAIRepair = () => {
            handleRestartCamera(); // 觸發您原本就寫好的重啟鏡頭函式
            if (isTesting) {
                setAiTip("✨ AI 已重新校準環境參數");
            }
        };
        window.addEventListener('ai-repair-trigger', handleGlobalAIRepair);
        return () => window.removeEventListener('ai-repair-trigger', handleGlobalAIRepair);
    }, [handleRestartCamera, isTesting]);
    useEffect(() => { if (!showInstruction) startCamera(); }, [showInstruction, startCamera]);

    const handleRestartCamera = () => {
        setAiTip("正在嘗試重啟鏡頭...");
        startCamera();
        setTimeout(() => setAiTip("鏡頭已重啟，請調整手部位置。"), 1000);
    };

    const calcDistance = (p1: NormalizedLandmark, p2: NormalizedLandmark) => {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    useEffect(() => {
        let animationId: number;
        let lastWristPos = { x: 0, y: 0 };

        const detect = () => {
            if (handLandmarker && videoRef.current && canvasRef.current && videoRef.current.readyState >= 2) {
                const now = performance.now();
                const detectResults = handLandmarker.detectForVideo(videoRef.current, now);
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    if (detectResults.landmarks && detectResults.landmarks.length > 0) {
                        const landmarks = detectResults.landmarks[0];
                        const drawingUtils = new DrawingUtils(ctx);
                        drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, { color: "#4caaa2", lineWidth: 3 });
                        
                        const thumbTip = landmarks[4];
                        const indexTip = landmarks[8];
                        const wrist = landmarks[0];
                        const palmSize = calcDistance(wrist, landmarks[9]);
                        const normDist = calcDistance(thumbTip, indexTip) / (palmSize || 1);
                        
                        setWaveformData(prev => [...prev.slice(-60), normDist]);

                        if (isTesting) {
                             if (currentTest !== 'staticTremor') {
                                bradykinesiaAnalyzerRef.current.addDistance(normDist, now);
                                const metrics = bradykinesiaAnalyzerRef.current.getMetrics();
                                if (metrics.tapCount! > tapCount) audioService.playClick();
                                setTapCount(metrics.tapCount!);
                                
                                // 即時 AI 引導邏輯
                                if (metrics.amplitude === 'decreasing') setAiTip("檢測到振幅衰減，請儘量保持開合幅度最大！");
                                else if (metrics.speed === 'slow') setAiTip("速度稍慢，請嘗試加快點擊節奏。");
                                else setAiTip("動作良好，請繼續保持。");
                            } else {
                                tremorAnalyzerRef.current.addDataPoint((indexTip.y - wrist.y) * 100);
                                setAiTip("請保持手部完全靜止，放鬆即可。");
                            }
                        }

                        const wristDelta = Math.sqrt(Math.pow(wrist.x - lastWristPos.x, 2) + Math.pow(wrist.y - lastWristPos.y, 2));
                        setIsEnvShaking(wristDelta > 0.08 && isTesting);
                        lastWristPos = { x: wrist.x, y: wrist.y };
                    }
                }
            }
            animationId = requestAnimationFrame(detect);
        };
        detect();
        return () => cancelAnimationFrame(animationId);
    }, [handLandmarker, isTesting, currentTest, tapCount]);
    
    const finishTest = useCallback(() => {
        audioService.playSuccess();
        setIsTesting(false);
        const metric = currentTest !== 'staticTremor' ? bradykinesiaAnalyzerRef.current.getMetrics() : tremorAnalyzerRef.current.analyze();
        setResults(prev => ({ ...prev, [currentTest]: metric }));
        bradykinesiaAnalyzerRef.current.reset();
        tremorAnalyzerRef.current.reset();

        if (currentTestIndex < handTests.length - 1) {
            setTimeout(() => {
                setCurrentTestIndex(prev => prev + 1);
                setTapCount(0);
                setCountdown(STATIC_TREMOR_TIME);
                setShowInstruction(true); 
                setWaveformData([]);
                setAiTip("下一階段準備就緒。");
            }, 1000);
        } else {
            setIsAnalyzing(true);
            const prompt = `請以神經內科專業角度分析以下數據: ${JSON.stringify(results)}。語言: 繁體中文。`;
            getAIResponseNonStreaming(prompt).then(analysis => onComplete(results as FingerTapResult, analysis));
        }
    }, [currentTest, currentTestIndex, results, language, onComplete]);

    useEffect(() => {
        if (!isTesting) return;
        if (currentTest !== 'staticTremor' && tapCount >= REQUIRED_TAPS) finishTest();
        if (currentTest === 'staticTremor') {
            const timer = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
            if (countdown <= 0) { clearInterval(timer); finishTest(); }
            return () => clearInterval(timer);
        }
    }, [isTesting, tapCount, countdown, currentTest, finishTest]);

    if (showInstruction) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
                <Card className="max-w-2xl text-center space-y-8 dark:bg-slate-800">
                    <h1 className="text-3xl font-black dark:text-white">{t.fingerTapTest[currentTest].title[language]}</h1>
                    <div className="p-8 bg-slate-100 dark:bg-slate-900 rounded-3xl">
                         <div className="text-6xl mb-4">🖐️</div>
                         <p className="text-slate-500 dark:text-slate-400 font-medium">{t.fingerTapTest[currentTest].instructions[language][0]}</p>
                    </div>
                    <Button onClick={() => setShowInstruction(false)} className="w-full">開始檢測</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[3rem] overflow-hidden border-4 border-slate-800">
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full scale-x-[-1] object-cover opacity-70" />
                <canvas ref={canvasRef} width={1280} height={720} className="absolute inset-0 w-full h-full scale-x-[-1]" />
                
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl">
                         <p className="text-[10px] font-black text-slate-400 uppercase">AI 即時引導</p>
                         <p className="text-slate-900 font-bold">{aiTip}</p>
                    </div>
                    {isTesting && (
                         <div className="bg-brand-teal-500 text-white px-6 py-3 rounded-2xl font-black text-2xl">
                             {currentTest === 'staticTremor' ? `${countdown}s` : `${tapCount}/${REQUIRED_TAPS}`}
                         </div>
                    )}
                </div>

                {!isTesting && !isAnalyzing && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
                        <Button onClick={() => setIsTesting(true)}>啟動檢測</Button>
                        <button onClick={handleRestartCamera} className="bg-white/20 backdrop-blur-md text-white px-6 py-4 rounded-2xl font-bold hover:bg-white/30 transition-all">重啟鏡頭</button>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center">
                        <Loader text="臨床數據運算中..." />
                    </div>
                )}
            </div>
            {isTesting && (
                <div className="w-full max-w-5xl h-24 mt-6 bg-slate-800/50 rounded-2xl p-2">
                     <WaveformCanvas data={waveformData} width={1000} height={80} />
                </div>
            )}
        </div>
    );
};

export default FingerTapTest;
