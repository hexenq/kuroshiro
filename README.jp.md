![kuroshiro](https://kuroshiro.org/kuroshiro.png)

# kuroshiro

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)
[![Join the chat at https://gitter.im/hexenq/kuroshiro](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hexenq/kuroshiro)
[![License](https://img.shields.io/github/license/lassjs/lass.svg)](LICENSE)

kuroshiroは日本語文をローマ字や仮名なとに変換できるライブラリです。フリガナ・送り仮名の機能も搭載します。

*ほかの言語：[English](README.md), [日本語](README.jp.md), [简体中文](README.zh-cn.md), [繁體中文](README.zh-tw.md)。*

## デモ
オンラインデモは[こちら](https://kuroshiro.org/#demo)です。

## 特徴
- 日本語文 => ひらがな、カタカナ、ローマ字
- フリガナ、送り仮名サポート
- 🆕複数の形態素解析器をサポート
- 🆕複数のローマ字表記法をサポート
- 実用ツール付き

## バッジョン1.xでの重大な変更
- 形態素解析器がルビロジックから分離される。それゆえ、様々な形態素解析器（[レディーメイド](#形態素解析器プラグイン)も[カスタマイズ](CONTRIBUTING.md#how-to-submit-new-analyzer-plugins)も）を利用できることになります。
- ES2017の新機能「async/await」を利用します
- CommonJSからES Modulesへ移行します
    
## 形態素解析器プラグイン
*始まる前にプラグインの適合性をチェックしてください*

| 解析器 | Node.js サポート | ブラウザ サポート | レポジトリ | 開発者 |
|---|---|---|---|---|
|Kuromoji|✓|✓|[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)|[Hexen Qi](https://github.com/hexenq)|
|Mecab|✓|✗|[kuroshiro-analyzer-mecab](https://github.com/hexenq/kuroshiro-analyzer-mecab)|[Hexen Qi](https://github.com/hexenq)|
|Yahoo Web API|✓|✓|[kuroshiro-analyzer-yahoo-webapi](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi)|[Hexen Qi](https://github.com/hexenq)|

## 使い方
### Node.js (又はWebpackなどのモジュールバンドラを使ってる時)
npmでインストール:
```sh
$ npm install kuroshiro
```

kuroshiroをロードします:

*ES6 Module `import` と CommonJS `require`、どちらでもOK*
```js
import Kuroshiro from "kuroshiro";
```

インスタンス化します:
```js
const kuroshiro = new Kuroshiro();
```

形態素解析器のインスタンスを引数にしてkuroshiroを初期化する ([API説明](#initanalyzer)を参考にしてください):
```js
// この例では，まずnpm installとimportを通じてkuromojiの形態素解析器を導入します
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

// ...

// 初期化
// ここでasync/awaitを使ってますが, Promiseも使えます
await kuroshiro.init(new KuromojiAnalyzer());
```

変換の実行:
```js
const result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
```

### ブラウザ
`dist/kuroshiro.min.js`を導入し (その前に`npm install`と`npm run build`を通じて`kuroshiro.min.js`を生成します)、そしてHTMLに:
```html
<script src="url/to/kuroshiro.min.js"></script>
```

この例では`kuroshiro-analyzer-kuromoji.min.js`の導入は必要です。詳しくは[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)を参考にしてください
```html
<script src="url/to/kuroshiro-analyzer-kuromoji.min.js"></script>
```

インスタンス化します:
```js
var kuroshiro = new Kuroshiro();
```

形態素解析器のインスタンスを引数にしてkuroshiroを初期化するから，変換を実行します:
```js
kuroshiro.init(new KuromojiAnalyzer({ dictPath: "url/to/dictFiles" }))
    .then(function () {
        return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
    })
    .then(function(result){
        console.log(result);
    })
```

## APIの説明
### コンストラクタ
__例__

```js
const kuroshiro = new Kuroshiro();
```

### インスタンス関数
#### init(analyzer)
形態素解析器のインスタンスを引数にしてkuroshiroを初期化する。先に形態素解析器の導入と初期化は必要です。前述の[形態素解析器プラグイン](#形態素解析器プラグイン)を利用できます。形態素解析器の初期化方法は各自のドキュメントを参照してください。

__引数__

* `analyzer` - 形態素解析器のインスタンス。

__例__

```js
await kuroshiro.init(new KuromojiAnalyzer());
```

#### convert(str, [options])
文字列を目標音節文字に変換します（変換モードが設置できます）。

__引数__

* `str` - 変換される文字列。
* `options` - *任意* 変換のパラメータ。下表の通り。

| オプション | タイプ | デフォルト値 | 説明 |
|---|---|---|---|
| to | String | 'hiragana' | 目標音節文字<br />`hiragana` (ひらがな),<br />`katakana` (カタカナ),<br />`romaji` (ローマ字) |
| mode | String | 'normal' | 変換モード<br />`normal` (一般),<br />`spaced` (スペースで組み分け),<br />`okurigana` (送り仮名),<br />`furigana` (フリガナ) |
| romajiSystem<sup>*</sup> | String | "hepburn" | ローマ字<br />`nippon` (日本式),<br />`passport` (パスポート式),<br />`hepburn` (ヘボン式) |
| delimiter_start | String | '(' | 区切り文字 (始め) |
| delimiter_end | String | ')' | 区切り文字 (終り) |

**: 引数`romajiSystem`は引数`to`が`romaji`に設定されてる場合にのみ有効です。詳細については, [ローマ字表記法](#ローマ字表記法)を参考にしてください。*

__例__

```js
// normal (一般)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 結果：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

```js
// spaced (スペースで組み分け)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 結果：かんじとれ たら て を つなご う 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！
```

```js
// okurigana (送り仮名)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 結果: 感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！
```

<pre>
// furigana (フリガナ)
kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"furigana", to:"hiragana"});
// 結果: <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！
</pre>

### 実用ツール
__例__
```js
const result = Kuroshiro.Util.isHiragana("あ"));
```
#### isHiragana(char)
入力文字はひらがなかどうかを判断します。

#### isKatakana(char)
入力文字はカタカナかどうかを判断します。

#### isKana(char)
入力文字は仮名かどうかを判断します。

#### isKanji(char)
入力文字は漢字かどうかを判断します。

#### isJapanese(char)
入力文字は日本語かどうかを判断します。

#### hasHiragana(str)
入力文字列にひらがながあるかどうかを確認する。

#### hasKatakana(str)
入力文字列にカタカナがあるかどうかを確認する。

#### hasKana(str)
入力文字列に仮名があるかどうかを確認する。

#### hasKanji(str)
入力文字列に漢字があるかどうかを確認する。

#### hasJapanese(str)
入力文字列に日本語があるかどうかを確認する。

#### kanaToHiragna(str)
入力仮名文字列をひらがなへ変換します。

#### kanaToKatakana(str)
入力仮名文字列をカタカナへ変換します。

#### kanaToRomaji(str, system)
入力仮名文字列をローマ字へ変換します。引数`system`の指定可能値は`"nippon"`, `"passport"`, `"hepburn"` (デフォルト値: "hepburn")

## ローマ字表記法
kuroshiroは三種類のローマ字表記法をサポートします。

`nippon`: 日本式ローマ字。[ISO 3602 Strict](http://www.age.ne.jp/x/nrs/iso3602/iso3602.html) を参照。

`passport`: パスポート式ローマ字。 日本外務省が発表した [ヘボン式ローマ字綴方表](https://www.ezairyu.mofa.go.jp/passport/hebon.html) を参照。

`hepburn`: ヘボン式ローマ字。[BS 4812 : 1972](https://archive.is/PiJ4) を参照。

各種ローマ字表の比較は[こちら](http://jgrammar.life.coocan.jp/ja/data/rohmaji2.htm)を参考にしてください。

### ローマ字変換のお知らせ
フリガナは音声を正確にあらわしていないため、__フリガナ__ を __ローマ字__ に完全自動的に変換することは不可能です。（[なぜフリガナではダメなのか？](https://green.adam.ne.jp/roomazi/onamae.html#naze)を参照）

そのゆえ、`nippon`、`hepburn`のローマ字表記法を使って、フリガナ（仮名）-> ローマ字 変換を行うとき、kuroshiroは長音の処理を実行しません。（`passport`表記法そのものが長音を無視します）

*例えば`nippon`、` passport`、 `hepburn`のローマ字表記法を使って フリガナ->ローマ字 変換を行うと、それぞれ"kousi"、 "koshi"、 "koushi"が得られます。*

フリガナモードを使うかどうかにかかわらず、漢字->ローマ字の変換はこの仕組みに影響を与えられないです。

## 貢献したい方
[CONTRIBUTING](CONTRIBUTING.md) を参考にしてみてください。

## 感謝
- kuromoji
- wanakana

## ライセンス
MIT