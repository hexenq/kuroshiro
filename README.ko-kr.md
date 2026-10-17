![kuroshiro](https://kuroshiro.org/kuroshiro.png)

# kuroshiro

[![CI](https://github.com/hexenq/kuroshiro/actions/workflows/ci.yml/badge.svg)](https://github.com/hexenq/kuroshiro/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/kuroshiro.svg)](https://www.npmjs.com/package/kuroshiro)
[![License](https://img.shields.io/github/license/hexenq/kuroshiro.svg)](LICENSE)

kuroshiro는 일본어 문장을 히라가나, 가타카나 및 로마자로 변환할 수 있는 라이브러리입니다. 후리가나와 오쿠리가나 방식도 지원합니다.

*다른 언어로 읽기: [English](README.md), [日本語](README.jp.md), [简体中文](README.zh-cn.md), [繁體中文](README.zh-tw.md), [Esperanto](README.eo-eo.md), [한국어](README.ko-kr.md).*

## 데모
[여기서](https://kuroshiro.org/#demo) 데모를 확인해보세요.

## 기능
- 일본어 문장 => 히라가나, 가타카나, 로마자
- 후리가나와 오쿠리가나 지원
- 🆕여러 형태소 분석기 지원
- 🆕여러 로마자 표기법 지원
- 유용한 일본어 유틸리티 포함

## 1.x에서 마이그레이션

- 2.x는 Node.js 22+ 또는 Promise를 포함한 ES2015를 기본 지원하는 브라우저가 필요합니다. Internet Explorer는 지원하지 않습니다. 형태소 분석기의 실행 환경 요구 사항도 따로 확인해 주세요.
- `Kuroshiro.Util.kanaToHiragna(...)`를 `Kuroshiro.Util.kanaToHiragana(...)`로 바꿔 주세요. 이전 이름은 제거되었습니다.
- CommonJS `require`, ESM 기본 가져오기, 브라우저 전역 변수 `Kuroshiro`, 비동기 `init()` / `convert()` API는 계속 지원합니다.
- TypeScript 선언이 포함되어 있습니다. [TypeScript 사용법](README.md#typescript)을 참고해 주세요. 아래 예제에서는 타입 선언을 포함한 Kuromoji 2.0 beta를 사용합니다.

## 형태소 분석기 플러그인
*각 플러그인을 사용하기 전에 호환성을 확인해 주세요.*

| 분석기 | Node.js 지원| 브라우저 지원 | 플러그인 저장소 | 개발자 |
|---|---|---|---|---|
|Kuromoji|✓|✓|[kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)|[Hexen Qi](https://github.com/hexenq)|
|Mecab|✓|✗|[kuroshiro-analyzer-mecab](https://github.com/hexenq/kuroshiro-analyzer-mecab)|[Hexen Qi](https://github.com/hexenq)|
|Yahoo Web API (유지보수 일시 중단)|✓|✗|[kuroshiro-analyzer-yahoo-webapi](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi)|[Hexen Qi](https://github.com/hexenq)|

Yahoo Web API 분석기는 API 마이그레이션이 완료되지 않았으며 유지보수가 일시 중단된 상태입니다. 새 프로젝트에서는 사용을 권장하지 않습니다. 자세한 내용은 [유지보수 상태](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi#maintenance-status)를 확인해 주세요.

## 사용방법
### Node.js (또는 Webpack과 같은 모듈 번들러를 사용할 때)
npm을 이용하여 설치합니다.
```sh
$ npm install kuroshiro@beta kuroshiro-analyzer-kuromoji@beta
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

### 브라우저
설치된 npm 패키지의 `dist/kuroshiro.min.js`를 사용하고 HTML에 추가하세요:

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

`node_modules/kuromoji/dict/`의 사전 파일을 `public/dict/` 같은 공개 디렉터리에 복사하고, `dictPath`를 해당 파일의 URL(이 예제에서는 `/dict/`)로 설정하세요. 자세한 내용은 [브라우저 사전 배포 안내](https://github.com/hexenq/kuroshiro-analyzer-kuromoji#browser-dictionary-setup)를 참고하세요.

kuroshiro를 객체화한 분석기로 초기화하고, 변환합니다.
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
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"normal", to:"hiragana"});
// 결과：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

```js
// spaced (공백 문자로 분리)
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"spaced", to:"hiragana"});
// 결과：かんじとれ たら て を つなごう 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！
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
const result = Kuroshiro.Util.isHiragana("あ");
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

#### kanaToHiragana(str)
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

#### 장음

후리가나에는 장음을 구별하는 데 필요한 발음 정보가 충분하지 않을 수 있으므로, 가나 표기를 직접 로마자로 변환하는 것만으로는 실제 발음을 정확하게 재현할 수 없습니다. 자세한 설명은 [なぜ フリガナでは ダメなのか？](https://green.adam.ne.jp/roomazi/onamae.html#naze)를 참고하세요.

따라서 `kanaToRomaji()`는 세 표기법 모두 가나 표기만으로 장음을 추정하지 않습니다. 다만 장음 기호 `ー`는 선택한 표기법에 따라 처리합니다.

예를 들어, `kanaToRomaji()`로 `こうし`를 변환하면 `nippon`, `passport`, `hepburn`에서 각각 `kousi`, `koushi`, `koushi`가 됩니다.

이러한 가나 직접 변환의 제한이 `convert()`의 장음 처리를 막는 것은 아닙니다. `convert()`는 분석기가 제공하는 발음 정보가 있으면 이를 사용하며, 한자를 로마자로 변환할 때도 주석 모드 사용 여부와 관계없이 동일하게 처리합니다. 따라서 변환 결과는 분석기가 제공하는 발음 정보에 따라 달라집니다.

#### 촉음(`っ/ッ`)

뒤의 자음을 겹쳐 쓸 수 없을 때는 세 표기법 모두 `'`로 표시합니다. 예: `っい` → `'i`, `あっ` → `a'`. 이는 kuroshiro의 자체 규칙이며 추가로 발음하는 음절을 뜻하지 않습니다.

## 기여하기
[CONTRIBUTING](CONTRIBUTING.md)을 확인해 주세요.

## 영감
- kuromoji
- wanakana

## 라이선스
MIT
