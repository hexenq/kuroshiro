const KATAKANA_HIRAGANA_SHIFT = "\u3041".charCodeAt(0) - "\u30a1".charCodeAt(0);
const HIRAGANA_KATAKANA_SHIFT = "\u30a1".charCodeAt(0) - "\u3041".charCodeAt(0);
const ROMANIZATION_SYSTEM = {
    NIPPON: "nippon",
    PASSPORT: "passport",
    HEPBURN: "hepburn"
};

/**
 * Check if given char is a hiragana
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a hiragana
 */
const isHiragana = function (ch) {
    ch = ch[0];
    return ch >= "\u3040" && ch <= "\u309f";
};

/**
 * Check if given char is a katakana
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a katakana
 */
const isKatakana = function (ch) {
    ch = ch[0];
    return ch >= "\u30a0" && ch <= "\u30ff";
};

/**
 * Check if given char is a kana
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a kana
 */
const isKana = function (ch) {
    return isHiragana(ch) || isKatakana(ch);
};

/**
 * Check if given char is a kanji
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a kanji
 */
const isKanji = function (ch) {
    ch = ch[0];
    return (ch >= "\u4e00" && ch <= "\u9fcf") ||
        (ch >= "\uf900" && ch <= "\ufaff") ||
        (ch >= "\u3400" && ch <= "\u4dbf");
};

/**
 * Check if given char is a Japanese
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a Japanese
 */
const isJapanese = function (ch) {
    return isKana(ch) || isKanji(ch);
};

/**
 * Check if given string has hiragana
 *
 * @param {string} str Given string
 * @return {boolean} if given string has hiragana
 */
const hasHiragana = function (str) {
    for (let i = 0; i < str.length; i++) {
        if (isHiragana(str[i])) return true;
    }
    return false;
};

/**
 * Check if given string has katakana
 *
 * @param {string} str Given string
 * @return {boolean} if given string has katakana
 */
const hasKatakana = function (str) {
    for (let i = 0; i < str.length; i++) {
        if (isKatakana(str[i])) return true;
    }
    return false;
};

/**
 * Check if given string has kana
 *
 * @param {string} str Given string
 * @return {boolean} if given string has kana
 */
const hasKana = function (str) {
    for (let i = 0; i < str.length; i++) {
        if (isKana(str[i])) return true;
    }
    return false;
};

/**
 * Check if given string has kanji
 *
 * @param {string} str Given string
 * @return {boolean} if given string has kanji
 */
const hasKanji = function (str) {
    for (let i = 0; i < str.length; i++) {
        if (isKanji(str[i])) return true;
    }
    return false;
};

/**
 * Check if given string has Japanese
 *
 * @param {string} str Given string
 * @return {boolean} if given string has Japanese
 */
const hasJapanese = function (str) {
    for (let i = 0; i < str.length; i++) {
        if (isJapanese(str[i])) return true;
    }
    return false;
};

/**
 * Convert kana to hiragana
 *
 * @param {string} str Given string
 * @return {string} Hiragana string
 */
const toRawHiragana = function (str) {
    return [...str].map((ch) => {
        if (ch > "\u30a0" && ch < "\u30f7") {
            return String.fromCharCode(ch.charCodeAt(0) + KATAKANA_HIRAGANA_SHIFT);
        }
        return ch;
    }).join("");
};

/**
 * Convert kana to katakana
 *
 * @param {string} str Given string
 * @return {string} Katakana string
 */
const toRawKatakana = function (str) {
    return [...str].map((ch) => {
        if (ch > "\u3040" && ch < "\u3097") {
            return String.fromCharCode(ch.charCodeAt(0) + HIRAGANA_KATAKANA_SHIFT);
        }
        return ch;
    }).join("");
};

/**
 * Convert kana to romaji
 *
 * @param {string} str Given string
 * @param {string} system To which romanization system the given string is converted
 * @return {string} Romaji string
 */
