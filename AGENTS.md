# Repository Guidelines

## Project Structure & Module Organization

The Next.js App Router application lives at the repository root. Routes are under `app/`, reusable UI is in `components/`, build-time blog content utilities are in `lib/`, and styles are in `styles/`. Grouped blog content belongs in `posts/<group>/<category>/` as Markdown; ungrouped categories may remain in `posts/<category>/`, with related media under `public/images/`. Files in `out/` are generated static-export artifacts and must not be hand-edited or committed.

## Build, Test, and Development Commands

Install dependencies after cloning:

```sh
npm install
```

- `npm run dev` starts the Next.js development server.
- `npm run lint` checks TypeScript and React code with ESLint.
- `npm run typecheck` checks the project with TypeScript without emitting files.
- `npm run build` creates the deployable static export in `out/` and verifies all post/category routes.

## Coding Style & Naming Conventions

Use two-space indentation in TypeScript, configuration, and scripts. ESLint configuration is in `eslint.config.mjs`; resolve lint and type errors before submitting. Use PascalCase for React components and component files (`PostList.tsx`), camelCase for functions and variables (`getAllPosts`), and lowercase names for CSS files. Prefer Server Components unless browser APIs or interactive state are required.

## Testing Guidelines

No automated test framework or coverage threshold is currently configured. Treat `npm run lint`, `npm run typecheck`, and `npm run build` as required checks. For UI changes, run the dev server and manually verify affected routes, responsive sidebar behavior, post rendering, and browser console output. For content changes, confirm the build-time export check passes and inspect the generated route locally.

## Commit & Pull Request Guidelines

Recent history uses short Korean summaries such as `posts 업데이트` and `자동 업데이트: 게시글 반영`. Keep commits concise, imperative, and scoped to one concern. Pull requests should explain the change, list verification commands, link any issue, and include screenshots for visible UI changes. Do not commit `.next/` or `out/` artifacts.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
