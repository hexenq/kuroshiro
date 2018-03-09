const KATAKANA_HIRAGANA_SHIFT = "\u3041".charCodeAt(0) - "\u30a1".charCodeAt(0);
const HIRAGANA_KATAKANA_SHIFT = "\u30a1".charCodeAt(0) - "\u3041".charCodeAt(0);

/**
 * Check if given char is a hiragana
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a hiragana
 */
var isHiragana = function (ch) {
    ch = ch[0];
    return ch >= '\u3040' && ch <= '\u309f';
};

/**
 * Check if given char is a katakana
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a katakana
 */
var isKatakana = function (ch) {
    ch = ch[0];
    return ch >= '\u30a0' && ch <= '\u30ff';
};

/**
 * Check if given char is a kanji
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a kanji
 */
var isKanji = function (ch) {
    ch = ch[0];
    return (ch >= '\u4e00' && ch <= '\u9fcf') ||
        (ch >= '\uf900' && ch <= '\ufaff') ||
        (ch >= '\u3400' && ch <= '\u4dbf');
};

/**
 * Check if given string has hiragana
 *
 * @param {string} str Given string
 * @return {boolean} if given string has hiragana
 */
var hasHiragana = function (str) {
    for (var i = 0; i < str.length; i++) {
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
var hasKatakana = function (str) {
    for (var i = 0; i < str.length; i++) {
        if (isKatakana(str[i])) return true;
    }
    return false;
};

/**
 * Check if given string has kanji
 *
 * @param {string} str Given string
 * @return {boolean} if given string has kanji
 */
var hasKanji = function (str) {
    for (var i = 0; i < str.length; i++) {
        if (isKanji(str[i])) return true;
    }
    return false;
};

var toRawHiragana = function (str) {
    return [...str].map((ch) => {
        if (ch > "\u30a0" && ch < "\u30f7")
            return String.fromCharCode(ch.charCodeAt(0) + KATAKANA_HIRAGANA_SHIFT);
        else
            return ch;
    }).join("");
};

var toRawKatakana = function (str) {
    return [...str].map((ch) => {
        if (ch > "\u3040" && ch < "\u3097")
            return String.fromCharCode(ch.charCodeAt(0) + HIRAGANA_KATAKANA_SHIFT);
        else
            return ch;
    }).join("");
};

var toRawRomaji = function (str) {
    var roman = {

        '１': '1', '２': '2', '３': '3', '４': '4', '５': '5', '６': '6', '７': '7', '８': '8', '９': '9', '０': '0',
        '！': '!', '”': '"', '＃': '#', '＄': '$', '％': '%', '＆': '&', '’': "'", '（': '(', '）': ')', '＝': '=',
        '～': '~', '｜': '|', '＠': '@', '‘': '`', '＋': '+', '＊': '*', '；': ";", '：': ':', '＜': '<', '＞': '>',
        '、': ',', '。': '.', '／': '/', '？': '?', '＿': '_', '・': '･', '「': '[', '」': ']', '｛': '{', '｝': '}',
        '￥': '\\', '＾': '^',

        'ふぁ': 'fa', 'ふぃ': 'fi', 'ふぇ': 'fe', 'ふぉ': 'fo',
        'ファ': 'fa', 'フィ': 'fi', 'フェ': 'fe', 'フォ': 'fo',

        'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
        'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
        'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
        'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
        'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
        'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
        'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',

        'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
        'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
        'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
        'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
        'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
        'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
        'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',

        'ふゃ': 'fya', 'ふゅ': 'fyu', 'ふょ': 'fyo',
        'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
        'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
        'ぢゃ': 'dya', 'ぢゅ': 'dyu', 'ぢょ': 'dyo',
        'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
        'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',

        'フャ': 'fya', 'フュ': 'fyu', 'フョ': 'fyo',
        'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo',
        'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
        'ヂャ': 'dya', 'ヂュ': 'dyu', 'ヂョ': 'dyo',
        'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jo',
        'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',

        'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
        'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
        'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
        'ざ': 'za', 'じ': 'zi', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
        'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',

        'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
        'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
        'ダ': 'da', 'ヂ': 'di', 'ヅ': 'du', 'デ': 'de', 'ド': 'do',
        'ザ': 'za', 'ジ': 'zi', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
        'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',

        'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo',
        'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
        'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
        'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
        'は': 'ha', 'ひ': 'hi', 'ふ': 'hu', 'へ': 'he', 'ほ': 'ho',
        'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
        'た': 'ta', 'ち': 'ti', 'つ': 'tu', 'て': 'te', 'と': 'to',
        'さ': 'sa', 'し': 'si', 'す': 'su', 'せ': 'se', 'そ': 'so',
        'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
        'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
        'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o',
        'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo',

        'ワ': 'wa', 'ヰ': 'wi', 'ヱ': 'we', 'ヲ': 'wo',
        'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
        'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
        'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
        'ハ': 'ha', 'ヒ': 'hi', 'フ': 'hu', 'ヘ': 'he', 'ホ': 'ho',
        'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
        'タ': 'ta', 'チ': 'ti', 'ツ': 'tu', 'テ': 'te', 'ト': 'to',
        'サ': 'sa', 'シ': 'si', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
        'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
        'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
        'ァ': 'a', 'ィ': 'i', 'ゥ': 'u', 'ェ': 'e', 'ォ': 'o',
        'ャ': 'ya', 'ュ': 'yu', 'ョ': 'yo',

        'ヶ': 'ke', 'ヵ': 'ka',
        'ん': 'n', 'ー': '-', '　': ' '

    };
    var reg_tu = /っ([bcdfghijklmnopqrstuvwyz])/gm;
    var reg_xtu = /っ/gm;

    var pnt = 0;
    var max = str.length;
    var ch, r;
    var result = '';

    while (pnt <= max) {
        if (r = roman[str.substring(pnt, pnt + 2)]) {
            result += r;
            pnt += 2;
        } else {
            result += (r = roman[ch = str.substring(pnt, pnt + 1)]) ? r : ch;
            pnt += 1;
        }
    }
    result = result.replace(reg_tu, '$1$1');
    result = result.replace(reg_xtu, 'tu');
    return result;
};

var getStrType = function (str) { //0 for pure kanji,1 for kanji-hira(kana)-mixed,2 for pure hira(kana),3 for others
    var hasKJ = false;
    var hasHK = false;
    for (var i = 0; i < str.length; i++) {
        if (isKanji(str[i])) {
            hasKJ = true;
        } else if (isHiragana(str[i]) || isKatakana(str[i])) {
            hasHK = true;
        }
    }
    if (hasKJ && hasHK) return 1;
    else if (hasKJ) return 0;
    else if (hasHK) return 2;
    else return 3;
};

var splitObjArray = function (arr, prop, split) {
    split = split || '';
    var result = '';
    for (var i = 0; i < arr.length; i++) {
        if (i !== arr.length - 1) {
            result += arr[i][prop] + '' + split;
        } else {
            result += arr[i][prop];
        }
    }
    return result;
};

export { 
    // language
    getStrType,
    hasHiragana,
    hasKatakana,
    hasKanji,
    isHiragana,
    isKatakana,
    isKanji,    
    toRawHiragana,
    toRawKatakana,
    toRawRomaji,    

    // data structure    
    splitObjArray
 };