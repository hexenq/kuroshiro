(function () {
    'use strict';
    const messages = {
        en: {
            outputPlaceholder: 'Your converted text will appear here.',
            title: 'kuroshiro — Japanese, in another reading.', description: 'An open-source JavaScript library for converting Japanese to hiragana, katakana and romaji, with furigana support. Try it in your browser.',
            language: 'Language', automatic: 'Automatic', skip: 'Skip to content', homeLabel: 'kuroshiro home', navLabel: 'Main navigation', navFeatures: 'Features', navDemo: 'Playground', navStart: 'Get started',
            eyebrow: '● OPEN-SOURCE JAPANESE LANGUAGE LIBRARY', heroTitle: 'Japanese,<br>in another <em>reading.</em>', heroDescription: 'Turn Japanese text into hiragana, katakana or romaji. Add readings with furigana. One JavaScript library, more ways to read.', tryDemo: 'Try the playground ↘', startBuilding: 'Start building →', heroMeta: 'JavaScript / Node.js & browser / MIT licensed',
            artLabel: 'Japanese readings: kanji, hiragana, katakana and romaji', artTop: 'ONE LANGUAGE, MANY READINGS', kanji: 'Kanji', hiragana: 'Hiragana', katakana: 'Katakana', romaji: 'Romaji', artCaption: 'A little clarity, character by character.',
            featuresLabel: 'Library features', featureConvert: '01 / CONVERT', featureConvertTitle: 'Choose your reading.', featureConvertDescription: 'Hiragana, katakana and romaji, with normal, spaced, okurigana and furigana output modes.', featureCustomize: '02 / CUSTOMIZE', featureCustomizeTitle: 'Make it fit your project.', featureCustomizeDescription: 'Choose Hepburn, Nippon or Passport romanization. Use an analyzer suited to your environment.', featureBuild: '03 / BUILD', featureBuildTitle: 'From learning to creating.', featureBuildDescription: 'Add reading aids to a Japanese learning tool, annotate text, or explore pronunciation in your own app.',
            demoEyebrow: 'THE PLAYGROUND', demoTitle: 'Give your words another form.', demoDescription: 'Real conversion, right here.<br>No account. No conversion server.', download: '↳ Loaded only when you start: about <strong>17 MiB</strong> of dictionary files, plus library scripts. Repeat visits may use your browser’s cache. Your text stays in this browser.',
            quickEyebrow: 'SMALL API. MANY POSSIBILITIES.', quickTitle: 'A few lines.<br>A new way to read.', quickDescription: 'Install kuroshiro and an analyzer, initialize once, then convert. This example uses Kuromoji in a JavaScript module environment.', docs: 'Read the documentation ↗', quickHeading: 'QUICK START', installLabel: 'Install packages', exampleLabel: 'Conversion example',
            communityEyebrow: 'BUILT IN THE OPEN', communityTitle: 'Better with your ideas.', communityDescription: 'Found an unexpected reading? Have a use case to share?<br>Issues, improvements and contributions are welcome.', github: 'Explore on GitHub ↗', footerDescription: 'Convert Japanese text to hiragana, katakana and romaji.', documentation: 'DOCUMENTATION', docsLabel: 'Documentation languages', analytics: 'Site usage is measured with Google Analytics.', createdBy: 'Created by', license: 'MIT License',
            original: 'Original text', inputHint: '日本語 · up to 5,000 characters', output: 'Your reading', outputHint: 'CONVERTED OUTPUT', to: 'To', mode: 'Mode', normal: 'Normal', spaced: 'Spaced', okurigana: 'Okurigana', furigana: 'Furigana', system: 'Romaji system', hepburn: 'Hepburn', nippon: 'Nippon', passport: 'Passport', start: 'Start demo', convert: 'Convert →', cancel: 'Cancel', noscript: 'JavaScript and Web Workers are required for this demo.',
            initial: 'Start the demo to load the dictionary, then convert your text.', retry: 'Retry / start demo', timeout: 'This is taking too long. Retry when your connection is ready.', loading: 'Downloading dictionary and initializing (about 17 MiB). This may take a while…', loadError: 'Could not load the demo. Check your connection and retry.', dictionaryError: 'Dictionary loading failed. Check your connection and retry.', conversionError: 'Conversion failed. Restart the demo and try a shorter text.', ready: 'Ready. Your text is converted locally in this browser.', complete: 'Conversion complete.', workerError: 'Web Workers could not start. Please use a browser that supports them.', tooLong: 'Please enter no more than 5,000 characters.', empty: 'Enter some text to convert.', converting: 'Converting…', cancelled: 'Cancelled. You can start again when ready.', unsupported: 'This demo requires a browser with Web Worker support.'
        },
        ja: {
            outputPlaceholder: '変換した文章がここに表示されます。',
            title: 'kuroshiro — 日本語を、別の読み方で。', description: '日本語をひらがな・カタカナ・ローマ字に変換するオープンソースの JavaScript ライブラリ。ふりがなにも対応。ブラウザーで試せます。',
            language: '言語', automatic: '自動', skip: '本文へ移動', homeLabel: 'kuroshiro ホーム', navLabel: 'メインナビゲーション', navFeatures: '機能', navDemo: 'デモ', navStart: '使ってみる',
            eyebrow: '● オープンソースの日本語変換ライブラリ', heroTitle: '日本語を、<br>別の<em>読み方で。</em>', heroDescription: '日本語をひらがな・カタカナ・ローマ字に変換。ふりがなで読みを添える。ひとつの JavaScript ライブラリで、読む方法が広がります。', tryDemo: 'デモを試す ↘', startBuilding: '開発を始める →', heroMeta: 'JavaScript / Node.js・ブラウザー / MIT ライセンス',
            artLabel: '日本語の表記：漢字、ひらがな、カタカナ、ローマ字', artTop: 'ひとつの言語、さまざまな表記', kanji: '漢字', hiragana: 'ひらがな', katakana: 'カタカナ', romaji: 'ローマ字', artCaption: '一文字ずつ、読みやすく。',
            featuresLabel: 'ライブラリの機能', featureConvert: '01 / 変換', featureConvertTitle: '読み方を選ぶ。', featureConvertDescription: 'ひらがな・カタカナ・ローマ字に変換。通常、分かち書き、送り仮名、ふりがなの出力モードに対応。', featureCustomize: '02 / カスタマイズ', featureCustomizeTitle: 'プロジェクトに合わせる。', featureCustomizeDescription: 'ヘボン式・日本式・パスポート式のローマ字を選択。実行環境に合った解析器を利用できます。', featureBuild: '03 / 開発', featureBuildTitle: '学ぶことから、作ることへ。', featureBuildDescription: '日本語学習ツールに読みを添えたり、文章にふりがなを付けたり、自分のアプリで発音を調べたり。',
            demoEyebrow: 'デモ', demoTitle: '言葉を、別のかたちに。', demoDescription: 'この場で変換。<br>アカウントも変換サーバーも不要です。', download: '↳ 開始時にのみ読み込み：辞書ファイル約 <strong>17 MiB</strong> とライブラリ。再訪問時はブラウザーのキャッシュが使われる場合があります。入力した文章はこのブラウザー内で処理されます。',
            quickEyebrow: '小さな API、大きな可能性。', quickTitle: '数行のコードで、<br>新しい読み方を。', quickDescription: 'kuroshiro と解析器をインストールし、一度初期化してから変換します。この例では JavaScript モジュール環境で Kuromoji を使います。', docs: 'ドキュメントを読む ↗', quickHeading: 'クイックスタート', installLabel: 'パッケージのインストール', exampleLabel: '変換の例',
            communityEyebrow: 'オープンな開発', communityTitle: 'あなたのアイデアで、もっと良く。', communityDescription: '想定と違う読みを見つけましたか？ 活用例を共有しませんか？<br>不具合報告、改善提案、貢献を歓迎します。', github: 'GitHub で見る ↗', footerDescription: '日本語をひらがな・カタカナ・ローマ字に変換。', documentation: 'ドキュメント', docsLabel: 'ドキュメントの言語', analytics: 'サイトの利用状況は Google Analytics で計測しています。', createdBy: '作者', license: 'MIT ライセンス',
            original: '元の文章', inputHint: '日本語 · 最大 5,000 文字', output: '変換結果', outputHint: '変換後の表記', to: '変換先', mode: 'モード', normal: '通常', spaced: '分かち書き', okurigana: '送り仮名', furigana: 'ふりがな', system: 'ローマ字の方式', hepburn: 'ヘボン式', nippon: '日本式', passport: 'パスポート式', start: 'デモを開始', convert: '変換 →', cancel: 'キャンセル', noscript: 'このデモには JavaScript と Web Worker が必要です。',
            initial: 'デモを開始して辞書を読み込み、文章を変換してください。', retry: '再試行 / デモを開始', timeout: '時間がかかりすぎています。接続を確認して再試行してください。', loading: '辞書をダウンロードして初期化しています（約 17 MiB）。しばらくお待ちください…', loadError: 'デモを読み込めませんでした。接続を確認して再試行してください。', dictionaryError: '辞書の読み込みに失敗しました。接続を確認して再試行してください。', conversionError: '変換に失敗しました。デモを再起動し、短い文章で試してください。', ready: '準備完了。このブラウザー内で文章を変換します。', complete: '変換が完了しました。', workerError: 'Web Worker を開始できませんでした。対応ブラウザーをお使いください。', tooLong: '5,000 文字以内で入力してください。', empty: '変換する文章を入力してください。', converting: '変換中…', cancelled: 'キャンセルしました。準備ができたら再開できます。', unsupported: 'このデモには Web Worker 対応ブラウザーが必要です。'
        },
        'zh-CN': {
            outputPlaceholder: '转换后的文字将显示在这里。',
            title: 'kuroshiro — 换一种方式，读日文。', description: '将日文转换为平假名、片假名和罗马字的开源 JavaScript 库，支持振假名。直接在浏览器中体验。',
            language: '语言', automatic: '自动', skip: '跳到正文', homeLabel: 'kuroshiro 首页', navLabel: '主导航', navFeatures: '特性', navDemo: '在线体验', navStart: '开始使用',
            eyebrow: '● 开源日文转换库', heroTitle: '换一种方式，<br><em>读日文。</em>', heroDescription: '将日文转换为平假名、片假名或罗马字，用振假名标注读音。一个 JavaScript 库，让阅读有更多可能。', tryDemo: '在线体验 ↘', startBuilding: '开始开发 →', heroMeta: 'JavaScript / Node.js 与浏览器 / MIT 许可证',
            artLabel: '日文的不同表记：汉字、平假名、片假名和罗马字', artTop: '一种语言，多种表记', kanji: '汉字', hiragana: '平假名', katakana: '片假名', romaji: '罗马字', artCaption: '逐字标注，让阅读更清晰。',
            featuresLabel: '库的特性', featureConvert: '01 / 转换', featureConvertTitle: '选择你需要的表记。', featureConvertDescription: '转换为平假名、片假名或罗马字，支持普通、分词、送假名和振假名输出模式。', featureCustomize: '02 / 定制', featureCustomizeTitle: '适配你的项目。', featureCustomizeDescription: '可选平文式、日本式或护照式罗马字，搭配适合运行环境的解析器。', featureBuild: '03 / 开发', featureBuildTitle: '从学习到创作。', featureBuildDescription: '为日语学习工具添加读音辅助，为文本注音，或在自己的应用中探索发音。',
            demoEyebrow: '在线体验', demoTitle: '让文字换一种表记。', demoDescription: '直接在这里转换。<br>无需账号，无需转换服务器。', download: '↳ 开始时才加载：约 <strong>17 MiB</strong> 的字典文件及库脚本。再次访问时可能使用浏览器缓存。待转换文字只在此浏览器中处理。',
            quickEyebrow: '简洁的 API，丰富的可能。', quickTitle: '几行代码，<br>换一种读法。', quickDescription: '安装 kuroshiro 和解析器，初始化一次，即可转换。本例在 JavaScript 模块环境中使用 Kuromoji。', docs: '阅读文档 ↗', quickHeading: '快速开始', installLabel: '安装依赖包', exampleLabel: '转换示例',
            communityEyebrow: '开放协作', communityTitle: '你的想法，让它更好。', communityDescription: '遇到了不符合预期的读音？ 想分享使用场景？<br>欢迎提交问题、改进建议和贡献。', github: '前往 GitHub ↗', footerDescription: '将日文转换为平假名、片假名和罗马字。', documentation: '帮助文档', docsLabel: '文档语言', analytics: '本站使用 Google Analytics 统计访问情况。', createdBy: '作者', license: 'MIT 许可证',
            original: '原文', inputHint: '日文 · 最多 5,000 字符', output: '转换结果', outputHint: '转换后的表记', to: '转换为', mode: '模式', normal: '普通', spaced: '分词', okurigana: '送假名', furigana: '振假名', system: '罗马字体系', hepburn: '平文式', nippon: '日本式', passport: '护照式', start: '启动 Demo', convert: '转换 →', cancel: '取消', noscript: '此 Demo 需要 JavaScript 和 Web Worker。',
            initial: '启动 Demo 加载字典，然后转换文字。', retry: '重试 / 启动 Demo', timeout: '等待时间过长，请检查连接后重试。', loading: '正在下载字典并初始化（约 17 MiB），请稍候…', loadError: '无法加载 Demo，请检查连接后重试。', dictionaryError: '字典加载失败，请检查连接后重试。', conversionError: '转换失败，请重新启动 Demo 并尝试较短的文字。', ready: '准备就绪，文字将在此浏览器中本地转换。', complete: '转换完成。', workerError: '无法启动 Web Worker，请使用支持它的浏览器。', tooLong: '请输入不超过 5,000 字符的文字。', empty: '请输入待转换的文字。', converting: '正在转换…', cancelled: '已取消，准备好后可以重新开始。', unsupported: '此 Demo 需要支持 Web Worker 的浏览器。'
        },
        'zh-TW': {
            outputPlaceholder: '轉換後的文字將顯示在這裡。',
            title: 'kuroshiro — 換一種方式，讀日文。', description: '將日文轉換為平假名、片假名和羅馬字的開源 JavaScript 函式庫，支援振假名。直接在瀏覽器中體驗。',
            language: '語言', automatic: '自動', skip: '跳到正文', homeLabel: 'kuroshiro 首頁', navLabel: '主導覽', navFeatures: '特色', navDemo: '線上體驗', navStart: '開始使用',
            eyebrow: '● 開源日文轉換函式庫', heroTitle: '換一種方式，<br><em>讀日文。</em>', heroDescription: '將日文轉換為平假名、片假名或羅馬字，用振假名標註讀音。一個 JavaScript 函式庫，讓閱讀有更多可能。', tryDemo: '線上體驗 ↘', startBuilding: '開始開發 →', heroMeta: 'JavaScript / Node.js 與瀏覽器 / MIT 授權',
            artLabel: '日文的不同表記：漢字、平假名、片假名和羅馬字', artTop: '一種語言，多種表記', kanji: '漢字', hiragana: '平假名', katakana: '片假名', romaji: '羅馬字', artCaption: '逐字標註，讓閱讀更清晰。',
            featuresLabel: '函式庫特色', featureConvert: '01 / 轉換', featureConvertTitle: '選擇你需要的表記。', featureConvertDescription: '轉換為平假名、片假名或羅馬字，支援普通、分詞、送假名和振假名輸出模式。', featureCustomize: '02 / 自訂', featureCustomizeTitle: '配合你的專案。', featureCustomizeDescription: '可選平文式、日本式或護照式羅馬字，搭配適合執行環境的解析器。', featureBuild: '03 / 開發', featureBuildTitle: '從學習到創作。', featureBuildDescription: '為日語學習工具加入讀音輔助，為文字注音，或在自己的應用程式中探索發音。',
            demoEyebrow: '線上體驗', demoTitle: '讓文字換一種表記。', demoDescription: '直接在這裡轉換。<br>無需帳號，無需轉換伺服器。', download: '↳ 開始時才載入：約 <strong>17 MiB</strong> 的字典檔案及函式庫。再次造訪時可能使用瀏覽器快取。待轉換文字只在此瀏覽器中處理。',
            quickEyebrow: '簡潔的 API，豐富的可能。', quickTitle: '幾行程式碼，<br>換一種讀法。', quickDescription: '安裝 kuroshiro 和解析器，初始化一次，即可轉換。本例在 JavaScript 模組環境中使用 Kuromoji。', docs: '閱讀文件 ↗', quickHeading: '快速開始', installLabel: '安裝套件', exampleLabel: '轉換範例',
            communityEyebrow: '開放協作', communityTitle: '你的想法，讓它更好。', communityDescription: '遇到了不符合預期的讀音？ 想分享使用情境？<br>歡迎回報問題、提出改進建議和貢獻。', github: '前往 GitHub ↗', footerDescription: '將日文轉換為平假名、片假名和羅馬字。', documentation: '說明文件', docsLabel: '文件語言', analytics: '本站使用 Google Analytics 統計瀏覽情況。', createdBy: '作者', license: 'MIT 授權',
            original: '原文', inputHint: '日文 · 最多 5,000 字元', output: '轉換結果', outputHint: '轉換後的表記', to: '轉換為', mode: '模式', normal: '普通', spaced: '分詞', okurigana: '送假名', furigana: '振假名', system: '羅馬字體系', hepburn: '平文式', nippon: '日本式', passport: '護照式', start: '啟動 Demo', convert: '轉換 →', cancel: '取消', noscript: '此 Demo 需要 JavaScript 和 Web Worker。',
            initial: '啟動 Demo 載入字典，然後轉換文字。', retry: '重試 / 啟動 Demo', timeout: '等待時間過長，請檢查連線後重試。', loading: '正在下載字典並初始化（約 17 MiB），請稍候…', loadError: '無法載入 Demo，請檢查連線後重試。', dictionaryError: '字典載入失敗，請檢查連線後重試。', conversionError: '轉換失敗，請重新啟動 Demo 並嘗試較短的文字。', ready: '準備就緒，文字將在此瀏覽器中本機轉換。', complete: '轉換完成。', workerError: '無法啟動 Web Worker，請使用支援它的瀏覽器。', tooLong: '請輸入不超過 5,000 字元的文字。', empty: '請輸入待轉換的文字。', converting: '正在轉換…', cancelled: '已取消，準備好後可以重新開始。', unsupported: '此 Demo 需要支援 Web Worker 的瀏覽器。'
        },
        ko: {
            outputPlaceholder: '변환된 텍스트가 여기에 표시됩니다.',
            title: 'kuroshiro — 일본어를, 다른 표기로.', description: '일본어를 히라가나, 가타카나, 로마자로 변환하는 오픈 소스 JavaScript 라이브러리. 후리가나를 지원하며 브라우저에서 바로 체험할 수 있습니다.',
            language: '언어', automatic: '자동', skip: '본문으로 이동', homeLabel: 'kuroshiro 홈', navLabel: '주 메뉴', navFeatures: '기능', navDemo: '체험', navStart: '시작하기',
            eyebrow: '● 오픈 소스 일본어 변환 라이브러리', heroTitle: '일본어를,<br>다른 <em>표기로.</em>', heroDescription: '일본어를 히라가나, 가타카나 또는 로마자로 변환하고 후리가나로 읽는 법을 표시하세요. 하나의 JavaScript 라이브러리로 읽는 방법이 다양해집니다.', tryDemo: '직접 체험하기 ↘', startBuilding: '개발 시작하기 →', heroMeta: 'JavaScript / Node.js 및 브라우저 / MIT 라이선스',
            artLabel: '일본어 표기: 한자, 히라가나, 가타카나, 로마자', artTop: '하나의 언어, 다양한 표기', kanji: '한자', hiragana: '히라가나', katakana: '가타카나', romaji: '로마자', artCaption: '한 글자씩, 더 쉽게 읽기.',
            featuresLabel: '라이브러리 기능', featureConvert: '01 / 변환', featureConvertTitle: '원하는 표기를 선택하세요.', featureConvertDescription: '히라가나, 가타카나, 로마자와 일반, 공백 구분, 오쿠리가나, 후리가나 출력 모드를 지원합니다.', featureCustomize: '02 / 맞춤 설정', featureCustomizeTitle: '프로젝트에 맞게 사용하세요.', featureCustomizeDescription: '헵번식, 일본식 또는 여권식 로마자 표기법을 선택하고 실행 환경에 맞는 분석기를 사용하세요.', featureBuild: '03 / 개발', featureBuildTitle: '학습에서 창작으로.', featureBuildDescription: '일본어 학습 도구에 읽기 도움을 추가하거나, 텍스트에 후리가나를 붙이거나, 직접 만든 앱에서 발음을 알아보세요.',
            demoEyebrow: '직접 체험하기', demoTitle: '텍스트를 다른 표기로 바꿔 보세요.', demoDescription: '여기서 바로 변환하세요.<br>계정도 변환 서버도 필요 없습니다.', download: '↳ 시작할 때만 약 <strong>17 MiB</strong>의 사전 파일과 라이브러리를 불러옵니다. 다시 방문하면 브라우저 캐시를 사용할 수 있습니다. 입력한 텍스트는 이 브라우저 안에서 처리됩니다.',
            quickEyebrow: '간단한 API, 다양한 가능성.', quickTitle: '몇 줄의 코드로,<br>새로운 읽기 방법을.', quickDescription: 'kuroshiro와 분석기를 설치하고 한 번 초기화한 다음 변환하세요. 이 예제는 JavaScript 모듈 환경에서 Kuromoji를 사용합니다.', docs: '문서 읽기 ↗', quickHeading: '빠른 시작', installLabel: '패키지 설치', exampleLabel: '변환 예제',
            communityEyebrow: '열린 개발', communityTitle: '여러분의 아이디어로 더 좋게.', communityDescription: '예상과 다른 읽기를 발견하셨나요? 사용 사례를 공유하고 싶으신가요?<br>문제 보고, 개선 제안, 기여를 환영합니다.', github: 'GitHub에서 보기 ↗', footerDescription: '일본어를 히라가나, 가타카나, 로마자로 변환합니다.', documentation: '도움말', docsLabel: '문서 언어', analytics: '사이트 이용 현황은 Google Analytics로 측정합니다.', createdBy: '제작자', license: 'MIT 라이선스',
            original: '원문', inputHint: '일본어 · 최대 5,000자', output: '변환 결과', outputHint: '변환된 표기', to: '변환 대상', mode: '모드', normal: '일반', spaced: '공백 구분', okurigana: '오쿠리가나', furigana: '후리가나', system: '로마자 표기법', hepburn: '헵번식', nippon: '일본식', passport: '여권식', start: '데모 시작', convert: '변환 →', cancel: '취소', noscript: '이 데모에는 JavaScript와 Web Worker가 필요합니다.',
            initial: '데모를 시작하여 사전을 불러온 다음 텍스트를 변환하세요.', retry: '재시도 / 데모 시작', timeout: '시간이 너무 오래 걸립니다. 연결을 확인한 후 다시 시도하세요.', loading: '사전을 다운로드하고 초기화하는 중입니다(약 17 MiB). 잠시 기다려 주세요…', loadError: '데모를 불러오지 못했습니다. 연결을 확인한 후 다시 시도하세요.', dictionaryError: '사전을 불러오지 못했습니다. 연결을 확인한 후 다시 시도하세요.', conversionError: '변환하지 못했습니다. 데모를 다시 시작하고 더 짧은 텍스트로 시도하세요.', ready: '준비되었습니다. 텍스트는 이 브라우저에서 변환됩니다.', complete: '변환이 완료되었습니다.', workerError: 'Web Worker를 시작할 수 없습니다. 지원하는 브라우저를 사용하세요.', tooLong: '5,000자 이내로 입력하세요.', empty: '변환할 텍스트를 입력하세요.', converting: '변환 중…', cancelled: '취소되었습니다. 준비되면 다시 시작할 수 있습니다.', unsupported: '이 데모에는 Web Worker를 지원하는 브라우저가 필요합니다.'
        },
        eo: {
            outputPlaceholder: 'Via konvertita teksto aperos ĉi tie.',
            title: 'kuroshiro — La japana, per alia skribo.', description: 'Malfermitkoda JavaScript-biblioteko por konverti la japanan al hiragano, katakano kaj latina skribo, kun subteno de furigano. Provu ĝin en via retumilo.',
            language: 'Lingvo', automatic: 'Aŭtomata', skip: 'Salti al la enhavo', homeLabel: 'Ĉefpaĝo de kuroshiro', navLabel: 'Ĉefa navigado', navFeatures: 'Funkcioj', navDemo: 'Provejo', navStart: 'Komenci',
            eyebrow: '● MALFERMITKODA BIBLIOTEKO POR LA JAPANA', heroTitle: 'La japana,<br>per alia <em>skribo.</em>', heroDescription: 'Konvertu japanan tekston al hiragano, katakano aŭ latina skribo. Aldonu legaĵojn per furigano. Unu JavaScript-biblioteko, pli da manieroj legi.', tryDemo: 'Provi la provejon ↘', startBuilding: 'Komenci programi →', heroMeta: 'JavaScript / Node.js kaj retumilo / MIT-permesilo',
            artLabel: 'Japanaj skriboj: kanĝio, hiragano, katakano kaj latina skribo', artTop: 'UNU LINGVO, MULTAJ SKRIBOJ', kanji: 'Kanĝio', hiragana: 'Hiragano', katakana: 'Katakano', romaji: 'Latina skribo', artCaption: 'Iom pli klare, signo post signo.',
            featuresLabel: 'Funkcioj de la biblioteko', featureConvert: '01 / KONVERTI', featureConvertTitle: 'Elektu vian skribon.', featureConvertDescription: 'Hiragano, katakano kaj latina skribo, kun normala, spacigita, okurigana kaj furigana eligo.', featureCustomize: '02 / ADAPTI', featureCustomizeTitle: 'Adaptu ĝin al via projekto.', featureCustomizeDescription: 'Elektu la latinigan sistemon Hepburn, Nippon aŭ Passport. Uzu analizilon taŭgan por via medio.', featureBuild: '03 / KREI', featureBuildTitle: 'De lernado al kreado.', featureBuildDescription: 'Aldonu leghelpon al japanlingva lernilo, prinotu tekston aŭ esploru prononcon en via propra aplikaĵo.',
            demoEyebrow: 'LA PROVEJO', demoTitle: 'Donu alian formon al viaj vortoj.', demoDescription: 'Vera konvertado, ĝuste ĉi tie.<br>Sen konto. Sen konverta servilo.', download: '↳ Nur post komenco: proksimume <strong>17 MiB</strong> da vortaraj dosieroj kaj la bibliotekoj. Ĉe posta vizito eble uziĝos la kaŝmemoro de via retumilo. Via teksto restas en ĉi tiu retumilo.',
            quickEyebrow: 'MALGRANDA API. MULTAJ EBLOJ.', quickTitle: 'Kelkaj linioj.<br>Nova maniero legi.', quickDescription: 'Instalu kuroshiro kaj analizilon, pravalorizu unufoje, poste konvertu. Ĉi tiu ekzemplo uzas Kuromoji en medio de JavaScript-moduloj.', docs: 'Legi la dokumentaron ↗', quickHeading: 'RAPIDA KOMENCO', installLabel: 'Instali pakaĵojn', exampleLabel: 'Ekzemplo de konvertado',
            communityEyebrow: 'MALFERMA DISVOLVADO', communityTitle: 'Pli bona kun viaj ideoj.', communityDescription: 'Ĉu vi trovis neatenditan legaĵon? Ĉu vi volas dividi uzekzemplon?<br>Problemoj, plibonigoj kaj kontribuoj estas bonvenaj.', github: 'Esplori ĉe GitHub ↗', footerDescription: 'Konvertu japanan tekston al hiragano, katakano kaj latina skribo.', documentation: 'DOKUMENTARO', docsLabel: 'Lingvoj de la dokumentaro', analytics: 'La uzado de la retejo estas mezurata per Google Analytics.', createdBy: 'Kreinto', license: 'MIT-permesilo',
            original: 'Originala teksto', inputHint: 'La japana · ĝis 5,000 signoj', output: 'Via legaĵo', outputHint: 'KONVERTITA ELIGO', to: 'Al', mode: 'Reĝimo', normal: 'Normala', spaced: 'Spacigita', okurigana: 'Okurigano', furigana: 'Furigano', system: 'Latiniga sistemo', hepburn: 'Hepburn', nippon: 'Nippon', passport: 'Passport', start: 'Komenci demonstron', convert: 'Konverti →', cancel: 'Nuligi', noscript: 'Ĉi tiu demonstro bezonas JavaScript kaj Web Worker.',
            initial: 'Komencu la demonstron por ŝargi la vortaron, poste konvertu vian tekston.', retry: 'Reprovi / komenci demonstron', timeout: 'Tio daŭras tro longe. Kontrolu vian konekton kaj reprovu.', loading: 'Elŝutado de la vortaro kaj pravalorizado (ĉirkaŭ 17 MiB). Bonvolu atendi…', loadError: 'Ne eblis ŝargi la demonstron. Kontrolu vian konekton kaj reprovu.', dictionaryError: 'Ne eblis ŝargi la vortaron. Kontrolu vian konekton kaj reprovu.', conversionError: 'La konvertado malsukcesis. Rekomencu la demonstron kaj provu pli mallongan tekston.', ready: 'Preta. Via teksto estas konvertata loke en ĉi tiu retumilo.', complete: 'Konvertado finita.', workerError: 'Ne eblis lanĉi Web Worker. Bonvolu uzi retumilon, kiu subtenas ĝin.', tooLong: 'Bonvolu enigi ne pli ol 5,000 signojn.', empty: 'Enigu tekston por konverti.', converting: 'Konvertado…', cancelled: 'Nuligita. Vi povas rekomenci kiam vi pretos.', unsupported: 'Ĉi tiu demonstro bezonas retumilon kun subteno de Web Worker.'
        }
    };
    const docs = {en:'README.md', ja:'README.jp.md', 'zh-CN':'README.zh-cn.md', 'zh-TW':'README.zh-tw.md', ko:'README.ko-kr.md', eo:'README.eo-eo.md'};
    const storageKey = 'kuroshiro.language';
    let choice = 'auto';
    let language = 'en';
    try {
        const saved = window.localStorage.getItem(storageKey);
        if (Object.prototype.hasOwnProperty.call(messages, saved)) choice = saved;
    } catch (error) { /* Storage may be blocked; the selector still works in this page. */ }
    function matchLanguage(tag) {
        const parts = String(tag).toLowerCase().split('-');
        if (parts[0] === 'zh') {
            if (parts.includes('hant')) return 'zh-TW';
            if (parts.includes('hans')) return 'zh-CN';
            return parts.some(part => ['tw', 'hk', 'mo'].includes(part)) ? 'zh-TW' : 'zh-CN';
        }
        return ['en', 'ja', 'ko', 'eo'].includes(parts[0]) ? parts[0] : undefined;
    }
    function detectLanguage() {
        const preferred = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
        for (const tag of preferred) {
            const match = matchLanguage(tag);
            if (match) return match;
        }
        return 'en';
    }
    function translate(key) { return messages[language][key] || messages.en[key] || key; }
    // Only trusted formatting tags become elements, with no attributes copied.
    function richText(element, value) {
        const source = new DOMParser().parseFromString(value, 'text/html');
        while (element.firstChild) element.removeChild(element.firstChild);
        function append(node, parent) {
            if (node.nodeType === 3) { parent.appendChild(document.createTextNode(node.textContent)); return; }
            if (node.nodeType !== 1) return;
            const allowed = ['BR', 'EM', 'STRONG'].includes(node.tagName);
            const target = allowed ? document.createElement(node.tagName.toLowerCase()) : parent;
            if (allowed) parent.appendChild(target);
            for (const child of node.childNodes) append(child, target);
        }
        for (const node of source.body.childNodes) append(node, element);
    }
    function apply() {
        language = choice === 'auto' ? detectLanguage() : choice;
        document.documentElement.lang = language;
        for (const element of document.querySelectorAll('[data-i18n]')) {
            const value = translate(element.dataset.i18n);
            if (element.hasAttribute('data-i18n-rich')) richText(element, value);
            else element.textContent = value;
        }
        for (const attribute of ['aria-label', 'content', 'data-placeholder']) {
            for (const element of document.querySelectorAll('[data-i18n-' + attribute + ']')) {
                element.setAttribute(attribute, translate(element.getAttribute('data-i18n-' + attribute)));
            }
        }
        for (const link of document.querySelectorAll('[data-i18n-docs]')) link.href = 'https://github.com/hexenq/kuroshiro/blob/master/' + docs[language];
        const selector = document.getElementById('siteLanguage');
        if (selector) selector.value = choice;
        document.dispatchEvent(new CustomEvent('kuroshiro:languagechange'));
    }
    window.KuroshiroI18n = {translate};
    const selector = document.getElementById('siteLanguage');
    if (selector) {
        document.getElementById('languageControl').hidden = false;
        selector.addEventListener('change', () => {
            choice = Object.prototype.hasOwnProperty.call(messages, selector.value) ? selector.value : 'auto';
            try {
                if (choice === 'auto') window.localStorage.removeItem(storageKey);
                else window.localStorage.setItem(storageKey, choice);
            } catch (error) { /* A manual choice remains effective without persistence. */ }
            apply();
        });
    }
    window.addEventListener('languagechange', () => { if (choice === 'auto') apply(); });
    apply();
})();
