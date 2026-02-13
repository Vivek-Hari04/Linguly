// src/data/scripts/jp.js
export const hiraganaChart = {
  a: ['あ', 'い', 'う', 'え', 'お'],
  ka: ['か', 'き', 'く', 'け', 'こ'],
  sa: ['さ', 'し', 'す', 'せ', 'そ'],
  ta: ['た', 'ち', 'つ', 'て', 'と'],
  na: ['な', 'に', 'ぬ', 'ね', 'の'],
  ha: ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ma: ['ま', 'み', 'む', 'め', 'も'],
  ya: ['や', '', 'ゆ', '', 'よ'],
  ra: ['ら', 'り', 'る', 'れ', 'ろ'],
  wa: ['わ', '', '', '', 'を'],
  n: ['ん']
};

export const katakanaChart = {
  a: ['ア', 'イ', 'ウ', 'エ', 'オ'],
  ka: ['カ', 'キ', 'ク', 'ケ', 'コ'],
  sa: ['サ', 'シ', 'ス', 'セ', 'ソ'],
  ta: ['タ', 'チ', 'ツ', 'テ', 'ト'],
  na: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
  ha: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
  ma: ['マ', 'ミ', 'ム', 'メ', 'モ'],
  ya: ['ヤ', '', 'ユ', '', 'ヨ'],
  ra: ['ラ', 'リ', 'ル', 'レ', 'ロ'],
  wa: ['ワ', '', '', '', 'ヲ'],
  n: ['ン']
};

export const commonKanji = {
  numbers: [
    { kanji: '一', reading: 'いち', meaning: 'one' },
    { kanji: '二', reading: 'に', meaning: 'two' },
    { kanji: '三', reading: 'さん', meaning: 'three' },
    { kanji: '四', reading: 'し/よん', meaning: 'four' },
    { kanji: '五', reading: 'ご', meaning: 'five' },
    { kanji: '六', reading: 'ろく', meaning: 'six' },
    { kanji: '七', reading: 'しち/なな', meaning: 'seven' },
    { kanji: '八', reading: 'はち', meaning: 'eight' },
    { kanji: '九', reading: 'きゅう/く', meaning: 'nine' },
    { kanji: '十', reading: 'じゅう', meaning: 'ten' }
  ],
  basics: [
    { kanji: '人', reading: 'ひと/じん', meaning: 'person' },
    { kanji: '日', reading: 'ひ/にち', meaning: 'day/sun' },
    { kanji: '月', reading: 'つき/げつ', meaning: 'month/moon' },
    { kanji: '火', reading: 'ひ/か', meaning: 'fire' },
    { kanji: '水', reading: 'みず/すい', meaning: 'water' },
    { kanji: '木', reading: 'き/もく', meaning: 'tree/wood' },
    { kanji: '金', reading: 'かね/きん', meaning: 'gold/money' },
    { kanji: '土', reading: 'つち/ど', meaning: 'earth/soil' },
    { kanji: '本', reading: 'ほん', meaning: 'book/origin' },
    { kanji: '山', reading: 'やま/さん', meaning: 'mountain' }
  ]
};

export const isHiragana = (char) => {
  return /[\u3040-\u309F]/.test(char);
};

export const isKatakana = (char) => {
  return /[\u30A0-\u30FF]/.test(char);
};

export const isKanji = (char) => {
  return /[\u4E00-\u9FAF]/.test(char);
};

export const getScriptType = (text) => {
  let hasHiragana = false;
  let hasKatakana = false;
  let hasKanji = false;

  for (const char of text) {
    if (isHiragana(char)) hasHiragana = true;
    if (isKatakana(char)) hasKatakana = true;
    if (isKanji(char)) hasKanji = true;
  }

  return { hasHiragana, hasKatakana, hasKanji };
};

export const romajiToHiragana = {
  'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
  'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
  'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
  'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
  'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
  'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
  'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
  'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
  'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
  'wa': 'わ', 'wo': 'を', 'n': 'ん'
};

export const romajiToKatakana = {
  'a': 'ア', 'i': 'イ', 'u': 'ウ', 'e': 'エ', 'o': 'オ',
  'ka': 'カ', 'ki': 'キ', 'ku': 'ク', 'ke': 'ケ', 'ko': 'コ',
  'sa': 'サ', 'shi': 'シ', 'su': 'ス', 'se': 'セ', 'so': 'ソ',
  'ta': 'タ', 'chi': 'チ', 'tsu': 'ツ', 'te': 'テ', 'to': 'ト',
  'na': 'ナ', 'ni': 'ニ', 'nu': 'ヌ', 'ne': 'ネ', 'no': 'ノ',
  'ha': 'ハ', 'hi': 'ヒ', 'fu': 'フ', 'he': 'ヘ', 'ho': 'ホ',
  'ma': 'マ', 'mi': 'ミ', 'mu': 'ム', 'me': 'メ', 'mo': 'モ',
  'ya': 'ヤ', 'yu': 'ユ', 'yo': 'ヨ',
  'ra': 'ラ', 'ri': 'リ', 'ru': 'ル', 're': 'レ', 'ro': 'ロ',
  'wa': 'ワ', 'wo': 'ヲ', 'n': 'ン'
};