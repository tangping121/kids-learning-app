/**
 * 语文课程数据
 */

// 声母
const PINYIN_SHENGMU = [
    { pinyin: 'b', text: 'b', desc: '波', example: '爸爸 bà ba', emoji: '👨' },
    { pinyin: 'p', text: 'p', desc: '坡', example: '皮球 pí qiú', emoji: '⚽' },
    { pinyin: 'm', text: 'm', desc: '摸', example: '妈妈 mā ma', emoji: '👩' },
    { pinyin: 'f', text: 'f', desc: '佛', example: '飞机 fēi jī', emoji: '✈️' },
    { pinyin: 'd', text: 'd', desc: '得', example: '大象 dà xiàng', emoji: '🐘' },
    { pinyin: 't', text: 't', desc: '特', example: '太阳 tài yáng', emoji: '☀️' },
    { pinyin: 'n', text: 'n', desc: '讷', example: '牛奶 niú nǎi', emoji: '🥛' },
    { pinyin: 'l', text: 'l', desc: '勒', example: '老虎 lǎo hǔ', emoji: '🐯' },
    { pinyin: 'g', text: 'g', desc: '哥', example: '哥哥 gē ge', emoji: '👦' },
    { pinyin: 'k', text: 'k', desc: '科', example: '开心 kāi xīn', emoji: '😊' },
    { pinyin: 'h', text: 'h', desc: '喝', example: '花朵 huā duǒ', emoji: '🌸' },
    { pinyin: 'j', text: 'j', desc: '鸡', example: '鸡蛋 jī dàn', emoji: '🥚' },
    { pinyin: 'q', text: 'q', desc: '欺', example: '气球 qì qiú', emoji: '🎈' },
    { pinyin: 'x', text: 'x', desc: '希', example: '星星 xīng xing', emoji: '⭐' },
    { pinyin: 'zh', text: 'zh', desc: '知', example: '蜘蛛 zhī zhū', emoji: '🕷️' },
    { pinyin: 'ch', text: 'ch', desc: '吃', example: '吃饭 chī fàn', emoji: '🍚' },
    { pinyin: 'sh', text: 'sh', desc: '狮', example: '狮子 shī zi', emoji: '🦁' },
    { pinyin: 'r', text: 'r', desc: '日', example: '太阳 tài yáng', emoji: '🌅' },
    { pinyin: 'z', text: 'z', desc: '资', example: '紫色 zǐ sè', emoji: '🟣' },
    { pinyin: 'c', text: 'c', desc: '刺', example: '草地 cǎo dì', emoji: '🌱' },
    { pinyin: 's', text: 's', desc: '丝', example: '森林 sēn lín', emoji: '🌲' },
    { pinyin: 'y', text: 'y', desc: '医', example: '月亮 yuè liang', emoji: '🌙' },
    { pinyin: 'w', text: 'w', desc: '乌', example: '乌龟 wū guī', emoji: '🐢' }
];

// 韵母
const PINYIN_YUNMU = [
    { pinyin: 'a', text: 'a', desc: '啊', example: '爸爸妈妈', emoji: '👨‍👩‍👧' },
    { pinyin: 'o', text: 'o', desc: '喔', example: '哦 ò', emoji: '😯' },
    { pinyin: 'e', text: 'e', desc: '鹅', example: '白鹅 bái é', emoji: '🦢' },
    { pinyin: 'i', text: 'i', desc: '衣', example: '衣服 yī fu', emoji: '👕' },
    { pinyin: 'u', text: 'u', desc: '乌', example: '乌鸦 wū yā', emoji: '🐦‍⬛' },
    { pinyin: 'ü', text: 'ü', desc: '鱼', example: '小鱼 xiǎo yú', emoji: '🐟' },
    { pinyin: 'ai', text: 'ai', desc: '爱', example: '爱 ài', emoji: '❤️' },
    { pinyin: 'ei', text: 'ei', desc: '欸', example: '杯子 bēi zi', emoji: '🥤' },
    { pinyin: 'ui', text: 'ui', desc: '威', example: '水 shuǐ', emoji: '💧' },
    { pinyin: 'ao', text: 'ao', desc: '奥', example: '猫 māo', emoji: '🐱' },
    { pinyin: 'ou', text: 'ou', desc: '欧', example: '狗 gǒu', emoji: '🐶' },
    { pinyin: 'iu', text: 'iu', desc: '优', example: '牛 niú', emoji: '🐂' },
    { pinyin: 'ie', text: 'ie', desc: '耶', example: '叶 yè', emoji: '🍃' },
    { pinyin: 'üe', text: 'üe', desc: '约', example: '月亮 yuè liang', emoji: '🌙' },
    { pinyin: 'er', text: 'er', desc: '耳', example: '耳朵 ěr duo', emoji: '👂' },
    { pinyin: 'an', text: 'an', desc: '安', example: '山 shān', emoji: '⛰️' },
    { pinyin: 'en', text: 'en', desc: '恩', example: '门 mén', emoji: '🚪' },
    { pinyin: 'in', text: 'in', desc: '音', example: '金 jīn', emoji: '🥇' },
    { pinyin: 'un', text: 'un', desc: '温', example: '春 chūn', emoji: '🌸' },
    { pinyin: 'ün', text: 'ün', desc: '晕', example: '云 yún', emoji: '☁️' },
    { pinyin: 'ang', text: 'ang', desc: '昂', example: '羊 yáng', emoji: '🐑' },
    { pinyin: 'eng', text: 'eng', desc: '亨', example: '风 fēng', emoji: '🌬️' },
    { pinyin: 'ing', text: 'ing', desc: '英', example: '星 xīng', emoji: '🌟' },
    { pinyin: 'ong', text: 'ong', desc: '翁', example: '龙 lóng', emoji: '🐉' }
];

