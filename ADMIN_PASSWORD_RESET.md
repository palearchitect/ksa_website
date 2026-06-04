# Admin Password Management

## Initial Setup

When the KSA Valuers application starts for the first time, it requires an `ADMIN_PASSWORD` environment variable to create the admin user account.

### Password Requirements

The admin password must be at least **12 characters** and contain:
- ✅ Uppercase letters (A-Z)
- ✅ Lowercase letters (a-z)
- ✅ Numbers (0-9)
- ✅ Special characters (!@#$%^&* etc.)

### Example Secure Passwords

- `MySecureAdmin_2024!`
- `KSAValuers@2024Admin`
- `P@ssw0rd!SecureKey123`

### NOT Acceptable

❌ `password123` - No uppercase, special chars
❌ `MyPassword` - No numbers, special chars
❌ `Pass1!` - Too short (< 12 chars)
❌ `MyPassword123` - No special chars

## Setting Up the Admin Password

### 1. First-Time Setup

Create a `.env` file in the `backend/` directory:

```bash
# backend/.env
DATABASE_URL=postgres://user:password@localhost:5432/ksa_valuers
NODE_ENV=development
ADMIN_PASSWORD=MySecureAdmin_2024!
```

### 2. Start the Server

```bash
cd backend
npm install
npm run db:setup  # Runs migrations and seeds admin user
npm start
```

You should see:
```
✅ Seeded admin user (admin@ksavaluers.com)
⚠️  Keep your ADMIN_PASSWORD secure. Do not share it or commit it to version control.
```

### 3. Log In

Navigate to `http://localhost:5173/admin/login` and enter:
- **Email:** `admin@ksavaluers.com`
- **Password:** (whatever you set in `ADMIN_PASSWORD`)

## Resetting the Admin Password

If you forget the admin password or need to change it, follow these steps:

### Option 1: Via Database (Recommended for Development)

1. Connect to your PostgreSQL database:
```bash
psql postgres://user:password@localhost:5432/ksa_valuers
```

2. Generate a bcrypt hash of your new password:
```bash
node -e "console.log(require('bcryptjs').hashSync('MyNewPassword_2024!', 12))"
```
This will output something like: `$2a$12$abcd1234...`

3. Update the password in the database:
```sql
UPDATE users SET password_hash = '$2a$12$your_hash_here' WHERE email = 'admin@ksavaluers.com';
```

4. Verify the update:
```sql
SELECT email, password_hash FROM users WHERE role = 'admin';
```

### Option 2: Re-seed the Admin User (Nuclear Option)

**Warning:** This will reset the admin user to the password in your `ADMIN_PASSWORD` env var.

1. Update `ADMIN_PASSWORD` in `backend/.env`:
```
ADMIN_PASSWORD=MyNewSecurePassword_2024!
```

2. Delete the existing admin user from the database:
```sql
DELETE FROM users WHERE email = 'admin@ksavaluers.com';
```

3. Restart the server:
```bash
npm start
```

The server will automatically re-create the admin user with the new password.

### Option 3: CLI Script (Future Enhancement)

Future versions should include a CLI script:
```bash
npm run admin:reset-password -- --email=admin@ksavaluers.com --password=MyNewPassword_2024!
```

## Production Deployment

### Using Environment Variables

In production, use a secure secrets manager (not `.env` files):

#### AWS Secrets Manager
```bash
aws secretsmanager create-secret \
  --name ksa-valuers/admin-password \
  --secret-string "MySecureAdmin_2024!"
```

Then in your application startup:
```bash
ADMIN_PASSWORD=$(aws secretsmanager get-secret-value \
  --secret-id ksa-valuers/admin-password \
  --query SecretString --output text)
```

#### Heroku
```bash
heroku config:set ADMIN_PASSWORD=MySecureAdmin_2024! --app your-app-name
```

#### DigitalOcean App Platform
Set via the Dashboard → Settings → Environment Variables

### Password Rotation Policy

Best practices for production:

1. **Change password every 90 days**
   - Set a calendar reminder
   - Use a password manager to generate new secure passwords
   - Update your secrets manager

2. **After each password change:**
   - Update the secrets manager
   - Notify relevant team members
   - Document the change in your security log

3. **On employee departure:**
   - Immediately reset the admin password
   - Use a new secure password
   - Revoke access to secrets manager

## Troubleshooting

### "ADMIN_PASSWORD environment variable is not set"

The server requires `ADMIN_PASSWORD` to be set. Add it to your `.env`:
```bash
ADMIN_PASSWORD=MySecurePassword_2024!
```

### "ADMIN_PASSWORD does not meet security requirements"

Your password doesn't meet the policy. Example that works:
```
✅ MySecureAdmin_2024!
   - 19 characters (> 12)
   - Has uppercase: M, S, A
   - Has lowercase: y, e, c, u, r, e, d, m, i, n
   - Has numbers: 2, 0, 2, 4
   - Has special char: !
```

### "Login failed with admin@ksavaluers.com"

1. Verify the password matches your `ADMIN_PASSWORD` env var
2. Check if the admin user exists:
```sql
SELECT email, role FROM users WHERE email = 'admin@ksavaluers.com';
```
3. If missing, restart the server to trigger re-seeding
4. If password is wrong, use "Resetting the Admin Password" steps above

## Security Best Practices

✅ **DO:**
- Use a strong, unique password (12+ chars, mixed case, numbers, special chars)
- Store password in a secure secrets manager
- Rotate password every 90 days
- Never commit `.env` files with passwords to Git
- Use HTTPS in production
- Enable 2FA (when implemented)

❌ **DON'T:**
- Reuse the same password across services
- Share the admin password in emails or chat
- Hardcode passwords in the application
- Use simple passwords like "password123"
- Leave default passwords in production
- Store passwords in plain text files

## Support

For password reset assistance or security concerns, contact your system administrator or the development team.
