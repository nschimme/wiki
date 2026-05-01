# MUME Wiki

Community wiki and guide to [Multi-Users in Middle-earth](https://mume.org/) — a free text-based multiplayer RPG set in Tolkien's world.

## Contributing

### Non-coders (edit via GitHub)

1. Browse to any page in [`docs/pages/`](docs/pages/) on GitHub
2. Click the pencil icon (Edit this file)
3. Make your changes and click **Commit changes** → **Create a new branch and pull request**
4. A preview build will be triggered automatically; a maintainer will review and merge

### Coders (local development)

```bash
npm install
npm run docs:dev      # dev server at http://localhost:5173 (hot reload)
npm run docs:build    # production build — must exit 0 before opening a PR
```

#### Exact CI parity (Docker / Podman)

To reproduce the GitHub Actions environment exactly before pushing:

```bash
docker compose up --build   # or: podman compose up --build
# site served at http://localhost:4173
```

This runs Node 22-alpine, `npm ci`, and `npm run docs:build` — the same steps as the deploy workflow.

## Tech stack

- [VitePress](https://vitepress.dev/) — static site generator
- [GitHub Actions](https://github.com/features/actions) — CI/CD
- [GitHub Pages](https://pages.github.com/) — hosting
