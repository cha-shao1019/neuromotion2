
import { GoogleGenAI, GenerateContentResponse, Part, Type } from "@google/genai";
import { ChatMessage, ScreeningResults, MaskedFaceResult, MotorTestMetric, UPDRSScore } from "../types";

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

const assistantSystemInstruction = `你是「NeuroMotion」帕金森居家篩檢小幫手。
你的回答規則：
1. **絕不重複**：不要重複使用者的問題，直接回答。
2. **簡約條列**：使用 * 代表項目，每點不超過 20 字。
3. **重點標示**：關鍵詞必須用 **粗體**。
4. **醫療聲明**：最後加上「本回答僅供參考，非正式醫療診斷」。
5. **專業度**：使用臨床語氣，解釋篩檢過程與注意事項。`;

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

const adminAssistantSystemInstruction = `你是 NeuroMotion 的臨床數據專家。
你必須能夠回答關於以下主題的「系統問題」：
* **網站運作原理**：Edge Computing, Mediapipe 視覺識別, 隱私影像不離機。
* **科學依據**：MDS-UPDRS 量表, 4-6Hz 震顫頻率, Sequence Effect (振幅衰減)。
* **對表單與檢測的解釋**：詳細說明問卷各題目的臨床意義。
回答規則：
1. **架構化**：使用條列式。
2. **數據導向**：優先分析儀表板數據。
3. **禁止廢話**：回答直接標重點。`;

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
