# Agent Behavioral Rules & Project Invariants

## Execution & Architecture Rules
1. **Supabase Shared Pooler**: Always default to `aws-1-eu-west-1.pooler.supabase.com:6543` for database connection strings to prevent IPv6 DNS resolution issues on dev hosts.
2. **Percent-Encoding Passwords**: Always percent-encode special characters in `DATABASE_URL` strings (`#` -> `%23`, `!` -> `%21`).
3. **Drizzle ORM Transaction Pooler**: Always set `{ prepare: false }` on `postgres.js` clients.
4. **Environment File Hierarchy**: Ensure `.env.local` overrides `.env` with `override: true`.
5. **No Visual Speculation**: Verify visual layout rendering before completing UI tasks.
