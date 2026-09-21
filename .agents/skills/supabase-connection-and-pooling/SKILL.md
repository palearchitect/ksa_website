---
name: supabase-connection-and-pooling
description: Workflow for connecting Node.js backends and Drizzle ORM to Supabase via IPv4 Shared Poolers with percent-encoding, SSL, and multi-env loading.
---

# Supabase Connection & Pooling Best Practices

## 1. Connection String Format (Shared Pooler)

When connecting from IPv4-only local dev environments or serverless functions, use the Supabase Shared Transaction Pooler on port `6543`:

```env
DATABASE_URL=postgresql://postgres.<project_ref>:<percent_encoded_password>@aws-1-<region>.pooler.supabase.com:6543/postgres
```

### Password Percent-Encoding Reference
| Special Character | Percent-Encoded Value |
| :--- | :--- |
| `#` | `%23` |
| `!` | `%21` |
| `@` | `%40` |
| `$` | `%24` |
| `/` | `%2F` |
| `:` | `%3A` |

---

## 2. Drizzle ORM Configuration (Transaction Mode)

When using Drizzle ORM with `postgres.js` over a Transaction Pooler, disable prepared statements (`prepare: false`):

```javascript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL;

// Disable prefetch as it is not supported for Transaction Pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
```

---

## 3. PostgreSQL (`pg`) Node Client SSL Configuration

Enable SSL for remote PostgreSQL hosts like Supabase:

```javascript
const { Pool } = require('pg');

const dbUrl = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: dbUrl,
  ssl: dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1')
    ? { rejectUnauthorized: false }
    : false,
});
```

---

## 4. Multi-Environment Loader Pattern (`.env.local` Overrides)

Ensure backend scripts prioritize `.env.local` over `.env`:

```javascript
const path = require('path');
const fs = require('fs');

const envPaths = [
  path.join(process.cwd(), '.env.local'),
  path.join(process.cwd(), '.env')
];
envPaths.forEach(p => {
  if (fs.existsSync(p)) require('dotenv').config({ path: p, override: true });
});
require('dotenv').config();
```
