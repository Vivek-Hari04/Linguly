// src/utils/languageRules.js
export const getLanguageRules = (languageCode) => {
  const rules = {
    es: {
      hasGender: true,
      hasArticles: true,
      hasCases: false,
      hasScript: false,
      wordOrder: 'SVO',
      formalityLevels: ['informal', 'formal'],
      genders: ['masculine', 'feminine'],
      articles: {
        definite: { masculine: 'el', feminine: 'la', plural_m: 'los', plural_f: 'las' },
        indefinite: { masculine: 'un', feminine: 'una', plural_m: 'unos', plural_f: 'unas' }
      }
    },
    fr: {
      hasGender: true,
      hasArticles: true,
      hasCases: false,
      hasScript: false,
      wordOrder: 'SVO',
      formalityLevels: ['tu', 'vous'],
      genders: ['masculine', 'feminine'],
      articles: {
        definite: { masculine: 'le', feminine: 'la', plural: 'les' },
        indefinite: { masculine: 'un', feminine: 'une', plural: 'des' }
      }
    },
    de: {
      hasGender: true,
      hasArticles: true,
      hasCases: true,
      hasScript: false,
      wordOrder: 'SOV',
      formalityLevels: ['du', 'Sie'],
      genders: ['masculine', 'feminine', 'neuter'],
      cases: ['nominative', 'accusative', 'dative', 'genitive'],
      articles: {
        definite: { masculine: 'der', feminine: 'die', neuter: 'das', plural: 'die' },
        indefinite: { masculine: 'ein', feminine: 'eine', neuter: 'ein' }
      }
    },
    it: {
      hasGender: true,
      hasArticles: true,
      hasCases: false,
      hasScript: false,
      wordOrder: 'SVO',
      formalityLevels: ['tu', 'Lei'],
      genders: ['masculine', 'feminine'],
      articles: {
        definite: { masculine: 'il', feminine: 'la', plural_m: 'i', plural_f: 'le' },
        indefinite: { masculine: 'un', feminine: 'una' }
      }
    },
    jp: {
      hasGender: false,
      hasArticles: false,
      hasCases: true,
      hasScript: true,
      scriptTypes: ['hiragana', 'katakana', 'kanji'],
      wordOrder: 'SOV',
      formalityLevels: ['casual', 'polite', 'honorific'],
      particles: ['は', 'が', 'を', 'に', 'で', 'へ', 'の', 'と', 'や', 'か']
    },
    cn: {
      hasGender: false,
      hasArticles: false,
      hasCases: false,
      hasScript: true,
      scriptTypes: ['simplified', 'traditional'],
      wordOrder: 'SVO',
      tones: 4,
      formalityLevels: ['informal', 'formal'],
      measureWords: true
    }
  };

  return rules[languageCode] || {};
};

export const getPronunciationRules = (languageCode) => {
  const rules = {
    es: {
      stressRules: true,
      accentMarks: ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'],
      specialSounds: {
        'j': 'like h in "hello"',
        'rr': 'rolled r',
        'ñ': 'ny sound',
        'll': 'y sound in most dialects'
      }
    },
    fr: {
      nasalVowels: true,
      liaisonRules: true,
      silentLetters: true,
      accentMarks: ['é', 'è', 'ê', 'à', 'ù', 'ç', 'ï', 'ô'],
      specialSounds: {
        'r': 'guttural r',
        'u': 'round lips',
        'on': 'nasal sound',
        'an': 'nasal sound'
      }
    },
    de: {
      umlautRules: true,
      accentMarks: ['ä', 'ö', 'ü', 'ß'],
      specialSounds: {
        'ch': 'varies by position',
        'sch': 'sh sound',
        'ei': 'sounds like "eye"',
        'ie': 'sounds like "ee"'
      }
    },
    it: {
      doubleConsonants: true,
      accentMarks: ['à', 'è', 'é', 'ì', 'ò', 'ù'],
      specialSounds: {
        'gn': 'ny sound',
        'gli': 'ly sound',
        'sc': 'sh before e/i',
        'z': 'ts or dz sound'
      }
    },
    jp: {
      pitchAccent: true,
      longVowels: true,
      specialSounds: {
        'r': 'between r and l',
        'tsu': 'difficult for English speakers',
        'fu': 'between f and h',
        'n': 'moraic nasal'
      },
      mora: true
    },
    cn: {
      tones: true,
      toneCount: 4,
      toneSandhi: true,
      specialSounds: {
        'x': 'like sh with tongue forward',
        'q': 'like ch with tongue forward',
        'zh': 'like j',
        'r': 'like French r'
      },
      pinyinRequired: true
    }
  };

  return rules[languageCode] || {};
};

export const validateWord = (word, languageCode) => {
  const rules = getLanguageRules(languageCode);
  
  if (!word || typeof word !== 'string') {
    return { valid: false, error: 'Invalid word format' };
  }

  if (languageCode === 'jp') {
    const hasHiragana = /[\u3040-\u309F]/.test(word);
    const hasKatakana = /[\u30A0-\u30FF]/.test(word);
    const hasKanji = /[\u4E00-\u9FAF]/.test(word);
    
    if (!hasHiragana && !hasKatakana && !hasKanji) {
      return { valid: false, error: 'Must contain Japanese characters' };
    }
  }

  if (languageCode === 'cn') {
    const hasHanzi = /[\u4E00-\u9FFF]/.test(word);
    
    if (!hasHanzi) {
      return { valid: false, error: 'Must contain Chinese characters' };
    }
  }

  return { valid: true };
};

export const getCommonPatterns = (languageCode) => {
  const patterns = {
    es: {
      verbs: {
        ar: ['hablar', 'estudiar', 'trabajar'],
        er: ['comer', 'beber', 'leer'],
        ir: ['vivir', 'escribir', 'abrir']
      },
      questionWords: ['qué', 'quién', 'dónde', 'cuándo', 'por qué', 'cómo', 'cuánto']
    },
    fr: {
      verbs: {
        er: ['parler', 'étudier', 'travailler'],
        ir: ['finir', 'choisir', 'réussir'],
        re: ['vendre', 'attendre', 'répondre']
      },
      questionWords: ['qui', 'que', 'quoi', 'où', 'quand', 'pourquoi', 'comment', 'combien']
    },
    de: {
      verbs: {
        en: ['sprechen', 'lernen', 'arbeiten'],
        separable: ['aufstehen', 'anrufen', 'einkaufen']
      },
      questionWords: ['wer', 'was', 'wo', 'wann', 'warum', 'wie', 'wie viel']
    },
    it: {
      verbs: {
        are: ['parlare', 'studiare', 'lavorare'],
        ere: ['credere', 'vendere', 'leggere'],
        ire: ['dormire', 'partire', 'finire']
      },
      questionWords: ['chi', 'che', 'cosa', 'dove', 'quando', 'perché', 'come', 'quanto']
    },
    jp: {
      particles: {
        topic: 'は',
        subject: 'が',
        object: 'を',
        location: 'に/で',
        direction: 'へ',
        possessive: 'の'
      },
      questionWords: ['何', '誰', 'どこ', 'いつ', 'なぜ', 'どう', 'いくつ']
    },
    cn: {
      particles: {
        aspectual: ['了', '过', '着'],
        structural: ['的', '地', '得']
      },
      questionWords: ['什么', '谁', '哪里', '什么时候', '为什么', '怎么', '多少']
    }
  };

  return patterns[languageCode] || {};
};