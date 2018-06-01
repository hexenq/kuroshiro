![kuroshiro.js](http://hexenq.com/kuroshiro/kuroshiro.png)

# kuroshiro.js

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.js.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro.js)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro.js/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro.js)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)
[![Bower version](https://badge.fury.io/bo/kuroshiro.svg)](https://badge.fury.io/bo/kuroshiro)

kuroshiro.js is a japanese language utility mainly for converting Kanji-mixed sentence to Hiragana, Katakana or Romaji
with furigana and okurigana modes supported.

*Read this in other languages: [English](README.md), [简体中文](README.zh-cn.md), [繁體中文](README.zh-tw.md).*

**⚠ Attention: The `1.x` version of `kuroshiro` is still in alpha and some improvements could be made. For production, it's recommended to use 0.2.x version.**

## Demo
You can check the demo [here](http://hexenq.com/kuroshiro/demo/index.html).

## Attention 

This project is still in early alpha and a lot of improvements could be made.

Also please note that we will not be responsible for any devious usage of the app. In its current state this project is more a technical demo of how to stream videos using WebRTC and the Media Source Extensions API than a really usable and full-featured software.

With that in mind, if you want to make a PR to improve the app you are very welcome!

## Usage
### Node.js
Install with npm package manager:
```sh
$ npm install kuroshiro
```
    
Load the library:
```js
// when using JavaScript
const kuroshiro = require("kuroshiro");
```
```ts
// when using TypeScript
import * as kuroshiro from 'kuroshiro';
```
Have fun:
```js
kuroshiro.init(function (err) {
    // kuroshiro is ready
    var result = kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！');    
    console.log(result);
});
```
    
### Browser
Install with Bower package manager:
```sh
$ bower install kuroshiro
```
    
In your HTML:
```html
<script src="url/to/kuroshiro.js"></script>
```

Have fun with scripts below:
```js               
kuroshiro.init(function (err) {
    // kuroshiro is ready
    var result = kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！');    
    console.log(result);
});
```

### Using a module bundler (e.g. Webpack)
Install with npm package manager:
```sh
$ npm install kuroshiro
```

Look for the dictionaries (12 files) in `node_modules/kuromoji/dict` and move them to a folder that is not processed by Webpack.
```js
import kuroshiro from 'kuroshiro'

kuroshiro.init(
  {
    dicPath: 'path/to/folder/not/processed/by/Wepback'
  },
 (err) => {
    if(err){
       console.error(err);
    } else {
       // kuroshiro is ready
        const result = kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！');    
        console.log(result);
    }
});
```

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
// normal
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {mode:'okurigana', to:'hiragana'});
// output：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

```js
// spaced
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {mode:'okurigana', to:'hiragana'});
// output：かんじとれ たら て を つなご う 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！
```

```js
// okurigana
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {mode:'okurigana', to:'hiragana'});
// output: 感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！
```

<pre>
// furigana
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {mode:'furigana', to:'hiragana'});
// output: <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！
</pre>

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

## Inspired By
- kuromoji
- wanakana

## License
MIT
