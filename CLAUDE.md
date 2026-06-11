# CLAUDE.md

Orientation for agents working in this repo.

1. **Start with [docs/REPO_MAP.md](docs/REPO_MAP.md)** — the
   navigation map. It answers "where does X live / where do I put Y"
   in one read; only explore directories it doesn't cover. Don't run
   a broad repo exploration before reading it.
2. **Honor [BUSINESS_TEMPLATE_AGENT_CONTRACT.md](BUSINESS_TEMPLATE_AGENT_CONTRACT.md)**
   — sources of truth (`metrics/*.json` over rendered docs),
   commit+push before reporting, no unapproved outbound sends,
   Supabase as the only auth surface.
3. **After structural changes** (new routes, dirs, libs, tables,
   features), update `docs/REPO_MAP.md` in the same commit — see
   `.claude/skills/maintain-repo-map`.
4. Ship small, build-passing commits to `main` (each push deploys
   staging). Never push the `production` branch — users promote it.
