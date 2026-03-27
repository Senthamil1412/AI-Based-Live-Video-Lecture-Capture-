# Contributing to LectureLens AI

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/<your-username>/lecture-capture.git`
3. **Install dependencies**: `npm install`
4. **Set up environment**: Copy `.env.local.example` and add your API keys
5. **Start dev server**: `npm run dev`

## Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/short-description` | `feature/multi-language-support` |
| Bug Fix | `fix/issue-description` | `fix/transcript-delay` |
| Docs | `docs/what-you-changed` | `docs/update-api-readme` |

## Commit Style (Conventional Commits)

```
feat:  new feature
fix:   bug fix
docs:  documentation only
style: formatting, no logic change
refactor: code refactor
test:  adding tests
chore: build/config changes
```

## Pull Request Guidelines

- One PR per feature/fix
- Include a clear description of what changed and why
- Test your changes locally before submitting
- Link any related issues using `Closes #issue-number`

## Areas Where Help is Needed

- 🌍 Multi-language transcription support
- 🔐 User authentication (NextAuth.js)
- ☁️ Supabase cloud sync
- 📱 Mobile responsiveness improvements
- 🧪 Unit & integration tests

## Code Style

- TypeScript strict mode — avoid `any` types where possible
- CSS Modules for component styles
- Keep API routes lean — business logic in utility functions
- Add `console.log` strategically for debugging, remove before PR

## Questions?

Open an issue with the `question` label — we're happy to help!
