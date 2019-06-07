import {
    ROMAJI_TABLE, ROMANIZATION_SYSTEM, HIRAGANA_KATAKANA_SHIFT, KATAKANA_HIRAGANA_SHIFT,
    HIRAGANA_START, HIRAGANA_END, KATAKANA_START, KATAKANA_END,
    CJK_START, CJK_END, CJK_EXT_A_START, CJK_EXT_A_END, CJK_EXT_B_START, CJK_EXT_B_END, KATAKANA_SHIFTABLE_START, KATAKANA_SHIFTABLE_END, HIRAGANA_SHIFTABLE_START, HIRAGANA_SHIFTABLE_END
} from "./constants";

/**
 * Check if given char is a hiragana
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a hiragana
 */
export const isHiragana = function (ch = "") {
    const charCode = (ch[0] || "").charCodeAt(0);
    return charCode >= HIRAGANA_START && charCode <= HIRAGANA_END;
};

/**
 * Check if given char is a katakana
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a katakana
 */
export const isKatakana = function (ch = "") {
    const charCode = (ch[0] || "").charCodeAt(0);
    return charCode >= KATAKANA_START && charCode <= KATAKANA_END;
};

/**
 * Check if given char is a kana
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a kana
 */
export const isKana = function (ch = "") {
    return isHiragana(ch) || isKatakana(ch);
};

/**
 * Check if given char is a kanji
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a kanji
 */
export const isKanji = function (ch = "") {
    const charCode = ([...ch][0] || "").codePointAt(0);
    return (charCode >= CJK_START && charCode <= CJK_END)
        || (charCode >= CJK_EXT_A_START && charCode <= CJK_EXT_A_END)
        || (charCode >= CJK_EXT_B_START && charCode <= CJK_EXT_B_END);
};

/**
 * Check if given char is a Japanese
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a Japanese
 */
export const isJapanese = function (ch = "") {
    return isKana(ch) || isKanji(ch);
};

/**
 * Check if given string has hiragana
 *
 * @param {string} str Given string
 * @return {boolean} if given string has hiragana
 */
export const hasHiragana = function (str = "") {
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
export const hasKatakana = function (str = "") {
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
export const hasKana = function (str = "") {
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
export const hasKanji = function (str = "") {
    str = [...str]; // parse surrogate pair
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
export const hasJapanese = function (str = "") {
    str = [...str]; // parse surrogate pair
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
export const toRawHiragana = function (str = "") {
    return [...str].map((ch) => {
        if (ch.codePointAt(0) >= KATAKANA_SHIFTABLE_START && ch.codePointAt(0) <= KATAKANA_SHIFTABLE_END) {
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
export const toRawKatakana = function (str = "") {
    return [...str].map((ch) => {
        if (ch.codePointAt(0) >= HIRAGANA_SHIFTABLE_START && ch.codePointAt(0) <= HIRAGANA_SHIFTABLE_END) {
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
export const toRawRomaji = function (str = "", system) {
    system = system || ROMANIZATION_SYSTEM.HEPBURN;

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
        if (r = ROMAJI_TABLE[system][str.substring(pnt, pnt + 2)]) {
            result += r;
            pnt += 2;
        }
        else {
            result += (r = ROMAJI_TABLE[system][ch = str.substring(pnt, pnt + 1)]) ? r : ch;
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
export const getStrType = function (str = "") {
    str = [...str];
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
    if (hasKJ) return 0;
    if (hasHK) return 2;
    return 3;
};

/**
 * Patch tokens for conversion
 * @param {Object} tokens Given tokens
 * @return {Object} Patched tokens
 */
export const patchTokens = function (tokens) {
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
            if (j + 1 < tokens.length) {
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
export const kanaToHiragna = function (str) {
    return toRawHiragana(str);
};

/**
 * Convert kana to katakana
 *
 * @param {string} str Given string
 * @return {string} Katakana string
 */
export const kanaToKatakana = function (str) {
    return toRawKatakana(str);
};

/**
 * Convert kana to romaji
 *
 * @param {string} str Given string
 * @param {string} system To which romanization system the given string is converted. ["nippon"|"passport"|"hepburn"]
 * @return {string} Romaji string
 */
export const kanaToRomaji = function (str, system) {
    return toRawRomaji(str, system);
};
