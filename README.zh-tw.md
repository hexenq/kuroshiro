![kuroshiro](https://kuroshiro.org/kuroshiro.png)

# kuroshiro

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)
[![Join the chat at https://gitter.im/hexenq/kuroshiro](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hexenq/kuroshiro)
[![License](https://img.shields.io/github/license/lassjs/lass.svg)](LICENSE)

kuroshiro是一款十分方便使用的日文轉換注音工具，主要針對日文文本，進行到平假名、片假名及羅馬字的轉換，並支持注音假名、送假名
（旁註音）等注音模式。

*其他說明語言：[English](README.md), [日本語](README.jp.md), [簡體中文](README.zh-cn.md), [繁體中文](README.zh-tw.md)。*

## 演示
你可以在[這裡](https://kuroshiro.org/#demo)查看在線演示。

## 特性
- 日文文本 => 平假名、片假名、羅馬字
- 支持注音假名和送假名
- 🆕支持多種語素解析器
- 🆕支持多種羅馬字體系
- 實用日語工具

## 1.x版本的重大變化
- 從注音邏輯中分離語素解析器部分，使得我們可以使用不同的語素解析器（[預定義的](#解析器插件)或[自定義的](CONTRIBUTING.md#how-to-submit-new-analyzer-plugins)）
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
### Node.js (或使用Webpack等打包工具時)
首先使用npm包管理器進行安裝:
```sh
$ npm install kuroshiro
```

載入kuroshiro庫:

*同時支持ES6 Module `import` 和 CommonJS `require`*
```js
import Kuroshiro from "kuroshiro";
```

實例化:
```js
const kuroshiro = new Kuroshiro();
```

使用一個解析器實例來初始化kuroshiro (請參考[API說明](#initanalyzer)):
```js
// 在這個示例中，首先npm install並import導入kuromoji解析器
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

// ...

// 初始化
// 這裡使用了async/await, 你同樣也可以使用Promise
await kuroshiro.init(new KuromojiAnalyzer());
```

進行轉換操作:
```js
const result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
```

### 瀏覽器
將`dist/kuroshiro.min.js`加入到你的工程 (你需要先後執行`npm install`和`npm run build`，以把它構建出來)，並在HTML中加入:
```html
<script src="url/to/kuroshiro.min.js"></script>
```

在這個示例中, 你還需要引入`kuroshiro-analyzer-kuromoji.min.js`。具體獲取方法請參考[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)
```html
<script src="url/to/kuroshiro-analyzer-kuromoji.min.js"></script>
```

實例化:
```js
var kuroshiro = new Kuroshiro();
```

使用一個解析器實例來初始化kuroshiro，然後進行轉換操作:
```js
kuroshiro.init(new KuromojiAnalyzer({ dictPath: "url/to/dictFiles" }))
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
使用一個解析器實例來初始化kuroshiro。你需要首先導入並初始化一個解析器。你可以使用上面提到的已實現的[解析器插件](#解析器插件)。關於解析器的初始化方法請參照相應解析器的文檔說明。

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
| romajiSystem<sup>*</sup> | String | "hepburn" | 羅馬字體系<br />`nippon` (日本式),<br />`passport` (護照式),<br />`hepburn` (平文式) |
| delimiter_start | String | '(' | 分隔符 (起始) |
| delimiter_end | String | ')' | 分隔符 (結束) |

**: `romajiSystem`參數僅當`to`參數設置為`romaji`時生效。有關這一參數的更多信息, 請見 [羅馬字體系](#羅馬字體系)*

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
const result = Kuroshiro.Util.isHiragana("あ"));
```
#### isHiragana(char)
判斷輸入字元是否是平假名。

#### isKatakana(char)
判斷輸入字元是否是片假名。

#### isKana(char)
判斷輸入字元是否是假名。

#### isKanji(char)
判斷輸入字元是否是日文漢字。

#### isJapanese(char)
判斷輸入字元是否是日文。

#### hasHiragana(str)
檢查輸入字元串中是否含有平假名。

#### hasKatakana(str)
檢查輸入字元串中是否含有片假名。

#### hasKana(str)
檢查輸入字元串中是否含有假名。

#### hasKanji(str)
檢查輸入字元串中是否含有日文漢字。

#### hasJapanese(str)
檢查輸入字元串中是否含有日文。

#### kanaToHiragna(str)
轉換輸入假名字元串至平假名。

#### kanaToKatakana(str)
轉換輸入假名字元串至片假名。

#### kanaToRomaji(str, system)
轉換輸入假名字元串至羅馬字。參數`system`可選值為`"nippon"`, `"passport"`, `"hepburn"` (默認值: "hepburn")。

## 羅馬字體系
kuroshiro支持三種羅馬字體系。

`nippon`: 日本式羅馬字。參照 [ISO 3602 Strict](http://www.age.ne.jp/x/nrs/iso3602/iso3602.html)。

`passport`: 護照式羅馬字。 參照日本外務省發布的 [日文羅馬字對照表](https://www.ezairyu.mofa.go.jp/passport/hebon.html)。

`hepburn`: 平文羅馬字。參照 [BS 4812 : 1972](https://archive.is/PiJ4)。

想快速了解這些羅馬字體系的不同，可參考這個實用的[網頁](http://jgrammar.life.coocan.jp/ja/data/rohmaji2.htm)。

### 羅馬字轉換須知
完全自動化進行注音假名到羅馬字的直接轉換是不可能的，這是因為一般的注音假名都缺乏正確的發音信息，可以參考 [なぜ フリガナでは ダメなのか？](https://green.adam.ne.jp/roomazi/onamae.html#naze)。

因此kuroshiro在進行直接的注音假名->羅馬字轉換（使用`nippon`或`hepburn`羅馬字體系）時，不會處理長音。(`passport`羅馬字體系本身便忽略長音)

*例如，當進行假名"こうし"到羅馬字的轉換時，對於`nippon`, `passport`, `hepburn`三種羅馬字體系，你會分別得到"kousi", "koshi", "koushi"這幾個結果*

漢字->羅馬字的轉換無論使用注音假名模式與否都 __不受__ 此邏輯影響。

## 貢獻
請查閱文檔 [CONTRIBUTING](CONTRIBUTING.md).

## 靈感源
- kuromoji
- wanakana

## 版權說明
MIT