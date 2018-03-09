import {
    getStrType,
    hasKatakana,
    hasKanji,
    isKatakana,
    isKanji,    
    toRawHiragana,
    toRawKatakana,
    toRawRomaji,    
    splitObjArray
 } from "./util";

function Kuroshiro(){
    this._analyzer = null;
}

/**
 * Initiate kuroshiro.js
 * 
 * @param {Analyzer} analyzer Morphological analyzer
 * @param {function} [callback] Callback after initiating analyzer
 */
Kuroshiro.prototype.init = function (analyzer, callback) {
    let self = this;
    if(self._analyzer == null){        
        analyzer.init(function(err){
            if(err){
                return callback(err);
            }else{
                self._analyzer = analyzer;
                return callback();
            }
        });
    }else{
        callback(new Error("Kuroshiro has already been initialized."));
    }
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
Kuroshiro.prototype.convert = function (str, options, callback) {
    options = options || {};
    options.to = options.to || 'hiragana';
    options.mode = options.mode || 'normal';
    //options.convertall = options.convertall || false;
    options.delimiter_start = options.delimiter_start || '(';
    options.delimiter_end = options.delimiter_end || ')';
    str = str || '';

    this._analyzer.parse(str, function(tokens){
        for (var cr = 0; cr < tokens.length; cr++) {
            if (!tokens[cr].reading)
                tokens[cr].reading = tokens[cr].surface_form;
        }
    
        if (options.mode === 'normal' || options.mode === 'spaced') {
            switch (options.to) {
                case 'katakana':
                    if (options.mode === 'normal')
                        return callback(null, splitObjArray(tokens, 'reading'));
                    else
                        return callback(null, splitObjArray(tokens, 'reading', ' '));
                    break;
                case 'romaji':
                    if (options.mode === 'normal')
                        return callback(null, toRawRomaji(splitObjArray(tokens, 'reading')));
                    else
                        return callback(null, toRawRomaji(splitObjArray(tokens, 'reading', ' ')));
                    break;
                case 'hiragana':
                    for (var hi = 0; hi < tokens.length; hi++) {
                        if (hasKanji(tokens[hi].surface_form)) {
                            if (!hasKatakana(tokens[hi].surface_form)) {
                                tokens[hi].reading = toRawHiragana(tokens[hi].reading);
                            } else {
                                // handle katakana-kanji-mixed tokens
                                tokens[hi].reading = toRawHiragana(tokens[hi].reading);
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
                        return callback(null, splitObjArray(tokens, 'reading'));
                    else
                        return callback(null, splitObjArray(tokens, 'reading', ' '));
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
                    return callback(null, result);
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
                    return callback(null, result);
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
                    return callback(null, result);
            }
        } else {
            return callback(new Error('No such mode...'));
        }
    });
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
Kuroshiro.prototype.toHiragana = function (str, options, callback) {
    options = options || {};
    options.to = 'hiragana';
    return this.convert(str, options, callback);
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
Kuroshiro.prototype.toKatakana = function (str, options, callback) {
    options = options || {};
    options.to = 'katakana';
    return this.convert(str, options, callback);
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
Kuroshiro.prototype.toRomaji = function (str, options, callback) {
    options = options || {};
    options.to = 'romaji';
    return this.convert(str, options, callback);
};

export default Kuroshiro;