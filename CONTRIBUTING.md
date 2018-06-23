# Contributing to Kuroshiro
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## Code organization

| Files | Description |
|---|---|
| `src/*.js` | core files |
| `dist/*.js` | generated UMD distribution |
| `lib/*.js`  | generated CommonJS distribution |
| `test/*.js` | test files |

## Setting up development environment

To contribute, fork the library and install dependencies. You need
[git](http://git-scm.com/) and
[node](http://nodejs.org/); you might use
[nvm](https://github.com/creationix/nvm)

```bash
git clone https://github.com/hexenq/kuroshiro
npm install
npm run test
```

## Pull Request Process

### Before Submitting

 * **Pull requests to the `master` branch will be closed.** Please submit all pull requests to the `dev` branch.
 * **DO NOT** submit changes to the generated files. Instead only change
`src/*.js` and run the tests.

### Pull request - Submission

1. [Fork](http://help.github.com/fork-a-repo/) the project, clone your fork,
   and configure the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<your-username>/<repo-name>
   # Navigate to the newly cloned directory
   cd <repo-name>
   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/<upstream-owner>/<repo-name>
   ```

2. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout <dev-branch>
   git pull upstream <dev-branch>
   ```

3. Create a new topic branch (off the main project development branch) to
   contain your feature, change, or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

4. Commit your changes in logical chunks.      Use Git's
   [interactive rebase](https://help.github.com/articles/interactive-rebase)
   feature to tidy up your commits before making them public.

5. Locally merge (or rebase) the upstream development branch into your topic branch:

   ```bash
   git pull [--rebase] upstream <dev-branch>
   ```

6. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

7. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/)
    with a clear title and description.

## Code Style

This repository uses eslint to maintain code style and consistency, and to avoid style arguments.

## License

By contributing, you agree that your contributions will be licensed under MIT License.