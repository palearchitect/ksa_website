# KSA Valuers — Node.js Hosting Guide

This guide covers everything you need to deploy the KSA Valuers platform on **Hostinger VPS**, **Hostinger Node.js Hosting**, or any comparable Node.js hosting provider (Railway, Render, DigitalOcean App Platform, etc.).

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Minimum Server Specifications](#minimum-server-specifications)
- [Hostinger-Specific Setup](#hostinger-specific-setup)
- [Environment Variables](#environment-variables)
- [Database Setup (PostgreSQL)](#database-setup-postgresql)
- [Build & Deployment Steps](#build--deployment-steps)
- [Process Management](#process-management)
- [Reverse Proxy & SSL (Nginx)](#reverse-proxy--ssl-nginx)
- [Domain & DNS Configuration](#domain--dns-configuration)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)
- [Alternative Providers](#alternative-providers)

---

## Architecture Overview

```
┌────────────────────────────────────────────────┐
│                   Internet                     │
└──────────────────┬─────────────────────────────┘
                   │  HTTPS (443)
┌──────────────────▼─────────────────────────────┐
│        Nginx Reverse Proxy (SSL termination)   │
└──────────────────┬─────────────────────────────┘
                   │  HTTP (3000)
┌──────────────────▼─────────────────────────────┐
│            Express.js Server (Node.js)         │
│  ┌───────────────────────────────────────────┐ │
│  │  /api/*          → Backend API routes     │ │
│  │  /*              → Vue SPA (dist/)        │ │
│  └───────────────────────────────────────────┘ │
└──────────────────┬─────────────────────────────┘
                   │
┌──────────────────▼─────────────────────────────┐
│        PostgreSQL Database (port 5432)         │
└────────────────────────────────────────────────┘
```

In production, the Express server serves both the API **and** the built Vue frontend from the `dist/` directory. A single Node.js process handles everything.

---

## Minimum Server Specifications

| Resource           | Minimum            | Recommended         |
| :----------------- | :----------------- | :------------------ |
| **CPU**            | 1 vCPU             | 2 vCPU              |
| **RAM**            | 1 GB               | 2 GB                |
| **Storage**        | 20 GB SSD          | 40 GB SSD           |
| **Node.js**        | v18.x LTS          | v20.x LTS or v22.x |
| **PostgreSQL**     | 14+                | 16+                 |
| **OS**             | Ubuntu 22.04 LTS   | Ubuntu 24.04 LTS    |
| **Bandwidth**      | 1 TB/month         | 2 TB/month          |

> [!IMPORTANT]
> Hostinger's **VPS KVM 2** plan or higher is recommended. The cheapest VPS plan (1 GB RAM) will work but may struggle under traffic spikes with AI queries.

---

## Hostinger-Specific Setup

### Option A: Hostinger VPS (Recommended)

1. **Purchase a VPS plan** — KVM 2 or higher (2 GB RAM, 2 vCPU).
2. **Choose Ubuntu 22.04 or 24.04** as the OS template.
3. **SSH into your server:**
   ```bash
   ssh root@your-server-ip
   ```
4. **Install Node.js via nvm:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   source ~/.bashrc
   nvm install 20
   nvm alias default 20
   ```
5. **Install PostgreSQL:**
   ```bash
   sudo apt update && sudo apt install -y postgresql postgresql-contrib
   sudo systemctl enable postgresql
   sudo systemctl start postgresql
   ```
6. **Install Nginx:**
   ```bash
   sudo apt install -y nginx
   sudo systemctl enable nginx
   ```
7. **Install PM2 globally:**
   ```bash
   npm install -g pm2
   ```

### Option B: Hostinger Node.js Web Hosting

Hostinger's shared Node.js hosting is simpler but has limitations:

- ✅ Node.js runtime pre-installed
- ✅ SSL via hPanel
- ❌ No root/SSH access on lower plans
- ❌ No direct PostgreSQL — use an external DB provider (see [Database Setup](#database-setup-postgresql))
- ❌ Limited process management (no PM2)

**Steps for shared hosting:**
1. Set the **Node.js version** to 20.x in hPanel.
2. Set the **Application root** to `backend/`.
3. Set the **Startup file** to `server.js`.
4. Upload the project files (excluding `node_modules/`).
5. Use hPanel's terminal or SSH to run `npm install` in both root and `backend/` directories.
6. Build the frontend: `npm run build` (from root).
7. Configure environment variables via hPanel's `.env` editor.

### Option C: Automatic Deployment from GitHub (Hostinger Node.js Plan)

Hostinger's Node.js hosting plans support **automatic deployment directly from your GitHub repository**. Every push to your chosen branch triggers a rebuild and restart — no manual uploads or SSH needed.

**Setup steps:**

1. **Go to hPanel** → Websites → your site → **Git** → **Connect** to your GitHub account.
2. **Select the repository** (`ThePaleArchitect/ksa_website`).
3. **Configure the Build Configuration:**

   | Setting                | Value                              |
   | :--------------------- | :--------------------------------- |
   | **Framework preset**   | `Vite`                             |
   | **Branch**             | `main`                             |
   | **Node version**       | `22.x`                             |
   | **Root directory**     | `./`                               |

4. **Configure the Build and Output Settings:**

   | Setting                | Value                              |
   | :--------------------- | :--------------------------------- |
   | **Build command**      | `npm run build`                    |
   | **Package manager**    | `npm`                              |
   | **Output directory**   | `dist`                             |

5. **Set environment variables** — In hPanel, go to **Advanced** → **Environment Variables** (or edit the `.env` file via File Manager). Add all required variables from the [Environment Variables](#environment-variables) section below. Make sure `NODE_ENV=production` is set.

6. **Set up the database** — Since Hostinger shared hosting doesn't include PostgreSQL, use an external provider (Neon, Supabase, Railway — see [Database Setup](#database-setup-postgresql)). Copy the connection string into your `DATABASE_URL` env variable.

7. **Trigger the first deploy** — Click **Deploy** in hPanel, or simply push a commit to `main`:
   ```bash
   git push origin main
   ```

8. **Verify** — Visit your domain. The site should be live with both the frontend and API running.

**How it works:**

```
GitHub Push (main) → Hostinger Webhook → Pull Latest Code
    → npm install (auto, via package manager setting)
    → npm run build (produces dist/)
    → Serve from dist/ + Restart Node.js App
    → Site Updated Automatically ✅
```

> [!TIP]
> Every subsequent `git push origin main` will automatically redeploy the site. No manual intervention needed — just push your code and Hostinger handles the rest.

> [!IMPORTANT]
> The **Root directory** must be set to `./` (project root) so Hostinger can find the root `package.json` and run `npm run build` to produce the `dist/` folder. The backend dependencies are installed separately from `backend/package.json`.

---

## Environment Variables

Create the file `backend/.env` on your server with the following values:

```env
# ──────────────────────────────────────────────
# REQUIRED — Server will NOT start without these
# ──────────────────────────────────────────────

# Node environment — MUST be "production" on live server
NODE_ENV=production

# PostgreSQL connection string
DATABASE_URL=postgres://ksa_user:YOUR_STRONG_PASSWORD@localhost:5432/ksa_valuers

# JWT secrets — generate unique random strings (64+ chars recommended)
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=GENERATE_A_RANDOM_64_CHAR_HEX_STRING
JWT_REFRESH_SECRET=GENERATE_A_DIFFERENT_64_CHAR_HEX_STRING
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Admin seed password — min 12 chars, mixed case, numbers, special chars
ADMIN_PASSWORD=YourSecureAdminPass_2024!

# CORS — your production domain(s), comma-separated, HTTPS required
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Server port (Nginx will proxy to this)
PORT=3000

# ──────────────────────────────────────────────
# OPTIONAL — Features degrade gracefully without these
# ──────────────────────────────────────────────

# Email provider: gmail | smtp | sendgrid | aws-ses
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
ADMIN_EMAIL=admin@yourdomain.com
EMAIL_FROM=noreply@yourdomain.com

# Gemini AI (for AI assistant features)
GEMINI_API_KEY=your-gemini-api-key
```

> [!CAUTION]
> **Never commit `.env` to Git.** The `.gitignore` already excludes it. Always use your hosting provider's secrets manager or set variables directly on the server.

---

## Database Setup (PostgreSQL)

### Local PostgreSQL (VPS)

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE USER ksa_user WITH PASSWORD 'YOUR_STRONG_PASSWORD';
CREATE DATABASE ksa_valuers OWNER ksa_user;
GRANT ALL PRIVILEGES ON DATABASE ksa_valuers TO ksa_user;
\q
```

### External PostgreSQL Providers

If your hosting doesn't support local PostgreSQL (e.g., shared hosting), use one of these:

| Provider                | Free Tier           | Notes                          |
| :---------------------- | :------------------ | :----------------------------- |
| **Neon**                | 512 MB, 1 project   | Serverless, great for starters |
| **Supabase**            | 500 MB, 2 projects  | Includes auth/storage extras   |
| **Railway**             | $5 credit/month     | Simple provisioning            |
| **ElephantSQL**         | 20 MB (Tiny Turtle) | Very limited free tier         |
| **Aiven**               | 5 GB, 30-day trial  | Enterprise-grade               |

Update your `DATABASE_URL` to point to the external provider's connection string.

---

## Build & Deployment Steps

### First-Time Deployment

```bash
# 1. Clone the repository
git clone https://github.com/ThePaleArchitect/ksa_website.git
cd ksa_website

# 2. Install frontend dependencies
npm install --legacy-peer-deps

# 3. Install backend dependencies
cd backend && npm install && cd ..

# 4. Build the Vue frontend → produces dist/
npm run build

# 5. Configure environment
cp backend/.env.example backend/.env
nano backend/.env   # Fill in all REQUIRED values

# 6. Run database migrations (creates tables automatically)
cd backend && npm run db:migrate && cd ..

# 7. Seed initial data (optional — creates admin account)
cd backend && npm run db:seed && cd ..

# 8. Start the server
cd backend && npm start
```

### Subsequent Deployments (Updates)

```bash
cd /path/to/ksa_website

# Pull latest changes
git pull origin main

# Reinstall dependencies (in case they changed)
npm install --legacy-peer-deps
cd backend && npm install && cd ..

# Rebuild frontend
npm run build

# Run any new migrations
cd backend && npm run db:migrate && cd ..

# Restart the server
pm2 restart ksa-valuers
```

> [!TIP]
> You can use the included `deploy.sh` script to automate the install and build steps:
> ```bash
> chmod +x deploy.sh && ./deploy.sh
> ```

---

## Process Management

### Using PM2 (Recommended for VPS)

PM2 keeps your Node.js app alive, restarts on crash, and manages logs.

```bash
# Start the app with PM2
cd /path/to/ksa_website/backend
pm2 start server.js --name "ksa-valuers" --env production

# Save the process list (survives reboots)
pm2 save

# Enable PM2 to start on system boot
pm2 startup
# (Follow the command it prints)

# Useful PM2 commands
pm2 status              # Check running processes
pm2 logs ksa-valuers    # View live logs
pm2 restart ksa-valuers # Restart the app
pm2 stop ksa-valuers    # Stop the app
pm2 monit               # Real-time monitoring dashboard
```

### PM2 Ecosystem File (Optional)

Create `ecosystem.config.js` in the project root for advanced configuration:

```js
module.exports = {
  apps: [{
    name: 'ksa-valuers',
    script: './backend/server.js',
    cwd: __dirname,
    instances: 1,             // Use 'max' for cluster mode on multi-core VPS
    exec_mode: 'fork',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    max_memory_restart: '500M',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    merge_logs: true
  }]
};
```

Then start with:
```bash
pm2 start ecosystem.config.js --env production
```

---

## Reverse Proxy & SSL (Nginx)

### Nginx Configuration

Create `/etc/nginx/sites-available/ksa-valuers`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP → HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (managed by Certbot)
    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 256;

    # Proxy all traffic to Node.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static assets served by Express
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Enable the Site & Install SSL

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/ksa-valuers /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Install Certbot for free SSL
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically. Verify with:
sudo certbot renew --dry-run
```

---

## Domain & DNS Configuration

Point your domain to your VPS IP address:

| Record Type | Host    | Value             | TTL   |
| :---------- | :------ | :---------------- | :---- |
| **A**       | `@`     | `YOUR_VPS_IP`     | 3600  |
| **A**       | `www`   | `YOUR_VPS_IP`     | 3600  |
| **CNAME**   | `www`   | `yourdomain.com`  | 3600  |

> [!NOTE]
> If using Hostinger's DNS manager, update these records in hPanel → Domains → DNS Zone Editor. DNS propagation can take up to 48 hours.

---

## Post-Deployment Checklist

Run through this checklist after every deployment:

- [ ] `NODE_ENV` is set to `production`
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are unique, randomly generated strings
- [ ] `ADMIN_PASSWORD` meets the 12+ char complexity requirement
- [ ] `ALLOWED_ORIGINS` contains your production domain(s) with `https://`
- [ ] `DATABASE_URL` is correct and the database is accessible
- [ ] Frontend build exists (`dist/` directory is populated)
- [ ] Database migrations ran successfully (`npm run db:migrate`)
- [ ] SSL certificate is active (site loads over HTTPS)
- [ ] Nginx reverse proxy is forwarding traffic to port 3000
- [ ] PM2 is running and configured to start on boot
- [ ] API endpoints respond correctly: `curl https://yourdomain.com/api/properties`
- [ ] Frontend SPA routing works (navigate to `/about`, refresh — page should load)
- [ ] Admin login works at `/admin/login`
- [ ] Email sending is configured and tested (optional)
- [ ] Gemini AI endpoint responds (optional)

---

## Monitoring & Maintenance

### Log Management

```bash
# View PM2 logs
pm2 logs ksa-valuers --lines 100

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

### Database Backups

```bash
# Manual backup
pg_dump -U ksa_user -h localhost ksa_valuers > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backup (add to crontab)
crontab -e
# Add this line:
0 2 * * * pg_dump -U ksa_user ksa_valuers > /home/backups/ksa_$(date +\%Y\%m\%d).sql 2>&1
```

### Server Updates

```bash
# Keep the system updated
sudo apt update && sudo apt upgrade -y

# Update Node.js (via nvm)
nvm install 20 --reinstall-packages-from=current

# Update PM2
npm install -g pm2@latest
pm2 update
```

---

## Troubleshooting

| Problem                              | Solution                                                                                   |
| :----------------------------------- | :----------------------------------------------------------------------------------------- |
| `EADDRINUSE: port 3000`              | Another process is using port 3000. Kill it: `lsof -ti:3000 \| xargs kill -9`              |
| `ECONNREFUSED` on database           | Check PostgreSQL is running: `sudo systemctl status postgresql`                            |
| CORS errors in browser               | Verify `ALLOWED_ORIGINS` in `.env` matches your exact domain (include `https://`)          |
| 502 Bad Gateway (Nginx)              | Node.js app isn't running. Check: `pm2 status` and `pm2 logs`                             |
| SPA routes return 404                | Ensure `NODE_ENV=production` is set — this activates the SPA fallback in `server.js`       |
| Admin login fails                    | Reset by updating `ADMIN_PASSWORD` in `.env` and restarting the server                     |
| SSL certificate not renewing         | Check Certbot timer: `sudo systemctl status certbot.timer`                                 |
| `npm install` fails on VPS           | May need more RAM. Add swap: `sudo fallocate -l 2G /swapfile && sudo mkswap /swapfile`     |

---

## Alternative Providers

This project works on any Node.js hosting that supports PostgreSQL:

| Provider              | Type          | Starting Price | Notes                             |
| :-------------------- | :------------ | :------------- | :-------------------------------- |
| **Hostinger VPS**     | VPS           | ~$5/mo         | Best value, full control          |
| **Railway**           | PaaS          | Usage-based    | Easy deploys, built-in PostgreSQL |
| **Render**            | PaaS          | Free tier      | Auto-deploys from GitHub          |
| **DigitalOcean**      | VPS/App Plat  | $6/mo          | Reliable, great docs              |
| **Fly.io**            | PaaS          | Free tier      | Edge deployments                  |
| **AWS Lightsail**     | VPS           | $5/mo          | AWS ecosystem                     |
| **Hetzner**           | VPS           | €4/mo          | European hosting, great value     |

---

*Last updated: July 2025*
