![kuroshiro.js](http://hexenq.com/kuroshiro/kuroshiro.png)

# kuroshiro.js

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.js.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro.js)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro.js/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro.js)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)
[![Bower version](https://badge.fury.io/bo/kuroshiro.svg)](https://badge.fury.io/bo/kuroshiro)

kuroshiro.js是一款十分方便使用的日文轉換注音工具，主要針對含有日文漢字的文本，進行到平假名、片假名及羅馬字的轉換，並支持注音假名、送假名
（旁註音）等注音模式。本項目受到kuromoji和wanakana啟發。

*其他語言版本：[English](README.md), [简体中文](README.zh-cn.md), [繁體中文](README.zh-tw.md)。*

## 演示
你可以在[這裡](http://hexenq.com/kuroshiro/demo/index.html)查看在線演示，初始化會有些慢（需要下載字典，16MB左右），請耐心等待。

## 如何使用
### Node.js
首先使用npm包管理器進行安裝:
```sh
$ npm install kuroshiro
```

載入kuroshiro庫:
```js
// 當使用 JavaScript 時
const kuroshiro = require("kuroshiro");
```
```ts
// 當使用 TypeScript 時
import * as kuroshiro from 'kuroshiro';
```

開始使用:
```js
kuroshiro.init(function (err) {
    // kuroshiro.js初始化完畢
    var result = kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！');    
    console.log(result);
});
```
### 瀏覽器
使用Bower包管理器安裝:
```sh
$ bower install kuroshiro
```

在HTML中添加:
```html
<script src="url/to/kuroshiro.js"></script>
```

開始使用:
```js              
kuroshiro.init(function (err) {
    // kuroshiro.js初始化完畢
    var result = kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！');    
    console.log(result);
});
```

## API說明
### init([options], [callback])
初始化kuroshiro.js。 你應該在調用其他函數方法前調用一次本函數方法來進行初始化（只需初始化一次即可）。

__參數__

* `options` - *可選* 初始化選項，你可以通過 `dicPath` 來自定義IPA字典位置。
* `callback` - *可選* 當kuroshiro.js初始化完成或有錯誤發生時回調的函數方法。

__示例__

```js
kuroshiro.init(function (err) {
    // kuroshiro.js初始化完畢
    // 做些什麼
});
```

### convert(str, [options])
轉換指定的字元串到指定的音節文字（可在選項中配置注音模式等設置）。

__參數__

* `str` - 將被轉換的字元串。
* `options` - *可選* 轉換選項，見下表。

| 選項 | 類型 | 默認值 | 描述 |
|---|---|---|---|
| to | String | 'hiragana' | 目標音節文字 [`hiragana`(平假名),`katakana`(片假名),`romaji`(羅馬字)] |
| mode | String | 'normal' | 轉換模式 [`normal`(標準模式),`spaced`(空格分組),`okurigana`(送假名),`furigana`(注音假名)] |
| delimiter_start | String | '(' | 分隔符(起始) |
| delimiter_end | String | ')' | 分隔符(結束) |

__示例__

```js
// normal (標準模式)
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {mode:'okurigana', to:'hiragana'});
// 輸出：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

```js
// spaced (空格分組)
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {mode:'okurigana', to:'hiragana'});
// 輸出：かんじとれ たら て を つなご う 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！
```

```js
// okurigana (送假名)
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {mode:'okurigana', to:'hiragana'});
// 輸出: 感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！
```

<pre>
// furigana (注音假名)
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {mode:'furigana', to:'hiragana'});
// 輸出: <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！
</pre>

### toHiragana(str, [options])
轉換指定字元串到平假名。沒有`to`參數，其餘選項參數與convert()函數方法一樣。

### toKatakana(str, [options])
轉換指定字元串到片假名。沒有`to`參數，其餘選項參數與convert()函數方法一樣。

### toRomaji(str, [options])
轉換指定字元串到羅馬字。沒有`to`參數，其餘選項參數與convert()函數方法一樣。

### toKana(input)
轉換羅馬字到平（片）假名（使用wanakana）。

### isHiragana(input)
判斷input是否是平假名（使用wanakana）。

### isKatakana(input)
判斷input是否是片假名（使用wanakana）。

### isRomaji(input)
判斷input是否是羅馬字（使用wanakana）。

### isKanji(input)
判斷input是否是日文漢字。

### hasHiragana(input)
檢查input中是否含有平假名。

### hasKatakana(input)
檢查input中是否含有片假名。

### hasKanji(input)
檢查input中是否含有日文漢字。

## 版權說明
MIT