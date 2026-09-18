# 🚀 Hostinger Subdomain Deployment Guide: Decoupled Architecture

This guide explains how to deploy **KSA Valuers** on Hostinger with the frontend running at `https://ksavaluers.com` and the backend running at `https://api.ksavaluers.com`.

---

## 🏗️ Architecture Overview

```
[ Visitor Browser ]
     │
     ├──► Static SPA (HTML/JS/CSS) ──► Hostinger Domain (ksavaluers.com)
     │                                 [ Root public_html Folder ]
     │
     └──► REST API Requests (Axios) ─► Hostinger Subdomain (api.ksavaluers.com)
          (withCredentials: true)     [ Hostinger Node.js App Server ]
                                                │
                                                └──► PostgreSQL Database
```

---

1. **Create Subdomain in Hostinger**:
   - Go to **Hostinger hPanel** -> **Websites** -> **Subdomains**.
   - Subdomain name: `api` (for domain `ksavaluers.com`).
   - Checkbox settings:
     - **Custom folder for subdomain**: ✅ Checked (Hostinger will create a dedicated folder `public_html/api` or `api.ksavaluers.com` to isolate backend files).
     - **Use public_html directory**: ✅ Checked (or leave checked as default, Hostinger's Node.js Manager will automatically proxy traffic to the running Express app port).
   - Click **Create**.

2. **Monorepo vs. Separate Repositories**:
   - You do **NOT** need to split into 2 separate git repositories!
   - Keeping a single monorepo (`src/` for frontend, `backend/` for API) is standard practice.
   - When deploying:
     - **Frontend**: Upload only the compiled output (`dist/` folder contents) to `public_html/` for `ksavaluers.com`.
     - **Backend**: Point Hostinger's Node.js App startup file to `backend/server.js` inside the subdomain folder.

3. **Configure Node.js Application**:
   - Go to **hPanel** -> **Node.js** (or Advanced -> Node.js App).
   - Set **Application Root**: Subdomain folder (`public_html/api` or repository root).
   - Set **Application Startup File**: `backend/server.js`.
   - Set **Node.js Version**: 18.x or 20.x.

3. **Set Production Environment Variables**:
   In Hostinger Node.js Environment Configuration, set:

   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgres://your_db_user:your_db_password@your_db_host:5432/ksa_valuers
   JWT_SECRET=your_strong_random_jwt_secret_key_32_chars
   JWT_REFRESH_SECRET=your_strong_random_refresh_secret_key_32_chars
   ALLOWED_ORIGINS=https://ksavaluers.com,https://www.ksavaluers.com
   COOKIE_DOMAIN=.ksavaluers.com
   COOKIE_SAMESITE=none
   ADMIN_EMAIL=admin@ksavaluers.com
   ADMIN_PASSWORD=YourSecureAdminPassword!
   GEMINI_API_KEY=your_gemini_key_if_used
   ```

4. **Install Backend Dependencies & Start App**:
   - Run `npm install` in the app root directory.
   - Run database migrations: `npm run db:migrate`.
   - Start the Node.js application.

---

## Step 2: Frontend Deployment (`ksavaluers.com`)

1. **Build the Production Frontend**:
   On your local machine or build pipeline, set the environment variable pointing to your live backend API:

   ```bash
   # Create a .env.production file or set inline:
   VITE_API_BASE_URL=https://api.ksavaluers.com
   ```

   Run the build command:
   ```bash
   npm run build
   ```
   This generates the compiled static assets in the `dist/` directory.

2. **Upload `dist/` Assets to Hostinger**:
   - Upload all contents inside `dist/` (e.g. `index.html`, `assets/`, `favicon.ico`) directly into your primary domain's `public_html` folder on Hostinger.

3. **Verify SPA Rewrite (`public/.htaccess`)**:
   Ensure `public_html/.htaccess` contains SPA fallback routing:

   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 🔒 Verification Checklist

- [ ] Visit `https://api.ksavaluers.com/api/health` -> should return `{"status":"ok","environment":"production"}`.
- [ ] Visit `https://ksavaluers.com` -> page loads static Vue SPA cleanly.
- [ ] Log in at `https://ksavaluers.com/admin/login` -> browser issues cross-subdomain request to `https://api.ksavaluers.com/api/v1/auth/login`.
- [ ] Inspect cookies in DevTools (`Application -> Cookies`) -> `ksa_access` and `ksa_refresh` have domain `.ksavaluers.com` and `SameSite=None; Secure`.
