"use strict";

const KATAKANA_HIRAGANA_SHIFT = "\u3041".charCodeAt(0) - "\u30a1".charCodeAt(0);
const HIRAGANA_KATAKANA_SHIFT = "\u30a1".charCodeAt(0) - "\u3041".charCodeAt(0);

var kuromoji = require('kuromoji');

var tokenizer = null;

// check where we are, node or browser
var isNode = false;
var isBrowser = (typeof window !== 'undefined');
if (!isBrowser && typeof module !== 'undefined' && module.exports) {
    isNode = true;
}

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

/**
 * Convert given string to target syllabary with options available
 *
 * @param {string} str Given String
 * @param {Object} [options] JSON object which have key-value pairs settings
 * @param {string} [options.to='hiragana'] Target syllabary ['hiragana'|'katakana'|'romaji']
 * @param {string} [options.mode='normal'] Convert mode ['normal'|'spaced'|'okurigana'|'furigana']
 * @param {string} [options.delimiter_start='('] Delimiter(Start)
 * @param {string} [options.delimiter_end=')'] Delimiter(End)
 */
var convert = function (str, options) {
    options = options || {};
    options.to = options.to || 'hiragana';
    options.mode = options.mode || 'normal';
    //options.convertall = options.convertall || false;
    options.delimiter_start = options.delimiter_start || '(';
    options.delimiter_end = options.delimiter_end || ')';
    str = str || '';

    var tokens = tokenizer.tokenize(str);
    for (var cr = 0; cr < tokens.length; cr++) {
        if (!tokens[cr].reading)
            tokens[cr].reading = tokens[cr].surface_form;
    }

    if (options.mode === 'normal' || options.mode === 'spaced') {
        switch (options.to) {
            case 'katakana':
                if (options.mode === 'normal')
                    return splitObjArray(tokens, 'reading');
                else
                    return splitObjArray(tokens, 'reading', ' ');
                break;
            case 'romaji':
                if (options.mode === 'normal')
                    return toRawRomaji(splitObjArray(tokens, 'reading'));
                else
                    return toRawRomaji(splitObjArray(tokens, 'reading', ' '));
                break;
            case 'hiragana':
                for (var hi = 0; hi < tokens.length; hi++) {
                    if (hasKanji(tokens[hi].surface_form)) {
                        if (!hasKatakana(tokens[hi].surface_form)) {
                            tokens[hi].reading = toRawRawHiragana(tokens[hi].reading);
                        } else {
                            // handle katakana-kanji-mixed tokens
                            tokens[hi].reading = toRawRawHiragana(tokens[hi].reading);
                            var tmp = '';
                            var hpattern = '';
                            for (var hc = 0; hc < tokens[hi].surface_form.length; hc++) {
                                if (isKanji(tokens[hi].surface_form[hc])) {
                                    hpattern += '(.*)';
                                } else {
                                    hpattern += isKatakana(tokens[hi].surface_form[hc]) ? toRawHiragana(tokens[hi].surface_form[hc]) : tokens[hi].surface_form[hc];
                                }
                            }
                            var hreg = new RegExp(hpattern);
                            var hmatches = hreg.exec(tokens[hi].reading);
                            if (hmatches) {
                                var pickKJ = 0;
                                for (var hc1 = 0; hc1 < tokens[hi].surface_form.length; hc1++) {
                                    if (isKanji(tokens[hi].surface_form[hc1])) {
                                        tmp += hmatches[pickKJ + 1];
                                        pickKJ++;
                                    } else {
                                        tmp += tokens[hi].surface_form[hc1];
                                    }
                                }
                                tokens[hi].reading = tmp;
                            }
                        }
                    } else {
                        tokens[hi].reading = tokens[hi].surface_form;
                    }
                }
                if (options.mode === 'normal')
                    return splitObjArray(tokens, 'reading');
                else
                    return splitObjArray(tokens, 'reading', ' ');
                break;
        }
    } else if (options.mode === 'okurigana' || options.mode === 'furigana') {
        var notations = []; //[basic,basic_type[1=kanji,2=hiragana(katakana),3=others],notation]
        for (var i = 0; i < tokens.length; i++) {
            tokens[i].reading = toRawHiragana(tokens[i].reading);

            var strType = getStrType(tokens[i].surface_form);
            switch (strType) {
                case 0:
                    notations.push([tokens[i].surface_form, 1, tokens[i].reading]);
                    break;
                case 1:
                    var pattern = '';
                    var isLastTokenKanji = false;
                    var subs = []; // recognize kanjis and group them
                    for (var c = 0; c < tokens[i].surface_form.length; c++) {
                        if (isKanji(tokens[i].surface_form[c])) {
                            if (!isLastTokenKanji) {   // ignore successive kanji tokens (#10)
                                isLastTokenKanji = true;
                                pattern += '(.*?)';
                                subs.push(tokens[i].surface_form[c]);
                            } else {
                                subs[subs.length - 1] += tokens[i].surface_form[c];
                            }
                        } else {
                            isLastTokenKanji = false;
                            subs.push(tokens[i].surface_form[c]);
                            pattern += isKatakana(tokens[i].surface_form[c]) ? toRawHiragana(tokens[i].surface_form[c]) : tokens[i].surface_form[c];
                        }
                    }
                    var reg = new RegExp('^' + pattern + '$');
                    var matches = reg.exec(tokens[i].reading);
                    if (matches) {
                        var pickKanji = 1;
                        for (var c1 = 0; c1 < subs.length; c1++) {
                            if (isKanji(subs[c1][0])) {
                                notations.push([subs[c1], 1, matches[pickKanji++]]);
                            } else {
                                notations.push([subs[c1], 2, toRawHiragana(subs[c1])]);
                            }
                        }
                    } else {
                        notations.push([tokens[i].surface_form, 1, tokens[i].reading]);
                    }
                    break;
                case 2:
                    for (var c2 = 0; c2 < tokens[i].surface_form.length; c2++) {
                        notations.push([tokens[i].surface_form[c2], 2, tokens[i].reading[c2]]);
                    }
                    break;
                case 3:
                    for (var c3 = 0; c3 < tokens[i].surface_form.length; c3++) {
                        notations.push([tokens[i].surface_form[c3], 3, tokens[i].surface_form[c3]]);
                    }
                    break;
            }
        }
        var result = '';
        switch (options.to) {
            case 'katakana':
                if (options.mode === 'okurigana') {
                    for (var n0 = 0; n0 < notations.length; n0++) {
                        if (notations[n0][1] !== 1) {
                            result += notations[n0][0];
                        } else {
                            result += notations[n0][0] + options.delimiter_start + toRawKatakana(notations[n0][2]) + options.delimiter_end;
                        }
                    }
                } else { //furigana
                    for (var n1 = 0; n1 < notations.length; n1++) {
                        if (notations[n1][1] !== 1) {
                            result += notations[n1][0];
                        } else {
                            result += "<ruby>" + notations[n1][0] + "<rp>" + options.delimiter_start + "</rp><rt>" + toRawKatakana(notations[n1][2]) + "</rt><rp>" + options.delimiter_end + "</rp></ruby>";
                        }
                    }
                }
                return result;
            case 'romaji':
                if (options.mode === 'okurigana')
                    for (var n2 = 0; n2 < notations.length; n2++) {
                        if (notations[n2][1] !== 1) {
                            result += notations[n2][0];
                        } else {
                            result += notations[n2][0] + options.delimiter_start + toRawRomaji(notations[n2][2]) + options.delimiter_end;
                        }
                    }
                else { //furigana
                    result += "<ruby>";
                    for (var n3 = 0; n3 < notations.length; n3++) {
                        result += notations[n3][0] + "<rp>" + options.delimiter_start + "</rp><rt>" + toRawRomaji(notations[n3][2]) + "</rt><rp>" + options.delimiter_end + "</rp>";
                    }
                    result += "</ruby>";
                }
                return result;
            case 'hiragana':
                if (options.mode === 'okurigana') {
                    for (var n4 = 0; n4 < notations.length; n4++) {
                        if (notations[n4][1] !== 1) {
                            result += notations[n4][0];
                        } else {
                            result += notations[n4][0] + options.delimiter_start + notations[n4][2] + options.delimiter_end;
                        }
                    }
                } else { //furigana
                    for (var n5 = 0; n5 < notations.length; n5++) {
                        if (notations[n5][1] !== 1) {
                            result += notations[n5][0];
                        } else {
                            result += "<ruby>" + notations[n5][0] + "<rp>" + options.delimiter_start + "</rp><rt>" + notations[n5][2] + "</rt><rp>" + options.delimiter_end + "</rp></ruby>";
                        }
                    }
                }
                return result;
        }
    } else {
        throw new Error('No such mode...');
    }

};

