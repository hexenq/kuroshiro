![kuroshiro](https://kuroshiro.org/kuroshiro.png)

# kuroshiro

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)
[![Join the chat at https://gitter.im/hexenq/kuroshiro](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hexenq/kuroshiro)
[![License](https://img.shields.io/github/license/lassjs/lass.svg)](LICENSE)

kuroshiro是一款十分方便使用的日文转换注音工具，主要针对日文文本，进行到平假名、片假名及罗马字的转换，并支持注音假名、送假名
（旁注音）等注音模式。

*其他说明语言：[English](README.md), [日本語](README.jp.md), [简体中文](README.zh-cn.md), [繁體中文](README.zh-tw.md)。*

## 演示
你可以在[这里](https://kuroshiro.org/#demo)查看在线演示。

## 特性
- 日文文本 => 平假名、片假名、罗马字
- 支持注音假名和送假名
- 🆕支持多种语素解析器
- 🆕支持多种罗马字体系
- 实用日语工具

## 1.x版本的重大变化
- 从注音逻辑中分离语素解析器部分，使得我们可以使用不同的语素解析器（[预定义的](#解析器插件)或[自定义的](CONTRIBUTING.md#how-to-submit-new-analyzer-plugins)）
- 拥抱ES8/ES2017以使用async/await方法
- 使用ES6 Module取代CommonJS
    
## 解析器插件
*在开始工作之前，请先确认各插件的环境兼容性*

| 解析器 | Node.js支持 | 浏览器支持 | 仓库 | 开发者 |
|---|---|---|---|---|
|Kuromoji|✓|✓|[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)|[Hexen Qi](https://github.com/hexenq)|
|Mecab|✓|✗|[kuroshiro-analyzer-mecab](https://github.com/hexenq/kuroshiro-analyzer-mecab)|[Hexen Qi](https://github.com/hexenq)|
|Yahoo Web API|✓|✓|[kuroshiro-analyzer-yahoo-webapi](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi)|[Hexen Qi](https://github.com/hexenq)|

## 如何使用
### Node.js (或使用Webpack等打包工具时)
首先使用npm包管理器进行安装:
```sh
$ npm install kuroshiro
```

加载kuroshiro库:

*同时支持ES6 Module `import` 和 CommonJS `require`*
```js
import Kuroshiro from "kuroshiro";
```

实例化:
```js
const kuroshiro = new Kuroshiro();
```

使用一个解析器实例来初始化kuroshiro (请参考[API说明](#initanalyzer)):
```js
// 在这个示例中，首先npm install并import导入kuromoji解析器
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

// ...

// 初始化
// 这里使用了async/await, 你同样也可以使用Promise
await kuroshiro.init(new KuromojiAnalyzer());
```

进行转换操作:
```js
const result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
```

### 浏览器
将`dist/kuroshiro.min.js`加入到你的工程 (你需要先后执行`npm install`和`npm run build`，以把它构建出来)，并在HTML中加入:
```html
<script src="url/to/kuroshiro.min.js"></script>
```

在这个示例中, 你还需要引入`kuroshiro-analyzer-kuromoji.min.js`。具体获取方法请参考[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)
```html
<script src="url/to/kuroshiro-analyzer-kuromoji.min.js"></script>
```

实例化:
```js
var kuroshiro = new Kuroshiro();
```

使用一个解析器实例来初始化kuroshiro，然后进行转换操作:
```js
kuroshiro.init(new KuromojiAnalyzer({ dictPath: "url/to/dictFiles" }))
    .then(function () {
        return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
    })
    .then(function(result){
        console.log(result);
    })
```

## API说明
### 构造器
__示例__

```js
const kuroshiro = new Kuroshiro();
```

### 实例方法
#### init(analyzer)
使用一个解析器实例来初始化kuroshiro。你需要首先导入并初始化一个解析器。你可以使用上面提到的已实现的[解析器插件](#解析器插件)。关于解析器的初始化方法请参照相应解析器的文档说明。

__参数__

* `analyzer` - 解析器实例。

__示例__

```js
await kuroshiro.init(new KuromojiAnalyzer());
```

#### convert(str, [options])
转换指定的字符串到指定的音节文字（可在选项中配置注音模式等设置）。

__参数__

* `str` - 将被转换的字符串。
* `options` - *可选* 转换选项，见下表。

| 选项 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| to | String | 'hiragana' | 目标音节文字<br />`hiragana` (平假名),<br />`katakana` (片假名),<br />`romaji` (罗马字) |
| mode | String | 'normal' | 转换模式<br />`normal` (标准模式),<br />`spaced` (空格分组),<br />`okurigana` (送假名),<br />`furigana` (注音假名) |
| romajiSystem<sup>*</sup> | String | "hepburn" | 罗马字体系<br />`nippon` (日本式),<br />`passport` (护照式),<br />`hepburn` (平文式) |
| delimiter_start | String | '(' | 分隔符 (起始) |
| delimiter_end | String | ')' | 分隔符 (结束) |

**: `romajiSystem`参数仅当`to`参数设置为`romaji`时生效。有关这一参数的更多信息, 请见 [罗马字体系](#罗马字体系)*

__示例__

```js
// normal (标准模式)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 结果：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

```js
// spaced (空格分组)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 结果：かんじとれ たら て を つなご う 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！
```

```js
// okurigana (送假名)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 结果: 感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！
```

<pre>
// furigana (注音假名)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"furigana", to:"hiragana"});
// 结果: <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！
</pre>

### 实用工具
__示例__
```js
const result = Kuroshiro.Util.isHiragana("あ"));
```
#### isHiragana(char)
判断输入字符是否是平假名。

#### isKatakana(char)
判断输入字符是否是片假名。

#### isKana(char)
判断输入字符是否是假名。

#### isKanji(char)
判断输入字符是否是日文汉字。

#### isJapanese(char)
判断输入字符是否是日文。

#### hasHiragana(str)
检查输入字符串中是否含有平假名。

#### hasKatakana(str)
检查输入字符串中是否含有片假名。

#### hasKana(str)
检查输入字符串中是否含有假名。

#### hasKanji(str)
检查输入字符串中是否含有日文汉字。

#### hasJapanese(str)
检查输入字符串中是否含有日文。

#### kanaToHiragna(str)
转换输入假名字符串至平假名。

#### kanaToKatakana(str)
转换输入假名字符串至片假名。

#### kanaToRomaji(str, system)
转换输入假名字符串至罗马字。参数`system`可选值为`"nippon"`, `"passport"`, `"hepburn"` (默认值: "hepburn")。

## 罗马字体系
kuroshiro支持三种罗马字体系。

`nippon`: 日本式罗马字。参照 [ISO 3602 Strict](http://www.age.ne.jp/x/nrs/iso3602/iso3602.html)。

`passport`: 护照式罗马字。 参照日本外务省发布的 [日文罗马字对照表](https://www.ezairyu.mofa.go.jp/passport/hebon.html)。

`hepburn`: 平文罗马字。参照 [BS 4812 : 1972](https://archive.is/PiJ4)。

想快速了解这些罗马字体系的不同，可参考这个实用的[网页](http://jgrammar.life.coocan.jp/ja/data/rohmaji2.htm)。

### 罗马字转换须知
完全自动化进行注音假名到罗马字的直接转换是不可能的，这是因为一般的注音假名都缺乏正确的发音信息，可以参考 [なぜ フリガナでは ダメなのか？](https://green.adam.ne.jp/roomazi/onamae.html#naze)。

因此kuroshiro在进行直接的注音假名->罗马字转换（使用`nippon`或`hepburn`罗马字体系）时，不会处理长音。(`passport`罗马字体系本身便忽略长音)

*例如，当进行假名"こうし"到罗马字的转换时，对于`nippon`, `passport`, `hepburn`三种罗马字体系，你会分别得到"kousi", "koshi", "koushi"这几个结果*

汉字->罗马字的转换无论使用注音假名模式与否都 __不受__ 此逻辑影响。

## 贡献
请查阅文档 [CONTRIBUTING](CONTRIBUTING.md).

## 灵感源
- kuromoji
- wanakana

## 版权说明
MIT