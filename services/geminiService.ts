
import { GoogleGenAI, GenerateContentResponse, Part, Type } from "@google/genai";
import { ChatMessage, ScreeningResults, MaskedFaceResult, MotorTestMetric, UPDRSScore } from "../types";

// Always use process.env.API_KEY and initialize as a named parameter as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

const assistantSystemInstruction = `你是「帕金森居家初步篩檢」的 AI 小幫手。你的回答必須簡潔、條列式、並用 **粗體** 標示重點。避免重複語句。最後務必加上醫療免責聲明。`;

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
            config: { systemInstruction: assistantSystemInstruction },
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

const adminAssistantSystemInstruction = `你是專業臨床數據與系統分析助手。你的任務是：
1.  分析儀表板上的臨床數據集與趨勢。
2.  解釋這個網站的篩檢項目（問卷、手指測試、面部測試）的運作原理與 MDS-UPDRS 評分標準。
你的回答必須精準、條列式、並用 **粗體** 標示重點。`;

const streamAdminAIAssistantResponse = async (
    history: ChatMessage[],
    newUserMessage: string,
    adminData: any[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
): Promise<void> => {
    const dataContext = `數據集摘要: ${JSON.stringify(adminData.slice(0, 5))}`;
    try {
        const chat = ai.chats.create({
            model: modelName,
            config: { systemInstruction: adminAssistantSystemInstruction },
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
