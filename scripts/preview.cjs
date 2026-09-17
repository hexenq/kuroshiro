// Preview the actual homepage and shared demo; documentation still needs Jekyll.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function homepage() {
    return fs.readFileSync(path.join(root, 'index.html'), 'utf8')
        .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
        .replace('{% include analytics.html %}', '')
        .replace("{{ site.github.build_revision | default: 'local' }}", 'local')
        .replace('{% include demo.html %}', fs.readFileSync(path.join(root, '_includes/demo.html'), 'utf8'))
        .replace(/\{\{ '([^']+)' \| relative_url \}\}/g, '$1');
}
http.createServer((req,res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/') {
        res.setHeader('Content-Type','text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(homepage());
        return;
    }
    // These pages are rendered by Jekyll in production; preview links use the source docs.
    const docs = /^\/README\.(jp|zh-cn|zh-tw|eo-eo)\.html$/.exec(url.pathname);
    if (docs) {
        res.writeHead(302, {Location: 'https://github.com/hexenq/kuroshiro/blob/master/README.' + docs[1] + '.md'}).end();
        return;
    }
    const name = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!name.startsWith(path.join(root,'assets') + path.sep) && name !== path.join(root,'favicon.ico')) { res.writeHead(404).end(); return; }
    fs.readFile(name, (error, data) => {
        if (error) { res.writeHead(404).end(); return; }
        res.setHeader('Content-Type', name.endsWith('.js') ? 'application/javascript' : name.endsWith('.css') ? 'text/css' : name.endsWith('.ico') ? 'image/x-icon' : 'application/octet-stream');
        res.setHeader('Cache-Control', name.endsWith('.gz') ? 'public, max-age=3600' : 'no-store');
        res.end(data);
    });
}).listen(Number(process.env.PORT || 14337), '127.0.0.1', () => console.log('Homepage preview: http://127.0.0.1:' + (process.env.PORT || 14337)));
