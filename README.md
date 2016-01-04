![kuroshiro.js](http://www.hexenq.com/kuroshiro/kuroshiro.png)

# kuroshiro.js

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.js.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro.js)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro.js/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro.js)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)
[![Bower version](https://badge.fury.io/bo/kuroshiro.svg)](https://badge.fury.io/bo/kuroshiro)
[![dependencies](https://david-dm.org/hexenq/kuroshiro.js.svg)](https://david-dm.org/hexenq/kuroshiro.js)

kuroshiro.js is a japanese language utility mainly for converting Kanji-mixed sentence to Hiragana, Katakana or Romaji
with furigana and okurigana modes supported. This project is inspired by kuromoji and wanakana.

*Read this in other languages: [English](README.md), [简体中文](README.zh-cn.md).*

## Demo
You can check the demo [here](http://www.hexenq.com/kuroshiro/demo/index.html).

## Usage
### Node.js
Install with npm package manager:

    npm install kuroshiro
    
Load the library:

    var kuroshiro = require("kuroshiro");
    
Have fun:

    kuroshiro.init(function (err) {
        // kuroshiro is ready
        var result = kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！');    
        console.log(result);
    });
    
### Browser
Install with Bower package manager:

    bower install kuroshiro
    
In your HTML:

    <script src="url/to/kuroshiro.js"></script>

Have fun with scripts below:
                  
    kuroshiro.init(function (err) {
      // kuroshiro is ready
      var result = kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！');    
      console.log(result);
    });

## API
### init([options], [callback])
Initiate kuroshiro.js. You should call this function once before calling other functions. 

__Arguments__

* `options` - *Optional* An object with options. You can set `dicPath` (IPA Dictionary Path) here.
* `callback` - *Optional* A callback which is called when kuroshiro.js has been initiated, or an error occurs.

__Examples__

```js
kuroshiro.init(function (err) {
    // kuroshiro.js is ready
    // do something
});
```

### convert(str, [options])
Convert given string to target syllabary with options available

__Arguments__

* `str` - A String to be converted.
* `options` - *Optional* kuroshiro has several convert options as below.

| Options | Type | Default | Description |
|---|---|---|---|
| to | String | 'hiragana' | Target syllabary [`hiragana`,`katakana`,`romaji`] |
| mode | String | 'normal' | Convert mode [`normal`,`spaced`,`okurigana`,`furigana`] |
| delimiter_start | String | '(' | Delimiter(Start) |
| delimiter_end | String | ')' | Delimiter(End) |

__Examples__

```js
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {mode:'okurigana', to:'hiragana'});
// output: 感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！
```

### toHiragana(str, [options])
Convert given string to hiragana with options just like function convert() with `to` option excluded.

### toKatakana(str, [options])
Convert given string to katakana with options just like function convert() with `to` option excluded.

### toRomaji(str, [options])
Convert given string to romaji with options just like function convert() with `to` option excluded.

### toKana(input)
Convert Romaji to Kana using wanakana.

### isHiragana(input)
Check if input is hiragana using wanakana.

### isKatakana(input)
Check if input is katakana using wanakana.

### isRomaji(input)
Check if input is romaji using wanakana.

### isKanji(input)
Check if input is kanji.

### hasHiragana(input)
Check if input has hiragana.

### hasKatakana(input)
Check if input has katakana.

### hasKanji(input)
Check if input has kanji.

## License
MIT