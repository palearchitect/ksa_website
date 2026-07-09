# Email Service Configuration Guide

This guide explains how to configure the KSA Valuers email service with multiple provider options.

## 📋 Supported Email Providers

1. **Gmail** (default)
2. **Custom SMTP Server**
3. **SendGrid API**
4. **AWS SES (Simple Email Service)**

---

## 🚀 Quick Start

### Gmail (Default)

The simplest option for development/testing.

**1. Generate Gmail App Password:**
- Go to https://myaccount.google.com/apppasswords
- Select "Mail" and "Windows Computer" (or your device)
- Generate a 16-character password
- Copy the password

**2. Update `.env`:**
```bash
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

**3. Test:**
```bash
npm run dev
# Should show: ✅ Email service ready (gmail)
```

---

## 📧 SMTP (Custom Email Server)

Use your own domain's SMTP server.

**1. Get SMTP Credentials:**
From your email provider (Zoho, FastMail, your company's mail server, etc.):
- SMTP Host: `smtp.example.com`
- SMTP Port: `587` or `465`
- Username: your email
- Password: your email password
- Use TLS: Yes (port 587) or SSL (port 465)

**2. Update `.env`:**
```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-password
ADMIN_EMAIL=admin@example.com
```

**3. Test:**
```bash
npm run dev
# Should show: ✅ Email service ready (smtp)
```

---

## 🚀 SendGrid API

Scalable email service with detailed analytics.

**1. Create SendGrid Account:**
- Sign up at https://sendgrid.com
- Create an API key with Mail Send permission
- Copy the API key (save it - it won't be shown again)

**2. Update `.env`:**
```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your-api-key-here
EMAIL_USER=your-email@example.com
ADMIN_EMAIL=admin@ksavaluers.com
```

**3. Verify Sender Email:**
- In SendGrid dashboard → Settings → Sender Authentication
- Verify your domain or single sender email
- Wait for verification (usually 5-10 minutes)

**4. Test:**
```bash
npm run dev
# Should show: ✅ Email service ready (sendgrid)
```

---

## ☁️ AWS SES (Simple Email Service)

Production-grade service with cost-effective pricing.

**1. Set Up AWS Account:**
- Create AWS account: https://aws.amazon.com
- Navigate to SES (Simple Email Service)
- Region: Choose closest to your location
- Add verified email addresses or domain

**2. Create IAM User:**
- Go to IAM → Users → Create User
- Name: `ksa-ses-user`
- Attach Policy: `AmazonSESFullAccess`
- Create Access Key
- Save: Access Key ID and Secret Access Key

**3. Verify Email/Domain in SES:**
```bash
# For email verification:
# Email Address → Verify Email Address
# Click link in verification email

# OR for domain verification:
# Domain → Verify Domain
# Add DKIM/SPF records to your DNS
```

**4. Update `.env`:**
```bash
EMAIL_PROVIDER=aws-ses
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEM...
AWS_SES_REGION=us-east-1
ADMIN_EMAIL=admin@yourdomain.com
```

**5. Request Production Access:**
- By default, AWS SES is in "Sandbox Mode" (limits sending)
- To send to any email: Request production access in SES Console
- Usually approved within 24 hours

**6. Test:**
```bash
npm run dev
# Should show: ✅ Email service ready (aws-ses)
```

---

## 🛠️ Advanced Configuration

### Email Retry Settings

Configure retry behavior for failed emails:

```bash
# backend/.env

# Number of retry attempts (default: 3)
EMAIL_RETRY_ATTEMPTS=3

# Delay between retries in milliseconds (default: 1000)
EMAIL_RETRY_DELAY=1000
```

Retry uses exponential backoff:
- Attempt 1: Immediate
- Attempt 2: Wait 1000ms (1 second)
- Attempt 3: Wait 2000ms (2 seconds)
- If all fail: Error returned to client

### Custom From Address

```bash
# Override the sender email
EMAIL_FROM=custom-sender@example.com
```

---

## 📝 Testing Email Configuration

**Test email connection without sending:**

```bash
curl -X GET http://localhost:3000/api/health
```

Response shows email status:
```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "email": "configured"
}
```

**Test sending contact form:**

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "recipient@example.com",
    "subject": "Test Email",
    "message": "This is a test email"
  }'
```

**Test booking confirmation:**

```bash
curl -X POST http://localhost:3000/email/booking-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "booking": {
      "name": "John Doe",
      "email": "john@example.com",
      "bookingId": "BOOK-123456",
      "propertyTitle": "Modern Villa",
      "date": "2026-06-15",
      "time": "14:00",
      "location": "Ikoyi, Lagos"
    }
  }'
```

