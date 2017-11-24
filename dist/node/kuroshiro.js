/*!
 * kuroshiro.js
 * Copyright(c) 2015-2017 Hexen Qi <hexenq@gmail.com>
 * MIT Licensed
 */

"use strict";

var kuromoji = require('kuromoji');
var wanakana = require('wanakana');

var tokenizer = null;

// check where we are, node or browser
var isNode = false;
var isBrowser = (typeof window !== 'undefined');
if(!isBrowser && typeof module !== 'undefined' && module.exports){
    isNode = true;
}

/**
 * Check if given char is a kanji
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a kanji
 */
var isKanji = function(ch){
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
var hasHiragana = function(str){
    for(var i=0;i<str.length;i++){
        if(wanakana.isHiragana(str[i])) return true;
    }
    return false;
};

/**
 * Check if given string has katakana
 *
 * @param {string} str Given string
 * @return {boolean} if given string has katakana
 */
var hasKatakana = function(str){
    for(var i=0;i<str.length;i++){
        if(wanakana.isKatakana(str[i])) return true;
    }
    return false;
};

/**
 * Check if given string has kanji
 *
 * @param {string} str Given string
 * @return {boolean} if given string has kanji
 */
var hasKanji = function(str){
    for(var i=0;i<str.length;i++){
        if(isKanji(str[i])) return true;
    }
    return false;
};

var getStrType = function(str){ //0 for pure kanji,1 for kanji-hira(kana)-mixed,2 for pure hira(kana),3 for others
    var hasKJ = false;
    var hasHK = false;
    for(var i=0;i<str.length;i++){
        if(isKanji(str[i])) {
            hasKJ = true;
        }else if(wanakana.isHiragana(str[i]) || wanakana.isKatakana(str[i])) {
            hasHK = true;
        }
    }
    if(hasKJ && hasHK) return 1;
    else if(hasKJ) return 0;
    else if(hasHK) return 2;
    else return 3;
};

var splitObjArray = function(arr,prop,split){
    split = split || '';
    var result = '';
    for(var i=0;i<arr.length;i++){
        if(i!==arr.length-1){
            result += arr[i][prop] + '' + split;
        }else{
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
 * TODO @param {boolean} [options.convertall=false] If convert all characters to target syllabary (by default only kanji will be converted)
 */
var convert = function(str, options){
    options = options || {};
    options.to = options.to || 'hiragana';
    options.mode = options.mode || 'normal';
    //options.convertall = options.convertall || false;
    options.delimiter_start = options.delimiter_start || '(';
    options.delimiter_end = options.delimiter_end || ')';
    str = str || '';

    var tokens = tokenizer.tokenize(str);
    for(var cr=0;cr<tokens.length;cr++){
        if(!tokens[cr].reading)
            tokens[cr].reading = tokens[cr].surface_form;
    }

    if(options.mode === 'normal' || options.mode === 'spaced'){
        switch (options.to){
            case 'katakana':
                if(options.mode === 'normal')
                    return splitObjArray(tokens,'reading');
                else
                    return splitObjArray(tokens,'reading',' ');
                break;
            case 'romaji':
                if(options.mode === 'normal')
                    return wanakana.toRomaji(splitObjArray(tokens, 'reading'));
                else
                    return wanakana.toRomaji(splitObjArray(tokens, 'reading', ' '));
                break;
            case 'hiragana':
                for(var hi=0;hi<tokens.length;hi++){
                    if(hasKanji(tokens[hi].surface_form)){
                        if(!hasKatakana(tokens[hi].surface_form)){
                            tokens[hi].reading = wanakana.toHiragana(tokens[hi].reading);
                        }else{
                            // handle katakana-kanji-mixed tokens
                            tokens[hi].reading = wanakana.toHiragana(tokens[hi].reading);
                            var tmp = '';
                            var hpattern = '';
                            for(var hc=0;hc<tokens[hi].surface_form.length;hc++){
                                if(isKanji(tokens[hi].surface_form[hc])){
                                    hpattern += '(.*)';
                                }else{
                                    hpattern += wanakana.isKatakana(tokens[hi].surface_form[hc]) ? wanakana.toHiragana(tokens[hi].surface_form[hc]):tokens[hi].surface_form[hc];
                                }
                            }
                            var hreg = new RegExp(hpattern);
                            var hmatches = hreg.exec(tokens[hi].reading);
                            if(hmatches){
                                var pickKJ = 0;
                                for(var hc1=0;hc1<tokens[hi].surface_form.length;hc1++){
                                    if(isKanji(tokens[hi].surface_form[hc1])){
                                        tmp += hmatches[pickKJ+1];
                                        pickKJ++;
                                    }else{
                                        tmp += tokens[hi].surface_form[hc1];
                                    }
                                }
                                tokens[hi].reading = tmp;
                            }
                        }
                    }else{
                        tokens[hi].reading = tokens[hi].surface_form;
                    }
                }
                if(options.mode === 'normal')
                    return splitObjArray(tokens,'reading');
                else
                    return splitObjArray(tokens,'reading',' ');
                break;
        }
    }else if(options.mode === 'okurigana' || options.mode === 'furigana'){
        var notations = []; //[basic,basic_type[1=kanji,2=hiragana(katakana),3=others],notation]
        for(var i=0;i<tokens.length;i++){
            tokens[i].reading = wanakana.toHiragana(tokens[i].reading);

            var strType = getStrType(tokens[i].surface_form);
            switch (strType){
                case 0:
                    notations.push([tokens[i].surface_form,1,tokens[i].reading]);
                    break;
                case 1:
                    var pattern = '';
                    var isLastTokenKanji = false;
                    var subs = []; // recognize kanjis and group them
                    for(var c=0;c<tokens[i].surface_form.length;c++){
                        if(isKanji(tokens[i].surface_form[c])){
                            if(!isLastTokenKanji){   // ignore successive kanji tokens (#10)
                                isLastTokenKanji = true;
                                pattern += '(.*?)';
                                subs.push(tokens[i].surface_form[c]);
                            }else{
                                subs[subs.length-1] += tokens[i].surface_form[c];
                            }
                        }else{
                            isLastTokenKanji = false;
                            subs.push(tokens[i].surface_form[c]);
                            pattern += wanakana.isKatakana(tokens[i].surface_form[c]) ? wanakana.toHiragana(tokens[i].surface_form[c]):tokens[i].surface_form[c];
                        }
                    }
                    var reg = new RegExp('^' + pattern + '$');
                    var matches = reg.exec(tokens[i].reading);
                    if(matches){
                        var pickKanji = 1;
                        for(var c1=0;c1<subs.length;c1++){
                            if(isKanji(subs[c1][0])){
                                notations.push([subs[c1],1,matches[pickKanji++]]);
                            }else{
                                notations.push([subs[c1],2,wanakana.toHiragana(subs[c1])]);
                            }
                        }
                    }else{
                        notations.push([tokens[i].surface_form,1,tokens[i].reading]);
                    }
                    break;
                case 2:
                    for(var c2=0;c2<tokens[i].surface_form.length;c2++){
                        notations.push([tokens[i].surface_form[c2],2,tokens[i].reading[c2]]);
                    }
                    break;
                case 3:
                    for(var c3=0;c3<tokens[i].surface_form.length;c3++){
                        notations.push([tokens[i].surface_form[c3],3,tokens[i].surface_form[c3]]);
                    }
                    break;
            }
        }
        var result = '';
        switch (options.to){
            case 'katakana':
                if(options.mode === 'okurigana'){
                    for(var n0=0;n0<notations.length;n0++){
                        if(notations[n0][1]!==1){
                            result += notations[n0][0];
                        }else{
                            result += notations[n0][0] + options.delimiter_start + wanakana.toKatakana(notations[n0][2]) + options.delimiter_end;
                        }
                    }
                }else{ //furigana
                    for(var n1=0;n1<notations.length;n1++){
                        if(notations[n1][1]!==1){
                            result += notations[n1][0];
                        }else{
                            result += "<ruby>" + notations[n1][0] + "<rp>" + options.delimiter_start + "</rp><rt>" + wanakana.toKatakana(notations[n1][2]) + "</rt><rp>" + options.delimiter_end + "</rp></ruby>";
                        }
                    }
                }
                return result;
            case 'romaji':
                if(options.mode === 'okurigana')
                    for(var n2=0;n2<notations.length;n2++){
                        if(notations[n2][1]!==1){
                            result += notations[n2][0];
                        }else{
                            result += notations[n2][0] + options.delimiter_start + wanakana.toRomaji(notations[n2][2]) + options.delimiter_end;
                        }
                    }
                else{ //furigana
                    result += "<ruby>";
                    for(var n3=0;n3<notations.length;n3++){
                        result += notations[n3][0] + "<rp>" + options.delimiter_start + "</rp><rt>" + wanakana.toRomaji(notations[n3][2]) + "</rt><rp>" + options.delimiter_end + "</rp>";
                    }
                    result += "</ruby>";
                }
                return result;
            case 'hiragana':
                if(options.mode === 'okurigana'){
                    for(var n4=0;n4<notations.length;n4++){
                        if(notations[n4][1]!==1){
                            result += notations[n4][0];
                        }else{
                            result += notations[n4][0] + options.delimiter_start + notations[n4][2] + options.delimiter_end;
                        }
                    }
                }else{ //furigana
                    for(var n5=0;n5<notations.length;n5++){
                        if(notations[n5][1]!==1){
                            result += notations[n5][0];
                        }else{
                            result += "<ruby>" + notations[n5][0] + "<rp>" + options.delimiter_start + "</rp><rt>" + notations[n5][2] + "</rt><rp>" + options.delimiter_end + "</rp></ruby>";
                        }
                    }
                }
                return result;
        }
    }else{
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
var toHiragana = function(str, options){
    options = options || {};
    options.to = 'hiragana';
    return convert(str,options);
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
var toKatakana = function(str, options){
    options = options || {};
    options.to = 'katakana';
    return convert(str,options);
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
var toRomaji = function(str, options){
    options = options || {};
    options.to = 'romaji';
    return convert(str,options);
};

/**
 * Initiate kuroshiro.js
 *
 * @param {Object} options Options [dicPath]
 * @param {function} [callback] Callback after building kuromoji tokenizer
 */
var init = function(options, callback){
    if(typeof options === 'function'){
        callback = options;
        options = {};
    }else if(typeof options === 'object'){
        if (!callback || typeof callback !== "function") {
            callback = function(){};
        }
    }else{
        options = {};
        if (!callback || typeof callback !== "function") {
            callback = function(){};
        }
    }

    var dicPath = options.dicPath;
    if(!dicPath){
        if(isNode) dicPath = require.resolve('kuromoji').replace(/src(?!.*src).*/,'dict/');
        else dicPath = 'bower_components/kuroshiro/dist/dict/';
    }
    kuromoji.builder({ dicPath: dicPath }).build(function (err, newtokenizer) {
        if(err)
            return callback(err);

        tokenizer = newtokenizer;
        kuroshiro.tokenize = tokenizer.tokenize;
        callback();
    });
};

var kuroshiro = {
    init: init,
    isHiragana: wanakana.isHiragana,
    isKatakana: wanakana.isKatakana,
    isRomaji: wanakana.isRomaji,
    isKanji: isKanji,
    hasHiragana: hasHiragana,
    hasKatakana: hasKatakana,
    hasKanji: hasKanji,
    convert: convert,
    toHiragana: toHiragana,
    toKatakana: toKatakana,
    toRomaji: toRomaji,
    toKana: wanakana.toKana
};

module.exports = kuroshiro;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJrdXJvc2hpcm8uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIGt1cm9zaGlyby5qc1xyXG4gKiBDb3B5cmlnaHQoYykgMjAxNS0yMDE3IEhleGVuIFFpIDxoZXhlbnFAZ21haWwuY29tPlxyXG4gKiBNSVQgTGljZW5zZWRcclxuICovXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBrdXJvbW9qaSA9IHJlcXVpcmUoJ2t1cm9tb2ppJyk7XHJcbnZhciB3YW5ha2FuYSA9IHJlcXVpcmUoJ3dhbmFrYW5hJyk7XHJcblxyXG52YXIgdG9rZW5pemVyID0gbnVsbDtcclxuXHJcbi8vIGNoZWNrIHdoZXJlIHdlIGFyZSwgbm9kZSBvciBicm93c2VyXHJcbnZhciBpc05vZGUgPSBmYWxzZTtcclxudmFyIGlzQnJvd3NlciA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyk7XHJcbmlmKCFpc0Jyb3dzZXIgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpe1xyXG4gICAgaXNOb2RlID0gdHJ1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGdpdmVuIGNoYXIgaXMgYSBrYW5qaVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY2ggR2l2ZW4gY2hhclxyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpZiBnaXZlbiBjaGFyIGlzIGEga2FuamlcclxuICovXHJcbnZhciBpc0thbmppID0gZnVuY3Rpb24oY2gpe1xyXG4gICAgY2ggPSBjaFswXTtcclxuICAgIHJldHVybiAoY2ggPj0gJ1xcdTRlMDAnICYmIGNoIDw9ICdcXHU5ZmNmJykgfHxcclxuICAgICAgICAgICAgKGNoID49ICdcXHVmOTAwJyAmJiBjaCA8PSAnXFx1ZmFmZicpIHx8XHJcbiAgICAgICAgICAgIChjaCA+PSAnXFx1MzQwMCcgJiYgY2ggPD0gJ1xcdTRkYmYnKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBnaXZlbiBzdHJpbmcgaGFzIGhpcmFnYW5hXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgR2l2ZW4gc3RyaW5nXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlmIGdpdmVuIHN0cmluZyBoYXMgaGlyYWdhbmFcclxuICovXHJcbnZhciBoYXNIaXJhZ2FuYSA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICBmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7aSsrKXtcclxuICAgICAgICBpZih3YW5ha2FuYS5pc0hpcmFnYW5hKHN0cltpXSkpIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGdpdmVuIHN0cmluZyBoYXMga2F0YWthbmFcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBHaXZlbiBzdHJpbmdcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaWYgZ2l2ZW4gc3RyaW5nIGhhcyBrYXRha2FuYVxyXG4gKi9cclxudmFyIGhhc0thdGFrYW5hID0gZnVuY3Rpb24oc3RyKXtcclxuICAgIGZvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGlmKHdhbmFrYW5hLmlzS2F0YWthbmEoc3RyW2ldKSkgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZ2l2ZW4gc3RyaW5nIGhhcyBrYW5qaVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIEdpdmVuIHN0cmluZ1xyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpZiBnaXZlbiBzdHJpbmcgaGFzIGthbmppXHJcbiAqL1xyXG52YXIgaGFzS2FuamkgPSBmdW5jdGlvbihzdHIpe1xyXG4gICAgZm9yKHZhciBpPTA7aTxzdHIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgaWYoaXNLYW5qaShzdHJbaV0pKSByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbnZhciBnZXRTdHJUeXBlID0gZnVuY3Rpb24oc3RyKXsgLy8wIGZvciBwdXJlIGthbmppLDEgZm9yIGthbmppLWhpcmEoa2FuYSktbWl4ZWQsMiBmb3IgcHVyZSBoaXJhKGthbmEpLDMgZm9yIG90aGVyc1xyXG4gICAgdmFyIGhhc0tKID0gZmFsc2U7XHJcbiAgICB2YXIgaGFzSEsgPSBmYWxzZTtcclxuICAgIGZvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGlmKGlzS2Fuamkoc3RyW2ldKSkge1xyXG4gICAgICAgICAgICBoYXNLSiA9IHRydWU7XHJcbiAgICAgICAgfWVsc2UgaWYod2FuYWthbmEuaXNIaXJhZ2FuYShzdHJbaV0pIHx8IHdhbmFrYW5hLmlzS2F0YWthbmEoc3RyW2ldKSkge1xyXG4gICAgICAgICAgICBoYXNISyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYoaGFzS0ogJiYgaGFzSEspIHJldHVybiAxO1xyXG4gICAgZWxzZSBpZihoYXNLSikgcmV0dXJuIDA7XHJcbiAgICBlbHNlIGlmKGhhc0hLKSByZXR1cm4gMjtcclxuICAgIGVsc2UgcmV0dXJuIDM7XHJcbn07XHJcblxyXG52YXIgc3BsaXRPYmpBcnJheSA9IGZ1bmN0aW9uKGFycixwcm9wLHNwbGl0KXtcclxuICAgIHNwbGl0ID0gc3BsaXQgfHwgJyc7XHJcbiAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICBmb3IodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICBpZihpIT09YXJyLmxlbmd0aC0xKXtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IGFycltpXVtwcm9wXSArICcnICsgc3BsaXQ7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSBhcnJbaV1bcHJvcF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGdpdmVuIHN0cmluZyB0byB0YXJnZXQgc3lsbGFiYXJ5IHdpdGggb3B0aW9ucyBhdmFpbGFibGVcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBHaXZlbiBTdHJpbmdcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBKU09OIG9iamVjdCB3aGljaCBoYXZlIGtleS12YWx1ZSBwYWlycyBzZXR0aW5nc1xyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMudG89J2hpcmFnYW5hJ10gVGFyZ2V0IHN5bGxhYmFyeSBbJ2hpcmFnYW5hJ3wna2F0YWthbmEnfCdyb21hamknXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubW9kZT0nbm9ybWFsJ10gQ29udmVydCBtb2RlIFsnbm9ybWFsJ3wnc3BhY2VkJ3wnb2t1cmlnYW5hJ3wnZnVyaWdhbmEnXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGVsaW1pdGVyX3N0YXJ0PScoJ10gRGVsaW1pdGVyKFN0YXJ0KVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGVsaW1pdGVyX2VuZD0nKSddIERlbGltaXRlcihFbmQpXHJcbiAqIFRPRE8gQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5jb252ZXJ0YWxsPWZhbHNlXSBJZiBjb252ZXJ0IGFsbCBjaGFyYWN0ZXJzIHRvIHRhcmdldCBzeWxsYWJhcnkgKGJ5IGRlZmF1bHQgb25seSBrYW5qaSB3aWxsIGJlIGNvbnZlcnRlZClcclxuICovXHJcbnZhciBjb252ZXJ0ID0gZnVuY3Rpb24oc3RyLCBvcHRpb25zKXtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgb3B0aW9ucy50byA9IG9wdGlvbnMudG8gfHwgJ2hpcmFnYW5hJztcclxuICAgIG9wdGlvbnMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCAnbm9ybWFsJztcclxuICAgIC8vb3B0aW9ucy5jb252ZXJ0YWxsID0gb3B0aW9ucy5jb252ZXJ0YWxsIHx8IGZhbHNlO1xyXG4gICAgb3B0aW9ucy5kZWxpbWl0ZXJfc3RhcnQgPSBvcHRpb25zLmRlbGltaXRlcl9zdGFydCB8fCAnKCc7XHJcbiAgICBvcHRpb25zLmRlbGltaXRlcl9lbmQgPSBvcHRpb25zLmRlbGltaXRlcl9lbmQgfHwgJyknO1xyXG4gICAgc3RyID0gc3RyIHx8ICcnO1xyXG5cclxuICAgIHZhciB0b2tlbnMgPSB0b2tlbml6ZXIudG9rZW5pemUoc3RyKTtcclxuICAgIGZvcih2YXIgY3I9MDtjcjx0b2tlbnMubGVuZ3RoO2NyKyspe1xyXG4gICAgICAgIGlmKCF0b2tlbnNbY3JdLnJlYWRpbmcpXHJcbiAgICAgICAgICAgIHRva2Vuc1tjcl0ucmVhZGluZyA9IHRva2Vuc1tjcl0uc3VyZmFjZV9mb3JtO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKG9wdGlvbnMubW9kZSA9PT0gJ25vcm1hbCcgfHwgb3B0aW9ucy5tb2RlID09PSAnc3BhY2VkJyl7XHJcbiAgICAgICAgc3dpdGNoIChvcHRpb25zLnRvKXtcclxuICAgICAgICAgICAgY2FzZSAna2F0YWthbmEnOlxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5tb2RlID09PSAnbm9ybWFsJylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3BsaXRPYmpBcnJheSh0b2tlbnMsJ3JlYWRpbmcnKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3BsaXRPYmpBcnJheSh0b2tlbnMsJ3JlYWRpbmcnLCcgJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncm9tYWppJzpcclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMubW9kZSA9PT0gJ25vcm1hbCcpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdhbmFrYW5hLnRvUm9tYWppKHNwbGl0T2JqQXJyYXkodG9rZW5zLCAncmVhZGluZycpKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2FuYWthbmEudG9Sb21hamkoc3BsaXRPYmpBcnJheSh0b2tlbnMsICdyZWFkaW5nJywgJyAnKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaGlyYWdhbmEnOlxyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBoaT0wO2hpPHRva2Vucy5sZW5ndGg7aGkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaGFzS2FuamkodG9rZW5zW2hpXS5zdXJmYWNlX2Zvcm0pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWhhc0thdGFrYW5hKHRva2Vuc1toaV0uc3VyZmFjZV9mb3JtKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbnNbaGldLnJlYWRpbmcgPSB3YW5ha2FuYS50b0hpcmFnYW5hKHRva2Vuc1toaV0ucmVhZGluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGFuZGxlIGthdGFrYW5hLWthbmppLW1peGVkIHRva2Vuc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW5zW2hpXS5yZWFkaW5nID0gd2FuYWthbmEudG9IaXJhZ2FuYSh0b2tlbnNbaGldLnJlYWRpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRtcCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhwYXR0ZXJuID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGhjPTA7aGM8dG9rZW5zW2hpXS5zdXJmYWNlX2Zvcm0ubGVuZ3RoO2hjKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzS2FuamkodG9rZW5zW2hpXS5zdXJmYWNlX2Zvcm1baGNdKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhwYXR0ZXJuICs9ICcoLiopJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHBhdHRlcm4gKz0gd2FuYWthbmEuaXNLYXRha2FuYSh0b2tlbnNbaGldLnN1cmZhY2VfZm9ybVtoY10pID8gd2FuYWthbmEudG9IaXJhZ2FuYSh0b2tlbnNbaGldLnN1cmZhY2VfZm9ybVtoY10pOnRva2Vuc1toaV0uc3VyZmFjZV9mb3JtW2hjXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHJlZyA9IG5ldyBSZWdFeHAoaHBhdHRlcm4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhtYXRjaGVzID0gaHJlZy5leGVjKHRva2Vuc1toaV0ucmVhZGluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihobWF0Y2hlcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBpY2tLSiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBoYzE9MDtoYzE8dG9rZW5zW2hpXS5zdXJmYWNlX2Zvcm0ubGVuZ3RoO2hjMSsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXNLYW5qaSh0b2tlbnNbaGldLnN1cmZhY2VfZm9ybVtoYzFdKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXAgKz0gaG1hdGNoZXNbcGlja0tKKzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja0tKKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wICs9IHRva2Vuc1toaV0uc3VyZmFjZV9mb3JtW2hjMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW5zW2hpXS5yZWFkaW5nID0gdG1wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2Vuc1toaV0ucmVhZGluZyA9IHRva2Vuc1toaV0uc3VyZmFjZV9mb3JtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMubW9kZSA9PT0gJ25vcm1hbCcpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNwbGl0T2JqQXJyYXkodG9rZW5zLCdyZWFkaW5nJyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNwbGl0T2JqQXJyYXkodG9rZW5zLCdyZWFkaW5nJywnICcpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfWVsc2UgaWYob3B0aW9ucy5tb2RlID09PSAnb2t1cmlnYW5hJyB8fCBvcHRpb25zLm1vZGUgPT09ICdmdXJpZ2FuYScpe1xyXG4gICAgICAgIHZhciBub3RhdGlvbnMgPSBbXTsgLy9bYmFzaWMsYmFzaWNfdHlwZVsxPWthbmppLDI9aGlyYWdhbmEoa2F0YWthbmEpLDM9b3RoZXJzXSxub3RhdGlvbl1cclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRva2Vucy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdG9rZW5zW2ldLnJlYWRpbmcgPSB3YW5ha2FuYS50b0hpcmFnYW5hKHRva2Vuc1tpXS5yZWFkaW5nKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzdHJUeXBlID0gZ2V0U3RyVHlwZSh0b2tlbnNbaV0uc3VyZmFjZV9mb3JtKTtcclxuICAgICAgICAgICAgc3dpdGNoIChzdHJUeXBlKXtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBub3RhdGlvbnMucHVzaChbdG9rZW5zW2ldLnN1cmZhY2VfZm9ybSwxLHRva2Vuc1tpXS5yZWFkaW5nXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhdHRlcm4gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNMYXN0VG9rZW5LYW5qaSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdWJzID0gW107IC8vIHJlY29nbml6ZSBrYW5qaXMgYW5kIGdyb3VwIHRoZW1cclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGM9MDtjPHRva2Vuc1tpXS5zdXJmYWNlX2Zvcm0ubGVuZ3RoO2MrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzS2FuamkodG9rZW5zW2ldLnN1cmZhY2VfZm9ybVtjXSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzTGFzdFRva2VuS2FuamkpeyAgIC8vIGlnbm9yZSBzdWNjZXNzaXZlIGthbmppIHRva2VucyAoIzEwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTGFzdFRva2VuS2FuamkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4gKz0gJyguKj8pJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzLnB1c2godG9rZW5zW2ldLnN1cmZhY2VfZm9ybVtjXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzW3N1YnMubGVuZ3RoLTFdICs9IHRva2Vuc1tpXS5zdXJmYWNlX2Zvcm1bY107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNMYXN0VG9rZW5LYW5qaSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vicy5wdXNoKHRva2Vuc1tpXS5zdXJmYWNlX2Zvcm1bY10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybiArPSB3YW5ha2FuYS5pc0thdGFrYW5hKHRva2Vuc1tpXS5zdXJmYWNlX2Zvcm1bY10pID8gd2FuYWthbmEudG9IaXJhZ2FuYSh0b2tlbnNbaV0uc3VyZmFjZV9mb3JtW2NdKTp0b2tlbnNbaV0uc3VyZmFjZV9mb3JtW2NdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCdeJyArIHBhdHRlcm4gKyAnJCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaGVzID0gcmVnLmV4ZWModG9rZW5zW2ldLnJlYWRpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG1hdGNoZXMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGlja0thbmppID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBjMT0wO2MxPHN1YnMubGVuZ3RoO2MxKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXNLYW5qaShzdWJzW2MxXVswXSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGF0aW9ucy5wdXNoKFtzdWJzW2MxXSwxLG1hdGNoZXNbcGlja0thbmppKytdXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RhdGlvbnMucHVzaChbc3Vic1tjMV0sMix3YW5ha2FuYS50b0hpcmFnYW5hKHN1YnNbYzFdKV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGF0aW9ucy5wdXNoKFt0b2tlbnNbaV0uc3VyZmFjZV9mb3JtLDEsdG9rZW5zW2ldLnJlYWRpbmddKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBjMj0wO2MyPHRva2Vuc1tpXS5zdXJmYWNlX2Zvcm0ubGVuZ3RoO2MyKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RhdGlvbnMucHVzaChbdG9rZW5zW2ldLnN1cmZhY2VfZm9ybVtjMl0sMix0b2tlbnNbaV0ucmVhZGluZ1tjMl1dKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBjMz0wO2MzPHRva2Vuc1tpXS5zdXJmYWNlX2Zvcm0ubGVuZ3RoO2MzKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RhdGlvbnMucHVzaChbdG9rZW5zW2ldLnN1cmZhY2VfZm9ybVtjM10sMyx0b2tlbnNbaV0uc3VyZmFjZV9mb3JtW2MzXV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgc3dpdGNoIChvcHRpb25zLnRvKXtcclxuICAgICAgICAgICAgY2FzZSAna2F0YWthbmEnOlxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5tb2RlID09PSAnb2t1cmlnYW5hJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBuMD0wO24wPG5vdGF0aW9ucy5sZW5ndGg7bjArKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG5vdGF0aW9uc1tuMF1bMV0hPT0xKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBub3RhdGlvbnNbbjBdWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBub3RhdGlvbnNbbjBdWzBdICsgb3B0aW9ucy5kZWxpbWl0ZXJfc3RhcnQgKyB3YW5ha2FuYS50b0thdGFrYW5hKG5vdGF0aW9uc1tuMF1bMl0pICsgb3B0aW9ucy5kZWxpbWl0ZXJfZW5kO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7IC8vZnVyaWdhbmFcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIG4xPTA7bjE8bm90YXRpb25zLmxlbmd0aDtuMSsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobm90YXRpb25zW24xXVsxXSE9PTEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IG5vdGF0aW9uc1tuMV1bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiPHJ1Ynk+XCIgKyBub3RhdGlvbnNbbjFdWzBdICsgXCI8cnA+XCIgKyBvcHRpb25zLmRlbGltaXRlcl9zdGFydCArIFwiPC9ycD48cnQ+XCIgKyB3YW5ha2FuYS50b0thdGFrYW5hKG5vdGF0aW9uc1tuMV1bMl0pICsgXCI8L3J0PjxycD5cIiArIG9wdGlvbnMuZGVsaW1pdGVyX2VuZCArIFwiPC9ycD48L3J1Ynk+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICBjYXNlICdyb21hamknOlxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5tb2RlID09PSAnb2t1cmlnYW5hJylcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIG4yPTA7bjI8bm90YXRpb25zLmxlbmd0aDtuMisrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobm90YXRpb25zW24yXVsxXSE9PTEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IG5vdGF0aW9uc1tuMl1bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IG5vdGF0aW9uc1tuMl1bMF0gKyBvcHRpb25zLmRlbGltaXRlcl9zdGFydCArIHdhbmFrYW5hLnRvUm9tYWppKG5vdGF0aW9uc1tuMl1bMl0pICsgb3B0aW9ucy5kZWxpbWl0ZXJfZW5kO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXsgLy9mdXJpZ2FuYVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIjxydWJ5PlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgbjM9MDtuMzxub3RhdGlvbnMubGVuZ3RoO24zKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gbm90YXRpb25zW24zXVswXSArIFwiPHJwPlwiICsgb3B0aW9ucy5kZWxpbWl0ZXJfc3RhcnQgKyBcIjwvcnA+PHJ0PlwiICsgd2FuYWthbmEudG9Sb21hamkobm90YXRpb25zW24zXVsyXSkgKyBcIjwvcnQ+PHJwPlwiICsgb3B0aW9ucy5kZWxpbWl0ZXJfZW5kICsgXCI8L3JwPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gXCI8L3J1Ynk+XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICBjYXNlICdoaXJhZ2FuYSc6XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLm1vZGUgPT09ICdva3VyaWdhbmEnKXtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIG40PTA7bjQ8bm90YXRpb25zLmxlbmd0aDtuNCsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobm90YXRpb25zW240XVsxXSE9PTEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IG5vdGF0aW9uc1tuNF1bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IG5vdGF0aW9uc1tuNF1bMF0gKyBvcHRpb25zLmRlbGltaXRlcl9zdGFydCArIG5vdGF0aW9uc1tuNF1bMl0gKyBvcHRpb25zLmRlbGltaXRlcl9lbmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXsgLy9mdXJpZ2FuYVxyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgbjU9MDtuNTxub3RhdGlvbnMubGVuZ3RoO241Kyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihub3RhdGlvbnNbbjVdWzFdIT09MSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gbm90YXRpb25zW241XVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gXCI8cnVieT5cIiArIG5vdGF0aW9uc1tuNV1bMF0gKyBcIjxycD5cIiArIG9wdGlvbnMuZGVsaW1pdGVyX3N0YXJ0ICsgXCI8L3JwPjxydD5cIiArIG5vdGF0aW9uc1tuNV1bMl0gKyBcIjwvcnQ+PHJwPlwiICsgb3B0aW9ucy5kZWxpbWl0ZXJfZW5kICsgXCI8L3JwPjwvcnVieT5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBzdWNoIG1vZGUuLi4nKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVydCBnaXZlbiBzdHJpbmcgdG8gaGlyYWdhbmEgd2l0aCBvcHRpb25zIGF2YWlsYWJsZVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIEdpdmVuIFN0cmluZ1xyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIEpTT04gb2JqZWN0IHdoaWNoIGhhdmUga2V5LXZhbHVlIHBhaXJzIHNldHRpbmdzXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5tb2RlPSdub3JtYWwnXSBDb252ZXJ0IG1vZGUgWydub3JtYWwnfCdzcGFjZWQnfCdva3VyaWdhbmEnfCdmdXJpZ2FuYSddXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5kZWxpbWl0ZXJfc3RhcnQ9JygnXSBEZWxpbWl0ZXIoU3RhcnQpXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5kZWxpbWl0ZXJfZW5kPScpJ10gRGVsaW1pdGVyKEVuZClcclxuICovXHJcbnZhciB0b0hpcmFnYW5hID0gZnVuY3Rpb24oc3RyLCBvcHRpb25zKXtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgb3B0aW9ucy50byA9ICdoaXJhZ2FuYSc7XHJcbiAgICByZXR1cm4gY29udmVydChzdHIsb3B0aW9ucyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVydCBnaXZlbiBzdHJpbmcgdG8ga2F0YWthbmEgd2l0aCBvcHRpb25zIGF2YWlsYWJsZVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIEdpdmVuIFN0cmluZ1xyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIEpTT04gb2JqZWN0IHdoaWNoIGhhdmUga2V5LXZhbHVlIHBhaXJzIHNldHRpbmdzXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5tb2RlPSdub3JtYWwnXSBDb252ZXJ0IG1vZGUgWydub3JtYWwnfCdzcGFjZWQnfCdva3VyaWdhbmEnfCdmdXJpZ2FuYSddXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5kZWxpbWl0ZXJfc3RhcnQ9JygnXSBEZWxpbWl0ZXIoU3RhcnQpXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5kZWxpbWl0ZXJfZW5kPScpJ10gRGVsaW1pdGVyKEVuZClcclxuICovXHJcbnZhciB0b0thdGFrYW5hID0gZnVuY3Rpb24oc3RyLCBvcHRpb25zKXtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgb3B0aW9ucy50byA9ICdrYXRha2FuYSc7XHJcbiAgICByZXR1cm4gY29udmVydChzdHIsb3B0aW9ucyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVydCBnaXZlbiBzdHJpbmcgdG8gcm9tYWppIHdpdGggb3B0aW9ucyBhdmFpbGFibGVcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBHaXZlbiBTdHJpbmdcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBKU09OIG9iamVjdCB3aGljaCBoYXZlIGtleS12YWx1ZSBwYWlycyBzZXR0aW5nc1xyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubW9kZT0nbm9ybWFsJ10gQ29udmVydCBtb2RlIFsnbm9ybWFsJ3wnc3BhY2VkJ3wnb2t1cmlnYW5hJ3wnZnVyaWdhbmEnXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGVsaW1pdGVyX3N0YXJ0PScoJ10gRGVsaW1pdGVyKFN0YXJ0KVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGVsaW1pdGVyX2VuZD0nKSddIERlbGltaXRlcihFbmQpXHJcbiAqL1xyXG52YXIgdG9Sb21hamkgPSBmdW5jdGlvbihzdHIsIG9wdGlvbnMpe1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICBvcHRpb25zLnRvID0gJ3JvbWFqaSc7XHJcbiAgICByZXR1cm4gY29udmVydChzdHIsb3B0aW9ucyk7XHJcbn07XHJcblxyXG4vKipcclxuICogSW5pdGlhdGUga3Vyb3NoaXJvLmpzXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbnMgW2RpY1BhdGhdXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYWxsYmFja10gQ2FsbGJhY2sgYWZ0ZXIgYnVpbGRpbmcga3Vyb21vamkgdG9rZW5pemVyXHJcbiAqL1xyXG52YXIgaW5pdCA9IGZ1bmN0aW9uKG9wdGlvbnMsIGNhbGxiYWNrKXtcclxuICAgIGlmKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKXtcclxuICAgICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XHJcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xyXG4gICAgfWVsc2UgaWYodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKXtcclxuICAgICAgICBpZiAoIWNhbGxiYWNrIHx8IHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xyXG4gICAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICAgIG9wdGlvbnMgPSB7fTtcclxuICAgICAgICBpZiAoIWNhbGxiYWNrIHx8IHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKXt9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGljUGF0aCA9IG9wdGlvbnMuZGljUGF0aDtcclxuICAgIGlmKCFkaWNQYXRoKXtcclxuICAgICAgICBpZihpc05vZGUpIGRpY1BhdGggPSByZXF1aXJlLnJlc29sdmUoJ2t1cm9tb2ppJykucmVwbGFjZSgvc3JjLiovLCdkaWN0LycpO1xyXG4gICAgICAgIGVsc2UgZGljUGF0aCA9ICdib3dlcl9jb21wb25lbnRzL2t1cm9zaGlyby9kaXN0L2RpY3QvJztcclxuICAgIH1cclxuICAgIGt1cm9tb2ppLmJ1aWxkZXIoeyBkaWNQYXRoOiBkaWNQYXRoIH0pLmJ1aWxkKGZ1bmN0aW9uIChlcnIsIG5ld3Rva2VuaXplcikge1xyXG4gICAgICAgIGlmKGVycilcclxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XHJcblxyXG4gICAgICAgIHRva2VuaXplciA9IG5ld3Rva2VuaXplcjtcclxuICAgICAgICBrdXJvc2hpcm8udG9rZW5pemUgPSB0b2tlbml6ZXIudG9rZW5pemU7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxudmFyIGt1cm9zaGlybyA9IHtcclxuICAgIGluaXQ6IGluaXQsXHJcbiAgICBpc0hpcmFnYW5hOiB3YW5ha2FuYS5pc0hpcmFnYW5hLFxyXG4gICAgaXNLYXRha2FuYTogd2FuYWthbmEuaXNLYXRha2FuYSxcclxuICAgIGlzUm9tYWppOiB3YW5ha2FuYS5pc1JvbWFqaSxcclxuICAgIGlzS2Fuamk6IGlzS2FuamksXHJcbiAgICBoYXNIaXJhZ2FuYTogaGFzSGlyYWdhbmEsXHJcbiAgICBoYXNLYXRha2FuYTogaGFzS2F0YWthbmEsXHJcbiAgICBoYXNLYW5qaTogaGFzS2FuamksXHJcbiAgICBjb252ZXJ0OiBjb252ZXJ0LFxyXG4gICAgdG9IaXJhZ2FuYTogdG9IaXJhZ2FuYSxcclxuICAgIHRvS2F0YWthbmE6IHRvS2F0YWthbmEsXHJcbiAgICB0b1JvbWFqaTogdG9Sb21hamksXHJcbiAgICB0b0thbmE6IHdhbmFrYW5hLnRvS2FuYVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrdXJvc2hpcm87XHJcbiJdLCJmaWxlIjoia3Vyb3NoaXJvLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
