/**
 * 英语课程数据
 */

// 字母 A-Z
const ALPHABET_DATA = [
    { upper: 'A', lower: 'a', word: 'Apple', cn: '苹果', emoji: '🍎', phonetic: 'æ' },
    { upper: 'B', lower: 'b', word: 'Ball', cn: '球', emoji: '⚽', phonetic: 'biː' },
    { upper: 'C', lower: 'c', word: 'Cat', cn: '猫', emoji: '🐱', phonetic: 'siː' },
    { upper: 'D', lower: 'd', word: 'Dog', cn: '狗', emoji: '🐶', phonetic: 'diː' },
    { upper: 'E', lower: 'e', word: 'Egg', cn: '鸡蛋', emoji: '🥚', phonetic: 'iː' },
    { upper: 'F', lower: 'f', word: 'Fish', cn: '鱼', emoji: '🐟', phonetic: 'ef' },
    { upper: 'G', lower: 'g', word: 'Girl', cn: '女孩', emoji: '👧', phonetic: 'dʒiː' },
    { upper: 'H', lower: 'h', word: 'Hat', cn: '帽子', emoji: '🎩', phonetic: 'eɪtʃ' },
    { upper: 'I', lower: 'i', word: 'Ice cream', cn: '冰淇淋', emoji: '🍦', phonetic: 'aɪ' },
    { upper: 'J', lower: 'j', word: 'Juice', cn: '果汁', emoji: '🧃', phonetic: 'dʒeɪ' },
    { upper: 'K', lower: 'k', word: 'Kite', cn: '风筝', emoji: '🪁', phonetic: 'keɪ' },
    { upper: 'L', lower: 'l', word: 'Lion', cn: '狮子', emoji: '🦁', phonetic: 'el' },
    { upper: 'M', lower: 'm', word: 'Moon', cn: '月亮', emoji: '🌙', phonetic: 'em' },
    { upper: 'N', lower: 'n', word: 'Nest', cn: '鸟巢', emoji: '🪺', phonetic: 'en' },
    { upper: 'O', lower: 'o', word: 'Orange', cn: '橙子', emoji: '🍊', phonetic: 'oʊ' },
    { upper: 'P', lower: 'p', word: 'Panda', cn: '熊猫', emoji: '🐼', phonetic: 'piː' },
    { upper: 'Q', lower: 'q', word: 'Queen', cn: '女王', emoji: '👸', phonetic: 'kjuː' },
    { upper: 'R', lower: 'r', word: 'Rabbit', cn: '兔子', emoji: '🐰', phonetic: 'ɑːr' },
    { upper: 'S', lower: 's', word: 'Sun', cn: '太阳', emoji: '☀️', phonetic: 'es' },
    { upper: 'T', lower: 't', word: 'Tiger', cn: '老虎', emoji: '🐯', phonetic: 'tiː' },
    { upper: 'U', lower: 'u', word: 'Umbrella', cn: '雨伞', emoji: '☂️', phonetic: 'juː' },
    { upper: 'V', lower: 'v', word: 'Violin', cn: '小提琴', emoji: '🎻', phonetic: 'viː' },
    { upper: 'W', lower: 'w', word: 'Water', cn: '水', emoji: '💧', phonetic: 'dʌbljuː' },
    { upper: 'X', lower: 'x', word: 'Xylophone', cn: '木琴', emoji: '🎹', phonetic: 'eks' },
    { upper: 'Y', lower: 'y', word: 'Yellow', cn: '黄色', emoji: '🟡', phonetic: 'waɪ' },
    { upper: 'Z', lower: 'z', word: 'Zebra', cn: '斑马', emoji: '🦓', phonetic: 'ziː' }
];

