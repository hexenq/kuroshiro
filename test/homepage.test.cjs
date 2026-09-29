const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const root = path.resolve(__dirname, '..');

test('homepage includes the shared demo, product sections and valid local targets', () => {
    const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.ok(source.startsWith('---\nlayout: null\n---'));
    assert.equal((source.match(/{% include demo.html %}/g) || []).length, 1);
    const html = source.replace('{% include demo.html %}', fs.readFileSync(path.join(root, '_includes/demo.html'), 'utf8'))
        .replace(/\{\{ '([^']+)' \| relative_url \}\}/g, '$1');
    const dom = new JSDOM(html);
    try {
        const doc = dom.window.document;
        for (const id of ['main', 'features', 'demo', 'quickstart']) assert.ok(doc.getElementById(id));
        const ids = [...doc.querySelectorAll('[id]')].map(node => node.id);
        assert.equal(new Set(ids).size, ids.length);
        for (const anchor of doc.querySelectorAll('a[href^="#"]')) {
            if (anchor.hash) assert.ok(doc.getElementById(anchor.hash.slice(1)), anchor.hash);
        }
        for (const asset of doc.querySelectorAll('link[href],script[src]')) {
            const url = new URL(asset.getAttribute('href') || asset.getAttribute('src'), 'https://kuroshiro.org');
            assert.ok(fs.existsSync(path.join(root, url.pathname)));
        }
        assert.ok(doc.querySelector('pre').textContent.includes('npm install'));
        assert.ok(doc.querySelectorAll('pre')[1].textContent.includes(doc.querySelector('textarea').value));
        const docsLinks = [...doc.querySelectorAll('nav[aria-label="Documentation languages"] a')];
        assert.deepEqual(docsLinks.map(link => [link.textContent, link.href]), [
            ['English', 'https://github.com/hexenq/kuroshiro/blob/master/README.md'],
            ['日本語', 'https://github.com/hexenq/kuroshiro/blob/master/README.jp.md'],
            ['简体中文', 'https://github.com/hexenq/kuroshiro/blob/master/README.zh-cn.md'],
            ['繁體中文', 'https://github.com/hexenq/kuroshiro/blob/master/README.zh-tw.md'],
            ['Esperanto', 'https://github.com/hexenq/kuroshiro/blob/master/README.eo-eo.md'],
            ['한국어', 'https://github.com/hexenq/kuroshiro/blob/master/README.ko-kr.md']
        ]);
    } finally { dom.window.close(); }
});