const toRawRomaji = function (str, system) {
    system = system || ROMANIZATION_SYSTEM.HEPBURN;

    const romajiSystem = {
        nippon: {
            // 数字と記号
            "１": "1",
            "２": "2",
            "３": "3",
            "４": "4",
            "５": "5",
            "６": "6",
            "７": "7",
            "８": "8",
            "９": "9",
            "０": "0",
            "！": "!",
            "“": "\"",
            "”": "\"",
            "＃": "#",
            "＄": "$",
            "％": "%",
            "＆": "&",
            "’": "'",
            "（": "(",
            "）": ")",
            "＝": "=",
            "～": "~",
            "｜": "|",
            "＠": "@",
            "‘": "`",
            "＋": "+",
            "＊": "*",
            "；": ";",
            "：": ":",
            "＜": "<",
            "＞": ">",
            "、": ",",
            "。": ".",
            "／": "/",
            "？": "?",
            "＿": "_",
            "・": "･",
            "「": "\"",
            "」": "\"",
            "｛": "{",
            "｝": "}",
            "￥": "\\",
            "＾": "^",

            // 直音-清音(ア～ノ)
            あ: "a",
            い: "i",
            う: "u",
            え: "e",
            お: "o",
            ア: "a",
            イ: "i",
            ウ: "u",
            エ: "e",
            オ: "o",

            か: "ka",
            き: "ki",
            く: "ku",
            け: "ke",
            こ: "ko",
            カ: "ka",
            キ: "ki",
            ク: "ku",
            ケ: "ke",
            コ: "ko",

            さ: "sa",
            し: "si",
            す: "su",
            せ: "se",
            そ: "so",
            サ: "sa",
            シ: "si",
            ス: "su",
            セ: "se",
            ソ: "so",

            た: "ta",
            ち: "ti",
            つ: "tu",
            て: "te",
            と: "to",
            タ: "ta",
            チ: "ti",
            ツ: "tu",
            テ: "te",
            ト: "to",

            な: "na",
            に: "ni",
            ぬ: "nu",
            ね: "ne",
            の: "no",
            ナ: "na",
            ニ: "ni",
            ヌ: "nu",
            ネ: "ne",
            ノ: "no",

            // 直音-清音(ハ～ヲ)
            は: "ha",
            ひ: "hi",
            ふ: "hu",
            へ: "he",
            ほ: "ho",
            ハ: "ha",
            ヒ: "hi",
            フ: "hu",
            ヘ: "he",
            ホ: "ho",

            ま: "ma",
            み: "mi",
            む: "mu",
            め: "me",
            も: "mo",
            マ: "ma",
            ミ: "mi",
            ム: "mu",
            メ: "me",
            モ: "mo",

            や: "ya",
            ゆ: "yu",
            よ: "yo",
            ヤ: "ya",
            ユ: "yu",
            ヨ: "yo",

            ら: "ra",
            り: "ri",
            る: "ru",
            れ: "re",
            ろ: "ro",
            ラ: "ra",
            リ: "ri",
            ル: "ru",
            レ: "re",
            ロ: "ro",

            わ: "wa",
            ゐ: "wi",
            ゑ: "we",
            を: "wo",
            ワ: "wa",
            ヰ: "wi",
            ヱ: "we",
            ヲ: "wo",

            // 直音-濁音(ガ～ボ)、半濁音(パ～ポ)
            が: "ga",
            ぎ: "gi",
            ぐ: "gu",
            げ: "ge",
            ご: "go",
            ガ: "ga",
            ギ: "gi",
            グ: "gu",
            ゲ: "ge",
            ゴ: "go",

            ざ: "za",
            じ: "zi",
            ず: "zu",
            ぜ: "ze",
            ぞ: "zo",
            ザ: "za",
            ジ: "zi",
            ズ: "zu",
            ゼ: "ze",
            ゾ: "zo",

            だ: "da",
            ぢ: "di",
            づ: "du",
            で: "de",
            ど: "do",
            ダ: "da",
            ヂ: "di",
            ヅ: "du",
            デ: "de",
            ド: "do",

            ば: "ba",
            び: "bi",
            ぶ: "bu",
            べ: "be",
            ぼ: "bo",
            バ: "ba",
            ビ: "bi",
            ブ: "bu",
            ベ: "be",
            ボ: "bo",

            ぱ: "pa",
            ぴ: "pi",
            ぷ: "pu",
            ぺ: "pe",
            ぽ: "po",
            パ: "pa",
            ピ: "pi",
            プ: "pu",
            ペ: "pe",
            ポ: "po",

            // 拗音-清音(キャ～リョ)
            きゃ: "kya",
            きゅ: "kyu",
            きょ: "kyo",
            しゃ: "sya",
            しゅ: "syu",
            しょ: "syo",
            ちゃ: "tya",
            ちゅ: "tyu",
            ちょ: "tyo",
            にゃ: "nya",
            にゅ: "nyu",
            にょ: "nyo",
            ひゃ: "hya",
            ひゅ: "hyu",
            ひょ: "hyo",
            みゃ: "mya",
            みゅ: "myu",
            みょ: "myo",
            りゃ: "rya",
            りゅ: "ryu",
            りょ: "ryo",
            キャ: "kya",
            キュ: "kyu",
            キョ: "kyo",
            シャ: "sya",
            シュ: "syu",
            ショ: "syo",
            チャ: "tya",
            チュ: "tyu",
            チョ: "tyo",
            ニャ: "nya",
            ニュ: "nyu",
            ニョ: "nyo",
            ヒャ: "hya",
            ヒュ: "hyu",
            ヒョ: "hyo",
            ミャ: "mya",
            ミュ: "myu",
            ミョ: "myo",
            リャ: "rya",
            リュ: "ryu",
            リョ: "ryo",

            // 拗音-濁音(ギャ～ビョ)、半濁音(ピャ～ピョ)、合拗音(クヮ、グヮ)
            ぎゃ: "gya",
            ぎゅ: "gyu",
            ぎょ: "gyo",
            じゃ: "zya",
            じゅ: "zyu",
            じょ: "zyo",
            ぢゃ: "dya",
            ぢゅ: "dyu",
            ぢょ: "dyo",
            びゃ: "bya",
            びゅ: "byu",
            びょ: "byo",
            ぴゃ: "pya",
            ぴゅ: "pyu",
            ぴょ: "pyo",
            くゎ: "kwa",
            ぐゎ: "gwa",
            ギャ: "gya",
            ギュ: "gyu",
            ギョ: "gyo",
            ジャ: "zya",
            ジュ: "zyu",
            ジョ: "zyo",
            ヂャ: "dya",
            ヂュ: "dyu",
            ヂョ: "dyo",
            ビャ: "bya",
            ビュ: "byu",
            ビョ: "byo",
            ピャ: "pya",
            ピュ: "pyu",
            ピョ: "pyo",
            クヮ: "kwa",
            グヮ: "gwa",

            // 小書きの仮名、符号
            ぁ: "a",
            ぃ: "i",
            ぅ: "u",
            ぇ: "e",
            ぉ: "o",
            ゃ: "ya",
            ゅ: "yu",
            ょ: "yo",
            ゎ: "wa",
            ァ: "a",
            ィ: "i",
            ゥ: "u",
            ェ: "e",
            ォ: "o",
            ャ: "ya",
            ュ: "yu",
            ョ: "yo",
            ヮ: "wa",
            ヵ: "ka",
            ヶ: "ke",
            ん: "n",
            ン: "n",
            // ー: "",
            "　": " ",

            // 外来音(イェ～グォ)
            いぇ: "ye",
            // うぃ: "",
            // うぇ: "",
            // うぉ: "",
            きぇ: "kye",
            // くぁ: "",
            くぃ: "kwi",
            くぇ: "kwe",
            くぉ: "kwo",
            // ぐぁ: "",
            ぐぃ: "gwi",
            ぐぇ: "gwe",
            ぐぉ: "gwo",
            イェ: "ye",
            // ウィ: "",
            // ウェ: "",
            // ウォ: "",
            // ヴ: "",
            // ヴァ: "",
            // ヴィ: "",
            // ヴェ: "",
            // ヴォ: "",
            // ヴュ: "",
            // ヴョ: "",
            キェ: "kya",
            // クァ: "",
            クィ: "kwi",
            クェ: "kwe",
            クォ: "kwo",
            // グァ: "",
            グィ: "gwi",
            グェ: "gwe",
            グォ: "gwo",

            // 外来音(シェ～フョ)
            しぇ: "sye",
            じぇ: "zye",
            すぃ: "swi",
            ずぃ: "zwi",
            ちぇ: "tye",
            つぁ: "twa",
            つぃ: "twi",
            つぇ: "twe",
            つぉ: "two",
            // てぃ: "ti",
            // てゅ: "tyu",
            // でぃ: "di",
            // でゅ: "dyu",
            // とぅ: "tu",
            // どぅ: "du",
            にぇ: "nye",
            ひぇ: "hye",
            ふぁ: "hwa",
            ふぃ: "hwi",
            ふぇ: "hwe",
            ふぉ: "hwo",
            ふゅ: "hwyu",
            ふょ: "hwyo",
            シェ: "sye",
            ジェ: "zye",
            スィ: "swi",
            ズィ: "zwi",
            チェ: "tye",
            ツァ: "twa",
            ツィ: "twi",
            ツェ: "twe",
            ツォ: "two",
            // ティ: "ti",
            // テュ: "tyu",
            // ディ: "di",
            // デュ: "dyu",
            // トゥ: "tu",
            // ドゥ: "du",
            ニェ: "nye",
            ヒェ: "hye",
            ファ: "hwa",
            フィ: "hwi",
            フェ: "hwe",
            フォ: "hwo",
            フュ: "hwyu",
            フョ: "hwyo"
        },
        passport: {
            // 数字と記号
            "１": "1",
            "２": "2",
            "３": "3",
            "４": "4",
            "５": "5",
            "６": "6",
            "７": "7",
            "８": "8",
            "９": "9",
            "０": "0",
            "！": "!",
            "“": "\"",
            "”": "\"",
            "＃": "#",
            "＄": "$",
            "％": "%",
            "＆": "&",
            "’": "'",
            "（": "(",
            "）": ")",
            "＝": "=",
            "～": "~",
            "｜": "|",
            "＠": "@",
            "‘": "`",
            "＋": "+",
            "＊": "*",
            "；": ";",
            "：": ":",
            "＜": "<",
            "＞": ">",
            "、": ",",
            "。": ".",
            "／": "/",
            "？": "?",
            "＿": "_",
            "・": "･",
            "「": "\"",
            "」": "\"",
            "｛": "{",
            "｝": "}",
            "￥": "\\",
            "＾": "^",

            // 直音-清音(ア～ノ)
            あ: "a",
            い: "i",
            う: "u",
            え: "e",
            お: "o",
            ア: "a",
            イ: "i",
            ウ: "u",
            エ: "e",
            オ: "o",

            か: "ka",
            き: "ki",
            く: "ku",
            け: "ke",
            こ: "ko",
            カ: "ka",
            キ: "ki",
            ク: "ku",
            ケ: "ke",
            コ: "ko",

            さ: "sa",
            し: "shi",
            す: "su",
            せ: "se",
            そ: "so",
            サ: "sa",
            シ: "shi",
            ス: "su",
            セ: "se",
            ソ: "so",

            た: "ta",
            ち: "chi",
            つ: "tsu",
            て: "te",
            と: "to",
            タ: "ta",
            チ: "chi",
            ツ: "tsu",
            テ: "te",
            ト: "to",

            な: "na",
            に: "ni",
            ぬ: "nu",
            ね: "ne",
            の: "no",
            ナ: "na",
            ニ: "ni",
            ヌ: "nu",
            ネ: "ne",
            ノ: "no",

            // 直音-清音(ハ～ヲ)
            は: "ha",
            ひ: "hi",
            ふ: "fu",
            へ: "he",
            ほ: "ho",
            ハ: "ha",
            ヒ: "hi",
            フ: "fu",
            ヘ: "he",
            ホ: "ho",

            ま: "ma",
            み: "mi",
            む: "mu",
            め: "me",
            も: "mo",
            マ: "ma",
            ミ: "mi",
            ム: "mu",
            メ: "me",
            モ: "mo",

            や: "ya",
            ゆ: "yu",
            よ: "yo",
            ヤ: "ya",
            ユ: "yu",
            ヨ: "yo",

            ら: "ra",
            り: "ri",
            る: "ru",
            れ: "re",
            ろ: "ro",
            ラ: "ra",
            リ: "ri",
            ル: "ru",
            レ: "re",
            ロ: "ro",

            わ: "wa",
            ゐ: "i",
            ゑ: "e",
            を: "o",
            ワ: "wa",
            ヰ: "i",
            ヱ: "e",
            ヲ: "o",

            // 直音-濁音(ガ～ボ)、半濁音(パ～ポ)
            が: "ga",
            ぎ: "gi",
            ぐ: "gu",
            げ: "ge",
            ご: "go",
            ガ: "ga",
            ギ: "gi",
            グ: "gu",
            ゲ: "ge",
            ゴ: "go",

            ざ: "za",
            じ: "ji",
            ず: "zu",
            ぜ: "ze",
            ぞ: "zo",
            ザ: "za",
            ジ: "ji",
            ズ: "zu",
            ゼ: "ze",
            ゾ: "zo",

            だ: "da",
            ぢ: "ji",
            づ: "zu",
            で: "de",
            ど: "do",
            ダ: "da",
            ヂ: "ji",
            ヅ: "zu",
            デ: "de",
            ド: "do",

            ば: "ba",
            び: "bi",
            ぶ: "bu",
            べ: "be",
            ぼ: "bo",
            バ: "ba",
            ビ: "bi",
            ブ: "bu",
            ベ: "be",
            ボ: "bo",

            ぱ: "pa",
            ぴ: "pi",
            ぷ: "pu",
            ぺ: "pe",
            ぽ: "po",
            パ: "pa",
            ピ: "pi",
            プ: "pu",
            ペ: "pe",
            ポ: "po",

            // 拗音-清音(キャ～リョ)
            きゃ: "kya",
            きゅ: "kyu",
            きょ: "kyo",
            しゃ: "sha",
            しゅ: "shu",
            しょ: "sho",
            ちゃ: "cha",
            ちゅ: "chu",
            ちょ: "cho",
            にゃ: "nya",
            にゅ: "nyu",
            にょ: "nyo",
            ひゃ: "hya",
            ひゅ: "hyu",
            ひょ: "hyo",
            みゃ: "mya",
            みゅ: "myu",
            みょ: "myo",
            りゃ: "rya",
            りゅ: "ryu",
            りょ: "ryo",
            キャ: "kya",
            キュ: "kyu",
            キョ: "kyo",
            シャ: "sha",
            シュ: "shu",
            ショ: "sho",
            チャ: "cha",
            チュ: "chu",
            チョ: "cho",
            ニャ: "nya",
            ニュ: "nyu",
            ニョ: "nyo",
            ヒャ: "hya",
            ヒュ: "hyu",
            ヒョ: "hyo",
            ミャ: "mya",
            ミュ: "myu",
            ミョ: "myo",
            リャ: "rya",
            リュ: "ryu",
            リョ: "ryo",

            // 拗音-濁音(ギャ～ビョ)、半濁音(ピャ～ピョ)、合拗音(クヮ、グヮ)
            ぎゃ: "gya",
            ぎゅ: "gyu",
            ぎょ: "gyo",
            じゃ: "ja",
            じゅ: "ju",
            じょ: "jo",
            ぢゃ: "ja",
            ぢゅ: "ju",
            ぢょ: "jo",
            びゃ: "bya",
            びゅ: "byu",
            びょ: "byo",
            ぴゃ: "pya",
            ぴゅ: "pyu",
            ぴょ: "pyo",
            // くゎ: "",
            // ぐゎ: "",
            ギャ: "gya",
            ギュ: "gyu",
            ギョ: "gyo",
            ジャ: "ja",
            ジュ: "ju",
            ジョ: "jo",
            ヂャ: "ja",
            ヂュ: "ju",
            ヂョ: "jo",
            ビャ: "bya",
            ビュ: "byu",
            ビョ: "byo",
            ピャ: "pya",
            ピュ: "pyu",
            ピョ: "pyo",
            // クヮ: "",
            // グヮ: "",

            // 小書きの仮名、符号
            ぁ: "a",
            ぃ: "i",
            ぅ: "u",
            ぇ: "e",
            ぉ: "o",
            ゃ: "ya",
            ゅ: "yu",
            ょ: "yo",
            ゎ: "wa",
            ァ: "a",
            ィ: "i",
            ゥ: "u",
            ェ: "e",
            ォ: "o",
            ャ: "ya",
            ュ: "yu",
            ョ: "yo",
            ヮ: "wa",
            ヵ: "ka",
            ヶ: "ke",
            ん: "n",
            ン: "n",
            // ー: "",
            "　": " ",

            // 外来音(イェ～グォ)
            // いぇ: "",
            // うぃ: "",
            // うぇ: "",
            // うぉ: "",
            // きぇ: "",
            // くぁ: "",
            // くぃ: "",
            // くぇ: "",
            // くぉ: "",
            // ぐぁ: "",
            // ぐぃ: "",
            // ぐぇ: "",
            // ぐぉ: "",
            // イェ: "",
            // ウィ: "",
            // ウェ: "",
            // ウォ: "",
            ヴ: "b"
            // ヴァ: "",
            // ヴィ: "",
            // ヴェ: "",
            // ヴォ: "",
            // ヴュ: "",
            // ヴョ: "",
            // キェ: "",
            // クァ: "",
            // クィ: "",
            // クェ: "",
            // クォ: "",
            // グァ: "",
            // グィ: "",
            // グェ: "",
            // グォ: "",

            // 外来音(シェ～フョ)
            // しぇ: "",
            // じぇ: "",
            // すぃ: "",
            // ずぃ: "",
            // ちぇ: "",
            // つぁ: "",
            // つぃ: "",
            // つぇ: "",
            // つぉ: "",
            // てぃ: "",
            // てゅ: "",
            // でぃ: "",
            // でゅ: "",
            // とぅ: "",
            // どぅ: "",
            // にぇ: "",
            // ひぇ: "",
            // ふぁ: "",
            // ふぃ: "",
            // ふぇ: "",
            // ふぉ: "",
            // ふゅ: "",
            // ふょ: "",
            // シェ: "",
            // ジェ: "",
            // スィ: "",
            // ズィ: "",
            // チェ: "",
            // ツァ: "",
            // ツィ: "",
            // ツェ: "",
            // ツォ: "",
            // ティ: "",
            // テュ: "",
            // ディ: "",
            // デュ: "",
            // トゥ: "",
            // ドゥ: "",
            // ニェ: "",
            // ヒェ: "",
            // ファ: "",
            // フィ: "",
            // フェ: "",
            // フォ: "",
            // フュ: "",
            // フョ: ""
        },
        hepburn: {
            // 数字と記号
            "１": "1",
            "２": "2",
            "３": "3",
            "４": "4",
            "５": "5",
            "６": "6",
            "７": "7",
            "８": "8",
            "９": "9",
            "０": "0",
            "！": "!",
            "“": "\"",
            "”": "\"",
            "＃": "#",
            "＄": "$",
            "％": "%",
            "＆": "&",
            "’": "'",
            "（": "(",
            "）": ")",
            "＝": "=",
            "～": "~",
            "｜": "|",
            "＠": "@",
            "‘": "`",
            "＋": "+",
            "＊": "*",
            "；": ";",
            "：": ":",
            "＜": "<",
            "＞": ">",
            "、": ",",
            "。": ".",
            "／": "/",
            "？": "?",
            "＿": "_",
            "・": "･",
            "「": "\"",
            "」": "\"",
            "｛": "{",
            "｝": "}",
            "￥": "\\",
            "＾": "^",

            // 直音-清音(ア～ノ)
            あ: "a",
            い: "i",
            う: "u",
            え: "e",
            お: "o",
            ア: "a",
            イ: "i",
            ウ: "u",
            エ: "e",
            オ: "o",

            か: "ka",
            き: "ki",
            く: "ku",
            け: "ke",
            こ: "ko",
            カ: "ka",
            キ: "ki",
            ク: "ku",
            ケ: "ke",
            コ: "ko",

            さ: "sa",
            し: "shi",
            す: "su",
            せ: "se",
            そ: "so",
            サ: "sa",
            シ: "shi",
            ス: "su",
            セ: "se",
            ソ: "so",

            た: "ta",
            ち: "chi",
            つ: "tsu",
            て: "te",
            と: "to",
            タ: "ta",
            チ: "chi",
            ツ: "tsu",
            テ: "te",
            ト: "to",

            な: "na",
            に: "ni",
            ぬ: "nu",
            ね: "ne",
            の: "no",
            ナ: "na",
            ニ: "ni",
            ヌ: "nu",
            ネ: "ne",
            ノ: "no",

            // 直音-清音(ハ～ヲ)
            は: "ha",
            ひ: "hi",
            ふ: "fu",
            へ: "he",
            ほ: "ho",
            ハ: "ha",
            ヒ: "hi",
            フ: "fu",
            ヘ: "he",
            ホ: "ho",

            ま: "ma",
            み: "mi",
            む: "mu",
            め: "me",
            も: "mo",
            マ: "ma",
            ミ: "mi",
            ム: "mu",
            メ: "me",
            モ: "mo",

            や: "ya",
            ゆ: "yu",
            よ: "yo",
            ヤ: "ya",
            ユ: "yu",
            ヨ: "yo",

            ら: "ra",
            り: "ri",
            る: "ru",
            れ: "re",
            ろ: "ro",
            ラ: "ra",
            リ: "ri",
            ル: "ru",
            レ: "re",
            ロ: "ro",

            わ: "wa",
            ゐ: "i",
            ゑ: "e",
            を: "o",
            ワ: "wa",
            ヰ: "i",
            ヱ: "e",
            ヲ: "o",

            // 直音-濁音(ガ～ボ)、半濁音(パ～ポ)
            が: "ga",
            ぎ: "gi",
            ぐ: "gu",
            げ: "ge",
            ご: "go",
            ガ: "ga",
            ギ: "gi",
            グ: "gu",
            ゲ: "ge",
            ゴ: "go",

            ざ: "za",
            じ: "ji",
            ず: "zu",
            ぜ: "ze",
            ぞ: "zo",
            ザ: "za",
            ジ: "ji",
            ズ: "zu",
            ゼ: "ze",
            ゾ: "zo",

            だ: "da",
            ぢ: "ji",
            づ: "zu",
            で: "de",
            ど: "do",
            ダ: "da",
            ヂ: "ji",
            ヅ: "zu",
            デ: "de",
            ド: "do",

            ば: "ba",
            び: "bi",
            ぶ: "bu",
            べ: "be",
            ぼ: "bo",
            バ: "ba",
            ビ: "bi",
            ブ: "bu",
            ベ: "be",
            ボ: "bo",

            ぱ: "pa",
            ぴ: "pi",
            ぷ: "pu",
            ぺ: "pe",
            ぽ: "po",
            パ: "pa",
            ピ: "pi",
            プ: "pu",
            ペ: "pe",
            ポ: "po",

            // 拗音-清音(キャ～リョ)
            きゃ: "kya",
            きゅ: "kyu",
            きょ: "kyo",
            しゃ: "sha",
            しゅ: "shu",
            しょ: "sho",
            ちゃ: "cha",
            ちゅ: "chu",
            ちょ: "cho",
            にゃ: "nya",
            にゅ: "nyu",
            にょ: "nyo",
            ひゃ: "hya",
            ひゅ: "hyu",
            ひょ: "hyo",
            みゃ: "mya",
            みゅ: "myu",
            みょ: "myo",
            りゃ: "rya",
            りゅ: "ryu",
            りょ: "ryo",
            キャ: "kya",
            キュ: "kyu",
            キョ: "kyo",
            シャ: "sha",
            シュ: "shu",
            ショ: "sho",
            チャ: "cha",
            チュ: "chu",
            チョ: "cho",
            ニャ: "nya",
            ニュ: "nyu",
            ニョ: "nyo",
            ヒャ: "hya",
            ヒュ: "hyu",
            ヒョ: "hyo",
            ミャ: "mya",
            ミュ: "myu",
            ミョ: "myo",
            リャ: "rya",
            リュ: "ryu",
            リョ: "ryo",

            // 拗音-濁音(ギャ～ビョ)、半濁音(ピャ～ピョ)、合拗音(クヮ、グヮ)
            ぎゃ: "gya",
            ぎゅ: "gyu",
            ぎょ: "gyo",
            じゃ: "ja",
            じゅ: "ju",
            じょ: "jo",
            ぢゃ: "ja",
            ぢゅ: "ju",
            ぢょ: "jo",
            びゃ: "bya",
            びゅ: "byu",
            びょ: "byo",
            ぴゃ: "pya",
            ぴゅ: "pyu",
            ぴょ: "pyo",
            // くゎ: "",
            // ぐゎ: "",
            ギャ: "gya",
            ギュ: "gyu",
            ギョ: "gyo",
            ジャ: "ja",
            ジュ: "ju",
            ジョ: "jo",
            ヂャ: "ja",
            ヂュ: "ju",
            ヂョ: "jo",
            ビャ: "bya",
            ビュ: "byu",
            ビョ: "byo",
            ピャ: "pya",
            ピュ: "pyu",
            ピョ: "pyo",
            // クヮ: "",
            // グヮ: "",

            // 小書きの仮名、符号
            ぁ: "a",
            ぃ: "i",
            ぅ: "u",
            ぇ: "e",
            ぉ: "o",
            ゃ: "ya",
            ゅ: "yu",
            ょ: "yo",
            ゎ: "wa",
            ァ: "a",
            ィ: "i",
            ゥ: "u",
            ェ: "e",
            ォ: "o",
            ャ: "ya",
            ュ: "yu",
            ョ: "yo",
            ヮ: "wa",
            ヵ: "ka",
            ヶ: "ke",
            ん: "n",
            ン: "n",
            // ー: "",
            "　": " ",

            // 外来音(イェ～グォ)
            いぇ: "ye",
            うぃ: "wi",
            うぇ: "we",
            うぉ: "wo",
            きぇ: "kye",
            くぁ: "kwa",
            くぃ: "kwi",
            くぇ: "kwe",
            くぉ: "kwo",
            ぐぁ: "gwa",
            ぐぃ: "gwi",
            ぐぇ: "gwe",
            ぐぉ: "gwo",
            イェ: "ye",
            ウィ: "wi",
            ウェ: "we",
            ウォ: "wo",
            ヴ: "vu",
            ヴァ: "va",
            ヴィ: "vi",
            ヴェ: "ve",
            ヴォ: "vo",
            ヴュ: "vyu",
            ヴョ: "vyo",
            キェ: "kya",
            クァ: "kwa",
            クィ: "kwi",
            クェ: "kwe",
            クォ: "kwo",
            グァ: "gwa",
            グィ: "gwi",
            グェ: "gwe",
            グォ: "gwo",

            // 外来音(シェ～フョ)
            しぇ: "she",
            じぇ: "je",
            // すぃ: "",
            // ずぃ: "",
            ちぇ: "che",
            つぁ: "tsa",
            つぃ: "tsi",
            つぇ: "tse",
            つぉ: "tso",
            てぃ: "ti",
            てゅ: "tyu",
            でぃ: "di",
            でゅ: "dyu",
            とぅ: "tu",
            どぅ: "du",
            にぇ: "nye",
            ひぇ: "hye",
            ふぁ: "fa",
            ふぃ: "fi",
            ふぇ: "fe",
            ふぉ: "fo",
            ふゅ: "fyu",
            ふょ: "fyo",
            シェ: "she",
            ジェ: "je",
            // スィ: "",
            // ズィ: "",
            チェ: "che",
            ツァ: "tsa",
            ツィ: "tsi",
            ツェ: "tse",
            ツォ: "tso",
            ティ: "ti",
            テュ: "tyu",
            ディ: "di",
            デュ: "dyu",
            トゥ: "tu",
            ドゥ: "du",
            ニェ: "nye",
            ヒェ: "hye",
            ファ: "fa",
            フィ: "fi",
            フェ: "fe",
            フォ: "fo",
            フュ: "fyu",
            フョ: "fyo"
        }
    };

    const reg_tsu = /(っ|ッ)([bcdfghijklmnopqrstuvwyz])/gm;
    const reg_xtsu = /っ|ッ/gm;

    let pnt = 0;
    let ch;
    let r;
    let result = "";

    // [PASSPORT] 長音省略 「―」の場合
    if (system === ROMANIZATION_SYSTEM.PASSPORT) {
        str = str.replace(/ー/gm, "");
    }

    // [NIPPON|HEPBURN] 撥音の特殊表記 a、i、u、e、o、y
    if (system === ROMANIZATION_SYSTEM.NIPPON || system === ROMANIZATION_SYSTEM.HEPBURN) {
        const reg_hatu = new RegExp(/(ん|ン)(?=あ|い|う|え|お|ア|イ|ウ|エ|オ|ぁ|ぃ|ぅ|ぇ|ぉ|ァ|ィ|ゥ|ェ|ォ|や|ゆ|よ|ヤ|ユ|ヨ|ゃ|ゅ|ょ|ャ|ュ|ョ)/g);
        let match;
        const indices = [];
        while ((match = reg_hatu.exec(str)) !== null) {
            indices.push(match.index + 1);
        }
        if (indices.length !== 0) {
            let mStr = "";
            for (let i = 0; i < indices.length; i++) {
                if (i === 0) {
                    mStr += `${str.slice(0, indices[i])}'`;
                }
                else {
                    mStr += `${str.slice(indices[i - 1], indices[i])}'`;
                }
            }
            mStr += str.slice(indices[indices.length - 1]);
            str = mStr;
        }
    }

    // [ALL] kana to roman chars
    const max = str.length;
    while (pnt <= max) {
        if (r = romajiSystem[system][str.substring(pnt, pnt + 2)]) {
            result += r;
            pnt += 2;
        }
        else {
            result += (r = romajiSystem[system][ch = str.substring(pnt, pnt + 1)]) ? r : ch;
            pnt += 1;
        }
    }
    result = result.replace(reg_tsu, "$2$2");

    // [PASSPORT|HEPBURN] 子音を重ねて特殊表記
    if (system === ROMANIZATION_SYSTEM.PASSPORT || system === ROMANIZATION_SYSTEM.HEPBURN) {
        result = result.replace(/cc/gm, "tc");
    }

    result = result.replace(reg_xtsu, "tsu");

    // [PASSPORT|HEPBURN] 撥音の特殊表記 b、m、p
    if (system === ROMANIZATION_SYSTEM.PASSPORT || system === ROMANIZATION_SYSTEM.HEPBURN) {
        result = result.replace(/nm/gm, "mm");
        result = result.replace(/nb/gm, "mb");
        result = result.replace(/np/gm, "mp");
    }

    // [NIPPON] 長音変換
    if (system === ROMANIZATION_SYSTEM.NIPPON) {
        result = result.replace(/aー/gm, "â");
        result = result.replace(/iー/gm, "î");
        result = result.replace(/uー/gm, "û");
        result = result.replace(/eー/gm, "ê");
        result = result.replace(/oー/gm, "ô");
    }

    // [HEPBURN] 長音変換
    if (system === ROMANIZATION_SYSTEM.HEPBURN) {
        result = result.replace(/aー/gm, "ā");
        result = result.replace(/iー/gm, "ī");
        result = result.replace(/uー/gm, "ū");
        result = result.replace(/eー/gm, "ē");
        result = result.replace(/oー/gm, "ō");
    }

    return result;
};

