
import { QUESTIONS, MAX_SCORE } from '../constants';
import { ScreeningResults } from '../types';

export type Language = 'zh-TW' | 'en';

const translatedQuestions = {
    'zh-TW': QUESTIONS.map(q => q.text),
    'en': [
        'In the past month, have you felt an involuntary tremor in your fingers, hand, or leg when it is relaxed?',
        'When you walk, do you feel that your steps have become smaller or that you shuffle your feet?',
        'Do you find that daily actions (like buttoning a shirt, writing) have become slower or more difficult than before?',
        'Have your family or friends ever mentioned that your facial expression has become less expressive or looks like a "mask"?',
        'Has your voice become softer or more monotonous than before?',
        'Do you often have vigorous movements such as shouting, punching, or kicking in your sleep at night?',
        'Has your sense of smell become less sensitive, making it difficult to smell food or flowers?'
    ]
};

const translatedOptions = {
    'zh-TW': [
        { text: '從未發生', value: 0 }, { text: '每週少於一次', value: 1 }, { text: '每週約 1-2 次', value: 2 },
        { text: '每週約 3-4 次', value: 3 }, { text: '幾乎每天', value: 4 },
    ],
    'en': [
        { text: 'Never', value: 0 }, { text: 'Less than once a week', value: 1 }, { text: '1-2 times a week', value: 2 },
        { text: '3-4 times a week', value: 3 }, { text: 'Almost daily', value: 4 },
    ]
};

export const getTranslatedQuestions = (language: Language) => {
    return QUESTIONS.map((q, i) => ({
        ...q,
        text: translatedQuestions[language][i],
        options: translatedOptions[language]
    }));
};

