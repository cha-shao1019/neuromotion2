
export enum Screen {
    LANDING,
    INFO_PAGE,
    PRE_QUESTIONNAIRE_INFO,
    QUESTIONNAIRE,
    QUESTIONNAIRE_RESULT,
    TEST_SELECTION,
    FINGER_TAP_TEST,
    MASKED_FACE_TEST,
    FINAL_REPORT,
    ADMIN_LOGIN,
    ADMIN_REGISTER,
    ADMIN_DASHBOARD,
    ADMIN_MANAGE_USERS,
    PRIVACY_POLICY,
    TERMS_OF_SERVICE,
    CHANGELOG,
    CLINICAL_REFERENCE,
}

export interface Question {
    id: string;
    text: string;
    options: { text: string; value: number }[];
}

export interface MotorTestMetric {
    speed: 'normal' | 'slow' | 'fast';
    consistency: 'consistent' | 'inconsistent' | 'hesitant';
    amplitude: 'normal' | 'decreasing' | 'variable';
    fatigue: 'none' | 'present';
    tremorFrequency?: number; // 敲擊或震顫頻率 (Hz)
    tremorAmplitude?: number; // 平均振幅 (相對手掌大小 %)
    amplitudeDecrement?: number; // 振幅衰減率 (%) - 檢測 Sequence Effect
    rhythmVariability?: number; // 節律變異度 (CV) - 檢測動作不規律
    hesitationCount?: number; // 動作凍結或猶豫次數
    averageOpenTime?: number; // 平均張開時間 (ms)
    tapCount?: number;
}

export interface FingerTapResult {
    fingerTapping: MotorTestMetric | null;
    handOpeningClosing: MotorTestMetric | null;
    staticTremor: MotorTestMetric | null; // 替換旋轉測試
}

export interface MaskedFaceResult {
    expressionMatch: 'good' | 'fair' | 'poor';
    reactionTime: 'normal' | 'slow';
}

export interface UPDRSScore {
    score: number;
    analysis: string;
}

export interface ScreeningResults {
    userId: string | null;
    age: string | null;
    gender: string | null;
    medicalHistory: string | null;
    questionnaireScore: number | null;
    questionnaireAnalysis: string | null;
    fingerTapResult: FingerTapResult | null;
    fingerTapAnalysis: string | null;
    maskedFaceResult: MaskedFaceResult | null;
    maskedFaceAnalysis: string | null;
    finalAnalysis: string | null;
    updrsScore?: UPDRSScore | null; // AI 預測的 UPDRS 分數
    fingerTapWaveform?: ChartDataPoint[] | null; // 手指開合的原始軌跡數據
}

export interface AdminUser {
    password: string;
    status: 'approved' | 'pending';
    role: 'super-admin' | 'admin' | 'physician';
    proof: string; // For physicians, this could be a license number or institution
    googleAccount?: string; // For physicians, Google account for integration
}

export interface AdminData {
    userId: string;
    date: string; // ISO 8601 format
    questionnaireScore: number;
    motorTestResult: 'Normal' | 'Slight Risk' | 'Moderate Risk' | 'High Risk';
    age: string | 'N/A';
    gender: '男性' | '女性' | '其他' | '不願透露' | 'N/A';
    updrsScore?: number;
    realData?: { 
        frequency: ChartDataPoint[], 
        amplitude: ChartDataPoint[],
        waveformData?: ChartDataPoint[] 
    };
}

// Replaces PatientReportRequest, aligns with Firebase data model
export interface FirebaseReport {
    id: string; // Firestore document ID
    userId: string;
    physicianUsername: string;
    status: 'pending' | 'reviewed';
    timestamp: any; // Firestore ServerTimestamp
    fullReportData: ScreeningResults;
    aiSummary: string; // The structured summary for the doctor
}


export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface ChartDataPoint {
    time: number;
    value: number;
}