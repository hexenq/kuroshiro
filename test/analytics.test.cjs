const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const root = path.resolve(__dirname, '..');
const template = fs.readFileSync(path.join(root, '_includes/analytics.html'), 'utf8');

test('homepage and documentation put one production analytics include first in head', () => {
    for (const file of ['index.html', '_layouts/default.html']) {
        const source = fs.readFileSync(path.join(root, file), 'utf8');
        assert.equal(source.split('{% include analytics.html %}').length - 1, 1);
        assert.match(source, /<head>\s*{% include analytics.html %}/);
    }
    assert.ok(template.includes("jekyll.environment == 'production'"));
    assert.ok(fs.readFileSync(path.join(root, 'scripts/preview.cjs'), 'utf8').includes(".replace('{% include analytics.html %}', '')"));
});

test('official static GA4 snippet initializes once with the configured measurement ID', () => {
    const html = template.replace(/{%[\s\S]*?%}/g, '')
        .replace('{{ site.google_analytics_id | escape }}', 'G-GSRQ6JMLTZ')
        .replace('{{ site.google_analytics_id | jsonify }}', JSON.stringify('G-GSRQ6JMLTZ'));
    // Do not fetch or execute Google's external script in unit tests.
    const dom = new JSDOM('<!doctype html><head>' + html + '</head>', {runScripts:'outside-only'});
    try {
        const tags = dom.window.document.querySelectorAll('script[src]');
        assert.equal(tags.length, 1);
        assert.equal(tags[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-GSRQ6JMLTZ');
        assert.ok(tags[0].hasAttribute('async'));
        dom.window.eval(dom.window.document.querySelector('script:not([src])').textContent);
        const commands = dom.window.dataLayer.map(command => Array.from(command));
        assert.equal(commands.length, 2);
        assert.equal(commands[0][0], 'js');
        assert.equal(commands[1][0], 'config');
        assert.equal(commands[1][1], 'G-GSRQ6JMLTZ');
    } finally { dom.window.close(); }
});
