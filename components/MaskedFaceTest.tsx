import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MaskedFaceResult } from '../types';
import { getAIResponseNonStreaming, getAIImageAnalysis } from '../services/geminiService';
import { EMOJI_POOL } from '../constants';
import Button from './shared/Button';
import Card from './shared/Card';
import Loader from './shared/Loader';
import DelayedAnalysisTip from './shared/DelayedAnalysisTip';
import { Language, translations } from '../services/i18n';
import audioService from '../services/audioService';

interface MaskedFaceTestProps {
    onComplete: (result: MaskedFaceResult, analysis: string) => void;
    language: Language;
    t: typeof translations;
}

const TEST_DURATION = 5; // 每個表情測試 5 秒
const EMOJI_COUNT = 3; 

const getTestEmojis = (pool: typeof EMOJI_POOL, count: number) => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]); 
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

const MaskedFaceTest: React.FC<MaskedFaceTestProps> = ({ onComplete, language, t }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const lastCapturedRef = useRef<number>(-1);
    
    const [testEmojis, setTestEmojis] = useState<{ emoji: string; name: string }[]>([]);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [countdown, setCountdown] = useState(TEST_DURATION);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
    const [capturedFrames, setCapturedFrames] = useState<Record<string, string[]>>({});
    
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
    const [isRestarting, setIsRestarting] = useState(false);

    const enumerateCameras = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter(device => device.kind === 'videoinput');
            setVideoDevices(cameras);
        } catch (err) { console.error("無法枚舉攝影機:", err); }
    }, []);

    const startCamera = useCallback(async () => {
        if (videoDevices.length === 0) {
             setError(t.maskedFaceTest.cameraError[language]);
             return;
        }
        try {
            const deviceId = videoDevices[currentDeviceIndex]?.deviceId;
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 1280, height: 720, deviceId: deviceId ? { exact: deviceId } : undefined } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => videoRef.current?.play();
            }
            setIsCameraOn(true);
            setError(null);
        } catch (err) {
            setError(t.maskedFaceTest.cameraError[language]);
            setIsCameraOn(false);
        }
    }, [t, language, videoDevices, currentDeviceIndex]);

    const stopCamera = useCallback(() => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
        setIsCameraOn(false);
    }, []);
    
    const switchCamera = () => {
        if (videoDevices.length > 1) {
            stopCamera();
            setCurrentDeviceIndex(prev => (prev + 1) % videoDevices.length);
        }
    };

    const handleRestart = async () => {
        if (isRestarting || isTesting) return;
        setIsRestarting(true);
        stopCamera();
        await new Promise(resolve => setTimeout(resolve, 200));
        await startCamera();
        setIsRestarting(false);
    };

    const captureFrame = useCallback(async () => {
        if (videoRef.current && testEmojis.length > 0 && videoRef.current.readyState >= 2) {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
                if (blob) {
                    const base64Data = await blobToBase64(blob);
                    const currentEmojiName = testEmojis[currentEmojiIndex].name;
                    setCapturedFrames(prev => ({
                        ...prev,
                        [currentEmojiName]: [...(prev[currentEmojiName] || []), base64Data],
                    }));
                }
            }
        }
    }, [currentEmojiIndex, testEmojis]);

    const analyzeMovement = useCallback(async (finalFrames: Record<string, string[]>) => {
        audioService.playSuccess();
        setIsAnalyzing(true);
        stopCamera();

        const analysisPromises = testEmojis.map(emoji => {
            const frames = finalFrames[emoji.name] || [];
            if (frames.length === 0) return Promise.resolve({ expressionMatch: 'poor' as const, reactionTime: 'slow' as const });
            
            const imageParts = frames.map(frame => ({ inlineData: { mimeType: 'image/jpeg', data: frame } }));
            const prompt = `Analyze these frames of a user imitating '${emoji.name}' (${emoji.emoji}). Evaluate match (good/fair/poor) and reaction time (normal/slow). Return ONLY JSON: {"expressionMatch": "...", "reactionTime": "..."}`;
            return getAIImageAnalysis(prompt, imageParts);
        });

        try {
            const results = await Promise.all(analysisPromises);
            let finalResult: MaskedFaceResult = { expressionMatch: 'good', reactionTime: 'normal' };
            const scoreMap = { 'good': 3, 'fair': 2, 'poor': 1, 'normal': 2, 'slow': 1 };
            let minScore = 10;

            results.forEach(res => {
                const s = scoreMap[res.expressionMatch] + scoreMap[res.reactionTime];
                if (s < minScore) {
                    minScore = s;
                    finalResult = res;
                }
            });
            
            const summaryPrompt = `用戶完成了面部表情模仿測試，AI視覺分析結果為：符合度 ${finalResult.expressionMatch}，反應速度 ${finalResult.reactionTime}。請以此寫一段150字建議，解釋面具臉特徵。語言：${language === 'en' ? 'English' : '繁中'}`;
            const finalAnalysis = await getAIResponseNonStreaming(summaryPrompt);
            onComplete(finalResult, finalAnalysis);
        } catch (error) {
            onComplete({ expressionMatch: 'fair', reactionTime: 'slow' }, "分析過程出現問題，請參考問卷結果。");
        }
    }, [testEmojis, onComplete, language, stopCamera]);
    
    useEffect(() => {
        setTestEmojis(getTestEmojis(EMOJI_POOL, EMOJI_COUNT));
        enumerateCameras();
    }, [enumerateCameras]);
    
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera, currentDeviceIndex]);

    useEffect(() => {
        let timer: number;
        if (isTesting && countdown > 0) {
            timer = window.setTimeout(() => setCountdown(prev => prev - 1), 1000);
        } else if (isTesting && countdown === 0) {
            if (currentEmojiIndex < testEmojis.length - 1) {
                setCurrentEmojiIndex(prev => prev + 1);
                setCountdown(TEST_DURATION);
                lastCapturedRef.current = -1;
            } else {
                setIsTesting(false);
                analyzeMovement(capturedFrames);
            }
        }
        return () => clearTimeout(timer);
    }, [isTesting, countdown, currentEmojiIndex, testEmojis.length, analyzeMovement, capturedFrames]);

    useEffect(() => {
        if (isTesting && (countdown === 4 || countdown === 2) && lastCapturedRef.current !== countdown) {
            lastCapturedRef.current = countdown;
            captureFrame();
        }
    }, [isTesting, countdown, captureFrame]);

    const startTest = () => {
        audioService.playTestStart();
        setCurrentEmojiIndex(0);
        setCountdown(TEST_DURATION);
        setCapturedFrames({});
        lastCapturedRef.current = -1;
        setIsTesting(true);
    };
    
    if (testEmojis.length === 0) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader text="準備中..." /></div>;

    const currentEmoji = testEmojis[currentEmojiIndex];

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
             <Card className="w-full max-w-5xl text-center">
                {isAnalyzing ? (
                    <div className="p-10">
                        <Loader text={t.maskedFaceTest.analyzing[language]} />
                        <DelayedAnalysisTip isAnalyzing={true} />
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl md:text-4xl font-bold text-brand-teal-300 mb-4">{t.maskedFaceTest.title[language]}</h1>
                        <div className="flex flex-col lg:flex-row gap-8 items-center mt-8">
                            <div className="w-full lg:w-1/3 order-2 lg:order-1 flex flex-col items-center justify-center bg-gray-900/50 p-6 rounded-3xl border border-white/5 shadow-inner">
                                <p className="text-xl text-gray-400 mb-4">{t.maskedFaceTest.imitating[language]}</p>
                                <div className="text-8xl md:text-9xl mb-4 drop-shadow-[0_0_20px_rgba(76,170,162,0.3)]">{currentEmoji.emoji}</div>
                                <p className="text-2xl font-bold text-white">{currentEmoji.name}</p>
                            </div>
                            <div className="w-full lg:w-2/3 order-1 lg:order-2">
                                <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border-2 border-brand-teal-900/50 shadow-2xl">
                                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full scale-x-[-1]"></video>
                                    {isTesting && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="bg-red-600 px-4 py-2 rounded-full font-mono text-xl font-bold animate-pulse flex items-center gap-2">
                                                <span className="w-3 h-3 bg-white rounded-full"></span>
                                                {countdown}s
                                            </div>
                                        </div>
                                    )}
                                    {!isCameraOn && !error && <div className="absolute inset-0 flex items-center justify-center"><Loader text="啟動中..." /></div>}
                                    {error && <div className="absolute inset-0 flex items-center justify-center bg-black/80"><p className="text-red-400 p-4">{error}</p></div>}
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 text-left space-y-4 max-w-2xl mx-auto">
                           <h2 className="text-xl font-bold text-brand-teal-400 text-center uppercase tracking-widest">{t.maskedFaceTest.instructionsTitle[language]}</h2>
                            <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300 text-sm">
                                <li className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-brand-teal-500 font-bold block mb-1">01</span> {t.maskedFaceTest.instruction1[language]}</li>
                                <li className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-brand-teal-500 font-bold block mb-1">02</span> {t.maskedFaceTest.instruction2[language]}</li>
                                <li className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-brand-teal-500 font-bold block mb-1">03</span> {t.maskedFaceTest.instruction3[language]}</li>
                            </ol>
                            <div className="pt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
                                <Button onClick={startTest} disabled={!isCameraOn || isTesting || !!error} className="w-full col-span-2">
                                    {isTesting ? t.maskedFaceTest.testing[language](currentEmojiIndex + 1, testEmojis.length) : t.maskedFaceTest.readyButton[language]}
                                </Button>
                                <Button onClick={switchCamera} variant="secondary" disabled={isTesting || isRestarting || videoDevices.length < 2} className="w-full text-sm py-2">
                                    切換鏡頭
                                </Button>
                                <Button onClick={handleRestart} variant="secondary" disabled={isTesting || isRestarting} className="w-full text-sm py-2">
                                    {isRestarting ? t.maskedFaceTest.restarting[language] : t.maskedFaceTest.restartButton[language]}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default MaskedFaceTest;