// 常用单词（分类）
const WORDS_DATA = {
    '动物': [
        { en: 'Cat', cn: '猫', emoji: '🐱' },
        { en: 'Dog', cn: '狗', emoji: '🐶' },
        { en: 'Bird', cn: '鸟', emoji: '🐦' },
        { en: 'Fish', cn: '鱼', emoji: '🐟' },
        { en: 'Rabbit', cn: '兔子', emoji: '🐰' },
        { en: 'Bear', cn: '熊', emoji: '🐻' },
        { en: 'Monkey', cn: '猴子', emoji: '🐵' },
        { en: 'Elephant', cn: '大象', emoji: '🐘' },
        { en: 'Tiger', cn: '老虎', emoji: '🐯' },
        { en: 'Lion', cn: '狮子', emoji: '🦁' }
    ],
    '水果': [
        { en: 'Apple', cn: '苹果', emoji: '🍎' },
        { en: 'Banana', cn: '香蕉', emoji: '🍌' },
        { en: 'Orange', cn: '橙子', emoji: '🍊' },
        { en: 'Grape', cn: '葡萄', emoji: '🍇' },
        { en: 'Strawberry', cn: '草莓', emoji: '🍓' },
        { en: 'Watermelon', cn: '西瓜', emoji: '🍉' },
        { en: 'Peach', cn: '桃子', emoji: '🍑' },
        { en: 'Cherry', cn: '樱桃', emoji: '🍒' }
    ],
    '颜色': [
        { en: 'Red', cn: '红色', emoji: '🔴' },
        { en: 'Blue', cn: '蓝色', emoji: '🔵' },
        { en: 'Yellow', cn: '黄色', emoji: '🟡' },
        { en: 'Green', cn: '绿色', emoji: '🟢' },
        { en: 'Purple', cn: '紫色', emoji: '🟣' },
        { en: 'Orange', cn: '橙色', emoji: '🟠' },
        { en: 'Black', cn: '黑色', emoji: '⚫' },
        { en: 'White', cn: '白色', emoji: '⚪' }
    ],
    '食物': [
        { en: 'Bread', cn: '面包', emoji: '🍞' },
        { en: 'Milk', cn: '牛奶', emoji: '🥛' },
        { en: 'Egg', cn: '鸡蛋', emoji: '🥚' },
        { en: 'Cake', cn: '蛋糕', emoji: '🍰' },
        { en: 'Rice', cn: '米饭', emoji: '🍚' },
        { en: 'Ice cream', cn: '冰淇淋', emoji: '🍦' },
        { en: 'Cookie', cn: '饼干', emoji: '🍪' },
        { en: 'Juice', cn: '果汁', emoji: '🧃' }
    ],
    '家庭': [
        { en: 'Father', cn: '爸爸', emoji: '👨' },
        { en: 'Mother', cn: '妈妈', emoji: '👩' },
        { en: 'Brother', cn: '哥哥', emoji: '👦' },
        { en: 'Sister', cn: '姐姐', emoji: '👧' },
        { en: 'Grandfather', cn: '爷爷', emoji: '👴' },
        { en: 'Grandmother', cn: '奶奶', emoji: '👵' },
        { en: 'Baby', cn: '宝宝', emoji: '👶' },
        { en: 'Family', cn: '家庭', emoji: '👨‍👩‍👧‍👦' }
    ],
    '身体': [
        { en: 'Head', cn: '头', emoji: '🗣️' },
        { en: 'Eye', cn: '眼睛', emoji: '👁️' },
        { en: 'Nose', cn: '鼻子', emoji: '👃' },
        { en: 'Mouth', cn: '嘴巴', emoji: '👄' },
        { en: 'Ear', cn: '耳朵', emoji: '👂' },
        { en: 'Hand', cn: '手', emoji: '✋' },
        { en: 'Foot', cn: '脚', emoji: '🦶' },
        { en: 'Heart', cn: '心', emoji: '❤️' }
    ]
};

