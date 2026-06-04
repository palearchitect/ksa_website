# Database Setup Guide

This document provides complete instructions for setting up and configuring the PostgreSQL database for the KSA Valuers project.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
4. [Troubleshooting](#troubleshooting)
5. [Database Management](#database-management)

---

## Quick Start

### For Mac/Linux

```bash
# 1. Install PostgreSQL (if not already installed)
# macOS (using Homebrew)
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# 2. Create database
createdb ksa_valuers

# 3. Configure .env
cd backend
cp .env.example .env

# Edit .env and set DATABASE_URL
# DATABASE_URL=postgres://user:password@localhost:5432/ksa_valuers
nano .env

# 4. Run migrations and seed data
npm run db:setup

# 5. Start backend
npm run dev
```

### For Windows

```bash
# 1. Install PostgreSQL
# Download from: https://www.postgresql.org/download/windows/
# Run installer with default options

# 2. Create database (use pgAdmin or psql)
# Open Command Prompt/PowerShell as Administrator
psql -U postgres

# In psql terminal:
CREATE DATABASE ksa_valuers;
\q

# 3. Configure .env
cd backend
copy .env.example .env

# Edit .env with your CONNECTION STRING (see below)
notepad .env

# 4. Run migrations and seed data
npm run db:setup

# 5. Start backend
npm run dev
```

### For Docker

```bash
# 1. Start PostgreSQL in Docker
docker run --name ksa-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ksa_valuers \
  -p 5432:5432 \
  -d postgres:15

# 2. Configure .env
cd backend
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ksa_valuers

# 3. Run migrations
npm run db:setup

# 4. Start backend
npm run dev
```

---

## Local Development Setup

### Step 1: Install PostgreSQL

**Option A: Using Homebrew (Mac)**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Option B: Using Chocolatey (Windows)**
```bash
choco install postgresql15
# Restart your terminal or computer
```

**Option C: Using apt (Linux/Ubuntu)**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Option D: Using Docker**
```bash
docker run -d \
  --name postgres-ksa \
  -e POSTGRES_DB=ksa_valuers \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  postgres:15
```

### Step 2: Verify PostgreSQL Installation

```bash
# Check PostgreSQL version
psql --version

# Test connection
psql -U postgres -c "SELECT version();"
```

### Step 3: Create Database

**Using psql (Command Line)**
```bash
psql -U postgres

# In the psql terminal:
CREATE DATABASE ksa_valuers;
\l              # List all databases
\q              # Exit psql
```

**Using pgAdmin (GUI)**
1. Open pgAdmin (installed with PostgreSQL)
2. Right-click "Databases" → Create → Database
3. Name: `ksa_valuers`
4. Click "Save"

### Step 4: Configure Environment Variables

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Copy example environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit .env file and add DATABASE_URL:**
   ```bash
   # Example connection strings:
   
   # Local PostgreSQL (default user 'postgres')
   DATABASE_URL=postgres://postgres:password@localhost:5432/ksa_valuers
   
   # Local with custom credentials
   DATABASE_URL=postgres://ksa_user:ksa_password@localhost:5432/ksa_valuers
   
   # Docker container
   DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/ksa_valuers
   ```

4. **Add JWT secrets:**
   ```bash
   JWT_SECRET=your-super-secret-key-change-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
   ```

5. **Save the file**

### Step 5: Run Database Migrations

```bash
# Install dependencies (if not done)
npm install

# Run migrations and seed data
npm run db:setup

# Or run separately:
npm run db:migrate    # Run migrations only
npm run db:seed       # Seed sample data only
```

### Step 6: Verify Database Setup

```bash
# Start the backend
npm run dev

# Check if you see:
# ✅ Database connection successful
# ✅ Database migrations completed
# ✅ Seeded default admin user
# 🚀 Backend running on http://localhost:3000
```

### Step 7: Test the API

```bash
# In a new terminal, test the health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {
#   "success": true,
#   "status": "healthy",
#   "database": "connected"
# }
```

---

## Connection String Format

### Standard PostgreSQL URL Format

```
postgres://[user[:password]@][host[:port]][/database][?param1=value1&...]
```

### Examples

| Scenario | Connection String |
|----------|-------------------|
| **Local (default)** | `postgres://postgres:password@localhost:5432/ksa_valuers` |
| **Custom local user** | `postgres://ksa_user:ksa_pass@localhost:5432/ksa_valuers` |
| **Docker container** | `postgres://postgres:postgres@postgres:5432/ksa_valuers` |
| **Heroku** | `postgres://username:password@ec2-12-34-567-89.compute-1.amazonaws.com:5432/dbname` |
| **AWS RDS** | `postgres://admin:password@ksa-db.abc123.us-east-1.rds.amazonaws.com:5432/ksa_valuers` |
| **DigitalOcean** | `postgres://doadmin:password@db-ksa-do-user-12345.c.db.ondigitalocean.com:25061/ksa_valuers` |

---

## Production Deployment

### AWS RDS Setup

1. **Create RDS Database:**
   - Service: PostgreSQL 15+
   - Storage: 20 GB (adjustable)
   - Instance class: db.t3.micro (free tier eligible)
   - Multi-AZ: Yes (for high availability)

2. **Configure Security Groups:**
   - Allow inbound traffic on port 5432
   - Restrict to your application servers' IP addresses

3. **Get Connection String:**
   ```
   postgres://admin:YourPassword@ksa-db.abc123.us-east-1.rds.amazonaws.com:5432/ksa_valuers
   ```

4. **Add to Production Environment:**
   - Store in secure secret manager (AWS Secrets Manager, Heroku Config Vars, etc.)
   - Never commit `.env` files with real credentials

### Heroku Deployment

1. **Provision PostgreSQL Add-on:**
   ```bash
   heroku addons:create heroku-postgresql:standard-0
   ```

2. **Verify DATABASE_URL:**
   ```bash
   heroku config | grep DATABASE_URL
   ```

3. **Run Migrations:**
   ```bash
   heroku run npm run db:setup
   ```

### DigitalOcean App Platform

1. **Create PostgreSQL Database:**
   - Region: Same as app
   - Version: 15+
   - Cluster name: ksa-valuers

2. **Connect App:**
   - DigitalOcean automatically injects `DB_CONNECTION` environment variable
   - Use in `.env`: `DATABASE_URL=$DB_CONNECTION`

---

## Database Management

### Common Tasks

#### View Database Tables
```bash
psql -U postgres -d ksa_valuers

# In psql:
\dt                    # List all tables
\d users              # Describe users table
SELECT * FROM users;  # View user data
```

#### Backup Database
```bash
# Create backup
pg_dump -U postgres ksa_valuers > backup.sql

# Restore from backup
psql -U postgres ksa_valuers < backup.sql
```

#### Reset Database (Development Only)
```bash
# Drop all tables
psql -U postgres -d ksa_valuers -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
npm run db:setup
```

#### Add New Database User
```bash
psql -U postgres

# In psql:
CREATE USER ksa_user WITH PASSWORD 'secure_password';
ALTER ROLE ksa_user SET client_encoding TO 'utf8';
ALTER ROLE ksa_user SET default_transaction_isolation TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE ksa_valuers TO ksa_user;
\q
```

---

## Troubleshooting

### Error: "cannot connect to server"

**Problem:** PostgreSQL is not running or connection details are wrong

**Solutions:**
```bash
# macOS - Start PostgreSQL
brew services start postgresql@15

# Linux - Start PostgreSQL
sudo systemctl start postgresql

# Windows - Check Services
# Control Panel → Services → postgres service should be running

# Docker - Check container
docker ps | grep postgres
docker logs postgres-ksa
```

### Error: "role 'postgres' does not exist"

**Solution:**
```bash
# Find the correct username
psql -l

# Or create the role
sudo -u postgres createuser postgres
```

### Error: "database 'ksa_valuers' does not exist"

**Solution:**
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE ksa_valuers;"
```

### Error: "FATAL: Ident authentication failed for user 'postgres'"

**Problem:** PostgreSQL authentication method is set to 'ident' instead of 'md5'

**Solution (Linux):**
1. Edit `/etc/postgresql/15/main/pg_hba.conf`
2. Change `ident` to `md5` for localhost connections
3. Restart PostgreSQL: `sudo systemctl restart postgresql`

### Error: "Connection refused on port 5432"

**Solutions:**
1. PostgreSQL is not running → Start the service
2. Running on different port → Check `postgresql.conf` for `port = XXXX`
3. Firewall blocking → Allow port 5432 through firewall

```bash
# Check which port PostgreSQL is using
sudo lsof -i :5432

# Check PostgreSQL config
psql -U postgres -c "SHOW port;"
```

### Error: "FATAL: remaining connection slots reserved for non-replication superuser connections"

**Problem:** Too many connections to the database

**Solution:**
```bash
# Increase max_connections in postgresql.conf
sudo nano /etc/postgresql/15/main/postgresql.conf

# Find and change:
# max_connections = 100
# to:
# max_connections = 200

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## Environment Variables Reference

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `DATABASE_URL` | none | ✅ | PostgreSQL connection string |
| `NODE_ENV` | development | ❌ | Environment mode |
| `JWT_SECRET` | replace-me | ❌ | JWT signing key (change in production!) |
| `JWT_REFRESH_SECRET` | replace-me-too | ❌ | Refresh token signing key |
| `JWT_ACCESS_TTL` | 15m | ❌ | Access token expiry |
| `JWT_REFRESH_TTL` | 7d | ❌ | Refresh token expiry |
| `PORT` | 3000 | ❌ | Server port |
| `EMAIL_USER` | none | ❌ | Email service username |
| `EMAIL_PASS` | none | ❌ | Email service password |
| `ADMIN_EMAIL` | info@ksavaluers.com | ❌ | Admin notification email |
| `GEMINI_API_KEY` | none | ❌ | Gemini AI API key |

---

## Next Steps

After successful database setup:

1. **Start the development server:**
   ```bash
   cd backend && npm run dev
   ```

2. **Test API endpoints:**
   ```bash
   # Health check
   curl http://localhost:3000/api/health
   
   # Get all properties
   curl http://localhost:3000/api/properties
   ```

3. **Access admin panel:**
   - Frontend: http://localhost:5173
   - Admin login: http://localhost:5173/admin/login
   - Default admin: admin@ksavaluers.com / ChangeMeNow_123

4. **Change default admin password immediately in production!**

---

## Additional Resources

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [Node.js pg Library](https://node-postgres.com/)
- [Connection Pooling Best Practices](https://node-postgres.com/features/pooling)
- [Database Migration Strategies](https://github.com/UpLeveled/expressjs-template/tree/master/migrations)
