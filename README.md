![kuroshiro](https://kuroshiro.org/kuroshiro.png)

# kuroshiro

[![CI](https://github.com/hexenq/kuroshiro/actions/workflows/ci.yml/badge.svg)](https://github.com/hexenq/kuroshiro/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](https://www.npmjs.com/package/kuroshiro)
[![License](https://img.shields.io/github/license/hexenq/kuroshiro.svg)](LICENSE)

kuroshiro is a Japanese language library for converting Japanese sentence to Hiragana, Katakana or Romaji with furigana and okurigana modes supported.

*Read this in other languages: [English](README.md), [日本語](README.jp.md), [简体中文](README.zh-cn.md), [繁體中文](README.zh-tw.md), [Esperanto](README.eo-eo.md), [한국어](README.ko-kr.md).*

## Demo
You can check the demo [here](https://kuroshiro.org/#demo).

## Feature
- Japanese Sentence => Hiragana, Katakana or Romaji
- Furigana and okurigana supported
- 🆕Multiple morphological analyzers supported
- 🆕Multiple romanization systems supported
- Useful Japanese utils

## Migrating from 1.x

- Version 2 requires Node.js 22+ or a browser with native ES2015 support, including Promises. Internet Explorer is not supported. Check the analyzer's additional requirements separately.
- Replace `Kuroshiro.Util.kanaToHiragna(...)` with `Kuroshiro.Util.kanaToHiragana(...)`; the old spelling has been removed.
- CommonJS `require`, ESM default imports, the `Kuroshiro` browser global, and the asynchronous `init()` / `convert()` API remain supported.
- TypeScript declarations are included. The examples below use the Kuromoji 2.0 beta, which also includes declarations.

## Ready-made Analyzer Plugins
*You should check the environment compatibility of each analyzer before you start working with them*

| Analyzer | Node.js Support| Browser Support | Plugin Repo | Developer |
|---|---|---|---|---|
|Kuromoji|✓|✓|[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)|[Hexen Qi](https://github.com/hexenq)|
|Mecab|✓|✗|[kuroshiro-analyzer-mecab](https://github.com/hexenq/kuroshiro-analyzer-mecab)|[Hexen Qi](https://github.com/hexenq)|
|Yahoo Web API (paused)|✓|✗|[kuroshiro-analyzer-yahoo-webapi](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi)|[Hexen Qi](https://github.com/hexenq)|

The Yahoo Web API analyzer's API migration is incomplete and maintenance is paused. It is not recommended for new projects. See its [maintenance status](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi#maintenance-status).

## Usage
### Node.js (or using a module bundler (e.g. Webpack))
Install with npm package manager:
```sh
$ npm install kuroshiro@beta kuroshiro-analyzer-kuromoji@beta
```
    
Load the library:

*Support ES6 Module `import`*

```js
import Kuroshiro from "kuroshiro";
// Initialize kuroshiro with an instance of analyzer (You could check the [apidoc](#initanalyzer) for more information):
// For this example, you should npm install and import the kuromoji analyzer first
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
// Instantiate
const kuroshiro = new Kuroshiro();
// Initialize
// Here uses async/await, you could also use Promise
await kuroshiro.init(new KuromojiAnalyzer());
// Convert what you want
const result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
```

*And CommonJS `require`*

```js
const Kuroshiro = require("kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const kuroshiro = new Kuroshiro();

kuroshiro.init(new KuromojiAnalyzer())
    .then(function(){
        return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
    })
    .then(function(result){
        console.log(result);
    })
```
    
### Browser
Use `dist/kuroshiro.min.js` from the installed npm package in your frontend project, and include it in your HTML:
```html
<script src="url/to/kuroshiro.min.js"></script>
```

For this example, you should also include `kuroshiro-analyzer-kuromoji.min.js` which you could get from [kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)
```html
<script src="url/to/kuroshiro-analyzer-kuromoji.min.js"></script>
```

Instantiate:
```js
var kuroshiro = new Kuroshiro();
```

Copy the dictionary files from `node_modules/kuromoji/dict/` to a public directory such as `public/dict/`. Set `dictPath` to their URL (`/dict/` in this example); see the [browser dictionary guide](https://github.com/hexenq/kuroshiro-analyzer-kuromoji#browser-dictionary-setup).

Initialize kuroshiro with an instance of analyzer, then convert what you want:
```js
kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/dict/" }))
    .then(function () {
        return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
    })
    .then(function(result){
        console.log(result);
    })
    .catch(function (error) {
        console.error(error);
    });
```

### TypeScript

Version 2 includes declarations for the package entry, custom analyzers,
conversion options, and the static `Kuroshiro.Util` helpers. The Kuromoji 2.0 beta
also includes declarations, so no separate `@types` package is needed for either library.

```ts
import Kuroshiro from "kuroshiro";

const options: Kuroshiro.ConvertOptions = { to: "romaji", romajiSystem: "hepburn" };
const hiragana: string = Kuroshiro.Util.kanaToHiragana("カナ");
```

For TypeScript compiled to CommonJS, enable `esModuleInterop` for default imports,
or use `import Kuroshiro = require("kuroshiro")`. Native Node ESM and bundler module
resolution also support the default import. Non-module browser scripts can use
`/// <reference types="kuroshiro" />` for the `Kuroshiro` global; the actual UMD
script must still be loaded in the page.

## API
### Constructor
__Examples__

```js
const kuroshiro = new Kuroshiro();
```

### Instance Methods
#### init(analyzer)
Initialize kuroshiro with an instance of analyzer. You should first import an analyzer and initialize it. You can make use of the [Ready-made Analyzers](#ready-made-analyzer-plugins) listed above. And please refer to documentation of analyzers for analyzer initialization instructions

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
| to | String | "hiragana" | Target syllabary [`hiragana`, `katakana`, `romaji`] |
| mode | String | "normal" | Convert mode [`normal`, `spaced`, `okurigana`, `furigana`] |
| romajiSystem<sup>*</sup> | String | "hepburn" | Romanization system [`nippon`, `passport`, `hepburn`] |
| delimiter_start | String | "(" | Delimiter(Start) |
| delimiter_end | String | ")" | Delimiter(End) |

**: Param `romajiSystem` is only applied when the value of param `to` is `romaji`. For more about it, check [Romanization System](#romanization-system)*

__Examples__

```js
// normal
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"normal", to:"hiragana"});
// result：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

```js
// spaced
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"spaced", to:"hiragana"});
// result：かんじとれ たら て を つなごう 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！
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
const result = Kuroshiro.Util.isHiragana("あ");
```
#### isHiragana(char)
Check if input char is hiragana.

#### isKatakana(char)
Check if input char is katakana.

#### isKana(char)
Check if input char is kana.

#### isKanji(char)
Check if input char is kanji.

#### isJapanese(char)
Check if input char is Japanese.

#### hasHiragana(str)
Check if input string has hiragana.

#### hasKatakana(str)
Check if input string has katakana.

#### hasKana(str)
Check if input string has kana.

#### hasKanji(str)
Check if input string has kanji.

#### hasJapanese(str)
Check if input string has Japanese.

#### kanaToHiragana(str)
Convert input kana string to hiragana.

In 2.x, this replaces the misspelled 1.x method
`kanaToHiragna`. Update existing calls to `Kuroshiro.Util.kanaToHiragana(...)`;
the old name is no longer exported. This is a breaking API change.

#### kanaToKatakana(str)
Convert input kana string to katakana.

#### kanaToRomaji(str, system)
Convert input kana string to romaji. Param `system` accepts `"nippon"`, `"passport"`, `"hepburn"` (Default: "hepburn"). 

## Romanization System
kuroshiro supports three kinds of romanization systems.

`nippon`: Nippon-shiki romanization. Refer to [ISO 3602 Strict](http://www.age.ne.jp/x/nrs/iso3602/iso3602.html).

`passport`: Passport-shiki romanization. Refer to [Japanese romanization table](https://www.ezairyu.mofa.go.jp/passport/hebon.html) published by Ministry of Foreign Affairs of Japan.

`hepburn`: Hepburn romanization. Refer to [BS 4812 : 1972](https://archive.is/PiJ4).

There is a useful [webpage](http://jgrammar.life.coocan.jp/ja/data/rohmaji2.htm) for you to check the difference between these romanization systems.

### Notice for Romaji Conversion

#### Long vowels

Furigana (kana spelling) does not always provide enough pronunciation information to distinguish long vowels, so converting it directly to romaji cannot reliably reproduce pronunciation. See [なぜ フリガナでは ダメなのか？](https://green.adam.ne.jp/roomazi/onamae.html#naze) for more background.

For this reason, `kanaToRomaji()` does not infer long vowels from kana spelling in any of the three romanization systems. The long vowel mark `ー` (chōonpu) is still handled according to the selected system.

For example, converting `こうし` with `kanaToRomaji()` produces `kousi`, `koushi`, and `koushi` in `nippon`, `passport`, and `hepburn`, respectively.

This limitation of direct kana conversion does not prevent `convert()` from handling long vowels: it uses pronunciation information from the analyzer when available, including when converting kanji with or without annotations. The result therefore depends on the pronunciation information provided by the analyzer.

#### Sokuon (`っ/ッ`)

When no following consonant can be doubled, all three systems use `'`, e.g. `っい` → `'i`, `あっ` → `a'`. This is kuroshiro's convention, not an extra spoken syllable.

## Contributing
Please check [CONTRIBUTING](CONTRIBUTING.md).

## Inspired By
- kuromoji
- wanakana

## License
MIT
