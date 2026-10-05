const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {JSDOM} = require('jsdom');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/i18n.js'), 'utf8');
const sample = '感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！';
const locales = ['en', 'ja', 'zh-CN', 'zh-TW', 'ko', 'eo'];

function setup({languages = ['en-US'], saved, blocked = false, worker = true} = {}) {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
        .replace('{% include demo.html %}', fs.readFileSync(path.join(root, '_includes/demo.html'), 'utf8'));
    const dom = new JSDOM(html, {url:'https://example.org/', runScripts:'outside-only'});
    const win = dom.window;
    Object.defineProperty(win.navigator, 'languages', {value:languages, configurable:true});
    if (saved) win.localStorage.setItem('kuroshiro.language', saved);
    if (blocked) Object.defineProperty(win, 'localStorage', {get() { throw new Error('Storage blocked'); }});
    const workers = [], timers = [];
    if (worker) win.Worker = class {
        constructor(url) { this.url = String(url); workers.push(this); }
        postMessage(message) { this.message = message; }
        terminate() { this.stopped = true; }
        reply(data) { this.onmessage({data:{id:this.message.id,...data}}); }
    };
    win.setTimeout = callback => { timers.push(callback); return timers.length; };
    win.clearTimeout = () => {};
    win.eval(source);
    Object.defineProperty(win.document, 'currentScript', {value:{src:'https://example.org/assets/demo.js?v=deployment-revision'}});
    win.eval(fs.readFileSync(path.join(root, 'assets/demo.js'), 'utf8'));
    const element = id => win.document.getElementById(id);
    const choose = language => { element('siteLanguage').value = language; element('siteLanguage').dispatchEvent(new win.Event('change')); };
    return {dom, win, element, choose, workers, timers};
}

test('automatic language honors preference order, regions, Chinese scripts and English fallback', () => {
    const cases = [
        [['en-GB'],'en'], [['ja-JP'],'ja'], [['ko-KR'],'ko'], [['eo-001'],'eo'],
        [['zh'],'zh-CN'], [['zh-CN'],'zh-CN'], [['zh-SG'],'zh-CN'], [['zh-TW'],'zh-TW'], [['zh-HK'],'zh-TW'], [['zh-MO'],'zh-TW'],
        [['zh-Hans-TW'],'zh-CN'], [['zh-Hant-CN'],'zh-TW'], [['ZH-hant-HK'],'zh-TW'],
        [['fr-FR','ko-KR','en-US'],'ko'], [['fr-FR','en-US','ja-JP'],'en'], [['fr-FR','de-DE'],'en']
    ];
    for (const [languages, expected] of cases) {
        const {dom, element} = setup({languages});
        try {
            assert.equal(dom.window.document.documentElement.lang, expected, languages.join(','));
            assert.equal(element('siteLanguage').value, 'auto');
            assert.equal(element('oritext').value, sample);
        } finally { dom.window.close(); }
    }
});

test('manual choice persists across reloads; automatic clears it and tracks language changes', () => {
    const first = setup({languages:['ja-JP']});
    let saved;
    try {
        first.choose('eo');
        saved = first.win.localStorage.getItem('kuroshiro.language');
        assert.equal(saved, 'eo');
        Object.defineProperty(first.win.navigator, 'languages', {value:['ko-KR'], configurable:true});
        first.win.dispatchEvent(new first.win.Event('languagechange'));
        assert.equal(first.win.document.documentElement.lang, 'eo');
        first.choose('auto');
        assert.equal(first.win.localStorage.getItem('kuroshiro.language'), null);
        assert.equal(first.win.document.documentElement.lang, 'ko');
        Object.defineProperty(first.win.navigator, 'languages', {value:['zh-Hant'], configurable:true});
        first.win.dispatchEvent(new first.win.Event('languagechange'));
        assert.equal(first.win.document.documentElement.lang, 'zh-TW');
    } finally { first.dom.window.close(); }
    for (const [stored, expected] of [[saved,'eo'], ['xx-invalid','ja'], ['__proto__','ja']]) {
        const {dom} = setup({languages:['ja-JP'], saved:stored});
        try { assert.equal(dom.window.document.documentElement.lang, expected); }
        finally { dom.window.close(); }
    }
});

test('blocked storage does not prevent detection or manual switching', () => {
    const {dom, choose} = setup({languages:['zh-HK'], blocked:true});
    try {
        assert.equal(dom.window.document.documentElement.lang, 'zh-TW');
        choose('ko');
        assert.equal(dom.window.document.documentElement.lang, 'ko');
        choose('auto');
        assert.equal(dom.window.document.documentElement.lang, 'zh-TW');
    } finally { dom.window.close(); }
});

