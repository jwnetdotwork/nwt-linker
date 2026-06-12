# NWT Linker

Links New World Translation Scripture references to jw.org.

## How to use

- Clone this repo.
- Make sure your NodeJS is at least v18 (`node --version`).
- `npm i` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-nwt-linker/`.

## Releasing new releases

- Set the new version number in `.env` (e.g., `NWT_LINKER_VERSION=1.0.1`).
- Run `./release.sh`. **Note:** Running this script is an explicit opt-in to trigger a cloud-based release flow. This will:
    - Update `package.json`, `manifest.json`, and `versions.json`.
    - Create a git commit and a tag (without `v` prefix).
    - Push the changes and tag to GitHub.
- Pushing to GitHub triggers the [GitHub Actions release workflow](.github/workflows/release.yml), which executes in an external cloud environment.
    - **Data Sent:** Repository contents, commit metadata, tags, and generated build artifacts.
    - **Risks:** External cloud execution, potential exposure of secrets if not properly configured, and auditability of all pushed data.
    - **Opt-out:** To avoid triggering the cloud workflow, do not run `./release.sh` or push tags to GitHub; instead, follow manual installation steps.

## Improve code quality with eslint

- Run `npm run lint` to check for common bugs and code issues.
- A GitHub action is preconfigured to automatically lint every commit on all branches.

## API Documentation

See https://docs.obsidian.md