---

## 🐛 Troubleshooting

### "Email service not configured"

**Problem:** Email endpoints return 503 error

**Solution:**
1. Check `EMAIL_PROVIDER` is set in `.env`
2. Check required credentials for that provider
3. Restart backend: `npm run dev`
4. Check logs for specific error message

### "Failed to authenticate"

**Gmail:**
- Use app-specific password, not regular password
- Regenerate app password
- Check Gmail account allows "Less Secure Apps" or use app passwords

**SMTP:**
- Verify host/port/username/password
- Check TLS/SSL settings (port 587 = TLS, 465 = SSL)
- Some providers require less secure apps: Enable in account settings

**SendGrid:**
- Verify API key is correct (starts with `SG.`)
- Check sender email is verified in SendGrid
- Confirm account has email sending quota

**AWS SES:**
- Verify sender email in SES console
- Request sandbox mode exit for production
- Check IAM user has `AmazonSESFullAccess` policy
- Verify AWS region matches one with email sender verified

### "Connection timeout"

**Problem:** Email service times out

**Solutions:**
- Check internet connection
- Verify firewall allows outbound on SMTP ports (25, 587, 465)
- For AWS SES: Verify region is correct
- Increase retry settings in `.env`:
  ```bash
  EMAIL_RETRY_DELAY=3000
  EMAIL_RETRY_ATTEMPTS=5
  ```

### "Cannot find module 'aws-sdk'"

**Problem:** AWS SES throws module not found error

**Solution:** Install AWS SDK:
```bash
cd backend
npm install aws-sdk
```

---

## 📊 Email Templates

The system includes pre-built templates:

1. **contact-confirmation** - Confirmation to user who submitted contact form
2. **booking-confirmation** - Property viewing confirmation
3. **admin-notification** - Alert to admin of new bookings/contact
4. **password-reset** - Password reset link
5. **welcome** - Welcome email for new users

All templates are professionally designed with HTML formatting.

---

## 🔒 Security Best Practices

### Development (Gmail)
✅ Use app-specific passwords
✅ Store in `.env` (never commit)
✅ Regenerate if leaked

### Production (AWS SES / SendGrid)
✅ Use cloud provider's managed credentials
✅ Store in environment variables (Heroku Config Vars, AWS Secrets Manager)
✅ Enable Domain/DKIM verification
✅ Monitor email delivery in provider dashboard
✅ Set up bounce/complaint handling

### General
✅ Never commit `.env` to git
✅ Use separate credentials for dev/prod
✅ Rotate passwords periodically
✅ Enable 2FA on email provider accounts
✅ Monitor email logs for suspicious activity

---

## 📈 Production Deployment

### Heroku
```bash
# Set environment variables
heroku config:set EMAIL_PROVIDER=sendgrid
heroku config:set SENDGRID_API_KEY=SG.xxx
heroku config:set EMAIL_FROM=noreply@yourdomain.com

# Or use AWS SES
heroku config:set EMAIL_PROVIDER=aws-ses
heroku config:set AWS_ACCESS_KEY_ID=AKIA...
heroku config:set AWS_SECRET_ACCESS_KEY=xxx
heroku config:set AWS_SES_REGION=us-east-1
```

### Docker
```dockerfile
# In Dockerfile
ENV EMAIL_PROVIDER=sendgrid
ENV SENDGRID_API_KEY=${SENDGRID_API_KEY}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
```

### Environment Variable Checklist

- [ ] EMAIL_PROVIDER is set
- [ ] All required credentials for provider are set
- [ ] ADMIN_EMAIL is set to valid email
- [ ] EMAIL_FROM is set to verified sender address
- [ ] No credentials in git history (use `git-secrets`)
- [ ] Credentials stored in secure secrets manager
- [ ] Test email delivery before going live

---

## 💡 Tips

1. **Test with Gmail first** - Easiest to set up quickly
2. **Use SendGrid for production** - Better deliverability and support
3. **Enable email logging** - Monitor `/api/status` endpoint for delivery stats
4. **Set up bounce handling** - Configure provider to handle bounces
5. **Use email templates** - Professional appearance, consistent branding
6. **Monitor sender reputation** - High bounce/complaint rates hurt deliverability

---

## 📚 Additional Resources

- [SendGrid Documentation](https://docs.sendgrid.com)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SMTP Configuration Guide](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)
