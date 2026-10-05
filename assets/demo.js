(function () {
    'use strict';
    const scriptUrl = document.currentScript.src;
    const byId = id => document.getElementById(id);
    const start = byId('startBtn'), convert = byId('convertBtn'), cancel = byId('cancelBtn');
    const status = byId('demoStatus'), output = byId('output');
    let worker, timer, ready = false, sequence = 0, pending;
    const fallback = {
        "retry": "Retry / start demo",
        "timeout": "This is taking too long. Retry when your connection is ready.",
        "loading": "Downloading dictionary and initializing (about 17 MiB). This may take a while…",
        "loadError": "Could not load the demo. Check your connection and retry.",
        "dictionaryError": "Dictionary loading failed. Check your connection and retry.",
        "conversionError": "Conversion failed. Restart the demo and try a shorter text.",
        "ready": "Ready. Your text is converted locally in this browser.",
        "complete": "Conversion complete.",
        "workerError": "Web Workers could not start. Please use a browser that supports them.",
        "tooLong": "Please enter no more than 5,000 characters.",
        "empty": "Enter some text to convert.",
        "converting": "Converting…",
        "cancelled": "Cancelled. You can start again when ready.",
        "unsupported": "This demo requires a browser with Web Worker support."
    };
    function setMessage(element, key) {
        element.setAttribute('data-i18n', key);
        element.textContent = window.KuroshiroI18n ? window.KuroshiroI18n.translate(key) : fallback[key];
    }
    function controls(busy) {
        start.disabled = busy;
        convert.disabled = busy || !ready;
        cancel.hidden = !busy;
        byId('demoArea').setAttribute('aria-busy', String(busy));
    }
    function reset(key) {
        clearTimeout(timer);
        if (worker) worker.terminate();
        worker = undefined;
        pending = undefined;
        ready = false;
        start.hidden = false;
        setMessage(start, 'retry');
        setMessage(status, key);
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
        timer = setTimeout(() => reset('timeout'), timeout);
        worker.postMessage({id:pending, type, ...payload});
    }
    start.addEventListener('click', () => {
        setMessage(status, 'loading');
        try {
            const workerUrl = new URL('demo-worker.js', scriptUrl);
            workerUrl.search = new URL(scriptUrl).search;
            worker = new Worker(workerUrl);
            worker.onerror = event => { event.preventDefault(); reset('loadError'); };
            worker.onmessage = ({data}) => {
                if (data.id !== pending) return;
                clearTimeout(timer);
                pending = undefined;
                if (data.type === 'error') {
                    reset(data.phase === 'init' ? 'dictionaryError' : 'conversionError');
                    return;
                }
                if (data.type === 'ready') {
                    ready = true;
                    start.hidden = true;
                    setMessage(status, 'ready');
                } else if (data.type === 'result') {
                    if (data.markup) render(data.result);
                    else output.textContent = data.result;
                    setMessage(status, 'complete');
                }
                controls(false);
            };
            send('init', {}, 180000);
        } catch { reset('workerError'); }
    });
    convert.addEventListener('click', () => {
        const text = byId('oritext').value;
        if (text.length > 5000) { setMessage(status, 'tooLong'); return; }
        output.replaceChildren();
        if (!text) { setMessage(status, 'empty'); return; }
        setMessage(status, 'converting');
        send('convert', {text, options:{to:byId('to').value, mode:byId('mode').value, romajiSystem:byId('romajiSystem').value}}, 30000);
    });
    cancel.addEventListener('click', () => reset('cancelled'));
    byId('to').addEventListener('change', () => { byId('romajiOption').hidden = byId('to').value !== 'romaji'; });
    if (!window.Worker) { start.disabled = true; setMessage(status, 'unsupported'); }
})();