/**
 * Convert given string to hiragana with options available
 *
 * @param {string} str Given String
 * @param {Object} [options] JSON object which have key-value pairs settings
 * @param {string} [options.mode='normal'] Convert mode ['normal'|'spaced'|'okurigana'|'furigana']
 * @param {string} [options.delimiter_start='('] Delimiter(Start)
 * @param {string} [options.delimiter_end=')'] Delimiter(End)
 */
var toHiragana = function (str, options) {
    options = options || {};
    options.to = 'hiragana';
    return convert(str, options);
};

/**
 * Convert given string to katakana with options available
 *
 * @param {string} str Given String
 * @param {Object} [options] JSON object which have key-value pairs settings
 * @param {string} [options.mode='normal'] Convert mode ['normal'|'spaced'|'okurigana'|'furigana']
 * @param {string} [options.delimiter_start='('] Delimiter(Start)
 * @param {string} [options.delimiter_end=')'] Delimiter(End)
 */
var toKatakana = function (str, options) {
    options = options || {};
    options.to = 'katakana';
    return convert(str, options);
};

/**
 * Convert given string to romaji with options available
 *
 * @param {string} str Given String
 * @param {Object} [options] JSON object which have key-value pairs settings
 * @param {string} [options.mode='normal'] Convert mode ['normal'|'spaced'|'okurigana'|'furigana']
 * @param {string} [options.delimiter_start='('] Delimiter(Start)
 * @param {string} [options.delimiter_end=')'] Delimiter(End)
 */