test('all six locales cover page and runtime keys, metadata and their matching documentation', () => {
    // Validate authored dictionaries independently of the runtime's English fallback.
    const literal = source.slice(source.indexOf('const messages = ') + 17, source.indexOf('    const docs =')).trim().replace(/;$/, '');
    const messages = vm.runInNewContext('(' + literal + ')');
    assert.deepEqual(Object.keys(messages), locales);
    const keys = Object.keys(messages.en).sort();
    const {dom, choose, element} = setup();
    try {
        const doc = dom.window.document;
        const code = [...doc.querySelectorAll('pre')].map(node => node.textContent);
        const filenames = ['README.md','README.jp.md','README.zh-cn.md','README.zh-tw.md','README.ko-kr.md','README.eo-eo.md'];
        const pageKeys = [...doc.querySelectorAll('[data-i18n], [data-i18n-aria-label], [data-i18n-content], [data-i18n-data-placeholder]')]
            .flatMap(node => [...node.attributes].filter(attr => ['data-i18n', 'data-i18n-aria-label', 'data-i18n-content', 'data-i18n-data-placeholder'].includes(attr.name)).map(attr => attr.value));
        for (const [index, locale] of locales.entries()) {
            assert.deepEqual(Object.keys(messages[locale]).sort(), keys, locale);
            for (const key of keys) assert.ok(typeof messages[locale][key] === 'string' && messages[locale][key].trim(), `${locale}.${key}`);
            for (const key of pageKeys) assert.ok(Object.hasOwn(messages[locale], key), `${locale} missing ${key}`);
            choose(locale);
            assert.equal(doc.title, messages[locale].title);
            assert.equal(doc.querySelector('meta[name="description"]').content, messages[locale].description);
            assert.equal(doc.querySelector('[data-i18n-docs]').href, 'https://github.com/hexenq/kuroshiro/blob/master/' + filenames[index]);
            assert.equal(doc.querySelector('.brand').getAttribute('aria-label'), messages[locale].homeLabel);
            assert.equal(element('output').getAttribute('data-placeholder'), messages[locale].outputPlaceholder);
            assert.equal(element('oritext').value, sample);
            assert.deepEqual([...doc.querySelectorAll('pre')].map(node => node.textContent), code);
            for (const node of doc.querySelectorAll('[data-i18n-rich] *')) {
                assert.ok(['BR','EM','STRONG'].includes(node.tagName));
                assert.equal(node.attributes.length, 0);
            }
        }
    } finally { dom.window.close(); }
});

test('switching while loading or converting preserves input, worker, controls and ruby results', () => {
    const {dom, choose, element, workers} = setup();
    try {
        element('startBtn').click();
        choose('zh-CN');
        assert.match(element('demoStatus').textContent, /正在下载/);
        assert.equal(element('convertBtn').disabled, true);
        assert.equal(element('cancelBtn').hidden, false);
        assert.equal(workers.length, 1);
        assert.equal(workers[0].url, 'https://example.org/assets/demo-worker.js?v=deployment-revision');
        assert.equal(element('oritext').value, sample);
        workers[0].reply({type:'ready'});
        assert.match(element('demoStatus').textContent, /准备就绪/);
        element('oritext').value = 'ユーザーの文章';
        element('to').value = 'romaji';
        element('mode').value = 'furigana';
        element('convertBtn').click();
        choose('ja');
        assert.equal(element('demoStatus').textContent, '変換中…');
        assert.equal(workers[0].message.text, 'ユーザーの文章');
        assert.equal(workers[0].message.options.to, 'romaji');
        assert.equal(workers[0].message.options.mode, 'furigana');
        workers[0].reply({type:'result', markup:true, result:'<ruby>文章<rt>bunshou</rt></ruby>'});
        const ruby = element('output').firstChild;
        choose('ko');
        assert.equal(element('output').firstChild, ruby);
        assert.equal(element('oritext').value, 'ユーザーの文章');
        assert.equal(element('to').value, 'romaji');
        assert.equal(element('mode').value, 'furigana');
        assert.equal(element('convertBtn').disabled, false);
        assert.equal(workers[0].stopped, undefined);
        assert.match(element('demoStatus').textContent, /완료/);
    } finally { dom.window.close(); }
});

test('cancellation, errors, timeouts and unsupported workers retain localized states on switch', () => {
    const {dom, choose, element, workers, timers} = setup({languages:['zh-CN']});
    try {
        element('startBtn').click();
        element('cancelBtn').click();
        assert.match(element('demoStatus').textContent, /已取消/);
        choose('ja');
        assert.match(element('demoStatus').textContent, /キャンセルしました/);
        assert.match(element('startBtn').textContent, /再試行/);
        element('startBtn').click();
        workers.at(-1).reply({type:'error', phase:'init'});
        choose('zh-CN');
        assert.match(element('demoStatus').textContent, /字典加载失败/);
        element('startBtn').click();
        timers.at(-1)();
        choose('ja');
        assert.match(element('demoStatus').textContent, /時間がかかりすぎ/);
        element('startBtn').click();
        workers.at(-1).reply({type:'ready'});
        element('oritext').value = '';
        element('convertBtn').click();
        assert.match(element('demoStatus').textContent, /入力/);
        element('oritext').value = 'あ'.repeat(5001);
        element('convertBtn').click();
        choose('zh-CN');
        assert.match(element('demoStatus').textContent, /5,000/);
        element('oritext').value = '日本語';
        element('convertBtn').click();
        workers.at(-1).reply({type:'error', phase:'convert'});
        assert.match(element('demoStatus').textContent, /转换失败/);
        choose('ja');
        assert.match(element('demoStatus').textContent, /変換に失敗/);
    } finally { dom.window.close(); }
    const unsupported = setup({worker:false});
    try {
        unsupported.choose('zh-CN');
        assert.equal(unsupported.element('startBtn').disabled, true);
        assert.match(unsupported.element('demoStatus').textContent, /支持 Web Worker/);
    } finally { unsupported.dom.window.close(); }
});
