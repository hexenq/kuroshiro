(function () {
    'use strict';
    const scriptUrl = document.currentScript.src;
    const byId = id => document.getElementById(id);
    const start = byId('startBtn'), convert = byId('convertBtn'), cancel = byId('cancelBtn');
    const status = byId('demoStatus'), output = byId('output');
    let worker, timer, ready = false, sequence = 0, pending;
    function controls(busy) {
        start.disabled = busy;
        convert.disabled = busy || !ready;
        cancel.hidden = !busy;
        byId('demoArea').setAttribute('aria-busy', String(busy));
    }
    function reset(message) {
        clearTimeout(timer);
        if (worker) worker.terminate();
        worker = undefined;
        pending = undefined;
        ready = false;
        start.hidden = false;
        start.textContent = 'Retry / start demo';
        status.textContent = message;
        controls(false);
    }
    // Build fresh nodes: never insert untrusted attributes or arbitrary HTML tags.
    function render(markup) {
        const parsed = new DOMParser().parseFromString(markup, 'text/html');
        function copy(node, parent) {
            if (node.nodeType === 3) { parent.appendChild(document.createTextNode(node.textContent)); return; }
            if (node.nodeType !== 1) return;
            const allowed = ['RUBY', 'RT', 'RP'].includes(node.tagName);
            const target = allowed ? document.createElement(node.tagName.toLowerCase()) : parent;
            if (allowed) parent.appendChild(target);
            for (const child of node.childNodes) copy(child, target);
        }
        output.replaceChildren();
        for (const node of parsed.body.childNodes) copy(node, output);
    }
    function send(type, payload, timeout) {
        pending = ++sequence;
        controls(true);
        timer = setTimeout(() => reset('This is taking too long. Retry when your connection is ready.'), timeout);
        worker.postMessage({id:pending, type, ...payload});
    }
    start.addEventListener('click', () => {
        status.textContent = 'Downloading dictionary and initializing (about 17 MiB). This may take a while…';
        try {
            worker = new Worker(new URL('demo-worker.js', scriptUrl));
            worker.onerror = event => { event.preventDefault(); reset('Could not load the demo. Check your connection and retry.'); };
            worker.onmessage = ({data}) => {
                if (data.id !== pending) return;
                clearTimeout(timer);
                pending = undefined;
                if (data.type === 'error') {
                    reset(data.phase === 'init' ? 'Dictionary loading failed. Check your connection and retry.' : 'Conversion failed. Restart the demo and try a shorter text.');
                    return;
                }
                if (data.type === 'ready') {
                    ready = true;
                    start.hidden = true;
                    status.textContent = 'Ready. Your text is converted locally in this browser.';
                } else if (data.type === 'result') {
                    if (data.markup) render(data.result);
                    else output.textContent = data.result;
                    status.textContent = 'Conversion complete.';
                }
                controls(false);
            };
            send('init', {}, 180000);
        } catch { reset('Web Workers could not start. Please use a browser that supports them.'); }
    });
    convert.addEventListener('click', () => {
        const text = byId('oritext').value;
        if (text.length > 5000) { status.textContent = 'Please enter no more than 5,000 characters.'; return; }
        output.replaceChildren();
        if (!text) { status.textContent = 'Enter some text to convert.'; return; }
        status.textContent = 'Converting…';
        send('convert', {text, options:{to:byId('to').value, mode:byId('mode').value, romajiSystem:byId('romajiSystem').value}}, 30000);
    });
    cancel.addEventListener('click', () => reset('Cancelled. You can start again when ready.'));
    byId('to').addEventListener('change', () => { byId('romajiOption').hidden = byId('to').value !== 'romaji'; });
    if (!window.Worker) { start.disabled = true; status.textContent = 'This demo requires a browser with Web Worker support.'; }
})();
