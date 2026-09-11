# Contributing to Kuroshiro
All kinds of contributions are welcome, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Submitting new analyzer plugins or fixes of them
- Proposing new features
- Help translating the documents

## Code Organization

| Files | Description |
|---|---|
| `src/*.js` | core files |
| `dist/*.js` | generated UMD distribution |
| `lib/*.js`  | generated CommonJS distribution |
| `test/*.js` | test files |

## Setting up development environment

To contribute, fork the repository and install its dependencies. Development requires Node.js 22 or newer.

```bash
git clone https://github.com/<your-username>/kuroshiro
cd kuroshiro
npm install
npm run test
```

## Commit Messages

Write commit messages in English and follow the Conventional Commits format:

```text
<type>(optional scope): <description>
```

Common types include `feat`, `fix`, `docs`, `test`, `refactor`, `build`, `ci`,
and `chore`.

## Pull Request Process

### Before Submitting

 * Submit pull requests to the `master` branch.
 * **DO NOT** submit changes to generated files in `lib/` or `dist/`.
   Change the source, tests, documentation, or build configuration instead.

### Pull request - Submission

1. [Fork](http://help.github.com/fork-a-repo/) the project, clone your fork,
   and configure the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<your-username>/kuroshiro
   # Navigate to the newly cloned directory
   cd kuroshiro
   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/hexenq/kuroshiro
   ```

2. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout master
   git pull upstream master
   ```

3. Create a new topic branch (off the default branch) to
   contain your feature, change, or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```
4. Make sure the tests are robust and passed. And refine the documents if needed.

5. Commit your changes in logical chunks using the commit message convention
   above. Use Git's
   [interactive rebase](https://help.github.com/articles/interactive-rebase)
   feature to tidy up your commits before making them public.

6. Locally merge (or rebase) the upstream default branch into your topic branch:

   ```bash
   git pull [--rebase] upstream master
   ```

7. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

8. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) to the `master` branch with a clear title and description.

## Code Style

This repository uses `eslint` to maintain code style and consistency.

## How to submit new analyzer plugins

There is a sample/seed repository [kuroshiro-analyzer-seed](https://github.com/hexenq/kuroshiro-analyzer-seed) for you. Check it out.

## License

By contributing, you agree that your contributions will be licensed under MIT License.
