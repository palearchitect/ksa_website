# Project Rules & Agent Execution Preferences (GEMINI.md)

## 1. Execution Protocol & Agent Voice
- **Silent Proactive Execution**: Execute non-destructive implementation steps autonomously. Omit unnecessary preamble, conversational filler, and re-summarizing artifact contents.
- **Compact Engineering Syntax**: Deliver dense, actionable diffs, accurate file links, and precise diagnostic checkpoints.
- **Empirical Visual & Runtime Verification**: Validate all changes via tests, command execution, or browser DevTools before declaring a task complete.

---

## 2. Visual & Aesthetic Standards
- **Monochrome & Editorial Precision**: High-contrast monochrome layout paired with crisp typography (Inter, Outfit, or editorial serif fonts). Use color strictly as a semantic accent.
- **Zero Placeholder Policy**: Never introduce unstyled placeholder boxes, broken image links, or fake metrics.
- **Negative Space Over Border Clutter**: Favor whitespace rhythm over hairline top/bottom borders.

---

## 3. Database, Supabase & Backend Invariants
- **Supabase Shared Pooler (IPv4)**: Use the Shared Transaction Pooler (`aws-1-<region>.pooler.supabase.com:6543`) for IPv4 local and serverless execution.
- **Percent-Encoding Security**: Always percent-encode database passwords with special characters (`#` $\rightarrow$ `%23`, `!` $\rightarrow$ `%21`, `@` $\rightarrow$ `%40`).
- **Drizzle ORM & Postgres.js**: Initialize `postgres.js` with `{ prepare: false }` when connected to transaction-mode poolers.
- **Multi-Environment Precedence**: Ensure backend processes prioritize `.env.local` over `.env` with `{ override: true }`.

---

## 4. Installed Agent Skills & Reference
- **Supabase Pooler & Drizzle ORM**: `.agents/skills/supabase-connection-and-pooling/SKILL.md`
- **Supabase Core**: `.agents/skills/supabase`
- **Supabase Server & Auth**: `.agents/skills/supabase-server`
- **Supabase Postgres Best Practices**: `.agents/skills/supabase-postgres-best-practices`
- **Addy Osmani Engineering Skills**: 25 specialized skills in `.agents/skills/` (frontend-ui-engineering, doubt-driven-development, performance-optimization, etc.)
