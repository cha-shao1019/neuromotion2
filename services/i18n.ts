
import { QUESTIONS } from '../constants';

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
    questionnaireResult: {
        title: { 'zh-TW': '初步問卷結果', 'en': 'Preliminary Results' },
        riskIndex: { 'zh-TW': '您的風險指數', 'en': 'Your Risk Index' },
        analyzing: { 'zh-TW': 'AI 深度分析中...', 'en': 'AI Deep Analysis...' },
        aiSuggestion: { 'zh-TW': 'AI 建議與解析', 'en': 'AI Suggestion & Analysis' },
        getComprehensive: { 'zh-TW': '為了獲得更全面的評估', 'en': 'To get a more comprehensive evaluation' },
        proceedToMotorTest: { 'zh-TW': '建議繼續進行運動機能測試', 'en': 'we suggest proceeding to motor tests.' },
        nextStepButton: { 'zh-TW': '進入下一步：運動測試', 'en': 'Next Step: Motor Tests' },
    },
    fingerTapTest: {
        fingerTapping: {
            title: { 'zh-TW': '手指點擊測試', 'en': 'Finger Tapping Test' },
            instructions: {
                'zh-TW': ['請使用食指與拇指進行快速點擊開合，重複 25 次。', '儘量保持動作幅度最大且節奏穩定。'],
                'en': ['Tap your index finger and thumb rapidly 25 times.', 'Try to maintain maximum amplitude and stable rhythm.']
            }
        },
        handOpeningClosing: {
            title: { 'zh-TW': '手掌開合測試', 'en': 'Hand Open/Close Test' },
            instructions: {
                'zh-TW': ['請用力張開並握緊拳頭，重複 25 次。', '動作應儘可能快速且完整。'],
                'en': ['Open and close your fist tightly 25 times.', 'Make the movement as fast and complete as possible.']
            }
        },
        staticTremor: {
            title: { 'zh-TW': '靜止性震顫測試', 'en': 'Static Tremor Test' },
            instructions: {
                'zh-TW': ['請將手部完全放鬆，平放在桌面上或膝蓋上。', '請保持靜止 10 秒鐘。'],
                'en': ['Relax your hand completely, resting it on a table or your lap.', 'Please stay still for 10 seconds.']
            }
        }
    },
    admin: {
        loginTitle: { 'zh-TW': '後台管理登入', 'en': 'Admin Login' },
        username: { 'zh-TW': '使用者名稱', 'en': 'Username' },
        password: { 'zh-TW': '密碼', 'en': 'Password' },
        noAccount: { 'zh-TW': '還沒有帳號？', 'en': 'No account yet?' },
        dashboardTitle: { 'zh-TW': '神經運動數據儀表板', 'en': 'NeuroMotion Data Dashboard' },
        detailModalTitle: { 'zh-TW': '臨床數據詳情', 'en': 'Clinical Data Details' },
        frequencyChartTitle: { 'zh-TW': '頻率趨勢 (Frequency)', 'en': 'Frequency Trend' },
        amplitudeChartTitle: { 'zh-TW': '振幅變異 (Amplitude)', 'en': 'Amplitude Variation' },
        pendingTitle: { 'zh-TW': '註冊申請已提交', 'en': 'Registration Submitted' },
        pendingBody: {
            'zh-TW': (email: string) => `您的帳號正在等待審核中。請聯繫 ${email} 以獲得快速審核。`,
            'en': (email: string) => `Your account is pending review. Please contact ${email} for fast-track approval.`
        },
        goToLogin: { 'zh-TW': '返回登入頁面', 'en': 'Back to Login' },
        registerTitle: { 'zh-TW': '管理端註冊', 'en': 'Admin Registration' },
        confirmPassword: { 'zh-TW': '確認密碼', 'en': 'Confirm Password' },
        registerButton: { 'zh-TW': '提交註冊申請', 'en': 'Submit Registration' },
        haveAccount: { 'zh-TW': '已經有帳號？', 'en': 'Already have an account?' },
    },
    testSelection: {
        title: { 'zh-TW': '選擇測試項目', 'en': 'Select Test Items' },
        subtitle: { 'zh-TW': '您可以根據需要選擇一項或多項測試。', 'en': 'You can select one or more tests as needed.' },
        fingerTestTitle: { 'zh-TW': '手指運動測試', 'en': 'Finger Motor Test' },
        fingerTestDesc: { 'zh-TW': '包含點擊、開合與震顫分析。', 'en': 'Includes tapping, opening/closing, and tremor analysis.' },
        faceTestTitle: { 'zh-TW': '面部表情測試', 'en': 'Facial Expression Test' },
        faceTestDesc: { 'zh-TW': '評估面部肌肉靈活性（面具臉）。', 'en': 'Evaluates facial muscle flexibility (masked face).' },
        startNTests: {
            'zh-TW': (count: number) => `開始執行 ${count} 項測試`,
            'en': (count: number) => `Start Executing ${count} Tests`
        },
        skipButton: { 'zh-TW': '跳過運動測試，直接查看報告', 'en': 'Skip motor tests, view report' },
    },
    maskedFaceTest: {
        title: { 'zh-TW': '面部表情模仿測試', 'en': 'Facial Mimicry Test' },
        cameraError: { 'zh-TW': '無法啟動攝影機，請檢查權限。', 'en': 'Cannot start camera, check permissions.' },
        analyzing: { 'zh-TW': '影像分析中...', 'en': 'Image Analysis...' },
        imitating: { 'zh-TW': '正在模仿：', 'en': 'Imitating:' },
        instructionsTitle: { 'zh-TW': '測試說明', 'en': 'Instructions' },
        instruction1: { 'zh-TW': '請將臉部對準畫面中央，並保持光線充足。', 'en': 'Align your face to the center with good lighting.' },
        instruction2: { 'zh-TW': '依照畫面提示，做出對應的表情（如：大笑、驚訝）。', 'en': 'Make the expression prompted (e.g., laugh, surprise).' },
        instruction3: { 'zh-TW': '每個表情請維持約 5 秒鐘直到倒數結束。', 'en': 'Maintain each expression for 5s until countdown ends.' },
        testing: {
            'zh-TW': (curr: number, total: number) => `進行中 (${curr}/${total})`,
            'en': (curr: number, total: number) => `In Progress (${curr}/${total})`
        },
        readyButton: { 'zh-TW': '我準備好了，開始測試', 'en': 'I\'m ready, start test' },
        restarting: { 'zh-TW': '重啟中...', 'en': 'Restarting...' },
        restartButton: { 'zh-TW': '重置攝影機', 'en': 'Reset Camera' },
    },
    preQuestionnaire: {
        title: { 'zh-TW': '基本資訊填寫', 'en': 'Basic Information' },
        subtitle: { 'zh-TW': '請提供簡單資訊，幫助 AI 提供更精準的分析。', 'en': 'Provide info to help AI deliver accurate analysis.' },
        ageLabel: { 'zh-TW': '您的年齡層', 'en': 'Your Age Group' },
        selectPlaceholder: { 'zh-TW': '請選擇...', 'en': 'Please select...' },
        genderLabel: { 'zh-TW': '您的性別', 'en': 'Your Gender' },
        consent: { 'zh-TW': '我已閱讀並同意隱私權政策與服務條款', 'en': 'I have read and agree to Privacy Policy & TOS' },
        startQuestionnaire: { 'zh-TW': '開始症狀篩檢問卷', 'en': 'Start Symptom Screening' },
    },
    aiAssistant: {
        initialGreeting: { 'zh-TW': '您好！我是 NeuroMotion AI 小幫手。有任何關於篩檢過程或帕金森症狀的問題，都可以問我喔。', 'en': 'Hello! I am NeuroMotion AI assistant. Ask me anything about the screening process or symptoms.' },
        header: { 'zh-TW': 'AI 健康諮詢', 'en': 'AI Health Consultant' },
        placeholder: { 'zh-TW': '請輸入您的問題...', 'en': 'Type your question...' },
    },
    adminAi: {
        initialGreeting: { 'zh-TW': '醫師您好，我是臨床數據助手。我可以幫您分析趨勢、找出異常個案或總結統計數據。', 'en': 'Hello Doctor, I am your clinical data assistant. I can help analyze trends, find anomalies, or summarize stats.' },
        header: { 'zh-TW': '臨床數據 AI 助手', 'en': 'Clinical Data AI Assistant' },
        placeholder: { 'zh-TW': '詢問關於數據的分析...', 'en': 'Ask about data analysis...' },
    },
    privacyPolicy: {
        title: { 'zh-TW': '隱私權政策', 'en': 'Privacy Policy' },
        lastUpdated: { 'zh-TW': '最後更新日期：2025年12月22日', 'en': 'Last Updated: Dec 22, 2025' },
        introduction: { 'zh-TW': '我們非常重視您的隱私，所有影像資料均在本地處理。', 'en': 'We value your privacy; all image data is processed locally.' },
        infoWeCollect: { 'zh-TW': '我們收集的資訊', 'en': 'Information We Collect' },
        infoWeCollectP1: { 'zh-TW': '本系統僅收集匿名化的問卷回覆與運動特徵數據。', 'en': 'We only collect anonymized questionnaire and motor feature data.' },
        infoWeCollectP2: { 'zh-TW': '您的臉部影像與手部動作影片會在處理後立即釋放，不會上傳。', 'en': 'Face and hand videos are released after processing, never uploaded.' },
        howWeUseInfoTitle: { 'zh-TW': '資訊的使用方式', 'en': 'How We Use Information' },
        howWeUseInfoP1: { 'zh-TW': '我們使用這些數據來：', 'en': 'We use this data to:' },
        howWeUseInfoL1: { 'zh-TW': '產生您的個人化篩檢報告', 'en': 'Generate personalized screening reports' },
        howWeUseInfoL2: { 'zh-TW': '改進 AI 分析模型的準確度', 'en': 'Improve AI analysis model accuracy' },
        howWeUseInfoL3: { 'zh-TW': '提供彙整後的臨床統計數據給醫師', 'en': 'Provide aggregated clinical stats to doctors' },
        dataRetention: { 'zh-TW': '資料保留', 'en': 'Data Retention' },
        dataRetentionP1: { 'zh-TW': '匿名報告會在系統中保留 30 天，或直到您手動清除快取。', 'en': 'Anonymous reports are kept for 30 days or until cache clear.' },
    },
    termsOfService: {
        title: { 'zh-TW': '服務條款', 'en': 'Terms of Service' },
        lastUpdated: { 'zh-TW': '最後更新日期：2025年12月22日', 'en': 'Last Updated: Dec 22, 2025' },
        acceptanceP1: { 'zh-TW': '使用本服務即代表您同意本條款之所有內容。', 'en': 'Using this service implies agreement to all terms.' },
        serviceDescription: { 'zh-TW': '服務說明', 'en': 'Service Description' },
        serviceDescriptionP1: { 'zh-TW': 'NeuroMotion 是一項**初步篩檢工具**，不代表最終診斷。', 'en': 'NeuroMotion is a **preliminary screening tool**, not a final diagnosis.' },
        userConduct: { 'zh-TW': '使用者行為', 'en': 'User Conduct' },
        userConductP1: { 'zh-TW': '使用者應確保提供資訊之真實性，並不得濫用系統。', 'en': 'Users should ensure info truthfulness and not abuse the system.' },
        disclaimer: { 'zh-TW': '免責聲明', 'en': 'Disclaimer' },
        disclaimerP1: { 'zh-TW': '本平台不承擔因延誤就醫而產生的任何責任。', 'en': 'This platform assumes no liability for delayed medical care.' },
        liability: { 'zh-TW': '責任限制', 'en': 'Limitation of Liability' },
        liabilityP1: { 'zh-TW': '本服務依現況提供，不保證 100% 的準確性。', 'en': 'Service provided as-is, no 100% accuracy guarantee.' },
    },
    preReportModal: {
        title: { 'zh-TW': '產生報告前的重要提醒', 'en': 'Important Reminder' },
        body: { 'zh-TW': '報告即將生成。請注意，這不是正式的診斷書，僅供醫療參考。', 'en': 'Report generating. Note: This is not a formal diagnosis, for reference only.' },
        confirmButton: { 'zh-TW': '我明白，請生成報告', 'en': 'I understand, generate report' },
    },
    changelogPage: {
        title: { 'zh-TW': '更新日誌', 'en': 'Changelog' },
        subtitle: { 'zh-TW': '系統演進與臨床功能迭代', 'en': 'System Evolution & Clinical Iterations' },
    },
    clinicalReferencePage: {
        title: { 'zh-TW': '臨床數據參考標準', 'en': 'Clinical Reference Standards' },
        subtitle: { 'zh-TW': '以下數值參考 MDS-UPDRS 第三部分運動評估規範，用於輔助 AI 判定動作特徵。', 'en': 'Values based on MDS-UPDRS Part III protocols, assisting AI in feature determination.' },
        dataSourceTitle: { 'zh-TW': '數據來源說明', 'en': 'Data Source Info' },
        dataSourceContent: { 'zh-TW': '本平台算法對標 Movement Disorder Society - Unified Parkinson\'s Disease Rating Scale (MDS-UPDRS) 臨床動作評分指南。', 'en': 'Algorithms benchmarked against MDS-UPDRS clinical motor scoring guidelines.' },
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
        handMotorTestIntro: { 'zh-TW': '此評估包含三項根據 MDS-UPDRS 量表設計的標準測試。', 'en': 'This assessment includes three standardized tests based on MDS-UPDRS.' },
        fingerTapDetailTitle: { 'zh-TW': '手指敲擊 (Finger Tapping)', 'en': 'Finger Tapping' },
        fingerTapDetailText: { 'zh-TW': '食指與拇指的最大幅度開合點擊。', 'en': 'Maximum amplitude tapping of index finger and thumb.' },
        fingerTapStandardsList: {
            'zh-TW': ['頻率穩定性', '振幅衰減狀況', '節律規律性'],
            'en': ['Frequency stability', 'Amplitude decrement', 'Rhythm regularity']
        },
        handOpenCloseTitle: { 'zh-TW': '握拳運動 (Hand Movements)', 'en': 'Hand Movements' },
        handOpenCloseText: { 'zh-TW': '手掌完全張開與緊握。', 'en': 'Fully opening and clenching of the hand.' },
        handOpenCloseStandardsList: {
            'zh-TW': ['動作速度', '開合完整度'],
            'en': ['Movement speed', 'Opening completeness']
        },
        staticTremorTitle: { 'zh-TW': '靜止震顫 (Resting Tremor)', 'en': 'Resting Tremor' },
        staticTremorText: { 'zh-TW': '手部在完全放鬆狀態下的穩定度。', 'en': 'Stability of the hand in a fully relaxed state.' },
        staticTremorStandardsList: {
            'zh-TW': ['震顫頻率 (Hz)', '位移振幅'],
            'en': ['Tremor frequency (Hz)', 'Displacement amplitude']
        },
        assessmentStandards: { 'zh-TW': '評估指標', 'en': 'Assessment Standards' },
        disclaimerText: { 'zh-TW': '本工具僅供初步篩檢參考，不具備醫療診斷效力。若有相關症狀，請務必諮詢神經內科專業醫師。', 'en': 'This tool is for screening reference only and not for medical diagnosis. Consult a neurologist if symptoms persist.' },
        backToHome: { 'zh-TW': '返回首頁', 'en': 'Back to Home' },
    }
};
