const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const root = path.resolve(__dirname,'..');
function setup() {
    const html = fs.readFileSync(path.join(root,'_includes/demo.html'),'utf8');
    const dom = new JSDOM(html, {url:'https://example.org/subsite/',runScripts:'outside-only'});
    const workers = [];
    dom.window.Worker = class {
        constructor(url) { this.url = String(url); workers.push(this); }
        postMessage(message) { this.message = message; }
        terminate() { this.stopped = true; }
        reply(data) { this.onmessage({data:{id:this.message.id,...data}}); }
    };
    Object.defineProperty(dom.window.document,'currentScript',{value:{src:'https://example.org/subsite/assets/demo.js'}});
    dom.window.eval(fs.readFileSync(path.join(root,'assets/demo.js'),'utf8'));
    const element = id => dom.window.document.getElementById(id);
    return {dom,workers,element};
}
test('lazy start, worker URL under base path, cancel, retry and stale responses', () => {
    const {dom,workers,element} = setup();
    try {
        assert.equal(workers.length,0);
        assert.equal(element('oritext').value,'感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！');
        assert.equal(element('convertBtn').disabled,true);
        element('startBtn').click();
        assert.equal(workers[0].url,'https://example.org/subsite/assets/demo-worker.js');
        const first = workers[0];
        element('cancelBtn').click();
        assert.equal(first.stopped,true);
        element('startBtn').click();
        first.reply({type:'ready'});
        assert.equal(element('convertBtn').disabled,true);
        workers[1].reply({type:'error',phase:'init'});
        assert.equal(workers[1].stopped,true);
        assert.equal(element('startBtn').disabled,false);
        element('startBtn').click();
        workers[2].reply({type:'ready'});
        assert.equal(element('convertBtn').disabled,false);
    } finally { dom.window.close(); }
});
test('plain text remains literal; ruby output drops arbitrary tags and attributes', () => {
    const {dom,workers,element} = setup();
    try {
        element('startBtn').click(); workers[0].reply({type:'ready'});
        element('oritext').value = '<img src=x onerror=alert(1)>日本語';
        element('convertBtn').click();
        workers[0].reply({type:'result',markup:false,result:'<img src=x onerror=alert(1)>にほんご'});
        assert.equal(element('output').children.length,0);
        assert.match(element('output').textContent,/<img/);
        element('convertBtn').click();
        workers[0].reply({type:'result',markup:true,result:'<ruby onclick="bad()">日本語<rt>にほんご</rt></ruby><img src=x onerror="bad()">'});
        assert.equal(element('output').innerHTML,'<ruby>日本語<rt>にほんご</rt></ruby>');
        element('oritext').value = 'あ'.repeat(5001);
        element('convertBtn').click();
        assert.match(element('demoStatus').textContent,/5,000/);
    } finally { dom.window.close(); }
});
