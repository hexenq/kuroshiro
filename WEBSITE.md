# Website development

## Analytics

The homepage and documentation share `_includes/analytics.html`, using GA4 measurement ID `G-GSRQ6JMLTZ` from `_config.yml`. The tag runs only in production Jekyll builds on `kuroshiro.org` or `www.kuroshiro.org`; the local preview omits it. No custom events containing demo input or conversion output are added. Google's external script performs its own analytics collection; local conversion does not mean the page has no third-party analytics. Review enhanced measurement, data collection and any applicable notice/consent requirements in the GA4 account. The old Baidu and Universal Analytics integrations have been removed.

This branch retains the existing Jekyll/GitHub Pages site. The demo no longer uses a conversion API. Text is processed by a Web Worker after the visitor explicitly starts the demo.

Run `npm ci`, `npm run build`, and `npm test` on Node.js 22 or newer. `npm run preview` serves the complete homepage at http://127.0.0.1:14337 using `index.html` and the shared `_includes/demo.html`. It substitutes only the homepage's include and relative URLs, not the full Jekyll engine. Language documentation links redirect to GitHub in this preview; production uses the Jekyll-rendered pages.

The playground and homepage quick-start use this default sample: `感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！`. Use the same full sentence for initial manual page tests, leaving it in the input after testing. Focused unit tests may use shorter strings or adversarial input.

`npm run build` copies the pinned published UMD libraries, Kuromoji dictionary and license notices to ignored `assets/vendor/`. These are generated assets, not hand-edited source. The compressed dictionary is approximately 17 MiB. HTTP caching is controlled by the eventual static host; no permanent/offline cache guarantee is made.

The worker handles dictionary loading and conversion off the UI thread. Loading can be cancelled or retried; a 180-second initialization deadline and 30-second conversion deadline terminate stalled workers. Text is limited to 5,000 UTF-16 code units. Plain results use textContent; furigana output permits only new ruby/rt/rp elements without attributes.

The website workflow builds the Node assets **before** running the official Jekyll Pages build action. `npm run verify:site` checks rendered pages, homepage links, all generated assets and license notices, and excludes development files from publication. The validated `_site` is uploaded as a Pages artifact. Pull requests only build and verify; deployment runs only on pushes to `gh-pages`, after a successful build, using the `github-pages` environment. PR jobs have no Pages write permissions.

Before the first production merge, obtain explicit approval to go live, set repository Settings → Pages → Source to GitHub Actions, confirm the existing `kuroshiro.org` domain and HTTPS settings, and allow `gh-pages` in the `github-pages` environment's deployment branch rules. Keep DNS unchanged when retaining the existing Pages domain. This PR does not change any repository settings. Do not merge while the old branch-only publishing source is still active: that build does not generate the dictionary files.

After merging, verify the successful deployment and test dictionary loading, conversion and translated documentation on the real domain. If rollback is necessary, revert the relevant website commits through a reviewed PR; the same workflow rebuilds and deploys the reverted source. A rollback to the former deployment mechanism also requires restoring its Pages settings, not merely reverting source.

Dependencies intentionally use published kuroshiro 1.2.0 and analyzer 1.1.0. The unreleased maintenance builds have not been substituted or labeled as npm releases.