// 日常对话
const DIALOGUE_DATA = [
    {
        title: '打招呼',
        lines: [
            { speaker: '👧', en: 'Hello! How are you?', cn: '你好！你怎么样？' },
            { speaker: '👦', en: 'I am fine, thank you!', cn: '我很好，谢谢！' },
            { speaker: '👧', en: 'Nice to meet you!', cn: '很高兴认识你！' },
            { speaker: '👦', en: 'Nice to meet you, too!', cn: '我也很高兴认识你！' }
        ]
    },
    {
        title: '介绍自己',
        lines: [
            { speaker: '👧', en: 'What is your name?', cn: '你叫什么名字？' },
            { speaker: '👦', en: 'My name is Tom.', cn: '我叫汤姆。' },
            { speaker: '👧', en: 'How old are you?', cn: '你几岁了？' },
            { speaker: '👦', en: 'I am six years old.', cn: '我六岁了。' }
        ]
    },
    {
        title: '在教室',
        lines: [
            { speaker: '👩‍🏫', en: 'Good morning, class!', cn: '早上好，同学们！' },
            { speaker: '👧', en: 'Good morning, teacher!', cn: '早上好，老师！' },
            { speaker: '👩‍🏫', en: 'Open your books, please.', cn: '请打开你们的书。' },
            { speaker: '👦', en: 'Yes, teacher!', cn: '好的，老师！' }
        ]
    },
    {
        title: '买东西',
        lines: [
            { speaker: '👦', en: 'I want an apple, please.', cn: '我想要一个苹果。' },
            { speaker: '👨', en: 'Here you are!', cn: '给你！' },
            { speaker: '👦', en: 'How much is it?', cn: '多少钱？' },
            { speaker: '👨', en: 'Two yuan, please.', cn: '两块钱。' },
            { speaker: '👦', en: 'Thank you!', cn: '谢谢！' }
        ]
    },
    {
        title: '问路',
        lines: [
            { speaker: '👧', en: 'Excuse me, where is the park?', cn: '打扰一下，公园在哪里？' },
            { speaker: '👮', en: 'Go straight and turn left.', cn: '直走然后左转。' },
            { speaker: '👧', en: 'Is it far?', cn: '远吗？' },
            { speaker: '👮', en: 'No, it is near.', cn: '不远，很近。' },
            { speaker: '👧', en: 'Thank you very much!', cn: '非常感谢！' }
        ]
    }
];

// 英文儿歌
const SONGS_DATA = [
    {
        title: 'ABC Song',
        lyrics: [
            'A B C D E F G,',
            'H I J K L M N,',
            'O P Q, R S T,',
            'U V W, X Y Z,',
            'Now I know my ABCs,',
            'Next time won\'t you sing with me?'
        ],
        cn: '字母歌，学习26个英文字母'
    },
    {
        title: 'Twinkle Twinkle Little Star',
        lyrics: [
            'Twinkle, twinkle, little star,',
            'How I wonder what you are!',
            'Up above the world so high,',
            'Like a diamond in the sky.',
            'Twinkle, twinkle, little star,',
            'How I wonder what you are!'
        ],
        cn: '一闪一闪亮晶晶，满天都是小星星'
    },
    {
        title: 'Happy Birthday',
        lyrics: [
            'Happy birthday to you,',
            'Happy birthday to you,',
            'Happy birthday dear friend,',
            'Happy birthday to you!'
        ],
        cn: '祝你生日快乐'
    },
    {
        title: 'Old MacDonald',
        lyrics: [
            'Old MacDonald had a farm, E-I-E-I-O!',
            'And on his farm he had a cow, E-I-E-I-O!',
            'With a moo moo here, and a moo moo there,',
            'Here a moo, there a moo, everywhere a moo moo,',
            'Old MacDonald had a farm, E-I-E-I-O!'
        ],
        cn: '老麦克唐纳有个农场'
    },
    {
        title: 'Head Shoulders Knees Toes',
        lyrics: [
            'Head, shoulders, knees and toes, knees and toes,',
            'Head, shoulders, knees and toes, knees and toes,',
            'And eyes and ears and mouth and nose,',
            'Head, shoulders, knees and toes, knees and toes!'
        ],
        cn: '头肩膀膝盖脚趾，认识身体部位'
    },
    {
        title: 'If You Are Happy',
        lyrics: [
            'If you\'re happy and you know it, clap your hands!',
            'If you\'re happy and you know it, clap your hands!',
            'If you\'re happy and you know it, then your face will surely show it,',
            'If you\'re happy and you know it, clap your hands!'
        ],
        cn: '如果你快乐就拍拍手'
    }
];
