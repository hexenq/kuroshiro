const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');

test('worker uses real published bundles and dictionaries for all output modes', async () => {
    for (const name of ['kuroshiro', 'kuroshiro-analyzer-kuromoji']) {
        const installed = require(path.join(root, 'node_modules', name, 'package.json'));
        assert.equal(installed.version, '2.0.0-beta.2');
        const bundle = name + '.min.js';
        assert.ok(fs.readFileSync(path.join(root, 'assets/vendor', bundle)).equals(fs.readFileSync(path.join(root, 'node_modules', name, 'dist', bundle))));
    }
    const messages = [], requests = [];
    const context = vm.createContext({URL, setTimeout, clearTimeout, console});
    context.self = context;
    context.location = {href:'https://example.org/assets/demo-worker.js'};
    context.postMessage = message => messages.push(message);
    context.importScripts = (...names) => {
        for (const name of names) {
            assert.equal(new URL(name, context.location.href).searchParams.get('v'), '2.0.0-beta.2');
            vm.runInContext(fs.readFileSync(path.join(root,'assets',name.split('?')[0]),'utf8'),context);
        }
    };
    context.XMLHttpRequest = class {
        open(method, url) { this.url = url; requests.push(url); }
        send() {
            fs.readFile(path.join(root,this.url), (error, buffer) => {
                if (error) { this.onerror(error); return; }
                this.status = 200;
                this.response = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
                this.onload();
            });
        }
    };
    vm.runInContext(fs.readFileSync(path.join(root,'assets/demo-worker.js'),'utf8'),context);
    assert.equal(requests.length,0);
    await context.onmessage({data:{id:1,type:'init'}});
    assert.equal(messages.at(-1).type,'ready');
    assert.ok(requests.length > 0);
    assert.ok(requests.every(url => url.startsWith('/assets/vendor/dict/')));
    for (const [to, expected] of [['hiragana','にほんご'],['katakana','ニホンゴ'],['romaji','nihongo']]) {
        await context.onmessage({data:{id:2,type:'convert',text:'日本語',options:{to,mode:'normal',romajiSystem:'hepburn'}}});
        assert.equal(messages.at(-1).result,expected);
    }
    for (const mode of ['normal','spaced','okurigana','furigana']) {
        const sample = '感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！';
        await context.onmessage({data:{id:3,type:'convert',text:sample,options:{to:'hiragana',mode}}});
        assert.equal(messages.at(-1).type,'result');
        assert.equal(messages.at(-1).markup,mode === 'furigana');
        assert.ok(messages.at(-1).result.includes('and'));
        assert.ok(messages.at(-1).result.includes('！'));
        assert.notEqual(messages.at(-1).result,sample);
    }
    for (const [romajiSystem, expected] of [['hepburn','konbanwa'], ['nippon','konbanwa'], ['passport','kombanwa']]) {
        await context.onmessage({data:{id:6,type:'convert',text:'こんばんは',options:{to:'romaji',mode:'normal',romajiSystem}}});
        assert.equal(messages.at(-1).result, expected);
    }
    await context.onmessage({data:{id:4,type:'convert',text:'<img>日本語',options:{to:'hiragana',mode:'furigana'}}});
    assert.ok(!messages.at(-1).result.includes('<img>'));
    await context.onmessage({data:{id:5,type:'convert',text:'あ'.repeat(5001),options:{}}});
    assert.equal(messages.at(-1).type,'error');
});
