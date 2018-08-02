![kuroshiro](http://hexenq.com/kuroshiro/kuroshiro.png)

# kuroshiro

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)

kuroshiro.js是一款十分方便使用的日文轉換注音工具，主要針對日文文本，進行到平假名、片假名及羅馬字的轉換，並支持注音假名、送假名
（旁註音）等注音模式。

*其他說明語言：[English](README.md), [日本語](README.jp.md), [簡體中文](README.zh-cn.md), [繁體中文](README.zh-tw.md)。*

## 演示
你可以在[這裡](http://hexenq.com/kuroshiro/demo/index.html)查看在線演示，初始化會有些慢（需要下載字典，16MB左右），請耐心等待。

## 1.x版本的重大變化
- 從注音邏輯中分離語素解析器部分，使得我們可以使用不同的語素解析器（預定義的或自定義的）
- 擁抱ES8/ES2017以使用async/await方法
- 使用ES6 Module取代CommonJS
    
## 解析器插件
*在開始工作之前，請先確認各插件的環境兼容性*

| 解析器 | Node.js支持 | 瀏覽器支持 | 倉庫 | 開發者 |
|---|---|---|---|---|
|Kuromoji|✓|✓|[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)|[Hexen Qi](https://github.com/hexenq)|
|Mecab|✓|✗|[kuroshiro-analyzer-mecab](https://github.com/hexenq/kuroshiro-analyzer-mecab)|[Hexen Qi](https://github.com/hexenq)|
|Yahoo Web API|✓|✓|[kuroshiro-analyzer-yahoo-webapi](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi)|[Hexen Qi](https://github.com/hexenq)|

## 如何使用
### Node.js
首先使用npm包管理器進行安裝:
```sh
$ npm install kuroshiro
```

載入kuroshiro庫:

*同時支持ES6 Module `import` 和 CommonJS `require`*
```js
import * as Kuroshiro from "kuroshiro";
```

實例化:
```js
const kuroshiro = new Kuroshiro();
```

使用一個解析器實例來初始化kuroshiro:
```js
// 這裡使用了async/await, 你同樣也可以使用Promise
await kuroshiro.init(new KuromojiAnalyzer());
```

進行轉換操作:
```js
const result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
```

### 瀏覽器
將`dist`中的`kuroshiro.min.js`加入到你的工程，並在HTML中加入:
```html
<script src="url/to/kuroshiro.min.js"></script>
```

實例化:
```js
var kuroshiro = new Kuroshiro();
```

使用一個解析器實例來初始化kuroshiro，然後進行轉換操作:
```js
kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/dict" }))
    .then(function () {
        return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
    })
    .then(function(result){
        console.log(result);
    })
```

## API說明
### 構造器
__示例__

```js
const kuroshiro = new Kuroshiro();
```

### 實例方法
#### init(analyzer)
使用一個解析器實例來初始化kuroshiro。你可以使用上面提到的已實現的[解析器插件](#解析器插件)。關於解析器的初始化方法請參照相應解析器的文檔說明。

__參數__

* `analyzer` - 解析器實例。

__示例__

```js
await kuroshiro.init(new KuromojiAnalyzer());
```

#### convert(str, [options])
轉換指定的字元串到指定的音節文字（可在選項中配置注音模式等設置）。

__參數__

* `str` - 將被轉換的字元串。
* `options` - *可選* 轉換選項，見下表。

| 選項 | 類型 | 默認值 | 描述 |
|---|---|---|---|
| to | String | 'hiragana' | 目標音節文字<br />`hiragana` (平假名),<br />`katakana` (片假名),<br />`romaji` (羅馬字) |
| mode | String | 'normal' | 轉換模式<br />`normal` (標準模式),<br />`spaced` (空格分組),<br />`okurigana` (送假名),<br />`furigana` (注音假名) |
| delimiter_start | String | '(' | 分隔符 (起始) |
| delimiter_end | String | ')' | 分隔符 (結束) |

__示例__

```js
// normal (標準模式)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 結果：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

```js
// spaced (空格分組)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 結果：かんじとれ たら て を つなご う 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！
```

```js
// okurigana (送假名)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 結果: 感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！
```

<pre>
// furigana (注音假名)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"furigana", to:"hiragana"});
// 結果: <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！
</pre>

### 實用工具
__示例__
```js
Kuroshiro.Util.isHiragana("あ"));
```
#### isHiragana(input)
判斷input是否是平假名。

#### isKatakana(input)
判斷input是否是片假名。

#### isKana(input)
判斷input是否是假名。

#### isKanji(input)
判斷input是否是日文漢字。

#### isJapanese(input)
判斷input是否是日文。

#### hasHiragana(input)
檢查input中是否含有平假名。

#### hasKatakana(input)
檢查input中是否含有片假名。

#### hasKana(input)
檢查input中是否含有假名。

#### hasKanji(input)
檢查input中是否含有日文漢字。

#### hasJapanese(input)
檢查input中是否含有日文。

## 貢獻ガイド
請查閱文檔 [CONTRIBUTING](CONTRIBUTING.md).

## 靈感源
- kuromoji
- wanakana

## 版權說明
MIT