// src/data/scripts/cn.js
export const tones = {
  first: { mark: '¯', name: 'High Level', description: 'High and flat' },
  second: { mark: '´', name: 'Rising', description: 'Starts mid, rises to high' },
  third: { mark: 'ˇ', name: 'Dipping', description: 'Starts mid, dips low, rises' },
  fourth: { mark: '`', name: 'Falling', description: 'Starts high, falls sharply' },
  neutral: { mark: '', name: 'Neutral', description: 'Light and short' }
};

export const pinyinVowels = {
  a: { first: 'ā', second: 'á', third: 'ǎ', fourth: 'à' },
  e: { first: 'ē', second: 'é', third: 'ě', fourth: 'è' },
  i: { first: 'ī', second: 'í', third: 'ǐ', fourth: 'ì' },
  o: { first: 'ō', second: 'ó', third: 'ǒ', fourth: 'ò' },
  u: { first: 'ū', second: 'ú', third: 'ǔ', fourth: 'ù' },
  ü: { first: 'ǖ', second: 'ǘ', third: 'ǚ', fourth: 'ǜ' }
};

export const commonRadicals = [
  { radical: '人', pinyin: 'rén', meaning: 'person', variants: ['亻'] },
  { radical: '口', pinyin: 'kǒu', meaning: 'mouth' },
  { radical: '手', pinyin: 'shǒu', meaning: 'hand', variants: ['扌'] },
  { radical: '水', pinyin: 'shuǐ', meaning: 'water', variants: ['氵'] },
  { radical: '心', pinyin: 'xīn', meaning: 'heart', variants: ['忄', '㣺'] },
  { radical: '木', pinyin: 'mù', meaning: 'tree/wood' },
  { radical: '日', pinyin: 'rì', meaning: 'sun/day' },
  { radical: '月', pinyin: 'yuè', meaning: 'moon/month' },
  { radical: '火', pinyin: 'huǒ', meaning: 'fire', variants: ['灬'] },
  { radical: '土', pinyin: 'tǔ', meaning: 'earth/soil' }
];

export const commonCharacters = {
  numbers: [
    { hanzi: '一', pinyin: 'yī', meaning: 'one' },
    { hanzi: '二', pinyin: 'èr', meaning: 'two' },
    { hanzi: '三', pinyin: 'sān', meaning: 'three' },
    { hanzi: '四', pinyin: 'sì', meaning: 'four' },
    { hanzi: '五', pinyin: 'wǔ', meaning: 'five' },
    { hanzi: '六', pinyin: 'liù', meaning: 'six' },
    { hanzi: '七', pinyin: 'qī', meaning: 'seven' },
    { hanzi: '八', pinyin: 'bā', meaning: 'eight' },
    { hanzi: '九', pinyin: 'jiǔ', meaning: 'nine' },
    { hanzi: '十', pinyin: 'shí', meaning: 'ten' }
  ],
  basics: [
    { hanzi: '人', pinyin: 'rén', meaning: 'person' },
    { hanzi: '大', pinyin: 'dà', meaning: 'big' },
    { hanzi: '小', pinyin: 'xiǎo', meaning: 'small' },
    { hanzi: '好', pinyin: 'hǎo', meaning: 'good' },
    { hanzi: '我', pinyin: 'wǒ', meaning: 'I/me' },
    { hanzi: '你', pinyin: 'nǐ', meaning: 'you' },
    { hanzi: '他', pinyin: 'tā', meaning: 'he/him' },
    { hanzi: '她', pinyin: 'tā', meaning: 'she/her' },
    { hanzi: '们', pinyin: 'men', meaning: 'plural marker' },
    { hanzi: '的', pinyin: 'de', meaning: 'possessive particle' }
  ]
};

export const measureWords = [
  { mw: '个', pinyin: 'gè', usage: 'general measure word' },
  { mw: '只', pinyin: 'zhī', usage: 'animals, some objects' },
  { mw: '本', pinyin: 'běn', usage: 'books' },
  { mw: '张', pinyin: 'zhāng', usage: 'flat objects' },
  { mw: '条', pinyin: 'tiáo', usage: 'long, thin objects' },
  { mw: '件', pinyin: 'jiàn', usage: 'clothing, matters' },
  { mw: '杯', pinyin: 'bēi', usage: 'cups of' },
  { mw: '瓶', pinyin: 'píng', usage: 'bottles of' },
  { mw: '辆', pinyin: 'liàng', usage: 'vehicles' },
  { mw: '位', pinyin: 'wèi', usage: 'people (polite)' }
];

export const isHanzi = (char) => {
  return /[\u4E00-\u9FFF]/.test(char);
};

export const hasTone = (pinyin) => {
  const toneMarks = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
  return toneMarks.test(pinyin);
};

export const getToneNumber = (pinyin) => {
  if (/[āēīōūǖ]/.test(pinyin)) return 1;
  if (/[áéíóúǘ]/.test(pinyin)) return 2;
  if (/[ǎěǐǒǔǚ]/.test(pinyin)) return 3;
  if (/[àèìòùǜ]/.test(pinyin)) return 4;
  return 0;
};

export const strokeOrder = {
  basic: [
    'horizontal (一)',
    'vertical (丨)',
    'left-falling (丿)',
    'right-falling (丶)',
    'rising (㇀)',
    'dot (、)',
    'hook (亅)'
  ],
  rules: [
    'Top to bottom',
    'Left to right',
    'Horizontal before vertical',
    'Outside before inside',
    'Middle before sides',
    'Enclosures last'
  ]
};