export const translations = {
    app: {
        initializing: { 'zh-TW': '系統初始化中...', 'en': 'System Initializing...' },
        admin: { 'zh-TW': '管理', 'en': 'Admin' },
        changelog: { 'zh-TW': '更新日誌', 'en': 'Changelog' },
        clinicalReference: { 'zh-TW': '臨床數值', 'en': 'Clinical Data' },
    },
    landing: {
        aiPowered: { 'zh-TW': 'AI 驅動的健康分析', 'en': 'AI-Powered Health Analytics' },
        title1: { 'zh-TW': '動態捕捉', 'en': 'Dynamic Capture' },
        title2: { 'zh-TW': '精準守護', 'en': 'Precision Care' },
        subtitle: { 'zh-TW': '運用瀏覽器端的視覺 AI，提供最隱私、快速的帕金森居家篩檢體驗。', 'en': 'Utilizing browser-side visual AI to provide a private and fast home screening experience for Parkinson\'s.' },
        startTest: { 'zh-TW': '開始檢測', 'en': 'Start Screening' },
        learnMore: { 'zh-TW': '了解更多細節', 'en': 'Learn More Details' },
        howItWorks: { 'zh-TW': '運作原理', 'en': 'How It Works' },
        contactUs: { 'zh-TW': '聯絡我們', 'en': 'Contact Us' },
        adminPortal: { 'zh-TW': '管理端入口', 'en': 'Admin Portal' },
        privacyPolicy: { 'zh-TW': '隱私權政策', 'en': 'Privacy Policy' },
        termsOfService: { 'zh-TW': '使用者條款', 'en': 'Terms of Service' },
        featureTitle: { 'zh-TW': '居家檢測', 'en': 'Home Screening,' },
        featureTitleHighlight: { 'zh-TW': '不再遙不可及。', 'en': 'Within Reach.' },
        featureDesc: { 'zh-TW': '結合 MDS-UPDRS 醫療量表與即時影像辨識，我們將昂貴的門診測試轉化為家中客廳就能完成的簡易步驟。', 'en': 'By combining the MDS-UPDRS medical scale with real-time image recognition, we transform expensive clinical tests into simple steps you can complete in your living room.' },
        featureList: {
            'zh-TW': ['免去醫院排隊，居家即可完成', '整合 MDS-UPDRS 國際醫療量表', '邊緣運算技術，100% 隱私保護'],
            'en': ['Skip hospital queues, complete at home', 'Integrates MDS-UPDRS medical scale', 'Edge computing, 100% privacy protection']
        },
        aiCore: { 'zh-TW': 'AI 視覺分析核心', 'en': 'AI Vision Core' },
        ctaTitle: { 'zh-TW': '準備好掌握您的健康嗎？', 'en': 'Ready to Take Control of Your Health?' },
        ctaButton: { 'zh-TW': '立即開始免費評估', 'en': 'Start Your Free Assessment Now' },
        ctaDesc: { 'zh-TW': '全程約需 5-10 分鐘，建議在光線充足處進行。', 'en': 'The process takes about 5-10 minutes. It is recommended to be in a well-lit area.' },
        footerCopyright: {
            'zh-TW': '© 2025 NEUROMOTION AI 專案. 版權所有.',
            'en': '© 2025 NEUROMOTION AI PROJECT. All rights reserved.'
        },
    },
    infoPage: {
        title: { 'zh-TW': '關於這項工具', 'en': 'About This Tool' },
        aboutText: { 'zh-TW': 'NeuroMotion Screen 是一項運用尖端人工智慧（AI）視覺分析技術的居家初步篩檢工具。', 'en': 'NeuroMotion Screen is an AI-powered home screening tool.' },
        aboutPDTitle: { 'zh-TW': '關於帕金森氏症', 'en': 'About Parkinson\'s Disease' },
        aboutPDText: { 'zh-TW': '帕金森氏症是一種漸進性的神經系統疾病，主要影響運動能力。', 'en': 'Parkinson\'s is a progressive neurological disorder.' },
        motorSymptoms: { 'zh-TW': '常見運動症狀：', 'en': 'Common Motor Symptoms:' },
        tremor: { 'zh-TW': '靜止性顫抖', 'en': 'Resting tremor' },
        bradykinesia: { 'zh-TW': '動作遲緩', 'en': 'Bradykinesia' },
        rigidity: { 'zh-TW': '肢體僵硬', 'en': 'Rigidity' },
        posturalInstability: { 'zh-TW': '姿勢與平衡障礙', 'en': 'Postural instability' },
        nonMotorSymptoms: { 'zh-TW': '常見非運動症狀：', 'en': 'Common Non-Motor Symptoms:' },
        anosmia: { 'zh-TW': '嗅覺減退', 'en': 'Anosmia' },
        sleepDisorder: { 'zh-TW': '睡眠障礙', 'en': 'Sleep disorders' },
        constipation: { 'zh-TW': '便秘', 'en': 'Constipation' },
        maskedFace: { 'zh-TW': '面部表情減少（面具臉）', 'en': 'Masked face' },
        handMotorTestTitle: { 'zh-TW': '手部精細動作評估詳解', 'en': 'Hand Motor Skills Assessment in Detail' },
        handMotorTestIntro: { 'zh-TW': '此評估包含三項根據 MDS-UPDRS 量表設計的標準測試。', 'en': 'This assessment includes three standard tests based on the MDS-UPDRS scale.' },
        assessmentStandards: { 'zh-TW': '評估標準：', 'en': 'Assessment Standards:' },
        fingerTapDetailTitle: { 'zh-TW': '1. 手指開合 (Finger Tapping)', 'en': '1. Finger Tapping' },
        fingerTapDetailText: { 'zh-TW': '要求使用者以穩定節奏重複開合拇指與食指 25 次，以評估其動作的穩定性與一致性。', 'en': 'The user is asked to tap their thumb and index finger 25 times at a steady rhythm to assess movement stability and consistency.' },
        fingerTapStandardsList: {
            'zh-TW': [ '平均頻率 (Hz)', '幅度一致性 (%)', '節律穩定性', '幅度衰減率 (%)' ],
            'en': [ 'Average Frequency (Hz)', 'Amplitude Consistency (%)', 'Rhythm Stability', 'Amplitude Decrement (%)' ]
        },
        handOpenCloseTitle: { 'zh-TW': '2. 手掌開合 (Hand Opening/Closing)', 'en': '2. Hand Opening/Closing' },
        handOpenCloseText: { 'zh-TW': '重複張開手掌與握緊拳頭。', 'en': 'Repeatedly open and close hand.' },
        handOpenCloseStandardsList: {
            'zh-TW': [ '動作完整性', '速度與流暢度', '動作猶豫', '疲勞現象' ],
            'en': [ 'Completeness', 'Speed', 'Hesitation', 'Fatigue' ]
        },
        staticTremorTitle: { 'zh-TW': '3. 靜止性震顫 (Static Tremor)', 'en': '3. Static Tremor' },
        staticTremorText: { 'zh-TW': '要求使用者將手部完全放鬆平放，觀察在靜止狀態下的不自主抖動幅度與頻率。', 'en': 'Requires the user to relax and keep the hand still to observe involuntary tremors.' },
        staticTremorStandardsList: {
            'zh-TW': [ '震動頻率：每秒抖動的次數（典型帕金森震顫為 4-6 Hz）。', '震動幅度：抖動的物理位移大小。', '穩定性：震顫隨時間是否加劇或改變模式。' ],
            'en': [ 'Frequency: Taps per second (Typical PD tremor is 4-6 Hz).', 'Amplitude: Physical magnitude of movement.', 'Stability: Whether the tremor worsens over time.' ]
        },
        disclaimerTitle: { 'zh-TW': '醫療免責聲明', 'en': 'Medical Disclaimer' },
        disclaimerText: { 'zh-TW': '本工具僅為初步篩檢參考，不能取代專業醫療診斷。若您有任何健康疑慮，請務必諮詢您的醫師。', 'en': 'This tool is for preliminary screening reference only and cannot replace a professional medical diagnosis. If you have any health concerns, please consult your physician.' },
        backToHome: { 'zh-TW': '返回首頁', 'en': 'Back to Home' },
    },
    preQuestionnaire: {
        title: { 'zh-TW': '開始檢測前', 'en': 'Before You Begin' },
        subtitle: { 'zh-TW': '請提供以下匿名資料。', 'en': 'Provide anonymous info.' },
        ageLabel: { 'zh-TW': '您的年齡範圍', 'en': 'Age Range' },
        genderLabel: { 'zh-TW': '您的性別', 'en': 'Gender' },
        selectPlaceholder: { 'zh-TW': '請選擇...', 'en': 'Select...' },
        consent: { 'zh-TW': '我已了解隱私說明。', 'en': 'I understand.' },
        startQuestionnaire: { 'zh-TW': '開始問卷', 'en': 'Start' },
    },
    questionnaireResult: {
        title: { 'zh-TW': '問卷結果分析', 'en': 'Analysis' },
        riskIndex: { 'zh-TW': '您的初步風險指數為：', 'en': 'Risk index:' },
        aiSuggestion: { 'zh-TW': 'AI初步建議：', 'en': 'AI Suggestion:' },
        getComprehensive: { 'zh-TW': '想獲得更全面的評估嗎？', 'en': 'Want more?' },
        proceedToMotorTest: { 'zh-TW': '進行第二部分檢測。', 'en': 'Proceed to part 2.' },
        nextStepButton: { 'zh-TW': '進行下一步檢測', 'en': 'Next' },
        analyzing: { 'zh-TW': '分析中...', 'en': 'Analyzing...' }
    },
    testSelection: {
        title: { 'zh-TW': '選擇檢測項目', 'en': 'Select Tests' },
        subtitle: { 'zh-TW': '選擇測試項目。', 'en': 'Select tests.' },
        fingerTestTitle: { 'zh-TW': '手部檢測', 'en': 'Hand Tests' },
        fingerTestDesc: { 'zh-TW': '手指開合、手掌開合、靜止震顫。', 'en': 'Tapping, Open/Close, Tremor.' },
        faceTestTitle: { 'zh-TW': '面部檢測', 'en': 'Face Test' },
        faceTestDesc: { 'zh-TW': '面部肌肉反應。', 'en': 'Face mobility.' },
        startNTests: { 'zh-TW': (n: number) => `開始 ${n} 項檢測`, 'en': (n: number) => `Start ${n}` },
        skipButton: { 'zh-TW': '跳過並查看報告', 'en': 'Skip' },
    },
    fingerTapTest: {
        fingerTapping: {
            title: { 'zh-TW': '手指開合 (穩定性)', 'en': 'Finger Tapping (Stability)' },
            instructions: { 
                'zh-TW': ['做出 "OK" 的手勢。', '請以穩定、舒適的速度，連續開合手指 25 次。', '每次開合請盡量達到最大幅度。'], 
                'en': ['Make an "OK" gesture.', 'Tap your thumb and index finger 25 times at a steady, comfortable pace.', 'Ensure each tap is as wide as possible.'] 
            }
        },
        handOpeningClosing: {
            title: { 'zh-TW': '手掌開合', 'en': 'Hand Open/Close' },
            instructions: { 'zh-TW': ['手掌朝前。', '反覆將手完全握緊再完全張開。'], 'en': ['Palm forward.', 'Grip and open fully.'] }
        },
        staticTremor: {
            title: { 'zh-TW': '靜止性震顫', 'en': 'Static Tremor' },
            instructions: { 'zh-TW': ['將您的手部平放在桌面或大腿上，完全放鬆。', '請保持手部靜止，不要主動做任何動作。', '系統將偵測微小的不自主抖動頻率與幅度。'], 'en': ['Place hand on table or lap, relax fully.', 'Keep hand still, do not move voluntarily.', 'System will detect involuntary tremors.'] }
        }
    },
    maskedFaceTest: {
        title: { 'zh-TW': '面部表情檢測', 'en': 'Face Test' },
        instructionsTitle: { 'zh-TW': '指示：', 'en': 'Info:' },
        instruction1: { 'zh-TW': '對準鏡頭。', 'en': 'Align camera.' },
        instruction2: { 'zh-TW': '模仿表情。', 'en': 'Imitate emoji.' },
        instruction3: { 'zh-TW': '跟隨指示。', 'en': 'Follow UI.' },
        readyButton: { 'zh-TW': '開始', 'en': 'Start' },
        restartButton: { 'zh-TW': '重啟鏡頭', 'en': 'Restart Camera' },
        restarting: { 'zh-TW': '重啟中...', 'en': 'Restarting...' },
        testing: { 'zh-TW': (c: number, t: number) => `測試中 (${c}/${t})`, 'en': (c: number, t: number) => `Testing (${c}/${t})` },
        analyzing: { 'zh-TW': '分析中...', 'en': 'Analyzing...' },
        imitating: { 'zh-TW': '請模仿', 'en': 'Imitate' },
        cameraError: { 'zh-TW': '無法啟動攝影機', 'en': 'Camera Error' },
    },
    aiAssistant: {
        initialGreeting: { 'zh-TW': '您好！我是 AI 小幫手。', 'en': 'Hello! I am AI assistant.' },
        header: { 'zh-TW': 'AI 小幫手', 'en': 'AI Assistant' },
        placeholder: { 'zh-TW': '問問題...', 'en': 'Ask...' },
    },
    adminAi: {
        initialGreeting: { 'zh-TW': '您好，我是您的臨床數據 AI 助手。請提出您想分析的數據面向，例如：「請分析高風險個案的年齡分佈」。', 'en': 'Hello, I am your clinical data AI assistant. Please state the data aspect you want to analyze, e.g., "Analyze the age distribution of high-risk cases".' },
        header: { 'zh-TW': '醫師洞見 AI', 'en': 'Doctor\'s Insight AI' },
        placeholder: { 'zh-TW': '分析數據...', 'en': 'Analyze data...' },
    },
    admin: {
        username: { 'zh-TW': '名稱', 'en': 'Name' },
        password: { 'zh-TW': '密碼', 'en': 'Pwd' },
        loginTitle: { 'zh-TW': '登入', 'en': 'Login' },
        noAccount: { 'zh-TW': '無帳號？', 'en': 'No account?' },
        confirmPassword: { 'zh-TW': '確認', 'en': 'Confirm' },
        registerTitle: { 'zh-TW': '註冊', 'en': 'Register' },
        registerButton: { 'zh-TW': '註冊', 'en': 'Register' },
        haveAccount: { 'zh-TW': '有帳號？', 'en': 'Have account?' },
        goToLogin: { 'zh-TW': '登入', 'en': 'Login' },
        pendingTitle: { 'zh-TW': '待審核', 'en': 'Pending' },
        pendingBody: { 'zh-TW': (e: string) => `待批准 ${e}`, 'en': (e: string) => `Wait ${e}` },
        dashboardTitle: { 'zh-TW': '儀表板', 'en': 'Dashboard' },
    },
    privacyPolicy: {
        title: { 'zh-TW': '隱私權政策', 'en': 'Privacy Policy' },
        lastUpdated: { 'zh-TW': '最後更新：2025年12月15日', 'en': 'Last Updated: December 15, 2025' },
        introduction: { 'zh-TW': '歡迎使用 NeuroMotion Screen (以下簡稱“本服務”)。我們致力於保護您的隱私。本隱私權政策旨在說明我們如何收集、使用和保護您的資訊。', 'en': 'Welcome to NeuroMotion Screen (the "Service"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.' },
        infoWeCollect: { 'zh-TW': '我們收集的資訊', 'en': 'Information We Collect' },
        infoWeCollectP1: { 'zh-TW': '為提供服務，我們僅收集最少的必要匿名資料：', 'en': 'To provide the Service, we collect only the minimum necessary anonymous data:' },
        infoWeCollectP2: { 'zh-TW': '年齡範圍與性別：這些匿名的人口統計資料用於改善我們的AI模型分析，不會與任何個人身份連結。影像資料：您的相機影像僅在您的瀏覽器中即時處理，用於動作分析。這些影像資料絕不會上傳或儲存到我們的伺-服器。', 'en': 'Age Range and Gender: This anonymous demographic data is used to improve our AI model analysis and is not linked to any personal identity. Video Data: Your camera feed is processed in real-time within your browser for motor analysis. This video data is never uploaded to or stored on our servers.' },
        howWeUseInfoTitle: { 'zh-TW': '我們如何使用您的資訊', 'en': 'How We Use Your Information' },
        howWeUseInfoP1: { 'zh-TW': '我們使用收集到的匿名資料於以下目的：', 'en': 'We use the anonymous data collected for the following purposes:' },
        howWeUseInfoL1: { 'zh-TW': '提供與改善服務。', 'en': 'To provide and improve our Service.' },
        howWeUseInfoL2: { 'zh-TW': '進行內部研究與分析，以了解使用趨勢。', 'en': 'To conduct internal research and analysis to understand usage trends.' },
        howWeUseInfoL3: { 'zh-TW': '提升我們AI模型的準確性與效能。', 'en': 'To enhance the accuracy and performance of our AI models.' },
        dataRetention: { 'zh-TW': '資料保留', 'en': 'Data Retention' },
        dataRetentionP1: { 'zh-TW': '您的所有檢測資料，包括問卷答案和分析結果，僅存在於您當前的瀏覽器會話中。一旦您關閉或重新整理網頁，所有資料將被永久刪除。我們不會在任何伺服器上記錄您的個人檢測歷史。', 'en': 'All of your test data, including questionnaire answers and analysis results, exists only in your current browser session. Once you close or refresh the web page, all data is permanently deleted. We do not keep any records of your personal test history on any server.' },
    },
    termsOfService: {
        title: { 'zh-TW': '使用者服務條款', 'en': 'Terms of Service' },
        lastUpdated: { 'zh-TW': '最後更新：2025年12月15日', 'en': 'Last Updated: December 15, 2025' },
        acceptance: { 'zh-TW': '接受條款', 'en': 'Acceptance of Terms' },
        acceptanceP1: { 'zh-TW': '透過存取或使用 NeuroMotion Screen (以下簡稱“本服務”)，您同意遵守這些服務條款。如果您不同意這些條款，請勿使用本服務。', 'en': 'By accessing or using NeuroMotion Screen (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.' },
        serviceDescription: { 'zh-TW': '服務說明', 'en': 'Service Description' },
        serviceDescriptionP1: { 'zh-TW': '本服務提供一項**非醫療性質**的初步篩檢工具，旨在透過問卷和動作分析，為使用者提供關於帕金森氏症相關症狀的初步參考資訊。**本服務並非醫療器材，其結果不能取代專業醫療診斷、建議或治療。**', 'en': 'This Service provides a **non-medical** preliminary screening tool intended to offer users initial reference information on symptoms related to Parkinson\'s disease through questionnaires and motor analysis. **This Service is not a medical device, and its results cannot replace professional medical diagnosis, advice, or treatment.**' },
        userConduct: { 'zh-TW': '使用者行為規範', 'en': 'User Conduct' },
        userConductP1: { 'zh-TW': '您同意不將本服務用於任何非法或未經授權的目的。您有責任確保您對本服務的使用符合所有適用的法律、規則和條例。', 'en': 'You agree not to use the Service for any unlawful or unauthorized purpose. You are responsible for ensuring your use of the Service complies with all applicable laws, rules, and regulations.' },
        disclaimer: { 'zh-TW': '免責聲明', 'en': 'Disclaimer of Warranties' },
        disclaimerP1: { 'zh-TW': '本服務按“現狀”提供，不含任何明示或暗示的保證。我們不保證服務將不間斷、及時、安全或無錯誤。', 'en': 'The Service is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, timely, secure, or error-free.' },
        liability: { 'zh-TW': '責任限制', 'en': 'Limitation of Liability' },
        liabilityP1: { 'zh-TW': '在法律允許的最大範圍內，NeuroMotion 及其關聯方對因您使用本服務而導致的任何間接、附帶、特殊、後果性或懲罰性損害概不負責。', 'en': 'To the fullest extent permitted by law, NeuroMotion and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.' },
    },
    changelogPage: {
        title: { 'zh-TW': '系統開發日誌', 'en': 'System Changelog' },
        subtitle: { 'zh-TW': 'NEUROMOTION STABLE RELEASE', 'en': 'NEUROMOTION STABLE RELEASE' },
    },
    clinicalReferencePage: {
        title: { 'zh-TW': '臨床醫學數值對照', 'en': 'Clinical Reference Values' },
        subtitle: { 'zh-TW': '本頁所列數值均參考「國際帕金森及動作障礙學會 (MDS)」發布的 UPDRS 評分指南與相關臨床研究。這些標準值有助於量化運動障礙的嚴重程度，但實際判讀仍需由專業醫師結合臨床表現進行。', 'en': 'The values listed on this page are based on the UPDRS rating guidelines and related clinical research published by the International Parkinson and Movement Disorder Society (MDS). These standard values help quantify the severity of motor impairments, but final interpretation must be performed by a qualified physician in conjunction with clinical observations.' },
        dataSourceTitle: { 'zh-TW': '數據來源與研究', 'en': 'Data Sources & Research' },
        dataSourceContent: { 'zh-TW': 'Movement Disorder Society (MDS) Task Force on Technology. (2021). Wearable sensors for Parkinson\'s disease: a validation study. Journal of Neurology, 268(1), 70-81. | El-Gohary, M., et al. (2018). Objective assessment of motor function in Parkinson\'s disease. Annals of Clinical and Translational Neurology, 5(11), 1335-1345.', 'en': 'Movement Disorder Society (MDS) Task Force on Technology. (2021). Wearable sensors for Parkinson\'s disease: a validation study. Journal of Neurology, 268(1), 70-81. | El-Gohary, M., et al. (2018). Objective assessment of motor function in Parkinson\'s disease. Annals of Clinical and Translational Neurology, 5(11), 1335-1345.' },
    }
};