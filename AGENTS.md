# MUME Wiki — Agent & Editor Guide

This wiki is built with [VitePress](https://vitepress.dev/) and hosted at https://wiki.mume.org.

## Quick start (local dev)

```bash
npm install
npm run docs:dev      # starts dev server at http://localhost:5173
npm run docs:build    # production build → docs/.vitepress/dist/
npm run docs:preview  # preview the production build locally
```

## Adding or editing pages

All wiki pages live in [`docs/pages/`](docs/pages/). Each is a standard Markdown file with YAML frontmatter:

```yaml
---
title: My Page Title
description: One-sentence description for SEO (auto-generated if omitted).
aliases: [Page Alias, Another Alias]
tags:
  - Guides
  - Newbie Help
---

# My Page Title

Content here...
```

**Rules:**
- `title` is required
- `aliases` (optional) is a list of alternative names for this page. The auto-linker uses these to create links from other pages automatically.
- `tags` must match existing categories — see [docs/tags.md](docs/tags.md) for valid tags
- File names use underscores for spaces (e.g. `Grey_Havens.md`)

## Linking between pages

Use relative Markdown links with the `.md` extension:

```md
[Rivendell](./Rivendell.md)
[Back to classes](../classes.md)
```

Do **not** use wikilink syntax `[text](Page "wikilink")` — the migration script converts those but the VitePress site uses standard links.

## Adding images

1. Drop the image file into [`docs/public/img/`](docs/public/img/)
2. Reference it in Markdown as an absolute path (no `docs/public` prefix):

```md
![Legolas](/img/Legolas.jpg)
```

Images are served at the site root, so `/img/filename.jpg` always works regardless of which page you're on.

## Using includes (shared content blocks)

Common navigation tables are in [`docs/includes/`](docs/includes/):

| File | Purpose |
|------|---------|
| `ClassRace.md` | Classes & Races navigation table |
| `Items.md` | Item types navigation |
| `Place.md` | Key locations navigation |
| `Delete.md` | "Marked for deletion" warning box |

Include them in a page with:

```md
<!--@include: ../includes/ClassRace.md-->
```

## Tag system

Tags appear in frontmatter and power the [Tags index](https://wiki.mume.org/tags). Use existing tags where possible:

| Tag | Used for |
|-----|----------|
| `Guides` | Strategy and how-to articles |
| `Newbie Help` | Content for new players |
| `Playable races` | Race description pages |
| `Commands` | Game command reference |
| `Spells` | Spell reference pages |
| `Skills` | Skill reference pages |
| `Equipment` | General equipment pages |
| `Locations` | Area and location pages |
| `Mobiles` | NPC/monster pages |
| `Software` | Clients, mappers, tools |

## Section index pages

The top-level section pages (`docs/classes.md`, `docs/guides.md`, etc.) are hand-maintained summaries. Update them when adding important new pages.

## PR previews

Open a pull request — GitHub Actions will build your changes. Once a maintainer approves your PR, a live preview will be automatically deployed and accessible via the "View deployment" button in the GitHub PR interface.

## AI agent notes

This file (`AGENTS.md`) is read automatically by Claude Code, OpenAI Codex, Gemini CLI, and other agents that support the `AGENTS.md` convention. Keep it up to date so agents have accurate project context.

Key facts for agents:
- All wiki content is in `docs/pages/*.md` — edit there, not in `_pages/` (legacy source)
- Images live in `docs/public/img/` and are referenced as `/img/filename`
- Build command: `npm run docs:build`
- Dev server: `npm run docs:dev`
- No test suite — verify with `npm run docs:build` (must exit 0)

## Running the migration script

The migration script (`scripts/fix-pages.js`) converts `_pages/` → `docs/pages/` and `assets/img/` → `docs/public/img/`. It is kept for reference but should not need to be run again unless re-importing from MediaWiki.

```bash
npm run migrate
```
