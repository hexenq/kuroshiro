# Repository Guidance

## Project Overview

Kuroshiro is a Japanese language conversion library. Preserve compatibility
across CommonJS, ESM default imports, and browser bundles.

## Development Commands

- Use `npm ci` to install dependencies from the lockfile without changing it.
- When intentionally changing dependencies, use `npm install <package>` or
  `npm uninstall <package>` and include the updated `package-lock.json`.
- Run the complete verification suite with `npm test`.
- Inspect the publishable package with `npm pack --dry-run`.

## Repository Rules

- Edit source files instead of generated output in `lib/` or `dist/`.
- Add or update tests when changing observable behavior.
- Keep public API changes backward-compatible unless a breaking release is
  explicitly planned.
- Do not change the package version during ordinary development. Update it only
  as part of the release process.
- Follow `CONTRIBUTING.md` for contribution details.

## Commits

- Write commit messages in English using Conventional Commits, for example:
  `fix: preserve CommonJS compatibility`.
