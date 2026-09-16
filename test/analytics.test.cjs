const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const root = path.resolve(__dirname, '..');
const template = fs.readFileSync(path.join(root, '_includes/analytics.html'), 'utf8');

test('homepage and documentation share the production analytics include', () => {
    for (const file of ['index.html', '_layouts/default.html']) {
        const source = fs.readFileSync(path.join(root, file), 'utf8');
        assert.equal(source.split('{% include analytics.html %}').length - 1, 1);
        assert.ok(!source.includes('google-analytics.com/analytics.js'));
    }
    assert.ok(template.includes("jekyll.environment == 'production'"));
});

test('analytics loads the configured GA4 tag only on official hosts', () => {
    // Execute only the loader, without fetching or executing the external analytics code.
    const script = template.match(/<script>([\s\S]*?)<\/script>/)[1]
        .replace('{{ site.google_analytics_id | jsonify }}', JSON.stringify('G-GSRQ6JMLTZ'));
    for (const host of ['kuroshiro.org', 'www.kuroshiro.org', 'localhost', '127.0.0.1', 'preview.example']) {
        const dom = new JSDOM('<!doctype html><head></head><body></body>', {url:`https://${host}/`, runScripts:'outside-only'});
        try {
            dom.window.eval(script);
            const tags = dom.window.document.querySelectorAll('script[src]');
            const official = ['kuroshiro.org', 'www.kuroshiro.org'].includes(host);
            assert.equal(tags.length, official ? 1 : 0);
            if (official) {
                assert.equal(tags[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-GSRQ6JMLTZ');
                assert.equal(tags[0].async, true);
                const commands = dom.window.dataLayer.map(command => Array.from(command));
                assert.equal(commands.length, 2);
                assert.equal(commands[0][0], 'js');
                assert.equal(commands[1][0], 'config');
                assert.equal(commands[1][1], 'G-GSRQ6JMLTZ');
            } else {
                assert.equal(dom.window.dataLayer, undefined);
            }
        } finally { dom.window.close(); }
    }
});
