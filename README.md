![kuroshiro](http://hexenq.com/kuroshiro/kuroshiro.png)

# kuroshiro

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)

kuroshiro is a Japanese language library for converting Japanese sentence to Hiragana, Katakana or Romaji with furigana and okurigana modes supported.

*Read this in other languages: [English](README.md), [日本語](README.jp.md), [简体中文](README.zh-cn.md), [繁體中文](README.zh-tw.md).*

## Demo
You can check the demo [here](http://hexenq.com/kuroshiro/demo/index.html).

## Breaking Change in 1.x
- Seperate morphological analyzer from phonetic notation logic to make it possible that we can use different morphological analyzers (ready-made or customized)
- Embrace ES8/ES2017 to use async/await functions
- Use ES6 Module instead of CommonJS
    
## Ready-made Analyzer Plugins
*You should check the environment compatibility of each analyzer before you start working with them*

| Analyzer | Node.js Support| Browser Support | Plugin Repo | Developer |
|---|---|---|---|---|
|Kuromoji|✓|✓|[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)|[Hexen Qi](https://github.com/hexenq)|
|Mecab|✓|✗|[kuroshiro-analyzer-mecab](https://github.com/hexenq/kuroshiro-analyzer-mecab)|[Hexen Qi](https://github.com/hexenq)|
|Yahoo Web API|✓|✓|[kuroshiro-analyzer-yahoo-webapi](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi)|[Hexen Qi](https://github.com/hexenq)|

## Usage
### Node.js
Install with npm package manager:
```sh
$ npm install kuroshiro
```
    
Load the library:

*Support both ES6 Module `import` and CommonJS `require`*
```js
import * as Kuroshiro from "kuroshiro";
```

Instantiate:
```js
const kuroshiro = new Kuroshiro();
```

Initiate kuroshiro with an instance of analyzer:
```js
// Here uses async/await, you could also use Promise
await kuroshiro.init(new KuromojiAnalyzer());
```

Convert what you want:
```js
const result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
```
    
### Browser
Add `kuroshiro.min.js` in `dist` to your frontend project, and in your HTML:
```html
<script src="url/to/kuroshiro.min.js"></script>
```

Instantiate:
```js
var kuroshiro = new Kuroshiro();
```

Initiate kuroshiro with an instance of analyzer, then convert what you want:
```js
kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/dict" }))
    .then(function () {
        return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
    })
    .then(function(result){
        console.log(result);
    })
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
### Constructor
__Examples__

```js
const kuroshiro = new Kuroshiro();
```

### Instance Medthods
#### init(analyzer)
Initiate kuroshiro with an instance of analyzer. You can make use of the [Ready-made Analyzers](#ready-made-analyzer-plugins) listed above. And please refer to documentation of analyzers for analyzer initialization instructions

__Arguments__

* `analyzer` - An instance of analyzer.

__Examples__

```js
await kuroshiro.init(new KuromojiAnalyzer());
```

#### convert(str, [options])
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
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// result：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

```js
// spaced
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// result：かんじとれ たら て を つなご う 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！
```

```js
// okurigana
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// result: 感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！
```

<pre>
// furigana
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"furigana", to:"hiragana"});
// result: <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！
</pre>

### Utils
__Examples__
```js
Kuroshiro.Util.isHiragana("あ"));
```
#### isHiragana(input)
Check if input is hiragana.

#### isKatakana(input)
Check if input is katakana.

#### isKana(input)
Check if input is kana.

#### isKanji(input)
Check if input is kanji.

#### isJapanese(input)
Check if input is Japanese.

#### hasHiragana(input)
Check if input has hiragana.

#### hasKatakana(input)
Check if input has katakana.

#### hasKana(input)
Check if input has kana.

#### hasKanji(input)
Check if input has kanji.

#### hasJapanese(input)
Check if input has Japanese.

## Contributing
Please check [CONTRIBUTING](CONTRIBUTING.md).

## Inspired By
- kuromoji
- wanakana

## License
MIT
