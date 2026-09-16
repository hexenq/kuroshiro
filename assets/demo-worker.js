/* Libraries and dictionaries are same-origin, version-locked build assets. */
let kuroshiro;
let ready;
self.onmessage = async function ({data}) {
    const {id, type} = data;
    try {
        if (type === 'init') {
            if (!ready) {
                ready = (async () => {
                    importScripts('vendor/kuroshiro.min.js', 'vendor/kuroshiro-analyzer-kuromoji.min.js');
                    const Kuroshiro = self.Kuroshiro.default || self.Kuroshiro;
                    kuroshiro = new Kuroshiro();
                    // A pathname avoids kuromoji's path.join corruption of absolute URLs.
                    const dictPath = new URL('vendor/dict/', self.location.href).pathname;
                    await kuroshiro.init(new self.KuromojiAnalyzer({dictPath}));
                })();
            }
            await ready;
            self.postMessage({id, type:'ready'});
        } else if (type === 'convert') {
            if (!ready) throw new Error('Not initialized');
            await ready;
            if (typeof data.text !== 'string' || data.text.length > 5000) throw new Error('Invalid input');
            // Escape user markup before conversion; only generated ruby markup may render.
            const markup = data.options.mode === 'furigana';
            const input = markup ? data.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : data.text;
            const result = await kuroshiro.convert(input, data.options);
            self.postMessage({id, type:'result', result, markup});
        }
    } catch {
        self.postMessage({id, type:'error', phase:type});
    }
};
