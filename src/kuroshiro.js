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
        if(isNode) dicPath = require.resolve('kuromoji').replace(/src.*/,'dict/');
        else dicPath = 'bower_components/kuroshiro/dist/dict/';
    }
    kuromoji.builder({ dicPath: dicPath }).build(function (err, newtokenizer) {
        if(err)
            return callback(err);

        tokenizer = newtokenizer;
        kuroshiro.tokenize = tokenizer.tokenize;
        if(callback) callback();
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
