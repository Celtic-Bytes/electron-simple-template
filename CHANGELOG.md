# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

You can add the folowing sections to this changelog: `Added`, `Removed`, `Changed` and `Fixed`.

## 0.0.3 (2026-10-14)

### Added

- Vitest 5 test infrastructure (`vitest.config.ts` with `main` and `renderer` projects, setup files, sample tests)
- `test`, `test:watch`, `test:main`, `test:renderer`, `test:coverage` and `typecheck` npm scripts
- `.svg` support in the esbuild loaders and in the TypeScript module declarations

### Changed

- Updated dependencies: Electron 44.x, TypeScript 6.x, ESLint 10.x, esbuild 0.28.x, electron-builder 26.15.x, Prettier 3.9.x, Stylelint 17.x, React 19.3.x and their type definitions
- Preload script is now built as CommonJS (`dist/preload.cjs`); sandboxed renderers cannot load ESM preloads
- Preload now exposes a minimal typed API on `window.api` (with a `system` domain) instead of a raw `ipcRenderer` pass-through; the channel contract lives in `types/ipc.types.ts`
- Removed `eslint-plugin-import` and `eslint-plugin-react`; updated `eslint-plugin-react-hooks` to the v7 flat config API
- `styles:*` scripts now target `src/**/*.css` explicitly
- Root TypeScript config files (`vitest.config.ts`, `eslint.config.mts`) are now part of the tsconfig program, so they get type-checked
- `coverage/` added to `.gitignore`

### Fixed

- Production builds failed to load the ESM preload in sandboxed renderers (now CJS)
- Removed the invalid `"yourenamehere": "file:"` self-dependency that could break `npm install`
- Added `allowScripts` approvals required by npm 11 (`esbuild`, `electron-winstaller`)
- ESLint "was not found by the project service" parsing errors for root config files: dropped the type-aware `projectService` parser option (fragile for files outside the tsconfig program) and aligned the ESLint config with the proven meowvies setup — explicit `files` pattern and merged browser+node globals. Root TypeScript config files (`vitest.config.ts`, `eslint.config.mts`) are still part of the tsconfig program, so they get type-checked
- Watcher now logs the build error that previously triggered a swallowed `catch`, and its remaining Spanish comments were translated to English

## 0.0.1 (2025-02-22)

### Added

- Markdown Files like LICENSE, CHANGELOG.md, etc..

### Changed

- README.md updated with new information.

### Fixed

- Some wrong behaviors with the watcher and esbuild configuration

## Unreleased (2025-02-10)

### Added

- Project scaffolding