// 常用汉字
const HANZI_LIST = [
    { char: '一', pinyin: 'yī', meaning: '数字一', strokes: 1, words: '一个 一起 一定', emoji: '1️⃣' },
    { char: '二', pinyin: 'èr', meaning: '数字二', strokes: 2, words: '第二 二月', emoji: '2️⃣' },
    { char: '三', pinyin: 'sān', meaning: '数字三', strokes: 3, words: '三个 三角', emoji: '3️⃣' },
    { char: '四', pinyin: 'sì', meaning: '数字四', strokes: 5, words: '四方 四季', emoji: '4️⃣' },
    { char: '五', pinyin: 'wǔ', meaning: '数字五', strokes: 4, words: '五个 五星', emoji: '5️⃣' },
    { char: '六', pinyin: 'liù', meaning: '数字六', strokes: 4, words: '六个 六月', emoji: '6️⃣' },
    { char: '七', pinyin: 'qī', meaning: '数字七', strokes: 2, words: '七个 七彩', emoji: '7️⃣' },
    { char: '八', pinyin: 'bā', meaning: '数字八', strokes: 2, words: '八个 八月', emoji: '8️⃣' },
    { char: '九', pinyin: 'jiǔ', meaning: '数字九', strokes: 2, words: '九月 九个', emoji: '9️⃣' },
    { char: '十', pinyin: 'shí', meaning: '数字十', strokes: 2, words: '十个 十分', emoji: '🔟' },
    { char: '人', pinyin: 'rén', meaning: '人类', strokes: 2, words: '人们 大人 人类', emoji: '🧑' },
    { char: '口', pinyin: 'kǒu', meaning: '嘴巴', strokes: 3, words: '口水 出口 入口', emoji: '👄' },
    { char: '手', pinyin: 'shǒu', meaning: '手掌', strokes: 4, words: '小手 拍手 手心', emoji: '✋' },
    { char: '目', pinyin: 'mù', meaning: '眼睛', strokes: 5, words: '目光 目标', emoji: '👁️' },
    { char: '日', pinyin: 'rì', meaning: '太阳', strokes: 4, words: '日出 生日 日期', emoji: '☀️' },
    { char: '月', pinyin: 'yuè', meaning: '月亮', strokes: 4, words: '月亮 月光 月亮', emoji: '🌙' },
    { char: '水', pinyin: 'shuǐ', meaning: '液体', strokes: 4, words: '喝水 水果 水中', emoji: '💧' },
    { char: '火', pinyin: 'huǒ', meaning: '火焰', strokes: 4, words: '火车 大火 火苗', emoji: '🔥' },
    { char: '山', pinyin: 'shān', meaning: '山峰', strokes: 3, words: '大山 山上 山下', emoji: '⛰️' },
    { char: '石', pinyin: 'shí', meaning: '石头', strokes: 5, words: '石头 小石 石子', emoji: '🪨' },
    { char: '木', pinyin: 'mù', meaning: '树木', strokes: 4, words: '大树 木头 树木', emoji: '🌳' },
    { char: '土', pinyin: 'tǔ', meaning: '泥土', strokes: 3, words: '土地 泥土 沙土', emoji: '🌍' },
    { char: '天', pinyin: 'tiān', meaning: '天空', strokes: 4, words: '天上 天空 今天', emoji: '🌌' },
    { char: '地', pinyin: 'dì', meaning: '大地', strokes: 6, words: '地上 地方 土地', emoji: '🌎' },
    { char: '上', pinyin: 'shàng', meaning: '上方', strokes: 3, words: '上面 上面 向上', emoji: '⬆️' },
    { char: '下', pinyin: 'xià', meaning: '下方', strokes: 3, words: '下面 向下 下山', emoji: '⬇️' },
    { char: '大', pinyin: 'dà', meaning: '巨大', strokes: 3, words: '大人 大小 大学', emoji: '🐘' },
    { char: '小', pinyin: 'xiǎo', meaning: '微小', strokes: 3, words: '小手 小鸟 小花', emoji: '🐦' },
    { char: '多', pinyin: 'duō', meaning: '许多', strokes: 6, words: '多少 很多 多多', emoji: '➕' },
    { char: '少', pinyin: 'shǎo', meaning: '少量', strokes: 4, words: '少量 很少 多少', emoji: '➖' }
];

