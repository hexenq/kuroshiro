const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const root = path.resolve(__dirname, '..');

function verifySite(site = path.join(root, '_site')) {
    function read(name) {
        const file = path.join(site, name);
        assert.ok(fs.existsSync(file), `Missing site asset: ${name}`);
        const data = fs.readFileSync(file);
        assert.ok(data.length, `Empty site asset: ${name}`);
        return data;
    }
    for (const name of ['index.html', 'README.jp.html', 'README.zh-cn.html', 'README.zh-tw.html', 'README.eo-eo.html', 'demo/index.html']) {
        const html = read(name).toString();
        assert.match(html, /<html[\s>]/i, `Not a rendered page: ${name}`);
        assert.ok(!html.includes('{% include demo.html %}'), `Unrendered include: ${name}`);
        assert.ok(!html.includes('{% include analytics.html %}'), `Unrendered analytics: ${name}`);
        if (name !== 'demo/index.html') {
            assert.equal((html.match(/https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=/g) || []).length, 1, `Missing or duplicate analytics: ${name}`);
            assert.ok(html.includes('G-GSRQ6JMLTZ'), `Missing GA4 measurement ID: ${name}`);
            assert.ok(!html.includes('hm.baidu.com'), `Retired Baidu tag: ${name}`);
            assert.ok(!html.includes('google-analytics.com/analytics.js'), `Retired Google tag: ${name}`);
        }
    }
    assert.equal(read('CNAME').toString().trim(), 'kuroshiro.org');
    const dom = new JSDOM(read('index.html').toString(), {url:'https://kuroshiro.org/'});
    try {
        const doc = dom.window.document;
        assert.equal(doc.querySelector('#oritext')?.textContent, '感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！');
        for (const node of doc.querySelectorAll('[href],script[src],img[src]')) {
            const value = node.getAttribute('href') || node.getAttribute('src');
            assert.ok(!value.includes('{{'), `Unrendered URL: ${value}`);
            const url = new URL(value, 'https://kuroshiro.org/');
            if (url.origin !== 'https://kuroshiro.org') continue;
            if (url.pathname === '/') {
                if (url.hash) assert.ok(doc.getElementById(url.hash.slice(1)), `Missing anchor: ${url.hash}`);
            } else read(decodeURIComponent(url.pathname).replace(/^\//, ''));
        }
    } finally { dom.window.close(); }
    // Compare every generated asset, including all dictionary files and license notices.
    // Do not lock the dictionary to a particular upstream file count.
    function compare(directory) {
        for (const entry of fs.readdirSync(path.join(root, directory), {withFileTypes:true})) {
            const relative = path.join(directory, entry.name);
            if (entry.isDirectory()) compare(relative);
            else assert.ok(read(relative).equals(fs.readFileSync(path.join(root, relative))), `Changed asset: ${relative}`);
        }
    }
    compare('assets');
    for (const name of ['node_modules', 'scripts', 'test', 'package.json', 'package-lock.json', 'WEBSITE.md', 'gemfile']) {
        assert.ok(!fs.existsSync(path.join(site, name)), `Development file published: ${name}`);
    }
    console.log('Verified rendered pages, homepage links, demo assets, dictionaries and license notices.');
}
module.exports = {verifySite};
if (require.main === module) verifySite();
