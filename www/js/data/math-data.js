/**
 * 数学课程数据
 */

// 数字0-20（带数量展示）
const NUMBERS_DATA = [
    { num: 0, word: '零', pinyin: 'líng', emoji: '🥚', count: 0 },
    { num: 1, word: '一', pinyin: 'yī', emoji: '🍎', count: 1 },
    { num: 2, word: '二', pinyin: 'èr', emoji: '🍌', count: 2 },
    { num: 3, word: '三', pinyin: 'sān', emoji: '🍒', count: 3 },
    { num: 4, word: '四', pinyin: 'sì', emoji: '🍓', count: 4 },
    { num: 5, word: '五', pinyin: 'wǔ', emoji: '⭐', count: 5 },
    { num: 6, word: '六', pinyin: 'liù', emoji: '🌸', count: 6 },
    { num: 7, word: '七', pinyin: 'qī', emoji: '🌈', count: 7 },
    { num: 8, word: '八', pinyin: 'bā', emoji: '🐙', count: 8 },
    { num: 9, word: '九', pinyin: 'jiǔ', emoji: '🎈', count: 9 },
    { num: 10, word: '十', pinyin: 'shí', emoji: '✋', count: 10 }
];

// 加法题
const ADDITION_PROBLEMS = [
    { a: 1, b: 1, op: '+', emoji: '🍎', result: 2 },
    { a: 1, b: 2, op: '+', emoji: '🍌', result: 3 },
    { a: 2, b: 2, op: '+', emoji: '🍒', result: 4 },
    { a: 2, b: 3, op: '+', emoji: '🍓', result: 5 },
    { a: 3, b: 2, op: '+', emoji: '⭐', result: 5 },
    { a: 3, b: 3, op: '+', emoji: '🌸', result: 6 },
    { a: 4, b: 1, op: '+', emoji: '🌈', result: 5 },
    { a: 4, b: 2, op: '+', emoji: '🎈', result: 6 },
    { a: 4, b: 3, op: '+', emoji: '🍇', result: 7 },
    { a: 5, b: 2, op: '+', emoji: '🍭', result: 7 },
    { a: 5, b: 3, op: '+', emoji: '🌻', result: 8 },
    { a: 5, b: 5, op: '+', emoji: '🦋', result: 10 },
    { a: 6, b: 2, op: '+', emoji: '🐝', result: 8 },
    { a: 6, b: 4, op: '+', emoji: '🍀', result: 10 },
    { a: 7, b: 3, op: '+', emoji: '🌟', result: 10 },
    { a: 8, b: 2, op: '+', emoji: '🐬', result: 10 },
    { a: 9, b: 1, op: '+', emoji: '🐠', result: 10 }
];

// 减法题
const SUBTRACTION_PROBLEMS = [
    { a: 2, b: 1, op: '-', emoji: '🍎', result: 1 },
    { a: 3, b: 1, op: '-', emoji: '🍌', result: 2 },
    { a: 3, b: 2, op: '-', emoji: '🍒', result: 1 },
    { a: 4, b: 1, op: '-', emoji: '🍓', result: 3 },
    { a: 4, b: 2, op: '-', emoji: '⭐', result: 2 },
    { a: 5, b: 2, op: '-', emoji: '🌸', result: 3 },
    { a: 5, b: 3, op: '-', emoji: '🌈', result: 2 },
    { a: 5, b: 4, op: '-', emoji: '🎈', result: 1 },
    { a: 6, b: 3, op: '-', emoji: '🍇', result: 3 },
    { a: 7, b: 2, op: '-', emoji: '🍭', result: 5 },
    { a: 8, b: 4, op: '-', emoji: '🌻', result: 4 },
    { a: 9, b: 5, op: '-', emoji: '🦋', result: 4 },
    { a: 10, b: 3, op: '-', emoji: '🐝', result: 7 },
    { a: 10, b: 5, op: '-', emoji: '🍀', result: 5 },
    { a: 10, b: 7, op: '-', emoji: '🌟', result: 3 }
];

// 形状
const SHAPES_DATA = [
    { name: '圆形', pinyin: 'yuán xíng', svg: '<circle cx="50" cy="50" r="40" />', color: '#e74c3c', desc: '圆圆的，没有角' },
    { name: '正方形', pinyin: 'zhèng fāng xíng', svg: '<rect x="15" y="15" width="70" height="70" />', color: '#3498db', desc: '四条边一样长' },
    { name: '长方形', pinyin: 'cháng fāng xíng', svg: '<rect x="10" y="30" width="80" height="40" />', color: '#2ecc71', desc: '对边一样长' },
    { name: '三角形', pinyin: 'sān jiǎo xíng', svg: '<polygon points="50,10 90,85 10,85" />', color: '#f5a623', desc: '有三个角' },
    { name: '星形', pinyin: 'xīng xíng', svg: '<polygon points="50,5 61,38 95,38 67,58 78,92 50,72 22,92 33,58 5,38 39,38" />', color: '#e94560', desc: '五个角的星星' },
    { name: '心形', pinyin: 'xīn xíng', svg: '<path d="M50,85 C50,85 15,55 15,35 C15,20 25,12 35,12 C42,12 47,18 50,25 C53,18 58,12 65,12 C75,12 85,20 85,35 C85,55 50,85 50,85Z" />', color: '#e74c3c', desc: '爱心的形状' },
    { name: '椭圆', pinyin: 'tuǒ yuán', svg: '<ellipse cx="50" cy="50" rx="45" ry="30" />', color: '#9b59b6', desc: '拉长的圆' },
    { name: '菱形', pinyin: 'líng xíng', svg: '<polygon points="50,10 90,50 50,90 10,50" />', color: '#1abc9c', desc: '四个相等的边' }
];

