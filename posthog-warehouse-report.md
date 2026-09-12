# PostHog Data Warehouse Setup Report

Created 0 of 2 detected sources in PostHog. The user cancelled both credential prompts, so both sources need browser setup.

## What was attempted

The wizard detected two data sources in this project and attempted to connect them to the PostHog data warehouse:

| Source | Kind | Signal |
|--------|------|--------|
| PostgreSQL | `Postgres` | `pg` found in `package.json` |
| Supabase | `Supabase` | `@supabase/supabase-js` found in `package.json` |

Both credential prompts were cancelled, so no sources were created in PostHog via the CLI.

## Changes made to the project

No source-code changes were made. No files were modified or created by this run (aside from this report).

## Sources requiring browser setup

Both sources must be connected manually in the PostHog app:

### PostgreSQL

Open the link below, enter your database credentials, and complete the setup:

**[Connect PostgreSQL in PostHog](https://us.posthog.com/project/597983/data-warehouse/new-source?kind=Postgres&utm_source=wizard&utm_campaign=warehouse-source)**

Required fields:
- **Host** — publicly reachable hostname (not `localhost` or private IPs like `10.x`, `192.168.x`)
- **Port** — default `5432`
- **Database** — your database name
- **User** — database username
- **Password** — database password

> If this Postgres database is hosted on Supabase, use the Supabase link below instead.

### Supabase

Open the link below and enter your Supabase database credentials:

**[Connect Supabase in PostHog](https://us.posthog.com/project/597983/data-warehouse/new-source?kind=Supabase&utm_source=wizard&utm_campaign=warehouse-source)**

Required fields:
- **Host** — use the **Session pooler** host, e.g. `aws-0-<region>.pooler.supabase.com` (find it in Supabase dashboard → Connect → Direct tab → Session pooler). The direct host `db.<ref>.supabase.co` is IPv6-only and won't work.
- **Port** — `5432` (Session pooler)
- **Database** — `postgres`
- **User** — `postgres.<project-ref>` (shown in the Session pooler URL)
- **Password** — your **database password** (Supabase → Settings → Database). This is NOT your `anon` key, `service_role` key, or account password.

## Next steps

1. Open each link above in your browser while logged into PostHog.
2. Enter the requested credentials and click through the setup wizard.
3. Select the tables you want to sync and choose a sync method (incremental recommended where available, otherwise full refresh).
4. PostHog will start syncing your data — check progress at [Data pipeline → Sources](https://us.posthog.com/project/597983/data-management/sources).
