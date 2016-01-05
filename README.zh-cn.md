![kuroshiro.js](http://www.hexenq.com/kuroshiro/kuroshiro.png)

# kuroshiro.js

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.js.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro.js)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro.js/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro.js)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)
[![Bower version](https://badge.fury.io/bo/kuroshiro.svg)](https://badge.fury.io/bo/kuroshiro)
[![dependencies](https://david-dm.org/hexenq/kuroshiro.js.svg)](https://david-dm.org/hexenq/kuroshiro.js)

kuroshiro.js是一个十分方便使用的日文转换注音工具，主要针对含有日文汉字的文本，进行到平假名、片假名及罗马字的转换，并支持注音假名、送假名
（旁注音）等注音模式。本项目受到kuromoji和wanakana启发。

*其他语言版本：[English](README.md), [简体中文](README.zh-cn.md).*

## 演示
你可以在[这里](http://www.hexenq.com/kuroshiro/demo/index.html)查看在线演示，初始化会有些慢（需要下载字典，16MB左右），请耐心等待。

## 如何使用
### Node.js
首先使用npm包管理器进行安装:

    npm install kuroshiro
    
加载kuroshiro库:

    var kuroshiro = require("kuroshiro");
    
开始使用:

    kuroshiro.init(function (err) {
        // kuroshiro.js初始化完毕
        var result = kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！');    
        console.log(result);
    });
    
### 浏览器
使用Bower包管理器安装:

    bower install kuroshiro
    
在HTML中添加:

    <script src="url/to/kuroshiro.js"></script>

开始使用:
                  
    kuroshiro.init(function (err) {
      // kuroshiro.js初始化完毕
      var result = kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！');    
      console.log(result);
    });

## API说明
### init([options], [callback])
初始化kuroshiro.js。 你应该在调用其他函数方法前调用一次本函数方法来进行初始化（只需初始化一次即可）。

__参数__

* `options` - *可选* 初始化选项，你可以通过 `dicPath` 来自定义IPA字典位置。
* `callback` - *可选* 当kuroshiro.js初始化完成或有错误发生时回调的函数方法。

__示例__

```js
kuroshiro.init(function (err) {
    // kuroshiro.js初始化完毕
    // 做些什么
});
```

### convert(str, [options])
转换指定的字符串到指定的音节文字（可在选项中配置注音模式等设置）。

__参数__

* `str` - 将被转换的字符串。
* `options` - *可选* 转换选项，见下表。

| 选项 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| to | String | 'hiragana' | 目标音节文字 [`hiragana`(平假名),`katakana`(片假名),`romaji`(罗马字)] |
| mode | String | 'normal' | 转换模式 [`normal`(标准模式),`spaced`(空格分组),`okurigana`(送假名),`furigana`(注音假名)] |
| delimiter_start | String | '(' | 分隔符(起始) |
| delimiter_end | String | ')' | 分隔符(结束) |

__示例__

```js
kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', {mode:'okurigana', to:'hiragana'});
// 输出: 感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！
```

### toHiragana(str, [options])
转换指定字符串到平假名。没有`to`参数，其余选项参数与convert()函数方法一样。

### toKatakana(str, [options])
转换指定字符串到片假名。没有`to`参数，其余选项参数与convert()函数方法一样。

### toRomaji(str, [options])
转换指定字符串到罗马字。没有`to`参数，其余选项参数与convert()函数方法一样。

### toKana(input)
转换罗马字到平（片）假名（使用wanakana）。

### isHiragana(input)
判断input是否是平假名（使用wanakana）。

### isKatakana(input)
判断input是否是片假名（使用wanakana）。

### isRomaji(input)
判断input是否是罗马字（使用wanakana）。

### isKanji(input)
判断input是否是日文汉字。

### hasHiragana(input)
检查input中是否含有平假名。

### hasKatakana(input)
检查input中是否含有片假名。

### hasKanji(input)
检查input中是否含有日文汉字。

## 版权说明
MIT