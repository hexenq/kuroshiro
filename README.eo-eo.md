![kuroshiro](https://kuroshiro.org/kuroshiro.png)

# Kuroshiro

[![CI](https://github.com/hexenq/kuroshiro/actions/workflows/ci.yml/badge.svg)](https://github.com/hexenq/kuroshiro/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](https://www.npmjs.com/package/kuroshiro)
[![License](https://img.shields.io/github/license/hexenq/kuroshiro.svg)](LICENSE)

la Kuroshiro estas Japanalingvo kodlibrejo por konverti Japanajn frazojn al Hiraganao, Katakanao aŭ Romaĝio, kaj ankaŭ subtenas furiganaon kaj okuriganaon.

*Legi ĉi tion per aliaj lingvoj: [English](README.md), [日本語](README.jp.md), [简体中文](README.zh-cn.md), [繁體中文](README.zh-tw.md), [Esperanto](README.eo-eo.md), [한국어](README.ko-kr.md).*

## Ekzempla Paĝo
Vidi la ekzemplan paĝon [ĉi tie](https://kuroshiro.org/#demo).

## Elementoj
- Japanalingva Frazo => Hiraganao, Katakanao aŭ Romaĝio
- Furiganao kaj okuriganao modoj
- 🆕Multaj lingvastrukturaj metodoj
- 🆕Multaj romanaskriptkonvertaj sistemoj
- Utilaj Japanalingvaj iloj

## Migrado de 1.x

- Versio 2 postulas Node.js 22+ aŭ retumilon kun denaska subteno por ES2015, inkluzive de Promise. Internet Explorer ne estas subtenata. Kontrolu ankaŭ la postulojn de la analizilo.
- Anstataŭigu `Kuroshiro.Util.kanaToHiragna(...)` per `Kuroshiro.Util.kanaToHiragana(...)`; la malnova nomo estas forigita.
- CommonJS `require`, defaŭltaj ESM-importoj, la retumila tutmonda variablo `Kuroshiro` kaj la nesinkronaj API-metodoj `init()` / `convert()` restas subtenataj.
- La pakaĵo inkluzivas TypeScript-tipdeklarojn; vidu [uzadon kun TypeScript](README.md#typescript). La sekvaj ekzemploj uzas Kuromoji 2.0 beta, kiu ankaŭ inkluzivas tipdeklarojn.

## Finitaj Analizilaj (Lingvastrukturaj) Iloj
*Antaŭ uzi ilon, bonvolu certiĝi pri mediakongrueco*
| Analizilo | Node.js Uzadeblo | Retumilo Uzadeblo | Plugin Repo | Programisto |
|---|---|---|---|---|
|Kuromoji|✓|✓|[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)|[Hexen Qi](https://github.com/hexenq)|
|Mecab|✓|✗|[kuroshiro-analyzer-mecab](https://github.com/hexenq/kuroshiro-analyzer-mecab)|[Hexen Qi](https://github.com/hexenq)|
|Yahoo Web API (prizorgado paŭzita)|✓|✗|[kuroshiro-analyzer-yahoo-webapi](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi)|[Hexen Qi](https://github.com/hexenq)|

La migrado de la analizilo Yahoo Web API al la nova API ankoraŭ ne finiĝis, kaj ĝia prizorgado estas paŭzita. Ĝi ne estas rekomendata por novaj projektoj. Vidu la [staton de prizorgado](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi#maintenance-status).

## Uzado
### Node.js (aŭ per "module bundler"-ilo (kiel Webpack))
Instali per npm pako-administrilo:
```sh
$ npm install kuroshiro@beta kuroshiro-analyzer-kuromoji@beta
```
    
Ŝargi la kodotekon:

*Subtenas ambaŭ "ES6 Module" `import` kaj "CommonJS" `require`*
```js
import Kuroshiro from "kuroshiro";
```

Generi:
```js
const kuroshiro = new Kuroshiro();
```

Iniciati kuroshiro kun genero de analizilo (Rigardu la dokumenton [apidoc](#initanalyzer) por vidi pli da informo):
```js
// Por ĉi tiu ekzemplo, vi devus fari npm install kaj importi la "kuromoji" analizilon unue.
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

// ...

// Ŝargi
// Ĉi tio uzas async/await, sed vi ankaŭ povus uzi Promise
await kuroshiro.init(new KuromojiAnalyzer());
```

Konverti frazon:
```js
const result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
```
    
### Retumilo
Uzu `dist/kuroshiro.min.js` el la instalita npm-pakaĵo kaj aldonu ĝin al via HTML:
```html
<script src="url/to/kuroshiro.min.js"></script>
```

Por fari kiel en ĉi ekzemplo, vi devas ankaŭ inkluzivi `kuroshiro-analyzer-kuromoji.min.js` kiu vi povas preni ĉe [kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)
```html
<script src="url/to/kuroshiro-analyzer-kuromoji.min.js"></script>
```

Ŝargi:
```js
var kuroshiro = new Kuroshiro();
```

Iniciati kuroshiro per ŝargo de analizilo, poste konverti:
```js
kuroshiro.init(new KuromojiAnalyzer({ dictPath: "url/to/dictFiles" }))
    .then(function () {
        return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
    })
    .then(function(result){
        console.log(result);
    })
```

## API
### Konstruilo
__Ekzemploj__

```js
const kuroshiro = new Kuroshiro();
```

### Instancometodoj
#### init(analyzer)
Iniciati kuroshiro per instanco de analizilo. Vi devus unue importi analizilon kaj iniciati ĝin. Vi povas uzi la [finitaj-iloj](#ready-made-analyzer-plugins) skribita supre. Bonvole rigardu la analizilan dokumentaron por vidi instrukciojn.

__Argumentoj__

* `analyzer` - Instanco de Analizilo.

__Ekzemploj__

```js
await kuroshiro.init(new KuromojiAnalyzer());
```

#### convert(str, [options])
Konverti frazon al cela skribsistemo (kun agordoj)

__Argumentoj__

* `str` - Konvertvola Frazo.
* `options` - *Optional* kuroshiro havas multajn frazajn konvertagordojn.

| Agordoj | Tipo | Defaŭlto | Informo |
|---|---|---|---|
| to | String | "hiragana" | Target syllabary [`hiragana`, `katakana`, `romaji`] |
| mode | String | "normal" | Convert mode [`normal`, `spaced`, `okurigana`, `furigana`] |
| romajiSystem<sup>*</sup> | String | "hepburn" | Romanization system [`nippon`, `passport`, `hepburn`] |
| delimiter_start | String | "(" | Delimiter(Start) |
| delimiter_end | String | ")" | Delimiter(End) |

**: Param `romajiSystem` estas uzata sole kiam parametro `to` estas `romaji`. Por vidi plie, rigardu [Romanaskriptkonvertaj Sistemoj](#romanization-system)*

__Ekzemploj__

```js
// normal
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"normal", to:"hiragana"});
// rezulto：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

```js
// spaced
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"spaced", to:"hiragana"});
// rezulto：かんじとれ たら て を つなごう 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！
```

```js
// okurigana
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// rezulto: 感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！
```

<pre>
// furigana
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"furigana", to:"hiragana"});
// rezulto: <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！
</pre>

### Utilaĵoj

__Ekzemploj__
```js
const result = Kuroshiro.Util.isHiragana("あ");
```
#### isHiragana(char)
Determini se enigita litero estas hiragana.

#### isKatakana(char)
Determini se enigita litero estas katakana.

#### isKana(char)
Determini se enigita litero estas kana.

#### isKanji(char)
Determini se enigita litero estas kanĵio.

#### isJapanese(char)
Determini se enigita litero estas Japanolingva.

#### hasHiragana(str)
Determini se enigita frazo enhavas hiraganan.

#### hasKatakana(str)
Determini se enigita frazo enhavas katakanan.

#### hasKana(str)
Determini se enigita frazo enhavas kanan.

#### hasKanji(str)
Determini se enigita frazo enhavas kanĵion.

#### hasJapanese(str)
Determini se enigita frazo enhavas Japanolingvajn Frazojn.

#### kanaToHiragana(str)
Konverti enigitan kanan frazon al hiragana

#### kanaToKatakana(str)
Konverti enigitan kanan frazon al katakana.

#### kanaToRomaji(str, system)
Konverti enigitan kanan frazon al romaĝio. Param `system` povas enhavi `"nippon"`, `"passport"`, `"hepburn"` (Defaŭlta: "hepburn").

## Romanaskriptkonvertaj Sistemoj
kuroshiro povas uzi tri da Romanaskriptkonvertajn Sistemojn.

`nippon`: Nippon-shiki sistemo. Rigardu [ISO 3602 Strict](http://www.age.ne.jp/x/nrs/iso3602/iso3602.html).

`passport`: Passport-shiki sistemo. Rigardu [Japanese romanization table](https://www.ezairyu.mofa.go.jp/passport/hebon.html) de la "Japana Ministerio de Eksteraj Aferoj".

`hepburn`: Hepburn sistemo. Rigardu [BS 4812 : 1972](https://archive.is/PiJ4).

Por vidi la malsamecoj de la tri sistemoj, rigardu [webpage](http://jgrammar.life.coocan.jp/ja/data/rohmaji2.htm).

### Informo pri Romaĝia Konvertado
Ne eblas tute konverti __furigana__ precize al __romaĝio__ ĉar furigana ne enhavas kompletan prononcan informon, (Rigardu [なぜ フリガナでは ダメなのか？](https://green.adam.ne.jp/roomazi/onamae.html#naze)) do kuroshiro ne konvertas chōon dum konvertado el furigana (kana) -> romaĝio je ĉiom da sistemoj (Sed, Chōonpu ĉiam konvertas) 

*Ekzemple, vi vidos "kousi", "koushi", "koushi" dum kana konvertado de "こうし" al romaĝio 
kiam vi uzas `nippon`, `passport`, `hepburn` sistemojn respektive*

Kanĝip -> romaĝio konvertado __ne estas afektita__.

## Kontribui
Rigardu [CONTRIBUTING](CONTRIBUTING.md).

## Inspiroj
- kuromoji
- wanakana

## Licenco
MIT
