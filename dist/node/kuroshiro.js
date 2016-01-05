/*!
 * kuroshiro.js
 * Copyright(c) 2015 Hexen Qi <hexenq@gmail.com>
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
                    if(!hasKatakana(tokens[hi].surface_form) && hasKanji(tokens[hi].surface_form)){
                        tokens[hi].reading = wanakana.toHiragana(tokens[hi].reading);
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
                    for(var c=0;c<tokens[i].surface_form.length;c++){
                        if(isKanji(tokens[i].surface_form[c])){
                            pattern += '(.*)';
                        }else{
                            pattern += tokens[i].surface_form[c];
                        }
                    }
                    var reg = new RegExp(pattern);
                    var matches = reg.exec(tokens[i].reading);
                    var pickKanji = 0;
                    for(var c1=0;c1<tokens[i].surface_form.length;c1++){
                        if(isKanji(tokens[i].surface_form[c1])){
                            notations.push([tokens[i].surface_form[c1],1,matches[pickKanji+1]]);
                            pickKanji++;
                        }else{
                            notations.push([tokens[i].surface_form[c1],2,wanakana.toHiragana(tokens[i].surface_form[c1])]);
                        }
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
    }else{
        options = options || {};
    }

    var dicPath = options.dicPath;
    if(!dicPath){
        if(isNode) dicPath = require.resolve('kuromoji').replace(/dist.*/,'dist/dict/');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJrdXJvc2hpcm8uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIGt1cm9zaGlyby5qc1xyXG4gKiBDb3B5cmlnaHQoYykgMjAxNSBIZXhlbiBRaSA8aGV4ZW5xQGdtYWlsLmNvbT5cclxuICogTUlUIExpY2Vuc2VkXHJcbiAqL1xyXG5cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIga3Vyb21vamkgPSByZXF1aXJlKCdrdXJvbW9qaScpO1xyXG52YXIgd2FuYWthbmEgPSByZXF1aXJlKCd3YW5ha2FuYScpO1xyXG5cclxudmFyIHRva2VuaXplciA9IG51bGw7XHJcblxyXG4vLyBjaGVjayB3aGVyZSB3ZSBhcmUsIG5vZGUgb3IgYnJvd3NlclxyXG52YXIgaXNOb2RlID0gZmFsc2U7XHJcbnZhciBpc0Jyb3dzZXIgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpO1xyXG5pZighaXNCcm93c2VyICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKXtcclxuICAgIGlzTm9kZSA9IHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBnaXZlbiBjaGFyIGlzIGEga2FuamlcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGNoIEdpdmVuIGNoYXJcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaWYgZ2l2ZW4gY2hhciBpcyBhIGthbmppXHJcbiAqL1xyXG52YXIgaXNLYW5qaSA9IGZ1bmN0aW9uKGNoKXtcclxuICAgIGNoID0gY2hbMF07XHJcbiAgICByZXR1cm4gKGNoID49ICdcXHU0ZTAwJyAmJiBjaCA8PSAnXFx1OWZjZicpIHx8XHJcbiAgICAgICAgICAgIChjaCA+PSAnXFx1ZjkwMCcgJiYgY2ggPD0gJ1xcdWZhZmYnKSB8fFxyXG4gICAgICAgICAgICAoY2ggPj0gJ1xcdTM0MDAnICYmIGNoIDw9ICdcXHU0ZGJmJyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZ2l2ZW4gc3RyaW5nIGhhcyBoaXJhZ2FuYVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIEdpdmVuIHN0cmluZ1xyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpZiBnaXZlbiBzdHJpbmcgaGFzIGhpcmFnYW5hXHJcbiAqL1xyXG52YXIgaGFzSGlyYWdhbmEgPSBmdW5jdGlvbihzdHIpe1xyXG4gICAgZm9yKHZhciBpPTA7aTxzdHIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgaWYod2FuYWthbmEuaXNIaXJhZ2FuYShzdHJbaV0pKSByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBnaXZlbiBzdHJpbmcgaGFzIGthdGFrYW5hXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgR2l2ZW4gc3RyaW5nXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlmIGdpdmVuIHN0cmluZyBoYXMga2F0YWthbmFcclxuICovXHJcbnZhciBoYXNLYXRha2FuYSA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICBmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7aSsrKXtcclxuICAgICAgICBpZih3YW5ha2FuYS5pc0thdGFrYW5hKHN0cltpXSkpIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGdpdmVuIHN0cmluZyBoYXMga2FuamlcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBHaXZlbiBzdHJpbmdcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaWYgZ2l2ZW4gc3RyaW5nIGhhcyBrYW5qaVxyXG4gKi9cclxudmFyIGhhc0thbmppID0gZnVuY3Rpb24oc3RyKXtcclxuICAgIGZvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGlmKGlzS2Fuamkoc3RyW2ldKSkgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG52YXIgZ2V0U3RyVHlwZSA9IGZ1bmN0aW9uKHN0cil7IC8vMCBmb3IgcHVyZSBrYW5qaSwxIGZvciBrYW5qaS1oaXJhKGthbmEpLW1peGVkLDIgZm9yIHB1cmUgaGlyYShrYW5hKSwzIGZvciBvdGhlcnNcclxuICAgIHZhciBoYXNLSiA9IGZhbHNlO1xyXG4gICAgdmFyIGhhc0hLID0gZmFsc2U7XHJcbiAgICBmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7aSsrKXtcclxuICAgICAgICBpZihpc0thbmppKHN0cltpXSkpIHtcclxuICAgICAgICAgICAgaGFzS0ogPSB0cnVlO1xyXG4gICAgICAgIH1lbHNlIGlmKHdhbmFrYW5hLmlzSGlyYWdhbmEoc3RyW2ldKSB8fCB3YW5ha2FuYS5pc0thdGFrYW5hKHN0cltpXSkpIHtcclxuICAgICAgICAgICAgaGFzSEsgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmKGhhc0tKICYmIGhhc0hLKSByZXR1cm4gMTtcclxuICAgIGVsc2UgaWYoaGFzS0opIHJldHVybiAwO1xyXG4gICAgZWxzZSBpZihoYXNISykgcmV0dXJuIDI7XHJcbiAgICBlbHNlIHJldHVybiAzO1xyXG59O1xyXG5cclxudmFyIHNwbGl0T2JqQXJyYXkgPSBmdW5jdGlvbihhcnIscHJvcCxzcGxpdCl7XHJcbiAgICBzcGxpdCA9IHNwbGl0IHx8ICcnO1xyXG4gICAgdmFyIHJlc3VsdCA9ICcnO1xyXG4gICAgZm9yKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgaWYoaSE9PWFyci5sZW5ndGgtMSl7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSBhcnJbaV1bcHJvcF0gKyAnJyArIHNwbGl0O1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXN1bHQgKz0gYXJyW2ldW3Byb3BdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVydCBnaXZlbiBzdHJpbmcgdG8gdGFyZ2V0IHN5bGxhYmFyeSB3aXRoIG9wdGlvbnMgYXZhaWxhYmxlXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgR2l2ZW4gU3RyaW5nXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gSlNPTiBvYmplY3Qgd2hpY2ggaGF2ZSBrZXktdmFsdWUgcGFpcnMgc2V0dGluZ3NcclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLnRvPSdoaXJhZ2FuYSddIFRhcmdldCBzeWxsYWJhcnkgWydoaXJhZ2FuYSd8J2thdGFrYW5hJ3wncm9tYWppJ11cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm1vZGU9J25vcm1hbCddIENvbnZlcnQgbW9kZSBbJ25vcm1hbCd8J3NwYWNlZCd8J29rdXJpZ2FuYSd8J2Z1cmlnYW5hJ11cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmRlbGltaXRlcl9zdGFydD0nKCddIERlbGltaXRlcihTdGFydClcclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmRlbGltaXRlcl9lbmQ9JyknXSBEZWxpbWl0ZXIoRW5kKVxyXG4gKiBUT0RPIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuY29udmVydGFsbD1mYWxzZV0gSWYgY29udmVydCBhbGwgY2hhcmFjdGVycyB0byB0YXJnZXQgc3lsbGFiYXJ5IChieSBkZWZhdWx0IG9ubHkga2Fuamkgd2lsbCBiZSBjb252ZXJ0ZWQpXHJcbiAqL1xyXG52YXIgY29udmVydCA9IGZ1bmN0aW9uKHN0ciwgb3B0aW9ucyl7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIG9wdGlvbnMudG8gPSBvcHRpb25zLnRvIHx8ICdoaXJhZ2FuYSc7XHJcbiAgICBvcHRpb25zLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgJ25vcm1hbCc7XHJcbiAgICAvL29wdGlvbnMuY29udmVydGFsbCA9IG9wdGlvbnMuY29udmVydGFsbCB8fCBmYWxzZTtcclxuICAgIG9wdGlvbnMuZGVsaW1pdGVyX3N0YXJ0ID0gb3B0aW9ucy5kZWxpbWl0ZXJfc3RhcnQgfHwgJygnO1xyXG4gICAgb3B0aW9ucy5kZWxpbWl0ZXJfZW5kID0gb3B0aW9ucy5kZWxpbWl0ZXJfZW5kIHx8ICcpJztcclxuICAgIHN0ciA9IHN0ciB8fCAnJztcclxuXHJcbiAgICB2YXIgdG9rZW5zID0gdG9rZW5pemVyLnRva2VuaXplKHN0cik7XHJcbiAgICBmb3IodmFyIGNyPTA7Y3I8dG9rZW5zLmxlbmd0aDtjcisrKXtcclxuICAgICAgICBpZighdG9rZW5zW2NyXS5yZWFkaW5nKVxyXG4gICAgICAgICAgICB0b2tlbnNbY3JdLnJlYWRpbmcgPSB0b2tlbnNbY3JdLnN1cmZhY2VfZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICBpZihvcHRpb25zLm1vZGUgPT09ICdub3JtYWwnIHx8IG9wdGlvbnMubW9kZSA9PT0gJ3NwYWNlZCcpe1xyXG4gICAgICAgIHN3aXRjaCAob3B0aW9ucy50byl7XHJcbiAgICAgICAgICAgIGNhc2UgJ2thdGFrYW5hJzpcclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMubW9kZSA9PT0gJ25vcm1hbCcpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNwbGl0T2JqQXJyYXkodG9rZW5zLCdyZWFkaW5nJyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNwbGl0T2JqQXJyYXkodG9rZW5zLCdyZWFkaW5nJywnICcpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JvbWFqaSc6XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLm1vZGUgPT09ICdub3JtYWwnKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3YW5ha2FuYS50b1JvbWFqaShzcGxpdE9iakFycmF5KHRva2VucywgJ3JlYWRpbmcnKSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdhbmFrYW5hLnRvUm9tYWppKHNwbGl0T2JqQXJyYXkodG9rZW5zLCAncmVhZGluZycsICcgJykpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2hpcmFnYW5hJzpcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaGk9MDtoaTx0b2tlbnMubGVuZ3RoO2hpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFoYXNLYXRha2FuYSh0b2tlbnNbaGldLnN1cmZhY2VfZm9ybSkgJiYgaGFzS2FuamkodG9rZW5zW2hpXS5zdXJmYWNlX2Zvcm0pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW5zW2hpXS5yZWFkaW5nID0gd2FuYWthbmEudG9IaXJhZ2FuYSh0b2tlbnNbaGldLnJlYWRpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbnNbaGldLnJlYWRpbmcgPSB0b2tlbnNbaGldLnN1cmZhY2VfZm9ybTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLm1vZGUgPT09ICdub3JtYWwnKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzcGxpdE9iakFycmF5KHRva2VucywncmVhZGluZycpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzcGxpdE9iakFycmF5KHRva2VucywncmVhZGluZycsJyAnKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1lbHNlIGlmKG9wdGlvbnMubW9kZSA9PT0gJ29rdXJpZ2FuYScgfHwgb3B0aW9ucy5tb2RlID09PSAnZnVyaWdhbmEnKXtcclxuICAgICAgICB2YXIgbm90YXRpb25zID0gW107IC8vW2Jhc2ljLGJhc2ljX3R5cGVbMT1rYW5qaSwyPWhpcmFnYW5hKGthdGFrYW5hKSwzPW90aGVyc10sbm90YXRpb25dXHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx0b2tlbnMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHRva2Vuc1tpXS5yZWFkaW5nID0gd2FuYWthbmEudG9IaXJhZ2FuYSh0b2tlbnNbaV0ucmVhZGluZyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc3RyVHlwZSA9IGdldFN0clR5cGUodG9rZW5zW2ldLnN1cmZhY2VfZm9ybSk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoc3RyVHlwZSl7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgbm90YXRpb25zLnB1c2goW3Rva2Vuc1tpXS5zdXJmYWNlX2Zvcm0sMSx0b2tlbnNbaV0ucmVhZGluZ10pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXR0ZXJuID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBjPTA7Yzx0b2tlbnNbaV0uc3VyZmFjZV9mb3JtLmxlbmd0aDtjKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpc0thbmppKHRva2Vuc1tpXS5zdXJmYWNlX2Zvcm1bY10pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4gKz0gJyguKiknO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4gKz0gdG9rZW5zW2ldLnN1cmZhY2VfZm9ybVtjXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChwYXR0ZXJuKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IHJlZy5leGVjKHRva2Vuc1tpXS5yZWFkaW5nKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGlja0thbmppID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGMxPTA7YzE8dG9rZW5zW2ldLnN1cmZhY2VfZm9ybS5sZW5ndGg7YzErKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzS2FuamkodG9rZW5zW2ldLnN1cmZhY2VfZm9ybVtjMV0pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGF0aW9ucy5wdXNoKFt0b2tlbnNbaV0uc3VyZmFjZV9mb3JtW2MxXSwxLG1hdGNoZXNbcGlja0thbmppKzFdXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrS2FuamkrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RhdGlvbnMucHVzaChbdG9rZW5zW2ldLnN1cmZhY2VfZm9ybVtjMV0sMix3YW5ha2FuYS50b0hpcmFnYW5hKHRva2Vuc1tpXS5zdXJmYWNlX2Zvcm1bYzFdKV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgYzI9MDtjMjx0b2tlbnNbaV0uc3VyZmFjZV9mb3JtLmxlbmd0aDtjMisrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90YXRpb25zLnB1c2goW3Rva2Vuc1tpXS5zdXJmYWNlX2Zvcm1bYzJdLDIsdG9rZW5zW2ldLnJlYWRpbmdbYzJdXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgYzM9MDtjMzx0b2tlbnNbaV0uc3VyZmFjZV9mb3JtLmxlbmd0aDtjMysrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90YXRpb25zLnB1c2goW3Rva2Vuc1tpXS5zdXJmYWNlX2Zvcm1bYzNdLDMsdG9rZW5zW2ldLnN1cmZhY2VfZm9ybVtjM11dKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICcnO1xyXG4gICAgICAgIHN3aXRjaCAob3B0aW9ucy50byl7XHJcbiAgICAgICAgICAgIGNhc2UgJ2thdGFrYW5hJzpcclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMubW9kZSA9PT0gJ29rdXJpZ2FuYScpe1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgbjA9MDtuMDxub3RhdGlvbnMubGVuZ3RoO24wKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihub3RhdGlvbnNbbjBdWzFdIT09MSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gbm90YXRpb25zW24wXVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gbm90YXRpb25zW24wXVswXSArIG9wdGlvbnMuZGVsaW1pdGVyX3N0YXJ0ICsgd2FuYWthbmEudG9LYXRha2FuYShub3RhdGlvbnNbbjBdWzJdKSArIG9wdGlvbnMuZGVsaW1pdGVyX2VuZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNleyAvL2Z1cmlnYW5hXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBuMT0wO24xPG5vdGF0aW9ucy5sZW5ndGg7bjErKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG5vdGF0aW9uc1tuMV1bMV0hPT0xKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBub3RhdGlvbnNbbjFdWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIjxydWJ5PlwiICsgbm90YXRpb25zW24xXVswXSArIFwiPHJwPlwiICsgb3B0aW9ucy5kZWxpbWl0ZXJfc3RhcnQgKyBcIjwvcnA+PHJ0PlwiICsgd2FuYWthbmEudG9LYXRha2FuYShub3RhdGlvbnNbbjFdWzJdKSArIFwiPC9ydD48cnA+XCIgKyBvcHRpb25zLmRlbGltaXRlcl9lbmQgKyBcIjwvcnA+PC9ydWJ5PlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgY2FzZSAncm9tYWppJzpcclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMubW9kZSA9PT0gJ29rdXJpZ2FuYScpXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBuMj0wO24yPG5vdGF0aW9ucy5sZW5ndGg7bjIrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG5vdGF0aW9uc1tuMl1bMV0hPT0xKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBub3RhdGlvbnNbbjJdWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBub3RhdGlvbnNbbjJdWzBdICsgb3B0aW9ucy5kZWxpbWl0ZXJfc3RhcnQgKyB3YW5ha2FuYS50b1JvbWFqaShub3RhdGlvbnNbbjJdWzJdKSArIG9wdGlvbnMuZGVsaW1pdGVyX2VuZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7IC8vZnVyaWdhbmFcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gXCI8cnVieT5cIjtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIG4zPTA7bjM8bm90YXRpb25zLmxlbmd0aDtuMysrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IG5vdGF0aW9uc1tuM11bMF0gKyBcIjxycD5cIiArIG9wdGlvbnMuZGVsaW1pdGVyX3N0YXJ0ICsgXCI8L3JwPjxydD5cIiArIHdhbmFrYW5hLnRvUm9tYWppKG5vdGF0aW9uc1tuM11bMl0pICsgXCI8L3J0PjxycD5cIiArIG9wdGlvbnMuZGVsaW1pdGVyX2VuZCArIFwiPC9ycD5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiPC9ydWJ5PlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgY2FzZSAnaGlyYWdhbmEnOlxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5tb2RlID09PSAnb2t1cmlnYW5hJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBuND0wO240PG5vdGF0aW9ucy5sZW5ndGg7bjQrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG5vdGF0aW9uc1tuNF1bMV0hPT0xKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBub3RhdGlvbnNbbjRdWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBub3RhdGlvbnNbbjRdWzBdICsgb3B0aW9ucy5kZWxpbWl0ZXJfc3RhcnQgKyBub3RhdGlvbnNbbjRdWzJdICsgb3B0aW9ucy5kZWxpbWl0ZXJfZW5kO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7IC8vZnVyaWdhbmFcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIG41PTA7bjU8bm90YXRpb25zLmxlbmd0aDtuNSsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobm90YXRpb25zW241XVsxXSE9PTEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IG5vdGF0aW9uc1tuNV1bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiPHJ1Ynk+XCIgKyBub3RhdGlvbnNbbjVdWzBdICsgXCI8cnA+XCIgKyBvcHRpb25zLmRlbGltaXRlcl9zdGFydCArIFwiPC9ycD48cnQ+XCIgKyBub3RhdGlvbnNbbjVdWzJdICsgXCI8L3J0PjxycD5cIiArIG9wdGlvbnMuZGVsaW1pdGVyX2VuZCArIFwiPC9ycD48L3J1Ynk+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc3VjaCBtb2RlLi4uJyk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgZ2l2ZW4gc3RyaW5nIHRvIGhpcmFnYW5hIHdpdGggb3B0aW9ucyBhdmFpbGFibGVcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBHaXZlbiBTdHJpbmdcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBKU09OIG9iamVjdCB3aGljaCBoYXZlIGtleS12YWx1ZSBwYWlycyBzZXR0aW5nc1xyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubW9kZT0nbm9ybWFsJ10gQ29udmVydCBtb2RlIFsnbm9ybWFsJ3wnc3BhY2VkJ3wnb2t1cmlnYW5hJ3wnZnVyaWdhbmEnXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGVsaW1pdGVyX3N0YXJ0PScoJ10gRGVsaW1pdGVyKFN0YXJ0KVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGVsaW1pdGVyX2VuZD0nKSddIERlbGltaXRlcihFbmQpXHJcbiAqL1xyXG52YXIgdG9IaXJhZ2FuYSA9IGZ1bmN0aW9uKHN0ciwgb3B0aW9ucyl7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIG9wdGlvbnMudG8gPSAnaGlyYWdhbmEnO1xyXG4gICAgcmV0dXJuIGNvbnZlcnQoc3RyLG9wdGlvbnMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgZ2l2ZW4gc3RyaW5nIHRvIGthdGFrYW5hIHdpdGggb3B0aW9ucyBhdmFpbGFibGVcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBHaXZlbiBTdHJpbmdcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBKU09OIG9iamVjdCB3aGljaCBoYXZlIGtleS12YWx1ZSBwYWlycyBzZXR0aW5nc1xyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubW9kZT0nbm9ybWFsJ10gQ29udmVydCBtb2RlIFsnbm9ybWFsJ3wnc3BhY2VkJ3wnb2t1cmlnYW5hJ3wnZnVyaWdhbmEnXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGVsaW1pdGVyX3N0YXJ0PScoJ10gRGVsaW1pdGVyKFN0YXJ0KVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGVsaW1pdGVyX2VuZD0nKSddIERlbGltaXRlcihFbmQpXHJcbiAqL1xyXG52YXIgdG9LYXRha2FuYSA9IGZ1bmN0aW9uKHN0ciwgb3B0aW9ucyl7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIG9wdGlvbnMudG8gPSAna2F0YWthbmEnO1xyXG4gICAgcmV0dXJuIGNvbnZlcnQoc3RyLG9wdGlvbnMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgZ2l2ZW4gc3RyaW5nIHRvIHJvbWFqaSB3aXRoIG9wdGlvbnMgYXZhaWxhYmxlXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgR2l2ZW4gU3RyaW5nXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gSlNPTiBvYmplY3Qgd2hpY2ggaGF2ZSBrZXktdmFsdWUgcGFpcnMgc2V0dGluZ3NcclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm1vZGU9J25vcm1hbCddIENvbnZlcnQgbW9kZSBbJ25vcm1hbCd8J3NwYWNlZCd8J29rdXJpZ2FuYSd8J2Z1cmlnYW5hJ11cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmRlbGltaXRlcl9zdGFydD0nKCddIERlbGltaXRlcihTdGFydClcclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmRlbGltaXRlcl9lbmQ9JyknXSBEZWxpbWl0ZXIoRW5kKVxyXG4gKi9cclxudmFyIHRvUm9tYWppID0gZnVuY3Rpb24oc3RyLCBvcHRpb25zKXtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgb3B0aW9ucy50byA9ICdyb21hamknO1xyXG4gICAgcmV0dXJuIGNvbnZlcnQoc3RyLG9wdGlvbnMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYXRlIGt1cm9zaGlyby5qc1xyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBPcHRpb25zIFtkaWNQYXRoXVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdIENhbGxiYWNrIGFmdGVyIGJ1aWxkaW5nIGt1cm9tb2ppIHRva2VuaXplclxyXG4gKi9cclxudmFyIGluaXQgPSBmdW5jdGlvbihvcHRpb25zLCBjYWxsYmFjayl7XHJcbiAgICBpZih0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xyXG4gICAgICAgIG9wdGlvbnMgPSB7fTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBkaWNQYXRoID0gb3B0aW9ucy5kaWNQYXRoO1xyXG4gICAgaWYoIWRpY1BhdGgpe1xyXG4gICAgICAgIGlmKGlzTm9kZSkgZGljUGF0aCA9IHJlcXVpcmUucmVzb2x2ZSgna3Vyb21vamknKS5yZXBsYWNlKC9kaXN0LiovLCdkaXN0L2RpY3QvJyk7XHJcbiAgICAgICAgZWxzZSBkaWNQYXRoID0gJ2Jvd2VyX2NvbXBvbmVudHMva3Vyb3NoaXJvL2Rpc3QvZGljdC8nO1xyXG4gICAgfVxyXG4gICAga3Vyb21vamkuYnVpbGRlcih7IGRpY1BhdGg6IGRpY1BhdGggfSkuYnVpbGQoZnVuY3Rpb24gKGVyciwgbmV3dG9rZW5pemVyKSB7XHJcbiAgICAgICAgaWYoZXJyKVxyXG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcclxuXHJcbiAgICAgICAgdG9rZW5pemVyID0gbmV3dG9rZW5pemVyO1xyXG4gICAgICAgIGt1cm9zaGlyby50b2tlbml6ZSA9IHRva2VuaXplci50b2tlbml6ZTtcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG52YXIga3Vyb3NoaXJvID0ge1xyXG4gICAgaW5pdDogaW5pdCxcclxuICAgIGlzSGlyYWdhbmE6IHdhbmFrYW5hLmlzSGlyYWdhbmEsXHJcbiAgICBpc0thdGFrYW5hOiB3YW5ha2FuYS5pc0thdGFrYW5hLFxyXG4gICAgaXNSb21hamk6IHdhbmFrYW5hLmlzUm9tYWppLFxyXG4gICAgaXNLYW5qaTogaXNLYW5qaSxcclxuICAgIGhhc0hpcmFnYW5hOiBoYXNIaXJhZ2FuYSxcclxuICAgIGhhc0thdGFrYW5hOiBoYXNLYXRha2FuYSxcclxuICAgIGhhc0thbmppOiBoYXNLYW5qaSxcclxuICAgIGNvbnZlcnQ6IGNvbnZlcnQsXHJcbiAgICB0b0hpcmFnYW5hOiB0b0hpcmFnYW5hLFxyXG4gICAgdG9LYXRha2FuYTogdG9LYXRha2FuYSxcclxuICAgIHRvUm9tYWppOiB0b1JvbWFqaSxcclxuICAgIHRvS2FuYTogd2FuYWthbmEudG9LYW5hXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGt1cm9zaGlybzsiXSwiZmlsZSI6Imt1cm9zaGlyby5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
