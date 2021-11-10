![kuroshiro](https://kuroshiro.org/kuroshiro.png)

# kuroshiro

[![Build Status](https://travis-ci.org/hexenq/kuroshiro.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro)
[![Coverage Status](https://coveralls.io/repos/hexenq/kuroshiro/badge.svg)](https://coveralls.io/r/hexenq/kuroshiro)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](http://badge.fury.io/js/kuroshiro)
[![Join the chat at https://gitter.im/hexenq/kuroshiro](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hexenq/kuroshiro)
[![License](https://img.shields.io/github/license/lassjs/lass.svg)](LICENSE)

kuroshiro는 일본어 문장을 히라가나, 가타나카 및 로마자로 변환할 수 있는 라이브러리입니다. 후리가나와 오쿠리가나 방식도 지원합니다.

*다른 언어로 읽기: [English](README.md), [日本語](README.jp.md), [简体中文](README.zh-cn.md), [繁體中文](README.zh-tw.md), [Esperanto](README.eo-eo.md), [한국어](README.ko-kr.md).*

## 데모
[여기서](https://kuroshiro.org/#demo) 데모를 확인해보세요.

## 기능
- 일본어 문장 => 히라가나, 가타카나, 로마자
- 후리가나와 오쿠리가나 지원
- 🆕여러 형태소 분석기 지원
- 🆕여러 로마자 표기법 지원
- 유용한 일본어 유틸리티 포함

## 1.x 버전의 주요 변경 사항
- 다른 형태소 분석기들을 사용할 수 있도록 형태소 분석기가 음성 표기법 로직에서 분리됨 ([만들어져 있는 형태소 분석기](#형태소-분석기-플러그인)도, [커스터마이즈](CONTRIBUTING.md#how-to-submit-new-analyzer-plugins)한 형태소 분석기도 사용할 수 있습니다.)
- ES8/ES2017의 async/await을 사용합니다.
- CommonJS 대신 ES6 모듈을 사용합니다.
    
## 형태소 분석기 플러그인
*각 플러그인을 사용하기 전에 호환성을 확인해 주세요.*

| 분석기 | Node.js 지원| 브라우저 지원 | 플러그인 저장소 | 개발자 |
|---|---|---|---|---|
|Kuromoji|✓|✓|[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)|[Hexen Qi](https://github.com/hexenq)|
|Mecab|✓|✗|[kuroshiro-analyzer-mecab](https://github.com/hexenq/kuroshiro-analyzer-mecab)|[Hexen Qi](https://github.com/hexenq)|
|Yahoo Web API|✓|✗|[kuroshiro-analyzer-yahoo-webapi](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi)|[Hexen Qi](https://github.com/hexenq)|

## 사용방법
### Node.js (또는 Webpack과 같은 모듈 번들러를 사용할 때)
npm을 이용하여 설치합니다.
```sh
$ npm install kuroshiro
```
    
라이브러리를 불러옵니다. `import` 방식도, `require` 방식도 좋습니다.

*ES6 Module `import` 방식의 예시*

```js
// 이 예시에서는 kuroshiro-analyzer-kuromoji도 설치하였습니다.
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

// 객체 생성
const kuroshiro = new Kuroshiro();

// 초기화
// 여기서는 async/await을 사용하지만, Promise를 사용해도 좋습니다.
await kuroshiro.init(new KuromojiAnalyzer());

// 변환하기
const result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
```

*CommonJS `require` 방식의 예시*

```js
const Kuroshiro = require("kuroshiro")；
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
    
### 브라우저
`dist/kuroshiro.min.js`를 프론트엔드 프로젝트에 추가하세요. (`npm install`로 설치하고, `npm run build`로 만들어서 사용할 수 있습니다.)

HTML에서 script 태그로 불러옵니다.
```html
<script src="url/to/kuroshiro.min.js"></script>
```

이 예시에서는, `kuroshiro-analyzer-kuromoji.min.js`를 사용합니다. [kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)에서 확인해보세요.
```html
<script src="url/to/kuroshiro-analyzer-kuromoji.min.js"></script>
```

객체를 생성합니다.
```js
var kuroshiro = new Kuroshiro();
```

kuroshiro를 객체화한 분석기로 초기화하고, 변환합니다.
```js
kuroshiro.init(new KuromojiAnalyzer({ dictPath: "url/to/dictFiles" }))
    .then(function () {
        return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
    })
    .then(function(result){
        console.log(result);
    })
```

## API 설명
### 생성자
__예시__

```js
const kuroshiro = new Kuroshiro();
```

### 인스턴스 메서드
#### init(analyzer)
kuroshiro를 분석기의 객체와 함께 초기화합니다. 형태소 분석기를 먼저 불러온 후 초기화 해야합니다. 앞서 언급했던 [형태소 분석기 플러그인](#형태소-분석기-플러그인)을 사용할 수 있습니다. 분석기를 초기화하는 방법에 대하여는 각 분석기의 문서를 참고해 주세요.

__인자__

* `analyzer` - 분석기의 객체.

__예시__

```js
await kuroshiro.init(new KuromojiAnalyzer());
```

#### convert(str, [options])
문자열을 옵션과 함께 음절 문자로 변환합니다.

__인자__

* `str` - 변환할 문자열.
* `options` - *선택적 인자* 변환 옵션. 아래 표를 확인해 주세요.

| 옵션 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| to | String | "hiragana" | 목표 음절 문자<br />`hiragana` (히라가나),<br />`katakana` (가타카나),<br />`romaji` (로마자) |
| mode | String | "normal" | 변환 모드<br />`normal` (일반),<br />`spaced` (공백 문자로 분리),<br />`okurigana` (오쿠리가나),<br />`furigana` (후리가나) |
| romajiSystem<sup>*</sup> | String | "hepburn" | 로마자 표기법<br />`nippon` (일본식),<br />`passport` (여권식),<br />`hepburn` (헵번식) |
| delimiter_start | String | "(" | 구분 문자(시작) |
| delimiter_end | String | ")" | 구분 문자(끝) |

**: 매개변수 `romajiSystem`은 매개변수 `to`가 `romaji`일 경우에만 적용됩니다. 자세한 사항은 [로마자 표기법](#로마자-표기법)을 참고하세요.*

__예시__

```js
// normal (일반)
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 결과：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

```js
// spaced (공백 문자로 분리)
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 결과：かんじとれ たら て を つなご う 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！
```

```js
// okurigana (오쿠리가나)
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// 결과: 感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！
```

<pre>
// furigana (후리가나)
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"furigana", to:"hiragana"});
// 결과: <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！
</pre>

### 유틸리티
__예시__
```js
const result = Kuroshiro.Util.isHiragana("あ"));
```
#### isHiragana(char)
입력한 문자가 히라가나인지 확인합니다.

#### isKatakana(char)
입력한 문자가 가타카나인지 확인합니다.

#### isKana(char)
입력한 문자가 가나인지 확인합니다.

#### isKanji(char)
입력한 문자가 한자인지 확인합니다.

#### isJapanese(char)
입력한 문자가 일본어인지 확인합니다.

#### hasHiragana(str)
입력한 문자열에 히라가나가 포함되었는지 확인합니다.

#### hasKatakana(str)
입력한 문자열에 가타카나가 포함되었는지 확인합니다.

#### hasKana(str)
입력한 문자열에 가나가 포함되었는지 확인합니다.

#### hasKanji(str)
입력한 문자열에 한자가 포함되었는지 확인합니다.

#### hasJapanese(str)
입력한 문자열에 일본어가 포함되었는지 확인합니다.

#### kanaToHiragna(str)
입력한 가나 문자열을 히라가나로 변환합니다.

#### kanaToKatakana(str)
입력한 가나 문자열을 가타카나로 변환합니다.

#### kanaToRomaji(str, system)
입력한 가나 문자열을 로마자로 변환합니다. 매개변수 `system`은 `"nippon"`, `"passport"`, `"hepburn"` 을 받습니다. (기본값: "hepburn"). 

## 로마자 표기법
kuroshiro는 세 가지의 로마자 표기법을 지원합니다.

`nippon`: 일본식 로마자 표기법. [ISO 3602 Strict](http://www.age.ne.jp/x/nrs/iso3602/iso3602.html)를 참고하세요.

`passport`: 여권식 로마자 표기법. 일본 외무성이 발행한 [헵번식 로마자 철자법표](https://www.ezairyu.mofa.go.jp/passport/hebon.html)를 참고하세요.

`hepburn`: 헵번식 로마자 표기법. [BS 4812 : 1972](https://archive.is/PiJ4)를 참고하세요.

각 로마자 표기법의 차이를 확인할 수 있는 유용한 [웹페이지](http://jgrammar.life.coocan.jp/ja/data/rohmaji2.htm)가 있습니다.

### 로마자 변환에 대한 알림
후리가나는 발음에 대한 정보가 부족하기 때문에, __후리가나__ 를 즉시 __로마자__ 로 완전히 자동으로 변환하는 것은 불가능합니다. ([なぜ フリガナでは ダメなのか？](https://green.adam.ne.jp/roomazi/onamae.html#naze)를 참고하세요.)

kuroshiro는 모든 로마자 표기법에서 후리가나(가나)를 로마자로 변환할 때, 장음을 처리하지 않을 것입니다. (장음부는 처리됩니다.)

*예를 들어, `nippon`, `passport`, `hepburn` 표기법을 차례대로, 가나 "こうし"를 로마자로 변환하면 "kousi", "koushi", "koushi"를 얻게 됩니다.*

후리가나 모드에 상관 없이, 한자 -> 로마자 변환에서 이 로직은 __적용되지 않습니다.__

## 기여하기
[CONTRIBUTING](CONTRIBUTING.md)을 확인해 주세요.

## 영감
- kuromoji
- wanakana

## 라이선스
MIT
