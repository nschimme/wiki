# MUME Wiki

Community wiki and guide to [Multi-Users in Middle-earth](https://mume.org/) — a free text-based multiplayer RPG set in Tolkien's world.

## Contributing

See [AGENTS.md](AGENTS.md) for full editing instructions.

**Quick steps:**
1. Fork this repo
2. Edit or add pages in [`docs/pages/`](docs/pages/)
3. Test locally: `npm install && npm run docs:dev`
4. Open a pull request — a preview will be available in the GitHub interface once approved by a maintainer

## Local development

```bash
npm install
npm run docs:dev      # http://localhost:5173
npm run docs:build    # production build
npm run docs:preview  # preview production build
```

## Tech stack

- [VitePress](https://vitepress.dev/) — static site generator
- [GitHub Actions](https://github.com/features/actions) — CI/CD
- [GitHub Pages](https://pages.github.com/) — hosting
