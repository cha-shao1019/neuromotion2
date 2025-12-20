import { GoogleGenAI, Chat, GenerateContentResponse, Part, Type } from "@google/genai";
import { ChatMessage, ScreeningResults, AdminData, MaskedFaceResult, MotorTestMetric, UPDRSScore } from "../types";
import { QUESTIONS } from '../constants';

// Initialize the GoogleGenAI client using the API key from Vite's environment variables.
// FIX: Switched from import.meta.env.VITE_API_KEY to process.env.API_KEY to follow strict Gemini API guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-3-flash-preview';

const streamAIResponse = async (
    prompt: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
): Promise<void> => {
    try {
        // Use the initialized 'ai' instance to generate streaming content
        const response = await ai.models.generateContentStream({ model: modelName, contents: prompt });
        for await (const chunk of response) {
            const text = chunk.text;
            if (text) {
                onChunk(text);
            }
        }
    } catch (error: any) {
        console.error("Error streaming AI response:", error);
        // Handle API errors gracefully with localized feedback
        if (error.message?.includes("API_KEY_INVALID")) {
            onError("API Key 無效或已過期。");
        } else if (error.message?.includes("PERMISSION_DENIED")) {
            onError("權限遭拒，請確認您的 API Key 是否具備使用此模型的權限。");
        } else {
            onError(`與AI服務連線異常: ${error.message || "未知錯誤"}`);
        }
    } finally {
        onComplete();
    }
};

const questionnaireText = QUESTIONS.map((q, i) => `問題 ${i + 1}: ${q.text}`).join('\n');

const assistantSystemInstruction = `你是「帕金森居家初步篩檢」網站的一位友善、有耐心且富有同理心的AI小幫手。你的使用者主要是可能不太熟悉科技產品的長者。
你的目標是引導使用者順利完成檢測，並解答他們對於網站操作、檢測流程及初步結果的疑問。

***你可以回答以下類型的問題：***
1.  **網站操作問題**：例如「我該如何開始？」、「下一步是什麼？」
2.  **檢測流程問題**：例如「為什麼要做手指檢測？」、「這個表情符號是什麼意思？」
3.  **解釋問卷問題與詞彙**：你可以解釋問卷中某個問題的含義，或定義其中提到的特定詞彙（例如「靜止性顫抖」）。
4.  **根據使用者結果提供初步解釋與建議**：當使用者提問關於他們的檢測結果時，你可以根據提供的結果數據進行解釋。請特別注意「動作遲緩」(Bradykinesia) 相關的指標，如振幅衰減率(Amplitude Decrement) 和 節律變異度 (Rhythm Variability)。

***最重要規則：劃清醫療界線***
你絕對不可以提供任何形式的醫療建議、症狀分析 or 疾病診斷。你的角色是「解釋者」和「引導者」，不是「診斷者」。

***每次當你回答任何與使用者個人結果相關的問題時，你都【必須】在回答的結尾處加上以下這段免責聲明：***
「請注意，這份分析僅為初步篩檢參考，不能取代專業醫療診斷。若您有任何疑慮，請務必諮詢醫師。」`;

const streamAIAssistantResponse = async (
    history: ChatMessage[],
    newUserMessage: string,
    results: ScreeningResults,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
): Promise<void> => {
    let resultsContext = "使用者當前的檢測結果如下（如果為null則代表未檢測）：\n";
    resultsContext += `- 問卷分數: ${results.questionnaireScore}\n`;
    
    // 詳細解析手指檢測數據
    if (results.fingerTapResult?.fingerTapping) {
        const ft = results.fingerTapResult.fingerTapping;
        resultsContext += `- 手指開合 (Bradykinesia指標):\n`;
        resultsContext += `  - 頻率: ${ft.tremorFrequency} Hz (正常約3-5Hz, <2.5Hz為慢)\n`;
        resultsContext += `  - 振幅衰減率 (Sequence Effect): ${ft.amplitudeDecrement}% (若>15%表示動作隨時間變小)\n`;
        resultsContext += `  - 節律變異 (CV): ${ft.rhythmVariability} (若>0.25表示不規律)\n`;
        resultsContext += `  - 凍結/猶豫次數: ${ft.hesitationCount}\n`;
    }
    
    if (results.fingerTapResult?.staticTremor) {
        const st = results.fingerTapResult.staticTremor;
        resultsContext += `- 靜止性震顫: 頻率 ${st.tremorFrequency} Hz, 幅度變異 ${st.tremorAmplitude}%\n`;
    }

    resultsContext += `- 表情檢測: ${JSON.stringify(results.maskedFaceResult)}\n`;
    resultsContext += `- UPDRS 預測分數: ${results.updrsScore?.score}\n`;
    const messageWithContext = `${resultsContext}\n\n 使用者問題: ${newUserMessage}`;

    try {
        const chat: Chat = ai.chats.create({
            model: modelName,
            config: { 
                systemInstruction: assistantSystemInstruction,
            },
            history: history.map((msg: ChatMessage) => ({ role: msg.role, parts: [{ text: msg.text }] })),
        });
        const stream = await chat.sendMessageStream({ message: messageWithContext });
        for await (const chunk of stream) {
            const c = chunk as GenerateContentResponse;
            const text = c.text;
            if (text) {
                onChunk(text);
            }
        }
    } catch (error: any) {
        console.error("AI Assistant Error:", error);
        onError("AI 助手暫時無法回應，請稍後再試。");
    } finally {
        onComplete();
    }
};

const adminAssistantSystemInstruction = `你是「醫師洞見 AI (Doctor's Insight AI)」，一個專為神經科醫師與研究人員設計的專業臨床數據分析助手。你的語氣應該專業、精確且數據導向。`;

const streamAdminAIAssistantResponse = async (
    history: ChatMessage[],
    newUserMessage: string,
    adminData: AdminData[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
): Promise<void> => {
    const dataContext = `目前的匿名受試者數據集如下 (共 ${adminData.length} 筆):\n${JSON.stringify(adminData, null, 2)}`;
    const messageWithContext = `${dataContext}\n\n分析師問題: ${newUserMessage}`;
    
    try {
        const chat: Chat = ai.chats.create({
            model: modelName,
            config: { systemInstruction: adminAssistantSystemInstruction },
            history: history.map((msg: ChatMessage) => ({ role: msg.role, parts: [{ text: msg.text }] })),
        });
        const stream = await chat.sendMessageStream({ message: messageWithContext });
        for await (const chunk of stream) {
            const c = chunk as GenerateContentResponse;
            const text = c.text;
            if (text) {
                onChunk(text);
            }
        }
    } catch (error) {
        onError("分析引擎暫時不可用。");
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