// 古诗
const POETRY_LIST = [
    {
        title: '咏鹅',
        author: '骆宾王',
        lines: ['鹅，鹅，鹅，', '曲项向天歌。', '白毛浮绿水，', '红掌拨清波。'],
        desc: '描写鹅在水里游泳的可爱模样'
    },
    {
        title: '静夜思',
        author: '李白',
        lines: ['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。'],
        desc: '在安静的夜晚思念家乡'
    },
    {
        title: '春晓',
        author: '孟浩然',
        lines: ['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。'],
        desc: '春天的早晨，鸟语花香'
    },
    {
        title: '悯农',
        author: '李绅',
        lines: ['锄禾日当午，', '汗滴禾下土。', '谁知盘中餐，', '粒粒皆辛苦。'],
        desc: '告诉我们粮食来之不易'
    },
    {
        title: '登鹳雀楼',
        author: '王之涣',
        lines: ['白日依山尽，', '黄河入海流。', '欲穷千里目，', '更上一层楼。'],
        desc: '站得高看得远'
    },
    {
        title: '望庐山瀑布',
        author: '李白',
        lines: ['日照香炉生紫烟，', '遥看瀑布挂前川。', '飞流直下三千尺，', '疑是银河落九天。'],
        desc: '壮观的瀑布像银河从天而降'
    },
    {
        title: '咏柳',
        author: '贺知章',
        lines: ['碧玉妆成一树高，', '万条垂下绿丝绦。', '不知细叶谁裁出，', '二月春风似剪刀。'],
        desc: '春风像剪刀剪出柳叶'
    },
    {
        title: '草',
        author: '白居易',
        lines: ['离离原上草，', '一岁一枯荣。', '野火烧不尽，', '春风吹又生。'],
        desc: '小草生命力很强'
    },
    {
        title: '江雪',
        author: '柳宗元',
        lines: ['千山鸟飞绝，', '万径人踪灭。', '孤舟蓑笠翁，', '独钓寒江雪。'],
        desc: '冬天雪天独自钓鱼的老爷爷'
    },
    {
        title: '游子吟',
        author: '孟郊',
        lines: ['慈母手中线，', '游子身上衣。', '临行密密缝，', '意恐迟迟归。', '谁言寸草心，', '报得三春晖。'],
        desc: '妈妈的爱温暖伟大'
    }
];

// 成语故事
const IDIOM_LIST = [
    { name: '画蛇添足', pinyin: 'huà shé tiān zú', meaning: '做了多余的事，反而不好', story: '从前有个人画蛇比赛赢了，他又给蛇添上脚，结果输了。' },
    { name: '守株待兔', pinyin: 'shǒu zhū dài tù', meaning: '不主动努力，只想等好运', story: '一个农夫偶然捡到撞树桩的兔子，就天天等兔子来撞树，结果田地荒了。' },
    { name: '刻舟求剑', pinyin: 'kè zhōu qiú jiàn', meaning: '做事不懂变通', story: '一个人坐船时剑掉水里了，他在船上刻记号，等船停了再按记号找剑，当然找不到了。' },
    { name: '亡羊补牢', pinyin: 'wáng yáng bǔ láo', meaning: '出了问题及时补救', story: '羊圈破了丢了羊，邻居劝他修补，他修好后羊再也没丢过。' },
    { name: '揠苗助长', pinyin: 'yà miáo zhù zhǎng', meaning: '急于求成反而坏事', story: '一个农夫嫌禾苗长得慢，就把苗拔高，结果苗都枯死了。' },
    { name: '掩耳盗铃', pinyin: 'yǎn ěr dào líng', meaning: '自欺欺人', story: '一个人偷铃铛怕别人听见，就捂住自己耳朵，结果还是被抓了。' },
    { name: '井底之蛙', pinyin: 'jǐng dǐ zhī wā', meaning: '见识短浅', story: '井里的青蛙以为天只有井口那么大，后来才知道天很大很大。' },
    { name: '狐假虎威', pinyin: 'hú jiǎ hǔ wēi', meaning: '借别人的势力欺负人', story: '狐狸被老虎抓住后，骗老虎说自己是天帝派来的，带着老虎在森林走，动物们都吓跑了。' }
];
