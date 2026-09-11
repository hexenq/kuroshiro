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
 * Merge a lone sokuon (っ / ッ) into the notation that follows it.
 *
 * A sokuon has no reading of its own — it geminates the consonant that
 * starts the next mora. When each notation is romanised independently
 * (which is what the furigana renderer does), a sokuon standing alone
 * falls through to the "no mapping" branch of toRawRomaji and comes out
 * as the literal "tsu":
 *
 *   座って  ->  座[suwa] っ[tsu] て[te]     // wrong
 *   真っ赤  ->  真[ma]   っ[tsu] 赤[ka]     // wrong
 *   カッター ->  カ[ka]   ッ[tsu] タ[ta] ー  // wrong
 *
 * Merging the sokuon forward gives the romaji converter the following
 * consonant it needs, so its existing gemination rule applies:
 *
 *   座って  ->  座[suwa] って[tte]
 *   真っ赤  ->  真[ma]   っ赤[kka]
 *
 * Reported upstream as takuyaa/kuromoji.js#53, filed against the
 * tokenizer. It is not a tokenizer bug: kuromoji correctly returns
 * 座っ[スワッ] + て[テ]. The error is here, in the consumer.
 *
 * Only the romaji paths use this. Hiragana and katakana output is
 * unaffected, because there a sokuon is emitted as its own literal
 * character and is already correct.
 *
 * A trailing sokuon with nothing to geminate (「あっ」) is left alone —
 * it has no well-defined romanisation and inventing one here would be a
 * separate decision.
 *
 * @param {Array} notations [basic, basic_type, notation, pronunciation]
 * @returns {Array} notations with lone sokuon merged forward
 */
const mergeSokuonForward = function (notations) {
    const SOKUON = /^[っッ]$/;
    const merged = [];
    let carry = null;
    for (let i = 0; i < notations.length; i++) {
        const n = notations[i];
        if (carry) {
            merged.push([
                carry[0] + n[0],
                n[1],
                carry[2] + n[2],
                carry[3] + n[3]
            ]);
            carry = null;
        }
        // [3] is the pronunciation; a lone sokuon is the whole of it.
        // The last notation has nothing to merge into, so it is kept.
        else if (SOKUON.test(n[3]) && i + 1 < notations.length) {
            carry = n;
        }
        else {
            merged.push(n);
        }
    }
    if (carry) {
        merged.push(carry); // trailing sokuon: nothing to merge into
    }
    return merged;
};

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
            await analyzer.init();
            this._analyzer = analyzer;
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
                                    pattern += "(.+)";
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
                case "romaji": {
                    // A lone sokuon has no reading of its own; romanising
                    // it in isolation yields "tsu". See mergeSokuonForward.
                    const romajiNotations = mergeSokuonForward(notations);
                    if (options.mode === "okurigana") {
                        for (let n2 = 0; n2 < romajiNotations.length; n2++) {
                            if (romajiNotations[n2][1] !== 1) {
                                result += romajiNotations[n2][0];
                            }
                            else {
                                result += romajiNotations[n2][0] + options.delimiter_start + toRawRomaji(romajiNotations[n2][3], options.romajiSystem) + options.delimiter_end;
                            }
                        }
                    }
                    else { // furigana
                        result += "<ruby>";
                        for (let n3 = 0; n3 < romajiNotations.length; n3++) {
                            result += `${romajiNotations[n3][0]}<rp>${options.delimiter_start}</rp><rt>${toRawRomaji(romajiNotations[n3][3], options.romajiSystem)}</rt><rp>${options.delimiter_end}</rp>`;
                        }
                        result += "</ruby>";
                    }
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
