# Website development

This branch retains the existing Jekyll/GitHub Pages site. The demo no longer uses a conversion API. Text is processed by a Web Worker after the visitor explicitly starts the demo.

Run `npm ci`, `npm run build`, and `npm test` on Node.js 22 or newer. `npm run preview` serves the complete homepage at http://127.0.0.1:14337 using `index.html` and the shared `_includes/demo.html`. It substitutes only the homepage's include and relative URLs, not the full Jekyll engine. Language documentation links redirect to GitHub in this preview; production uses the Jekyll-rendered pages.

The playground and homepage quick-start use this default sample: `感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！`. Use the same full sentence for initial manual page tests, leaving it in the input after testing. Focused unit tests may use shorter strings or adversarial input.

`npm run build` copies the pinned published UMD libraries, Kuromoji dictionary and license notices to ignored `assets/vendor/`. These are generated assets, not hand-edited source. The compressed dictionary is approximately 17 MiB. HTTP caching is controlled by the eventual static host; no permanent/offline cache guarantee is made.

The worker handles dictionary loading and conversion off the UI thread. Loading can be cancelled or retried; a 180-second initialization deadline and 30-second conversion deadline terminate stalled workers. Text is limited to 5,000 UTF-16 code units. Plain results use textContent; furigana output permits only new ruby/rt/rp elements without attributes.

Before publishing, build the Node assets **before** running Jekyll, so the resulting `_site/assets/vendor/` includes the dictionary and libraries. The former branch-only GitHub Pages build does not run npm and is insufficient by itself. No deployment workflow or Pages settings change is included yet. Do not deploy this branch without arranging that build step.

Dependencies intentionally use published kuroshiro 1.2.0 and analyzer 1.1.0. The unreleased maintenance builds have not been substituted or labeled as npm releases.
