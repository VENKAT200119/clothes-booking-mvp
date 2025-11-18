## Copilot / AI Agent Instructions — repository discovery first

Purpose: help AI coding agents become productive quickly by describing how to discover this repo's architecture, developer workflows, and project-specific patterns. If you are updating an existing file, merge carefully and preserve any human-written guidance.

1) First-pass discovery (required)
 - Search for these files at the repo root and top-level folders: `README.md`, `package.json`, `pyproject.toml`, `requirements.txt`, `Pipfile`, `go.mod`, `pom.xml`, `Dockerfile`, `Makefile`, `.github/workflows/**`, `apps/`, `services/`, `api/`, `src/`, `web/`, `mobile/`, `infra/`.
 - If you find a `README.md`, extract the "Getting started" and "Development" commands verbatim and list them in your summary.
 - If you find a `package.json` or `pyproject.toml`, extract the test/build scripts and report exact commands (e.g., `npm run test`, `poetry run pytest`). Do not assume commands.

2) Summarize architecture (what to produce)
 - High-level diagram in bullets: major components (web, api, worker, db), how they communicate (HTTP, RPC, queues), and where source code lives (paths).
 - Entrypoints: list files used to start services (e.g., `server.js`, `main.py`, `cmd/*`), and the Dockerfile / container entrypoint if present.
 - Data flow: note the primary data stores (files, Postgres, Redis, S3) by searching for client libraries and env variables like `DATABASE_URL`, `REDIS_URL`, `S3_BUCKET`.

3) Developer workflows and commands to surface
 - Build/install: exact install and build commands discovered (example: `npm ci && npm run build`).
 - Tests: exact test runner commands and any test tags or workspace-level scripts.
 - Local dev run: commands to run local servers (e.g., `npm run dev`, `uvicorn app.main:app --reload`) — only include if discovered.
 - Debugging: highlight any docs or scripts that configure debugging or common VS Code launch configs (`.vscode/launch.json`).

4) Project-specific conventions to extract
 - Mono-repo layout (if present): look for `packages/`, `apps/`, `tools/` and list how packages are versioned (independent/workspace).
 - Config-by-env: prefer to read `.env.example`, `config/*.yaml`, or `settings.py` to find required env vars and defaults.
 - Database migrations: detect `alembic/`, `migrations/`, or `prisma/` and report migration workflow.
 - API patterns: identify framework (Express, FastAPI, Django, Spring) by dependency names and show example route file path(s).

5) Integration & external dependencies
 - List external services (payment, oauth, cloud buckets, auth providers) discovered via client libraries and env var keys.
 - Note CI workflows and deployment configs in `.github/workflows/`, `Dockerfile`, `helm/`, or `deploy/`.

6) Making code changes (practical rules)
 - When editing, prefer minimal, focused changes with tests. Add or update unit tests only when you touched logic; list which tests to run.
 - Follow existing style: detect and follow linters/formatters (ESLint, Prettier, black, isort). Use repo's config files if present.
 - If you cannot find tests or build commands, add a brief note in the change explaining how you validated locally and which commands you ran.

7) What to include in your initial summary/PR description
 - One-paragraph architecture summary.
 - Exact commands to build/test/run discovered in the repo.
 - Key files and folders (3–8 bullets) and why they matter.
 - Any missing or ambiguous info needed from maintainers (e.g., DB seed data, env vars, CI secrets).

If anything in this guidance is unclear or the repository contains private conventions not discovered here, ask the maintainer for the missing files or the canonical "getting started" commands before making non-trivial changes.

— End of instructions —
