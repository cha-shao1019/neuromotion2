import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage, ScreeningResults, MaskedFaceResult, MotorTestMetric, UPDRSScore } from "../types";
// 修正：使用 Vite 專用的環境變數讀取方式，解決 process is not defined 錯誤
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenerativeAI(API_KEY);
const modelName = 'gemini-3-flash-preview';

const streamAIResponse = async (
    prompt: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
): Promise<void> => {
    try {
        const response = await ai.models.generateContentStream({ model: modelName, contents: prompt });
        for await (const chunk of response) {
            const text = chunk.text;
            if (text) onChunk(text);
        }
    } catch (error: any) {
        onError(`AI 服務異常: ${error.message}`);
    } finally {
        onComplete();
    }
};

// 優化：加強指令嚴謹度，防止重複語句
const assistantSystemInstruction = `你是「NeuroMotion」帕金森居家篩檢小幫手。
你的回答規則：
1. **禁止重複**：絕對不要重複使用者的提問。
2. **極簡條列**：嚴格使用 * 進行條列，每點不超過 20 個字。
3. **格式規範**：關鍵詞必須用 **粗體** 標示。
4. **專業背景**：具備 MDS-UPDRS 量表知識。
5. **警語**：結尾必加「本回答僅供參考，非正式醫療診斷」。`;

const streamAIAssistantResponse = async (
    history: ChatMessage[],
    newUserMessage: string,
    results: ScreeningResults,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
): Promise<void> => {
    try {
        const chat = ai.chats.create({
            model: modelName,
            config: {
                systemInstruction: assistantSystemInstruction,
                temperature: 0.6 // 降低溫度以增加回答穩定性
            },
            history: history.map((msg: ChatMessage) => ({ role: msg.role, parts: [{ text: msg.text }] })),
        });
        const stream = await chat.sendMessageStream({ message: newUserMessage });
        for await (const chunk of stream) {
            const text = chunk.text;
            if (text) onChunk(text);
        }
    } catch (error: any) {
        onError("AI 暫時無法回應。");
    } finally {
        onComplete();
    }
};

const adminAssistantSystemInstruction = `你是 NeuroMotion 臨床數據專家。
請用簡短條列回答關於系統的問題：
* **運作原理**：Edge Computing, Mediapipe 視覺識別, 影像不離機保障隱私。
* **科學依據**：對標 MDS-UPDRS 量表, 4-6Hz 震顫頻率分析, Sequence Effect 衰減評估。
* **技術架構**：React 19 + Vite + Gemini 1.5 Flash。
回答規範：
1. **條列呈現**：禁止大段文字。
2. **數據導向**：優先標註關鍵指標。
3. **標註重點**：使用 **粗體** 標示技術名詞。`;

const streamAdminAIAssistantResponse = async (
    history: ChatMessage[],
    newUserMessage: string,
    adminData: any[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
): Promise<void> => {
    const dataContext = `目前數據集摘要: ${JSON.stringify(adminData.slice(0, 3))}`;
    try {
        const chat = ai.chats.create({
            model: modelName,
            config: {
                systemInstruction: adminAssistantSystemInstruction,
                temperature: 0.5
            },
            history: history.map((msg: ChatMessage) => ({ role: msg.role, parts: [{ text: msg.text }] })),
        });
        const stream = await chat.sendMessageStream({ message: `${dataContext}\n問題: ${newUserMessage}` });
        for await (const chunk of stream) {
            const text = chunk.text;
            if (text) onChunk(text);
        }
    } catch (error) {
        onError("分析引擎異常。");
    } finally {
        onComplete();
    }
};

const getAIResponseNonStreaming = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({ model: modelName, contents: prompt });
        return response.text || "無回傳。";
    } catch (error) {
        return "AI 分析失敗。";
    }
};

const getAIImageAnalysis = async (prompt: string, imageParts: Part[]): Promise<MaskedFaceResult> => {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts: [{ text: prompt }, ...imageParts] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        expressionMatch: { type: Type.STRING, enum: ['good', 'fair', 'poor'] },
                        reactionTime: { type: Type.STRING, enum: ['normal', 'slow'] },
                    },
                    required: ["expressionMatch", "reactionTime"],
                },
            },
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        return { expressionMatch: 'fair', reactionTime: 'normal' };
    }
};

export const getAIUPDRSScore = async (metrics: MotorTestMetric): Promise<UPDRSScore | null> => {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: JSON.stringify(metrics),
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER },
                        analysis: { type: Type.STRING },
                    },
                    required: ["score", "analysis"],
                },
            },
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        return null;
    }
};

export { getAIResponseNonStreaming, streamAIResponse, streamAIAssistantResponse, streamAdminAIAssistantResponse, getAIImageAnalysis };