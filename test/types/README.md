# TypeScript consumer tests

These files are small examples of applications using the published package API.
The library implementation remains JavaScript; the declarations under test are
in the repository's root `index.d.ts`. These fixtures are not shipped in the npm
package.

## What each file checks

| File | Consumer scenario |
| --- | --- |
| `commonjs.cts` | `import Kuroshiro = require("kuroshiro")`, supported options, analyzer contracts, utility methods, and deliberately invalid calls |
| `interop.cts` | Default import compiled to CommonJS with TypeScript's `esModuleInterop` enabled |
| `default.mts` | Native ESM default import; also checked with bundler module resolution |
| `browser.ts` | A non-module browser script using the global `Kuroshiro` constructor and a triple-slash type reference |
| `joint.cts` | Core and the maintained Kuromoji analyzer together through CommonJS, using a real dictionary |
| `joint.mts` | The same package pair through native ESM, checking tokens and conversion |

`.cts` explicitly selects CommonJS TypeScript and emits `.cjs`; `.mts` selects
ESM TypeScript and emits `.mjs`. The browser fixture is an ordinary `.ts` script
with no module imports.

## How the runner uses them

`../types.cjs` is the runner. `npm test` builds the library before running it.
To run just these checks after a build:

```sh
npm run test:types
```

The runner:

1. Creates a temporary consumer project and packs the built library with
   `npm pack --ignore-scripts`. This creates a local tarball; it does not publish
   anything or run a second build.
2. Checks that the declaration file is present, then unpacks the tarball into the
   temporary project's `node_modules`. Runtime dependencies are linked from the
   existing installation, with no new network install.
3. Copies these fixtures to the consumer project and invokes TypeScript with
   strict checking. Imports use the package name, so this tests package discovery
   and published files, not just a relative import of the source declarations.
4. Checks CommonJS, CommonJS default-import interop, Node16, NodeNext, bundler,
   and browser-global configurations. Node16/NodeNext here are TypeScript module
   resolution modes, not a requirement to run Node 16. CI runs on Node 22/24.
5. Under NodeNext, emits and executes the three Node fixtures. This catches cases
   where the types accept an import or method but the actual JavaScript does not
   work. The other configurations only compile; the bundler check does not launch
   a bundler, and the global check does not launch a browser. Existing JavaScript
   package smoke tests separately exercise the UMD bundles.
6. Removes the temporary project, whether the checks pass or fail.

For paired integration, first build the sibling analyzer checkout, then run:

```sh
KUROSHIRO_ANALYZER_PACKAGE=../kuroshiro-analyzer-kuromoji npm run test:types
```

This also packs that analyzer and compiles and executes `joint.cts` and
`joint.mts`. CI uses a pinned analyzer revision for the same check.

## Why some calls are deliberately wrong

The `invalid()` function in `commonjs.cts` is never called. TypeScript still checks
its body, including assertions such as:

```ts
// @ts-expect-error Raw mode is not implemented.
core.convert("日本語", { mode: "raw" });
```

The check succeeds only if the next line has a type error. If the declarations
accidentally become too permissive (for example, by using `any`), the compiler
reports an unused `@ts-expect-error` and the test fails. Valid calls elsewhere
must compile without this directive. The fixtures therefore test both what the
API accepts and what it rejects.

`check()` contains the executable valid examples. Its `void check()` call starts
the async function; rejected promises fail the Node process. These runtime
checks confirm imports and a few representative conversions, while the regular
JavaScript tests cover the wider conversion behavior.
