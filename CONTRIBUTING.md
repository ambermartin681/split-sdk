# Contributing to split-sdk

Thank you for your interest in contributing to StellarSplit! This repo is part of the [Drips Wave Program](https://drips.network/wave) — a monthly open-source bounty program run by the Stellar Development Foundation.

## Before You Start

**Do not begin coding until you have been assigned to an issue by a maintainer.**

1. Browse [open issues](../../issues) and find one labelled `good first issue` or matching your skill level.
2. Comment on the issue: "I'd like to work on this."
3. Wait for a maintainer to assign you. Only then should you fork and start coding.

## Workflow

### 1. Fork & Clone

```bash
git clone https://github.com/<your-username>/split-sdk.git
cd split-sdk
npm install
```

### 2. Create a Branch

```
fix/issue-NUMBER-short-description
feat/issue-NUMBER-short-description
```

```bash
git checkout -b fix/issue-42-short-description
```

### 3. Make Your Changes

- Write clean, well-typed TypeScript.
- Add or update tests in `test/`.
- Run `npm test` — all tests must pass.
- Run `npm run lint` — TypeScript must compile without errors.

### 4. Commit

Use conventional commits:

```
fix: handle undefined return from freighter signTransaction (#42)
feat: add retry logic to _submitTx (#7)
```

### 5. Open a Pull Request

- Title: concise, under 70 characters.
- Description: what changed, why, and how you tested it.
- Reference the issue: `Closes #42`

## Code Standards

- All exported functions and classes must have JSDoc comments.
- No `any` types unless absolutely necessary — document why.
- Keep functions small and focused.

## Commit Message Format

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) — enforced by `commitlint` via a Husky `commit-msg` hook.

Allowed types: `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `chore`, `breaking`

```
feat: add invoice template caching (#42)
fix: handle undefined return from freighter signTransaction (#7)
perf: deduplicate concurrent getInvoice calls (#386)

BREAKING CHANGE: removed deprecated `pay()` options.dedupe field
```

Breaking changes must include a `BREAKING CHANGE:` footer — these auto-populate the breaking changes section in `CHANGELOG.md`.

## Releases & Changelog

`CHANGELOG.md` is auto-generated from conventional commits on every release. To cut a release:

### Setup (first time)

```bash
npm install     # installs husky, commitlint, release-it
npm run prepare # activates Husky hooks
```

### Create a release

```bash
npm run release       # interactive: bumps version, generates CHANGELOG.md, creates GitHub Release, publishes to npm
npm run release:dry   # dry run — shows what would happen without making changes
```

`release-it` uses commit types to determine the semver bump:
- `feat` → minor bump
- `fix` / `perf` → patch bump
- `BREAKING CHANGE` footer → major bump

## Questions?

Open a [Discussion](../../discussions) or ask in the issue thread.
