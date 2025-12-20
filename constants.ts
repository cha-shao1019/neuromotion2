
import { Question } from './types';

export const QUESTIONS: Question[] = [
    {
        id: 'q1',
        text: '過去一個月，您是否感覺到手指、手或腿部在放鬆時會不自主地顫抖？',
        options: [
            { text: '從未發生', value: 0 },
            { text: '每週少於一次', value: 1 },
            { text: '每週約 1-2 次', value: 2 },
            { text: '每週約 3-4 次', value: 3 },
            { text: '幾乎每天', value: 4 },
        ],
    },
    {
        id: 'q2',
        text: '您走路時，是否感覺步伐變小或拖著腳步走？',
        options: [
             { text: '從未發生', value: 0 },
            { text: '每週少於一次', value: 1 },
            { text: '每週約 1-2 次', value: 2 },
            { text: '每週約 3-4 次', value: 3 },
            { text: '幾乎每天', value: 4 },
        ],
    },
    {
        id: 'q3',
        text: '您是否覺得日常動作（如扣鈕扣、寫字）變得比以前慢或困難？',
        options: [
            { text: '從未發生', value: 0 },
            { text: '每週少於一次', value: 1 },
            { text: '每週約 1-2 次', value: 2 },
            { text: '每週約 3-4 次', value: 3 },
            { text: '幾乎每天', value: 4 },
        ],
    },
    {
        id: 'q4',
        text: '您的家人或朋友是否曾說過您的面部表情變得比較少或看起來像「戴著面具」？',
        options: [
            { text: '從未發生', value: 0 },
            { text: '每週少於一次', value: 1 },
            { text: '每週約 1-2 次', value: 2 },
            { text: '每週約 3-4 次', value: 3 },
            { text: '幾乎每天', value: 4 },
        ],
    },
    {
        id: 'q5',
        text: '您說話的聲音是否變得比以前小聲或單調？',
        options: [
            { text: '從未發生', value: 0 },
            { text: '每週少於一次', value: 1 },
            { text: '每週約 1-2 次', value: 2 },
            { text: '每週約 3-4 次', value: 3 },
            { text: '幾乎每天', value: 4 },
        ],
    },
     {
        id: 'q6',
        text: '您是否在晚上睡覺時，常有大叫、拳打腳踢等劇烈動作？',
        options: [
            { text: '從未發生', value: 0 },
            { text: '每週少於一次', value: 1 },
            { text: '每週約 1-2 次', value: 2 },
            { text: '每週約 3-4 次', value: 3 },
            { text: '幾乎每天', value: 4 },
        ],
    },
    {
        id: 'q7',
        text: '您的嗅覺是否變得不靈敏，聞不太到食物或花朵的香味？',
        options: [
            { text: '從未發生', value: 0 },
            { text: '每週少於一次', value: 1 },
            { text: '每週約 1-2 次', value: 2 },
            { text: '每週約 3-4 次', value: 3 },
            { text: '幾乎每天', value: 4 },
        ],
    },
];

export const MAX_SCORE = QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.value)), 0);

export const EMOJI_POOL: { emoji: string; name: string }[] = [
    { emoji: '😁', name: '燦爛微笑' },
    { emoji: '😮', name: '驚訝張嘴' },
    { emoji: '😠', name: '生氣皺眉' },
    { emoji: '😗', name: '噘嘴親吻' },
    { emoji: '☹️', name: '悲傷撇嘴' },
    { emoji: '🤨', name: '挑起單眉' },
    { emoji: '😖', name: '緊閉雙眼' },
    { emoji: '😬', name: '緊咬牙齒' },
];

export const GENDERS: ('男性' | '女性' | '其他' | '不願透露')[] = ['男性', '女性', '其他', '不願透露'];
export const AGE_RANGES = ['不到50歲', '50-59', '60-69', '70-79', '80歲以上'];

// 臨床醫療標準 (Medical Standards)
export const MEDICAL_STANDARDS = {
    fingerTap: {
        frequency: { min: 3.5, max: 6.0, unit: 'Hz', label: '敲擊頻率' },
        amplitude: { min: 85, max: 100, unit: '%', label: '平均振幅' },
        decrement: { max: 15, unit: '%', label: '振幅衰減率 (Sequence Effect)' },
        rhythmVariability: { max: 0.25, unit: ' CV', label: '節律變異度 (CV)' }
    },
    staticTremor: {
        frequency: { min: 0, max: 3.0, unit: 'Hz', label: '震顫頻率 (Resting)' },
        amplitude: { min: 0, max: 5, unit: '%', label: '平均位移強度' },
    },
    faceTest: {
        matchScore: { min: 80, unit: '%', label: '表情符合度' },
        symmetry: { min: 0.85, unit: '', label: '面部對稱性' },
        responseTime: { max: 0.8, unit: 's', label: '反應潛伏期' }
    }
};