/**
 * Get the type of given string
 *
 * @param {string} str Given string
 * @return {number} Type number. 0 for pure kanji, 1 for kanji-kana-mixed, 2 for pure kana, 3 for others
 */
const getStrType = function (str) {
    let hasKJ = false;
    let hasHK = false;
    for (let i = 0; i < str.length; i++) {
        if (isKanji(str[i])) {
            hasKJ = true;
        }
        else if (isHiragana(str[i]) || isKatakana(str[i])) {
            hasHK = true;
        }
    }
    if (hasKJ && hasHK) return 1;
    else if (hasKJ) return 0;
    else if (hasHK) return 2;
    return 3;
};

/**
 * Patch tokens for conversion
 * @param {Object} tokens Given tokens
 * @return {Object} Patched tokens
 */
const patchTokens = function (tokens) {
    // patch for token structure
    for (let cr = 0; cr < tokens.length; cr++) {
        if (hasJapanese(tokens[cr].surface_form)) {
            if (!tokens[cr].reading) {
                if (tokens[cr].surface_form.split("").every(isKana)) {
                    tokens[cr].reading = toRawKatakana(tokens[cr].surface_form);
                }
                else {
                    tokens[cr].reading = tokens[cr].surface_form;
                }
            }
            else if (hasHiragana(tokens[cr].reading)) {
                tokens[cr].reading = toRawKatakana(tokens[cr].reading);
            }
        }
        else {
            tokens[cr].reading = tokens[cr].surface_form;
        }
    }

    // patch for 助動詞"う" after 動詞
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].pos && tokens[i].pos === "助動詞" && (tokens[i].surface_form === "う" || tokens[i].surface_form === "ウ")) {
            if (i - 1 >= 0 && tokens[i - 1].pos && tokens[i - 1].pos === "動詞") {
                tokens[i - 1].surface_form += "う";
                if (tokens[i - 1].pronunciation) {
                    tokens[i - 1].pronunciation += "ー";
                }
                else {
                    tokens[i - 1].pronunciation = `${tokens[i - 1].reading}ー`;
                }
                tokens[i - 1].reading += "ウ";
                tokens.splice(i, 1);
                i--;
            }
        }
    }

    // patch for "っ" at the tail of 動詞、形容詞
    for (let j = 0; j < tokens.length; j++) {
        if (tokens[j].pos && (tokens[j].pos === "動詞" || tokens[j].pos === "形容詞") && tokens[j].surface_form.length > 1 && (tokens[j].surface_form[tokens[j].surface_form.length - 1] === "っ" || tokens[j].surface_form[tokens[j].surface_form.length - 1] === "ッ")) {
            if (j + 1 < tokens.length && tokens[j + 1].pos && (tokens[j + 1].pos === "動詞" || tokens[j + 1].pos === "助動詞")) {
                tokens[j].surface_form += tokens[j + 1].surface_form;
                if (tokens[j].pronunciation) {
                    tokens[j].pronunciation += tokens[j + 1].pronunciation;
                }
                else {
                    tokens[j].pronunciation = `${tokens[j].reading}${tokens[j + 1].reading}`;
                }
                tokens[j].reading += tokens[j + 1].reading;
                tokens.splice(j + 1, 1);
                j--;
            }
        }
    }

    return tokens;
};

/**
 * Convert kana to hiragana
 *
 * @param {string} str Given string
 * @return {string} Hiragana string
 */
const kanaToHiragna = function (str) {
    return toRawHiragana(str);
};

/**
 * Convert kana to katakana
 *
 * @param {string} str Given string
 * @return {string} Katakana string
 */
const kanaToKatakana = function (str) {
    return toRawKatakana(str);
};

/**
 * Convert kana to romaji
 *
 * @param {string} str Given string
 * @param {string} system To which romanization system the given string is converted. ["nippon"|"passport"|"hepburn"]
 * @return {string} Romaji string
 */
const kanaToRomaji = function (str, system) {
    return toRawRomaji(str, system);
};

export {
    // language
    ROMANIZATION_SYSTEM,
    getStrType,
    patchTokens,
    isHiragana,
    isKatakana,
    isKana,
    isKanji,
    isJapanese,
    hasHiragana,
    hasKatakana,
    hasKana,
    hasKanji,
    hasJapanese,
    toRawHiragana,
    toRawKatakana,
    toRawRomaji,
    kanaToHiragna,
    kanaToKatakana,
    kanaToRomaji
};