// 趣味数数
const COUNTING_DATA = [
    { question: '数一数有几只小动物？', emoji: '🐱', count: 3, options: [2, 3, 4], answer: 3 },
    { question: '数一数有几朵花？', emoji: '🌸', count: 5, options: [4, 5, 6], answer: 5 },
    { question: '数一数有几颗星星？', emoji: '⭐', count: 7, options: [6, 7, 8], answer: 7 },
    { question: '数一数有几个气球？', emoji: '🎈', count: 4, options: [3, 4, 5], answer: 4 },
    { question: '数一数有几只蝴蝶？', emoji: '🦋', count: 6, options: [5, 6, 7], answer: 6 },
    { question: '数一数有几个苹果？', emoji: '🍎', count: 8, options: [7, 8, 9], answer: 8 },
    { question: '数一数有几条小鱼？', emoji: '🐟', count: 2, options: [1, 2, 3], answer: 2 },
    { question: '数一数有几棵树？', emoji: '🌳', count: 9, options: [8, 9, 10], answer: 9 }
];

// 时间认知
const TIME_DATA = [
    { hour: 7, minute: 0, desc: '早上7点', event: '起床啦！☀️', emoji: '⏰' },
    { hour: 7, minute: 30, desc: '早上7点半', event: '吃早餐 🥣', emoji: '🍳' },
    { hour: 8, minute: 0, desc: '早上8点', event: '去上学 🏫', emoji: '🎒' },
    { hour: 12, minute: 0, desc: '中午12点', event: '吃午饭 🍚', emoji: '🍱' },
    { hour: 12, minute: 30, desc: '中午12点半', event: '睡午觉 😴', emoji: '🛏️' },
    { hour: 3, minute: 0, desc: '下午3点', event: '做运动 ⚽', emoji: '🏃' },
    { hour: 5, minute: 0, desc: '下午5点', event: '放学回家 🏠', emoji: '🚶' },
    { hour: 6, minute: 0, desc: '下午6点', event: '吃晚饭 🍽️', emoji: '🍲' },
    { hour: 7, minute: 0, desc: '晚上7点', event: '写作业 ✏️', emoji: '📝' },
    { hour: 8, minute: 30, desc: '晚上8点半', event: '准备睡觉 🌙', emoji: '🛌' },
    { hour: 9, minute: 0, desc: '晚上9点', event: '晚安睡觉 💤', emoji: '😴' }
];

// 比较大小
const COMPARE_DATA = [
    { left: '🐘', right: '🐭', leftName: '大象', rightName: '老鼠', answer: '>', question: '谁更大？', bigger: 'left' },
    { left: '🏖️', right: '🏔️', leftName: '沙堆', rightName: '高山', answer: '<', question: '谁更高？', bigger: 'right' },
    { left: '🍉', right: '🍇', leftName: '西瓜', rightName: '葡萄', answer: '>', question: '谁更大？', bigger: 'left' },
    { left: '🚗', right: '🚲', leftName: '汽车', rightName: '自行车', answer: '>', question: '谁更大？', bigger: 'left' },
    { left: '🐜', right: '🐕', leftName: '蚂蚁', rightName: '小狗', answer: '<', question: '谁更小？', bigger: 'right' },
    { left: '5', right: '3', leftName: '5', rightName: '3', answer: '>', question: '哪个数更大？', bigger: 'left' },
    { left: '2', right: '7', leftName: '2', rightName: '7', answer: '<', question: '哪个数更大？', bigger: 'right' },
    { left: '8', right: '8', leftName: '8', rightName: '8', answer: '=', question: '它们谁大？', bigger: 'equal' },
    { left: '🦁', right: '🐱', leftName: '狮子', rightName: '小猫', answer: '>', question: '谁更大？', bigger: 'left' },
    { left: '9', right: '6', leftName: '9', rightName: '6', answer: '>', question: '哪个数更大？', bigger: 'left' }
];

// 规律推理
const PATTERN_DATA = [
    { sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'], answer: '🔵', options: ['🔵', '🟢', '🔴'], hint: '红蓝交替' },
    { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], answer: '🌙', options: ['⭐', '🌙', '☀️'], hint: '两星一月' },
    { sequence: ['1', '2', '3', '4', '5'], answer: '6', options: ['7', '6', '8'], hint: '数字递增' },
    { sequence: ['2', '4', '6', '8'], answer: '10', options: ['9', '10', '12'], hint: '偶数递增' },
    { sequence: ['🌸', '🌸', '🌺', '🌸', '🌸'], answer: '🌺', options: ['🌸', '🌺', '🌻'], hint: '两樱花一红花' },
    { sequence: ['🍎', '🍌', '🍎', '🍌', '🍎'], answer: '🍌', options: ['🍎', '🍌', '🍇'], hint: '苹果香蕉交替' },
    { sequence: ['1', '3', '5', '7'], answer: '9', options: ['8', '9', '10'], hint: '奇数递增' },
    { sequence: ['🐶', '🐱', '🐶', '🐱', '🐶'], answer: '🐱', options: ['🐶', '🐱', '🐰'], hint: '狗猫交替' },
    { sequence: ['🔵', '🔵', '🔴', '🔵', '🔵'], answer: '🔴', options: ['🔵', '🔴', '🟢'], hint: '两蓝一红' },
    { sequence: ['10', '9', '8', '7'], answer: '6', options: ['5', '6', '7'], hint: '倒序递减' }
];
