const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const target = path.join(root, 'assets/vendor');
fs.mkdirSync(target, {recursive:true});
for (const name of ['kuroshiro', 'kuroshiro-analyzer-kuromoji']) {
    const source = path.join(root, 'node_modules', name);
    fs.copyFileSync(path.join(source, 'dist', name + '.min.js'), path.join(target, name + '.min.js'));
    fs.copyFileSync(path.join(source, 'LICENSE'), path.join(target, name + '-LICENSE'));
}
const kuromoji = path.join(root, 'node_modules/kuromoji');
fs.cpSync(path.join(kuromoji, 'dict'), path.join(target, 'dict'), {recursive:true});
fs.copyFileSync(path.join(kuromoji, 'LICENSE-2.0.txt'), path.join(target, 'kuromoji-LICENSE'));
fs.copyFileSync(path.join(kuromoji, 'NOTICE.md'), path.join(target, 'kuromoji-NOTICE.md'));
const size = fs.readdirSync(path.join(target, 'dict')).reduce((sum, name) => sum + fs.statSync(path.join(target, 'dict', name)).size, 0);
console.log(`Dictionary download: ${(size / 1048576).toFixed(1)} MiB (gzip files, before HTTP headers).`);