var toRomaji = function (str, options) {
    options = options || {};
    options.to = 'romaji';
    return convert(str, options);
};

/**
 * Initiate kuroshiro.js
 *
 * @param {Object} options Options [dicPath]
 * @param {function} [callback] Callback after building kuromoji tokenizer
 */
var init = function (options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    } else if (typeof options === 'object') {
        if (!callback || typeof callback !== "function") {
            callback = function () { };
        }
    } else {
        options = {};
        if (!callback || typeof callback !== "function") {
            callback = function () { };
        }
    }

    var dicPath = options.dicPath;
    if (!dicPath) {
        if (isNode) dicPath = require.resolve('kuromoji').replace(/src(?!.*src).*/, 'dict/');
        else dicPath = 'bower_components/kuroshiro/dist/dict/';
    }
    kuromoji.builder({ dicPath: dicPath }).build(function (err, newtokenizer) {
        if (err)
            return callback(err);

        tokenizer = newtokenizer;
        kuroshiro.tokenize = tokenizer.tokenize;
        callback();
    });
};

var kuroshiro = {
    init: init,
    isHiragana: isHiragana,
    isKatakana: isKatakana,
    isKanji: isKanji,
    hasHiragana: hasHiragana,
    hasKatakana: hasKatakana,
    hasKanji: hasKanji,
    convert: convert,
    toHiragana: toHiragana,
    toKatakana: toKatakana,
    toRomaji: toRomaji
};

module.exports = kuroshiro;