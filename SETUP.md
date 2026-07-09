# 🚀 KSA Valuers - Complete Setup Guide

Welcome! This guide will walk you through setting up and running the KSA Valuers website on your local computer from scratch. Even if you have little to no technical experience, you can get this running by following these steps.

---

## 📋 Table of Contents
1. [Prerequisites (Programs to Install)](#1-prerequisites-programs-to-install)
2. [Setting Up the Database](#2-setting-up-the-database)
3. [Configuring Environment Settings (.env)](#3-configuring-environment-settings-env)
4. [Setting Up Admin Credentials](#4-setting-up-admin-credentials)
5. [Configuring Email Notifications (Optional)](#5-configuring-email-notifications-optional)
6. [Starting the Application](#6-starting-the-application)
7. [How to Use the Application](#7-how-to-use-the-application)
8. [Troubleshooting Common Issues](#8-troubleshooting-common-issues)

---

## 1. Prerequisites (Programs to Install)

Before running the website, you must install two free software packages on your computer:

### A. Node.js (Application Runner)
Node.js allows the website server to run on your machine.
1. Download Node.js from the official site: **[https://nodejs.org/en](https://nodejs.org/en)** (Choose the **LTS** version).
2. Run the downloaded installer and click **Next** through the setup prompts with default options.
3. Verify it is installed: Open your terminal (called Command Prompt or PowerShell on Windows, or Terminal on Mac) and type:
   ```bash
   node --version
   ```
   *If you see a version number (like `v20.x.x`), you are good to go!*

### B. PostgreSQL (Database)
PostgreSQL is the database program that stores all listings, bookings, and user accounts.
1. Download PostgreSQL from: **[https://www.postgresql.org/download/](https://www.postgresql.org/download/)** (Choose your operating system: Windows, macOS, or Linux).
2. Run the installer:
   - Keep the default installation directory.
   - Select all components (including **pgAdmin 4**, which is a graphical screen to view your database).
   - **Important**: The installer will ask you to set a password for the database database owner (default user is `postgres`). **Write down this password!** You will need it later.
   - Use the default port number `5432`.
   - Click next to finish.

---

## 2. Setting Up the Database

Now we need to create a database container called `ksa_valuers` inside PostgreSQL.

### Option A: Using pgAdmin (Graphical User Interface - Easiest)
1. Open **pgAdmin 4** (search for it in your computer's applications).
2. On the left side, double-click **Servers** to expand the list.
3. It will ask for the password you set during the installation. Enter it and check the box to save the password.
4. Right-click on **Databases** -> **Create** -> **Database...**
5. In the **Database** field, type: `ksa_valuers`
6. Click **Save**. *You have now created the database!*

### Option B: Using Command Line (Fastest)
1. Open your terminal.
2. Run this command to log into PostgreSQL (it will prompt for your PostgreSQL password):
   ```bash
   psql -U postgres
   ```
3. Once logged in (you will see a `postgres=#` prompt), type:
   ```sql
   CREATE DATABASE ksa_valuers;
   ```
4. Exit by typing:
   ```sql
   \q
   ```

---

## 3. Configuring Environment Settings (.env)

The application reads configurations (like database passwords and keys) from a file named `.env`.

1. Go to the `backend/` folder of this project.
2. Look for a file named `.env.example`.
3. Make a copy of that file in the same folder and rename the copy to exactly `.env` (make sure it doesn't end with `.txt`).
4. Open the new `.env` file in any text editor (like Notepad on Windows or TextEdit on Mac) and configure the following variables:

```ini
# 1. Database Connection String
# Replace "your_postgres_password" with the password you set when installing PostgreSQL
DATABASE_URL=postgresql://postgres:your_postgres_password@localhost:5432/ksa_valuers

# 2. Server Environment (Keep as development for local testing)
NODE_ENV=development
PORT=3000

# 3. Security keys (Use any long random text string)
JWT_SECRET=your-random-long-security-key-phrase
JWT_REFRESH_SECRET=another-different-random-security-key-phrase
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# 4. Admin Initial Password (REQUIRED - See rules in Section 4 below)
ADMIN_PASSWORD=SetSecureAdminPass123!
```

---

## 4. Setting Up Admin Credentials

To prevent security vulnerabilities, the application requires you to define a secure password for the admin account in the `.env` file before starting.

### Password Rules
Your `ADMIN_PASSWORD` variable in `.env` must meet these conditions:
*   Must be at least **12 characters long**
*   Must contain at least one **UPPERCASE** letter (`A-Z`)
*   Must contain at least one **lowercase** letter (`a-z`)
*   Must contain at least one **number** (`0-9`)
*   Must contain at least one **special character** (`!@#$%^&*` etc.)

*Example of a valid password:* `SecurePass2026!`
*Example of an invalid password:* `admin123` (too short, no uppercase or special characters)

On the first launch, the server will automatically create the admin account with:
*   **Email Address:** `admin@ksavaluers.com`
*   **Password:** The secure password you set in the `ADMIN_PASSWORD` variable.

---

## 5. Configuring Email Notifications (Optional)

The website can send booking confirmation emails to customers and new appointment alerts to the admin. If you want to enable this, edit the email settings in the `.env` file:

```ini
# Choose your provider: gmail, smtp, sendgrid, or aws-ses
EMAIL_PROVIDER=gmail

# If using Gmail, input your address and a Gmail App Password
# (Note: Google requires a Gmail "App Password" generated in your Google account settings, not your regular password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop

# Set where admin alerts are sent
ADMIN_EMAIL=info@ksavaluers.com
EMAIL_FROM=noreply@ksavaluers.com
```

---

## 6. Starting the Application

Once you have installed the software, created the database, and configured the `.env` file, you can launch the app.

1. Open your terminal and navigate to the project directory.
2. Install the necessary dependencies (run this once):
   ```bash
   npm install
   ```
3. Run the database migration script to prepare tables and create your admin account (run this once):
   ```bash
   npm run db:setup
   ```
   *You should see output indicating successful database migrations and seeding of the admin user.*
4. Start both the frontend and backend together with one command:
   ```bash
   npm run dev:all
   ```
   *(Alternatively, if `dev:all` is not configured, run `npm run dev` in the root directory).*

---

## 7. How to Use the Application

Once the command is running, you can access the application via your web browser:

*   **Public Website:** **[http://localhost:5173](http://localhost:5173)**
    *   Browse property listings, search/filter ongoing projects, fill out contact forms, or schedule property tours.
*   **Admin Panel:** **[http://localhost:5173/admin/login](http://localhost:5173/admin/login)**
    *   Log in using:
        *   **Email:** `admin@ksavaluers.com`
        *   **Password:** (The password you set in `ADMIN_PASSWORD` in your `.env` file).
    *   **Self-Service Sign Up:** Alternatively, click the **Sign Up** tab on the login interface to dynamically register a new admin or agent account.
    *   Once logged in, you can create/modify property listings, update project completion percentages, manage scheduled tours, and view administrative audit logs.

---

## 8. Troubleshooting Common Issues

### ❌ Error: "Database connection failed"
*   **Why**: PostgreSQL is either not running, or your connection settings in `.env` are wrong.
*   **Fix**:
    1. Make sure PostgreSQL is started. On Windows, open the **Services** app and check if "postgresql" is listed as "Running". On Mac, run: `brew services start postgresql`.
    2. Check the `DATABASE_URL` line in your `.env` file. Ensure the password and port (`5432`) are correct, and there are no extra spaces.

### ❌ Error: "ADMIN_PASSWORD does not meet security requirements"
*   **Why**: The password you typed in `.env` is too short or simple.
*   **Fix**: Update the `ADMIN_PASSWORD` line in `backend/.env` to be at least 12 characters and contain a mix of uppercase, lowercase, numbers, and special characters (e.g., `@`, `!`, `#`).

### ❌ Port 3000 (or 5173) is already in use
*   **Why**: Another application (or an old run of the website server) is still running.
*   **Fix**: Close all terminal windows and open a fresh one. If that fails, restart your computer to clear any locked ports.
