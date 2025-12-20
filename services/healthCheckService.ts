import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

let handLandmarker: HandLandmarker | null = null;

export const runHealthCheck = async (): Promise<{ success: boolean; error: string }> => {
    // 1. Check Camera
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            return { success: false, error: '您的瀏覽器不支援相機功能。' };
        }
        // Request a minimal stream just to check for permission and availability, then stop it.
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        stream.getTracks().forEach(track => track.stop());
    } catch (err) {
        console.error("Health check failed: Camera access", err);
        return { success: false, error: '無法取用您的相機。請檢查瀏覽器權限，並確保沒有其他應用程式正在使用相機。' };
    }

    // 2. Check AI Model Loading
    try {
        if (!handLandmarker) {
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`, delegate: "GPU" },
                runningMode: "VIDEO", numHands: 1,
            });
        }
        if (!handLandmarker) {
             throw new Error("HandLandmarker failed to initialize.");
        }
    } catch (e) {
        console.error("Health check failed: AI Model", e);
        return { success: false, error: 'AI 視覺分析引擎載入失敗。請檢查您的網路連線，或嘗試重新整理頁面。' };
    }

    return { success: true, error: '' };
};
