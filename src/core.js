import {
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
} from "./util";

/**
 * Kuroshiro Class
 */
class Kuroshiro {
    /**
     * Constructor
     * @constructs Kuroshiro
     */
    constructor() {
        this._analyzer = null;
    }

    /**
     * Initialize Kuroshiro
     * @memberOf Kuroshiro
     * @instance
     * @returns {Promise} Promise object represents the result of initialization
     */
    async init(analyzer) {
        if (!analyzer || typeof analyzer !== "object" || typeof analyzer.init !== "function" || typeof analyzer.parse !== "function") {
            throw new Error("Invalid initialization parameter.");
        }
        else if (this._analyzer == null) {
            try {
                await analyzer.init();
                this._analyzer = analyzer;
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new Error("Kuroshiro has already been initialized.");
        }
    }

    /**
     * Convert given string to target syllabary with options available
     * @memberOf Kuroshiro
     * @instance
     * @param {string} str Given String
     * @param {Object} [options] Settings Object
     * @param {string} [options.to="hiragana"] Target syllabary ["hiragana"|"katakana"|"romaji"]
     * @param {string} [options.mode="normal"] Convert mode ["normal"|"spaced"|"okurigana"|"furigana"]
     * @param {string} [options.romajiSystem="hepburn"] Romanization System ["nippon"|"passport"|"hepburn"]
     * @param {string} [options.delimiter_start="("] Delimiter(Start)
     * @param {string} [options.delimiter_end=")"] Delimiter(End)
     * @returns {Promise} Promise object represents the result of conversion
     */
    async convert(str, options) {
        options = options || {};
        options.to = options.to || "hiragana";
        options.mode = options.mode || "normal";
        options.romajiSystem = options.romajiSystem || ROMANIZATION_SYSTEM.HEPBURN;
        options.delimiter_start = options.delimiter_start || "(";
        options.delimiter_end = options.delimiter_end || ")";
        str = str || "";

        if (["hiragana", "katakana", "romaji"].indexOf(options.to) === -1) {
            throw new Error("Invalid Target Syllabary.");
        }

        if (["normal", "spaced", "okurigana", "furigana"].indexOf(options.mode) === -1) {
            throw new Error("Invalid Conversion Mode.");
        }

        const ROMAJI_SYSTEMS = Object.keys(ROMANIZATION_SYSTEM).map(e => ROMANIZATION_SYSTEM[e]);
        if (ROMAJI_SYSTEMS.indexOf(options.romajiSystem) === -1) {
            throw new Error("Invalid Romanization System.");
        }

        const rawTokens = await this._analyzer.parse(str);
        const tokens = patchTokens(rawTokens);

        if (options.mode === "normal" || options.mode === "spaced") {
            switch (options.to) {
                case "katakana":
                    if (options.mode === "normal") {
                        return tokens.map(token => token.reading).join("");
                    }
                    return tokens.map(token => token.reading).join(" ");
                case "romaji":
                    const romajiConv = (token) => {
                        let preToken;
                        if (hasJapanese(token.surface_form)) {
                            preToken = token.pronunciation || token.reading;
                        }
                        else {
                            preToken = token.surface_form;
                        }
                        return toRawRomaji(preToken, options.romajiSystem);
                    };
                    if (options.mode === "normal") {
                        return tokens.map(romajiConv).join("");
                    }
                    return tokens.map(romajiConv).join(" ");
                case "hiragana":
                    for (let hi = 0; hi < tokens.length; hi++) {
                        if (hasKanji(tokens[hi].surface_form)) {
                            if (!hasKatakana(tokens[hi].surface_form)) {
                                tokens[hi].reading = toRawHiragana(tokens[hi].reading);
                            }
                            else {
                                // handle katakana-kanji-mixed tokens
                                tokens[hi].reading = toRawHiragana(tokens[hi].reading);
                                let tmp = "";
                                let hpattern = "";
                                for (let hc = 0; hc < tokens[hi].surface_form.length; hc++) {
                                    if (isKanji(tokens[hi].surface_form[hc])) {
                                        hpattern += "(.*)";
                                    }
                                    else {
                                        hpattern += isKatakana(tokens[hi].surface_form[hc]) ? toRawHiragana(tokens[hi].surface_form[hc]) : tokens[hi].surface_form[hc];
                                    }
                                }
                                const hreg = new RegExp(hpattern);
                                const hmatches = hreg.exec(tokens[hi].reading);
                                if (hmatches) {
                                    let pickKJ = 0;
                                    for (let hc1 = 0; hc1 < tokens[hi].surface_form.length; hc1++) {
                                        if (isKanji(tokens[hi].surface_form[hc1])) {
                                            tmp += hmatches[pickKJ + 1];
                                            pickKJ++;
                                        }
                                        else {
                                            tmp += tokens[hi].surface_form[hc1];
                                        }
                                    }
                                    tokens[hi].reading = tmp;
                                }
                            }
                        }
                        else {
                            tokens[hi].reading = tokens[hi].surface_form;
                        }
                    }
                    if (options.mode === "normal") {
                        return tokens.map(token => token.reading).join("");
                    }
                    return tokens.map(token => token.reading).join(" ");
                default:
                    throw new Error("Unknown option.to param");
            }
        }
        else if (options.mode === "okurigana" || options.mode === "furigana") {
            const notations = []; // [basic, basic_type[1=kanji,2=kana,3=others], notation, pronunciation]
            for (let i = 0; i < tokens.length; i++) {
                const strType = getStrType(tokens[i].surface_form);
                switch (strType) {
                    case 0:
                        notations.push([tokens[i].surface_form, 1, toRawHiragana(tokens[i].reading), tokens[i].pronunciation || tokens[i].reading]);
                        break;
                    case 1:
                        let pattern = "";
                        let isLastTokenKanji = false;
                        const subs = []; // recognize kanjis and group them
                        for (let c = 0; c < tokens[i].surface_form.length; c++) {
                            if (isKanji(tokens[i].surface_form[c])) {
                                if (!isLastTokenKanji) { // ignore successive kanji tokens (#10)
                                    isLastTokenKanji = true;
                                    pattern += "(.*)";
                                    subs.push(tokens[i].surface_form[c]);
                                }
                                else {
                                    subs[subs.length - 1] += tokens[i].surface_form[c];
                                }
                            }
                            else {
                                isLastTokenKanji = false;
                                subs.push(tokens[i].surface_form[c]);
                                pattern += isKatakana(tokens[i].surface_form[c]) ? toRawHiragana(tokens[i].surface_form[c]) : tokens[i].surface_form[c];
                            }
                        }
                        const reg = new RegExp(`^${pattern}$`);
                        const matches = reg.exec(toRawHiragana(tokens[i].reading));
                        if (matches) {
                            let pickKanji = 1;
                            for (let c1 = 0; c1 < subs.length; c1++) {
                                if (isKanji(subs[c1][0])) {
                                    notations.push([subs[c1], 1, matches[pickKanji], toRawKatakana(matches[pickKanji])]);
                                    pickKanji += 1;
                                }
                                else {
                                    notations.push([subs[c1], 2, toRawHiragana(subs[c1]), toRawKatakana(subs[c1])]);
                                }
                            }
                        }
                        else {
                            notations.push([tokens[i].surface_form, 1, toRawHiragana(tokens[i].reading), tokens[i].pronunciation || tokens[i].reading]);
                        }
                        break;
                    case 2:
                        for (let c2 = 0; c2 < tokens[i].surface_form.length; c2++) {
                            notations.push([tokens[i].surface_form[c2], 2, toRawHiragana(tokens[i].reading[c2]), (tokens[i].pronunciation && tokens[i].pronunciation[c2]) || tokens[i].reading[c2]]);
                        }
                        break;
                    case 3:
                        for (let c3 = 0; c3 < tokens[i].surface_form.length; c3++) {
                            notations.push([tokens[i].surface_form[c3], 3, tokens[i].surface_form[c3], tokens[i].surface_form[c3]]);
                        }
                        break;
                    default:
                        throw new Error("Unknown strType");
                }
            }
            let result = "";
            switch (options.to) {
                case "katakana":
                    if (options.mode === "okurigana") {
                        for (let n0 = 0; n0 < notations.length; n0++) {
                            if (notations[n0][1] !== 1) {
                                result += notations[n0][0];
                            }
                            else {
                                result += notations[n0][0] + options.delimiter_start + toRawKatakana(notations[n0][2]) + options.delimiter_end;
                            }
                        }
                    }
                    else { // furigana
                        for (let n1 = 0; n1 < notations.length; n1++) {
                            if (notations[n1][1] !== 1) {
                                result += notations[n1][0];
                            }
                            else {
                                result += `<ruby>${notations[n1][0]}<rp>${options.delimiter_start}</rp><rt>${toRawKatakana(notations[n1][2])}</rt><rp>${options.delimiter_end}</rp></ruby>`;
                            }
                        }
                    }
                    return result;
                case "romaji":
                    if (options.mode === "okurigana") {
                        for (let n2 = 0; n2 < notations.length; n2++) {
                            if (notations[n2][1] !== 1) {
                                result += notations[n2][0];
                            }
                            else {
                                result += notations[n2][0] + options.delimiter_start + toRawRomaji(notations[n2][3], options.romajiSystem) + options.delimiter_end;
                            }
                        }
                    }
                    else { // furigana
                        result += "<ruby>";
                        for (let n3 = 0; n3 < notations.length; n3++) {
                            result += `${notations[n3][0]}<rp>${options.delimiter_start}</rp><rt>${toRawRomaji(notations[n3][3], options.romajiSystem)}</rt><rp>${options.delimiter_end}</rp>`;
                        }
                        result += "</ruby>";
                    }
                    return result;
                case "hiragana":
                    if (options.mode === "okurigana") {
                        for (let n4 = 0; n4 < notations.length; n4++) {
                            if (notations[n4][1] !== 1) {
                                result += notations[n4][0];
                            }
                            else {
                                result += notations[n4][0] + options.delimiter_start + notations[n4][2] + options.delimiter_end;
                            }
                        }
                    }
                    else { // furigana
                        for (let n5 = 0; n5 < notations.length; n5++) {
                            if (notations[n5][1] !== 1) {
                                result += notations[n5][0];
                            }
                            else {
                                result += `<ruby>${notations[n5][0]}<rp>${options.delimiter_start}</rp><rt>${notations[n5][2]}</rt><rp>${options.delimiter_end}</rp></ruby>`;
                            }
                        }
                    }
                    return result;
                default:
                    throw new Error("Invalid Target Syllabary.");
            }
        }
    }
}

const Util = {
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
    kanaToHiragna,
    kanaToKatakana,
    kanaToRomaji
};

Kuroshiro.Util = Util;

export default Kuroshiro;
