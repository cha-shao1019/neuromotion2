
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FingerTapResult, MotorTestMetric, ChartDataPoint } from '../types';
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
                runningMode: "VIDEO", numHands: 2,
            });
            setHandLandmarker(landmarker);
        } catch (err) { console.error("AI Model Init Failed", err); }
    }, []);

    const startCamera = useCallback(async () => {
        if (showInstruction) return;
        try {
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => videoRef.current?.play();
            }
        } catch (err) { console.error("Camera startup failed", err); }
    }, [showInstruction]);

    useEffect(() => { initAIModel(); }, [initAIModel]);
    useEffect(() => { if (!showInstruction) startCamera(); }, [showInstruction, startCamera]);

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
                        const landmarks = detectResults.landmarks[0]; // Process first detected hand
                        const drawingUtils = new DrawingUtils(ctx);
                        drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, { color: "#4caaa2", lineWidth: 3 });
                        
                        const thumbTip = landmarks[4];
                        const indexTip = landmarks[8];
                        const wrist = landmarks[0];
                        const middleMCP = landmarks[9];

                        const palmSize = calcDistance(wrist, middleMCP);
                        const rawDistance = calcDistance(thumbTip, indexTip);
                        const normalizedDistance = rawDistance / (palmSize || 1);
                        
                        // Update waveform
                        setWaveformData(prev => [...prev.slice(-100), normalizedDistance]);

                        if (isTesting) {
                             if (currentTest === 'fingerTapping' || currentTest === 'handOpeningClosing') {
                                bradykinesiaAnalyzerRef.current.addDistance(normalizedDistance, now);
                                const newTapCount = bradykinesiaAnalyzerRef.current.getMetrics()?.tapCount || 0;
                                if(newTapCount > tapCount) audioService.playClick();
                                setTapCount(newTapCount);
                            } else if (currentTest === 'staticTremor') {
                                // Relative Y position of index finger tip to wrist
                                const relativeY = (indexTip.y - wrist.y) * 100; // Scale for better analysis
                                tremorAnalyzerRef.current.addDataPoint(relativeY);
                            }
                        }

                        // wrist shake detection
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
        
        let metric: MotorTestMetric | null = null;

        if (currentTest === 'fingerTapping' || currentTest === 'handOpeningClosing') {
            metric = bradykinesiaAnalyzerRef.current.getMetrics();
        } else if (currentTest === 'staticTremor') {
            metric = tremorAnalyzerRef.current.analyze();
        }
        
        // Ensure metric is not null before setting results
        if (metric) {
            setResults(prev => ({ ...prev, [currentTest]: metric }));
        }

        bradykinesiaAnalyzerRef.current.reset();
        tremorAnalyzerRef.current.reset();

        if (currentTestIndex < handTests.length - 1) {
            setTimeout(() => {
                setCurrentTestIndex(prev => prev + 1);
                setTapCount(0);
                setCountdown(STATIC_TREMOR_TIME);
                setShowInstruction(true); 
                setWaveformData([]);
            }, 1000);
        } else {
            setIsAnalyzing(true);
            
            const finalResultsForAI = { ...results, ...(metric && { [currentTest]: metric }) };
            const metricsSummary = JSON.stringify(finalResultsForAI);

            const prompt = `Please act as a neurology AI specialist and analyze the following hand motor test data.
                Test Data JSON: ${metricsSummary}
                Please pay close attention to these typical Parkinson's Disease (PD) features:
                1. Bradykinesia (slowness of movement): Check if frequency is < 3Hz, or hesitationCount > 0.
                2. Sequence Effect (decrement): Check if amplitudeDecrement is > 15% (indicating movement gets smaller/slower over time).
                3. Resting Tremor: Check if the staticTremor frequency is in the 4-6Hz range.
                4. Rhythm: Check if rhythmVariability (CV) is > 0.25 (irregular movements).
                Generate a concise report of about 150-200 words, indicating if any of the above signs were observed.
                Language: ${language === 'en' ? 'English' : 'Traditional Chinese'}.`;
            
            getAIResponseNonStreaming(prompt).then(analysis => onComplete({
                fingerTapping: results.fingerTapping || null,
                handOpeningClosing: results.handOpeningClosing || null,
                staticTremor: (metric && currentTest === 'staticTremor') ? metric : results.staticTremor || null
            } as FingerTapResult, analysis));
        }
    }, [currentTest, currentTestIndex, results, language, onComplete]);

    useEffect(() => {
        if (!isTesting) return;
        if ((currentTest === 'fingerTapping' || currentTest === 'handOpeningClosing') && tapCount >= REQUIRED_TAPS) finishTest();
        if (currentTest === 'staticTremor') {
            const timer = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
            if (countdown <= 0) {
                clearInterval(timer);
                finishTest();
            }
            return () => clearInterval(timer);
        }
    }, [isTesting, tapCount, countdown, currentTest, finishTest]);

    // ... RealisticHandGuide component remains the same ...
    const RealisticHandGuide = ({ type }: { type: HandTestType }) => {
        return (
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-brand-teal-500/10 rounded-full blur-2xl animate-pulse"></div>
                <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 overflow-visible drop-shadow-xl">
                    <defs>
                        <filter id="handGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                            <feOffset in="blur" dx="0" dy="2" result="offsetBlur"/>
                            <feFlood floodColor="#4caaa2" floodOpacity="0.5" result="flood"/>
                            <feComposite in="flood" in2="offsetBlur" operator="in" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <g filter="url(#handGlow)" stroke="#4caaa2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        {type === 'fingerTapping' && (
                            <>
                                {/* Palm */}
                                <path d="M 60 90 C 40 95, 30 70, 40 50 S 50 20, 70 30 S 85 50, 80 70 Z" fill="#4caaa2" fillOpacity="0.1" />
                                {/* Other fingers */}
                                <path d="M 70 30 C 70 15, 75 15, 75 30" />
                                <path d="M 80 45 C 85 30, 90 30, 90 45" />
                                <path d="M 83 60 C 93 50, 98 50, 98 60" />
                                {/* Animated thumb and index */}
                                <path d="M 40 50 C 20 50, 20 70, 40 80" className="thumb-path" />
                                <path d="M 50 35 C 40 20, 30 20, 30 35" className="index-finger-path" />
                            </>
                        )}
                        {type === 'handOpeningClosing' && (
                             <g className="hand-open-close">
                                 <path d="M45,80 C35,85 25,75 25,60 L35,40 C35,25 45,25 45,40Z" />
                                 <path d="M50,85 C50,95 45,95 45,85 L55,40 C55,25 65,25 65,40Z" />
                                 <path d="M60,85 C60,95 55,95 55,85 L70,45 C70,30 80,30 80,45Z" />
                                 <path d="M70,80 C80,85 85,75 85,60 L75,45 C75,35 85,35 85,45Z" />
                            </g>
                        )}
                        {type === 'staticTremor' && (
                            <g className="static-tremor-hand">
                                 <path d="M45,80 C35,85 25,75 25,60 L35,40 C35,25 45,25 45,40Z" />
                                 <path d="M50,85 C50,95 45,95 45,85 L55,40 C55,25 65,25 65,40Z" />
                                 <path d="M60,85 C60,95 55,95 55,85 L70,45 C70,30 80,30 80,45Z" />
                                 <path d="M70,80 C80,85 85,75 85,60 L75,45 C75,35 85,35 85,45Z" />
                            </g>
                        )}
                    </g>
                </svg>
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes tap-thumb { 0%, 100% { transform: rotate(0deg) translateX(0); } 50% { transform: rotate(15deg) translateX(10px); } }
                    @keyframes tap-index { 0%, 100% { transform: rotate(0deg) translateY(0); } 50% { transform: rotate(-8deg) translateY(8px) translateX(8px); } }
                    .thumb-path { animation: tap-thumb 1.2s cubic-bezier(0.45, 0, 0.55, 1) infinite; transform-origin: 50px 85px; }
                    .index-finger-path { animation: tap-index 1.2s cubic-bezier(0.45, 0, 0.55, 1) infinite; transform-origin: 55px 40px; }
                    @keyframes grip { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.6); } }
                    .hand-open-close { animation: grip 1.5s cubic-bezier(0.45, 0, 0.55, 1) infinite; transform-origin: center 85px; }
                    @keyframes tremor { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(0.6px, -0.2px); } 50% { transform: translate(0, 0.3px); } 75% { transform: translate(-0.6px, -0.2px); } }
                    .static-tremor-hand { animation: tremor 0.4s linear infinite; }
                `}} />
            </div>
        );
    };

    if (showInstruction) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-6 transition-colors">
                <Card className="w-full max-w-4xl text-center space-y-12 bg-slate-50 dark:bg-slate-800 rounded-[4rem]">
                    <div className="space-y-4">
                        <div className="inline-block px-4 py-1.5 bg-brand-teal-500/10 text-brand-teal-600 rounded-full text-[10px] font-black tracking-widest uppercase"> Step {currentTestIndex + 1} of 3 </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter"> {t.fingerTapTest[currentTest].title[language]} </h1>
                    </div>
                    <div className="relative py-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-inner">
                        <RealisticHandGuide type={currentTest} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        {t.fingerTapTest[currentTest].instructions[language].map((line, i) => (
                            <div key={i} className="flex gap-4 items-start p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700">
                                <span className="w-8 h-8 rounded-full bg-brand-teal-500 flex items-center justify-center text-white font-black text-xs shrink-0">{i + 1}</span>
                                <p className="text-slate-600 dark:text-slate-300 font-bold leading-relaxed">{line}</p>
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => setShowInstruction(false)} className="w-full py-6 text-xl sm:py-8 sm:text-2xl shadow-xl shadow-brand-teal-500/20"> 我已看完示範，開始檢測 </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 gap-4">
            <div className="relative w-full max-w-7xl aspect-video bg-black rounded-[4rem] overflow-hidden border-4 border-slate-800 shadow-2xl">
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full scale-x-[-1] object-cover opacity-60" />
                <canvas ref={canvasRef} width={1280} height={720} className="absolute inset-0 w-full h-full scale-x-[-1] pointer-events-none" />
                <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start">
                        <div className="bg-white/90 backdrop-blur-md px-6 py-4 sm:px-10 sm:py-6 rounded-[2.5rem] border border-slate-200">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">檢測協議</span>
                            <span className="text-2xl sm:text-3xl font-black text-slate-900">{t.fingerTapTest[currentTest].title[language]}</span>
                        </div>
                        {isTesting && (
                             <div className="bg-brand-teal-500 text-white px-8 py-5 sm:px-16 sm:py-8 rounded-[3rem] text-center shadow-2xl animate-reveal border-4 border-white/20">
                                <span className="text-[10px] font-black uppercase tracking-widest block mb-1">{currentTest === 'staticTremor' ? '剩餘秒數' : '完成進度'}</span>
                                <span className="text-6xl sm:text-7xl font-mono font-black">{currentTest === 'staticTremor' ? `${countdown}s` : `${tapCount}/${REQUIRED_TAPS}`}</span>
                             </div>
                        )}
                    </div>
                    {isEnvShaking && (
                        <div className="self-center bg-red-600/90 backdrop-blur-md text-white px-12 py-5 rounded-full font-black text-xl animate-bounce border-2 border-white/20 shadow-2xl"> ⚠️ 警告：環境不穩，請保持鏡頭固定 </div>
                    )}
                    {!isTesting && !isAnalyzing && (
                        <div className="self-center w-full max-w-sm bg-white/10 backdrop-blur-2xl p-8 sm:p-12 rounded-[3.5rem] border border-white/10 text-center pointer-events-auto">
                            <h2 className="text-white text-2xl sm:text-3xl font-black mb-10 tracking-tighter">系統就緒</h2>
                            <Button onClick={() => setIsTesting(true)} className="w-full py-5 text-lg sm:py-6 sm:text-xl">點擊開始計數</Button>
                        </div>
                    )}
                    {isAnalyzing && (
                        <div className="self-center bg-white p-12 sm:p-20 rounded-[4rem] text-center shadow-2xl">
                             <Loader text="計算運動衰減與節律變異中..." />
                             <DelayedAnalysisTip isAnalyzing={true} />
                        </div>
                    )}
                </div>
            </div>
            {isTesting && currentTest !== 'staticTremor' && (
                <div className="w-full max-w-7xl h-32 bg-slate-800/50 rounded-3xl border border-slate-700 p-4">
                     <WaveformCanvas data={waveformData} width={1200} height={112} />
                </div>
            )}
        </div>
    );
};

export default FingerTapTest;
