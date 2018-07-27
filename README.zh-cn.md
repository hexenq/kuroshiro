![kuroshiro](http://hexenq.com/kuroshiro/kuroshiro.png)

# kuroshiro

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)
[![Bower version](https://badge.fury.io/bo/kuroshiro.svg)](https://badge.fury.io/bo/kuroshiro)

kuroshiro.js是一款十分方便使用的日文转换注音工具，主要针对日文文本，进行到平假名、片假名及罗马字的转换，并支持注音假名、送假名
（旁注音）等注音模式。

*其他说明语言：[English](README.md), [简体中文](README.zh-cn.md), [繁體中文](README.zh-tw.md)。*

## 演示
你可以在[这里](http://hexenq.com/kuroshiro/demo/index.html)查看在线演示，初始化会有些慢（需要下载字典，16MB左右），请耐心等待。

## 1.x版本的重大变化
- 从注音逻辑中分离语素解析器部分，使得我们可以使用不同的语素解析器（预定义的或自定义的）
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
### Node.js
首先使用npm包管理器进行安装:
```sh
$ npm install kuroshiro
```

加载kuroshiro库:

*同时支持ES6 Module `import` 和 CommonJS `require`*
```js
import * as Kuroshiro from "kuroshiro";
```

实例化:
```js
const kuroshiro = new Kuroshiro();
```

使用一个解析器实例来初始化kuroshiro:
```js
// 这里使用了async/await, 你同样也可以使用Promise
await kuroshiro.init(new KuromojiAnalyzer());
```

进行转换操作:
```js
const result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
```

### 浏览器
将`dist`中的`kuroshiro.min.js`加入到你的工程，并在HTML中加入:
```html
<script src="url/to/kuroshiro.min.js"></script>
```

实例化:
```js
var kuroshiro = new Kuroshiro();
```

使用一个解析器实例来初始化kuroshiro，然后进行转换操作:
```js
kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/dict" }))
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
使用一个解析器实例来初始化kuroshiro。你可以使用上面提到的已实现的[解析器插件](#解析器插件)。关于解析器的初始化方法请参照相应解析器的文档说明。

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
| delimiter_start | String | '(' | 分隔符 (起始) |
| delimiter_end | String | ')' | 分隔符 (结束) |

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
Kuroshiro.Util.isHiragana("あ"));
```
#### isHiragana(input)
判断input是否是平假名。

#### isKatakana(input)
判断input是否是片假名。

#### isKana(input)
判断input是否是假名。

#### isKanji(input)
判断input是否是日文汉字。

#### isJapanese(input)
判断input是否是日文。

#### hasHiragana(input)
检查input中是否含有平假名。

#### hasKatakana(input)
检查input中是否含有片假名。

#### hasKana(input)
检查input中是否含有假名。

#### hasKanji(input)
检查input中是否含有日文汉字。

#### hasJapanese(input)
检查input中是否含有日文。

## 贡献
请查阅文档 [CONTRIBUTING](CONTRIBUTING.md).

## 灵感源
- kuromoji
- wanakana

## 版权说明
MIT