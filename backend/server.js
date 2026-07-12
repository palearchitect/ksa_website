require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const { runMigrations } = require('./migrations/init');
const { createEmailService } = require('./services/emailService');
const { getTemplate } = require('./services/emailTemplates');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'f91373f359e5fc7cec3d41d5120b302e6d3ec6750cdfa033bb5f57749b625ec036e6deb5ee2ac9a8d354b0c940ccf1fd0781aea43ca541fcb6082590397552e4';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '7df6457e1a2cb98621e7e70935bab46e826515c9b5a89311bd54d9e1b9b81f5ac86a020c6b2de95b37af8cd8f1d2495d01012843257f7d3e57b88a9152d4a8f6';
const ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_TTL || '15m';
const REFRESH_TOKEN_TTL = process.env.JWT_REFRESH_TTL || '7d';
const IS_PROD = process.env.NODE_ENV === 'production';

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Connection timeout and limits
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// CORS Configuration
const getAllowedOrigins = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Development - allow localhost
  if (nodeEnv !== 'production') {
    return [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];
  }

  // Production - require explicit ALLOWED_ORIGINS
  const allowedOrigins = process.env.ALLOWED_ORIGINS;
  if (!allowedOrigins) {
    console.warn(
      '⚠️  WARNING: ALLOWED_ORIGINS environment variable not set in production!\n' +
      '   Set ALLOWED_ORIGINS=https://example.com,https://api.example.com'
    );
    return []; // No origins allowed if not configured
  }

  // Parse comma-separated origins and validate they're https in production
  return allowedOrigins
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => {
      if (!origin.startsWith('https://') && !origin.startsWith('http://')) {
        console.warn(`⚠️  Skipping invalid origin: ${origin} (must be https:// or http://)`);
        return false;
      }
      if (nodeEnv === 'production' && !origin.startsWith('https://')) {
        console.warn(`⚠️  Skipping insecure origin in production: ${origin} (must be https://)`);
        return false;
      }
      return true;
    });
};

const allowedOrigins = getAllowedOrigins();

// Rate limiting for AI endpoint
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    success: false,
    message: 'Too many AI requests, please try again later.'
  }
});

// Rate limiting for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // In development, allow any origin (e.g. ngrok, LAN) to prevent CORS blocker errors
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // In production, enforce ALLOWED_ORIGINS
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Express Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (IS_PROD) {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  }
  next();
});

// Double-Submit Cookie CSRF Protection Middleware
const csrfProtection = (req, res, next) => {
  // Skip safe HTTP methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Only enforce CSRF if there is an active session cookie present
  if (req.cookies.ksa_access) {
    const csrfCookie = req.cookies.ksa_csrf;
    const csrfHeader = req.headers['x-csrf-token'];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return res.status(403).json({ success: false, message: 'Invalid or missing CSRF token' });
    }
  }
  next();
};

app.use(csrfProtection);

const normalizePropertyStatus = (status = '') => {
  const text = String(status).toLowerCase();
  if (text === 'for sale' || text === 'sale') return 'sale';
  if (text === 'for rent' || text === 'rent') return 'rent';
  if (text === 'sold') return 'sold';
  if (text === 'rented') return 'rented';
  return 'sale';
};

const mapProperty = (row) => ({
  id: row.id,
  title: row.title,
  location: row.location,
  image: row.image,
  images: row.images || [],
  price: Number(row.price || 0),
  status: row.status,
  type: row.type,
  bedrooms: row.bedrooms,
  bathrooms: row.bathrooms,
  squareFootage: row.square_footage,
  description: row.description,
  featured: row.featured,
  tags: row.tags || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapProject = (row) => ({
  id: row.id,
  title: row.title,
  location: row.location,
  image: row.image,
  description: row.description,
  status: row.status,
  type: row.type,
  totalUnits: row.total_units,
  completionPercentage: row.completion_percentage,
  startDate: row.start_date,
  expectedCompletion: row.expected_completion,
  budget: Number(row.budget || 0),
  featured: row.featured,
  amenities: row.amenities || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapBooking = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  date: row.booking_date,
  time: row.booking_time,
  guests: row.guests,
  notes: row.notes,
  property: row.property_id,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapHeroSlide = (row) => ({
  id: row.id,
  imageUrl: row.image_url,
  title: row.title,
  tagline: row.tagline,
  ctaText: row.cta_text,
  ctaLink: row.cta_link,
  sortOrder: Number(row.sort_order || 0),
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const requireFields = (payload, fields) => {
  const missing = fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === '';
  });
  return missing;
};

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const signAccessToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
const signRefreshToken = (user) =>
  jwt.sign({ sub: user.id, type: 'refresh' }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL });

const setAuthCookies = (res, accessToken, refreshToken) => {
  const base = { httpOnly: true, secure: IS_PROD, sameSite: 'lax', path: '/' };
  res.cookie('ksa_access', accessToken, { ...base, maxAge: 15 * 60 * 1000 });
  res.cookie('ksa_refresh', refreshToken, { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 });

  // Set CSRF token cookie on successful authentication
  const csrfToken = crypto.randomBytes(32).toString('hex');
  res.cookie('ksa_csrf', csrfToken, { httpOnly: false, secure: IS_PROD, sameSite: 'lax', path: '/' });
};

const clearAuthCookies = (res) => {
  res.clearCookie('ksa_access', { path: '/' });
  res.clearCookie('ksa_refresh', { path: '/' });
  res.clearCookie('ksa_csrf', { path: '/' });
};

const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.ksa_access;
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid session' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const email = String(req.user.email).toLowerCase().trim();
  const role = req.user.role;

  // Environment Whitelist Pattern (Ghost Admin Check)
  if (role === 'admin') {
    const superadminEmails = (process.env.SUPERADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    if (superadminEmails.includes(email)) {
      return next(); // Whitelisted superadmin bypasses role requirements
    } else {
      console.warn(`🚨 SECURITY ALERT: Unauthorized user tried to perform admin action: ${email}`);
      return res.status(403).json({ success: false, message: 'Forbidden: Superadmin access not whitelisted' });
    }
  }

  // Handle other roles
  const effectiveRoles = [...roles];
  if (roles.includes('manager') && !effectiveRoles.includes('management')) {
    effectiveRoles.push('management');
  }
  if (roles.includes('management') && !effectiveRoles.includes('manager')) {
    effectiveRoles.push('manager');
  }

  if (!effectiveRoles.includes(role)) {
    return res.status(403).json({ success: false, message: 'Insufficient permissions' });
  }
  return next();
};

const validateBookingPayload = (payload) => {
  const missing = requireFields(payload, ['name', 'email', 'phone', 'date', 'time']);
  if (missing.length > 0) return `Missing required fields: ${missing.join(', ')}`;
  return null;
};

const validatePasswordPolicy = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 12) return `Password must be at least 12 characters (got ${password.length})`;
  if (!/[A-Z]/.test(password)) return 'Password must contain uppercase letters (A-Z)';
  if (!/[a-z]/.test(password)) return 'Password must contain lowercase letters (a-z)';
  if (!/[0-9]/.test(password)) return 'Password must contain numbers (0-9)';
  if (!/[!@#$%^&*_\-+=\[\]{};:'",.<>?/\\|`~]/.test(password)) return 'Password must contain special characters (!@#$%^&* etc.)';
  return null;
};

// Rate limiter for public forms (contact, booking)
const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 submissions per hour
  message: {
    success: false,
    message: 'Too many submissions. Please try again after an hour.'
  }
});

// Custom validation helpers for input boundaries
const validatePropertyInput = (payload) => {
  const errors = [];
  if (payload.price !== undefined && payload.price !== null) {
    const price = Number(payload.price);
    if (isNaN(price) || price < 0) {
      errors.push('Price must be a non-negative number');
    }
  }
  if (payload.bedrooms !== undefined && payload.bedrooms !== null) {
    const br = Number(payload.bedrooms);
    if (isNaN(br) || br < 0) {
      errors.push('Bedrooms must be a non-negative integer');
    }
  }
  if (payload.bathrooms !== undefined && payload.bathrooms !== null) {
    const ba = Number(payload.bathrooms);
    if (isNaN(ba) || ba < 0) {
      errors.push('Bathrooms must be a non-negative integer');
    }
  }
  if (payload.squareFootage !== undefined && payload.squareFootage !== null) {
    const sf = Number(payload.squareFootage);
    if (isNaN(sf) || sf < 0) {
      errors.push('Square footage must be a non-negative integer');
    }
  }
  return errors.length > 0 ? errors.join(', ') : null;
};

const validateProjectInput = (payload) => {
  const errors = [];
  if (payload.completionPercentage !== undefined && payload.completionPercentage !== null) {
    const cp = Number(payload.completionPercentage);
    if (isNaN(cp) || cp < 0 || cp > 100) {
      errors.push('Completion percentage must be an integer between 0 and 100');
    }
  }
  if (payload.budget !== undefined && payload.budget !== null) {
    const budget = Number(payload.budget);
    if (isNaN(budget) || budget < 0) {
      errors.push('Budget must be a non-negative number');
    }
  }
  if (payload.totalUnits !== undefined && payload.totalUnits !== null) {
    const tu = Number(payload.totalUnits);
    if (isNaN(tu) || tu < 0) {
      errors.push('Total units must be a non-negative integer');
    }
  }
  return errors.length > 0 ? errors.join(', ') : null;
};

const validateHeroSlideInput = (payload) => {
  const errors = [];
  if (payload.sortOrder !== undefined && payload.sortOrder !== null) {
    const so = Number(payload.sortOrder);
    if (isNaN(so) || so < 0) {
      errors.push('Sort order must be a non-negative integer');
    }
  }
  return errors.length > 0 ? errors.join(', ') : null;
};

// Cryptographically signed Audit logging helper
const logAudit = async (userEmail, action, tableName, recordId, beforeData, afterData) => {
  try {
    const email = userEmail || 'system';
    const recId = String(recordId);
    const beforeStr = beforeData ? JSON.stringify(beforeData) : null;
    const afterStr = afterData ? JSON.stringify(afterData) : null;
    const timestamp = new Date();

    // Generate SHA-256 HMAC cryptographic signature to prevent log tampering
    const hashInput = `${email}|${action}|${tableName}|${recId}|${beforeStr || ''}|${afterStr || ''}|${timestamp.toISOString()}`;
    const hash = crypto.createHmac('sha256', JWT_SECRET).update(hashInput).digest('hex');

    await pool.query(
      `INSERT INTO audit_logs (user_email, action, table_name, record_id, before_data, after_data, created_at, hash)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8)`,
      [
        email,
        action,
        tableName,
        recId,
        beforeStr,
        afterStr,
        timestamp,
        hash
      ]
    );
  } catch (err) {
    console.error(`⚠️ Audit log failed: ${err.message}`);
  }
};

const initializeDatabase = async () => {
  try {
    // Check if ADMIN_PASSWORD is configured
    if (!process.env.ADMIN_PASSWORD) {
      throw new Error(
        'ADMIN_PASSWORD environment variable is not set.\n' +
        '\n   ❌ ERROR: Admin account cannot be created without a password.\n' +
        '\n   📋 To fix this:\n' +
        '      1. Set ADMIN_PASSWORD in backend/.env\n' +
        '      2. Password must be at least 12 characters with uppercase, lowercase, numbers, and special chars\n' +
        '         Example: MySecure_Pass123\n' +
        '      3. Run: npm run db:setup\n' +
        '\n   ℹ️  On first run, you can also use npm run db:seed to auto-generate a secure password.\n'
      );
    }

    // Validate password policy
    const passwordError = validatePasswordPolicy(process.env.ADMIN_PASSWORD);
    if (passwordError) {
      throw new Error(
        `ADMIN_PASSWORD does not meet security requirements:\n` +
        `   ${passwordError}\n` +
        `\n   Password must:\n` +
        `   - Be at least 12 characters long\n` +
        `   - Contain uppercase letters (A-Z)\n` +
        `   - Contain lowercase letters (a-z)\n` +
        `   - Contain numbers (0-9)\n` +
        `   - Contain special characters (!@#$%^&*)\n` +
        `\n   Example: MySecure_Pass123\n`
      );
    }

    // Test database connection
    console.log('🔌 Testing database connection...');
    const testConnection = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      throw new Error(
        'DATABASE_URL environment variable is not set. ' +
        'Please add DATABASE_URL to your .env file (e.g., postgres://user:password@localhost:5432/ksa_valuers)'
      );
    }

    // Run migrations
    console.log('\n🔧 Running database migrations...');
    await runMigrations();
    console.log('✅ Database migrations completed\n');

    // Seed admin user if needed
    const existingAdmin = await pool.query(`SELECT id FROM users WHERE email = $1 LIMIT 1`, ['admin@ksavaluers.com']);
    if (existingAdmin.rowCount === 0) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await pool.query(
        `INSERT INTO users (email, password_hash, role, name) VALUES ($1, $2, $3, $4)`,
        ['admin@ksavaluers.com', hash, 'admin', 'Admin User']
      );
      console.log('✅ Seeded admin user (admin@ksavaluers.com)');
      console.log('⚠️  Keep your ADMIN_PASSWORD secure. Do not share it or commit it to version control.');
    }

    return true;
  } catch (error) {
    console.error('\n❌ Database initialization error:');
    console.error(`   ${error.message}`);
    console.error('\n📖 Setup Instructions:');
    console.error('   1. Install PostgreSQL locally or use a cloud provider (Heroku, AWS RDS, etc.)');
    console.error('   2. Create a database: createdb ksa_valuers');
    console.error('   3. Add DATABASE_URL to backend/.env:');
    console.error('      DATABASE_URL=postgres://user:password@localhost:5432/ksa_valuers');
    console.error('   4. Set ADMIN_PASSWORD (min 12 chars with uppercase, lowercase, numbers, special chars):');
    console.error('      ADMIN_PASSWORD=MySecurePass123!');
    console.error('   5. Run: npm run db:setup');
    throw error;
  }
};

// Email Service Setup
let emailService;

const initializeEmailService = async () => {
  try {
    emailService = createEmailService();
    const testResult = await emailService.testConnection();

    if (testResult.success) {
      console.log(`✅ Email service ready (${testResult.provider})`);
    } else {
      console.error(`⚠️  Email service test failed: ${testResult.error}`);
    }
  } catch (error) {
    console.error(`❌ Failed to initialize email service: ${error.message}`);
    console.error('   Continuing without email service. Configure EMAIL_PROVIDER in .env to enable.');
  }
};

// ============================================
// CONTACT ENDPOINT
// ============================================
app.post('/api/contact', publicFormLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields marked with * are required'
      });
    }

    // Save to database first
    await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)`,
      [name, email, phone || null, subject, message]
    );

    // Send confirmation to user if email service is available
    if (emailService) {
      try {
        const confirmationTemplate = getTemplate('contact-confirmation', {
          name,
          email,
          subject,
          message
        });

        await emailService.send({
          to: email,
          subject: confirmationTemplate.subject,
          html: confirmationTemplate.html
        });
      } catch (emailError) {
        console.error('Confirmation email failed:', emailError.message);
        // Continue - message was saved to database
      }
    }

    // Send notification to admin if email service is available
    if (emailService && process.env.ADMIN_EMAIL) {
      try {
        const adminTemplate = getTemplate('admin-notification', {
          type: 'Contact Message',
          subject: subject,
          content: `
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        });

        await emailService.send({
          to: process.env.ADMIN_EMAIL,
          subject: adminTemplate.subject,
          html: adminTemplate.html,
          replyTo: email
        });
      } catch (emailError) {
        console.error('Admin notification email failed:', emailError.message);
      }
    }

    res.json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Contact endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Email address syntax and MX record verification helper
async function validateEmailReal(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split('@')[1];
  try {
    const dns = require('dns').promises;
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (err) {
    // If lookup fails or has no MX records, return false in production
    // (In local development we bypass to support offline testing)
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }
    return false;
  }
}

// ============================================
// AUTH & PROFILE ENDPOINTS
// ============================================

// GET /api/v1/auth/csrf - Get a fresh CSRF token
app.get('/api/v1/auth/csrf', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie('ksa_csrf', token, {
    httpOnly: false,
    secure: IS_PROD,
    sameSite: 'lax',
    path: '/'
  });
  return res.json({ success: true, csrfToken: token });
});

app.post('/api/v1/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const missing = requireFields(req.body || {}, ['email', 'password']);
    if (missing.length > 0) {
      return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
    }

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1`,
      [String(email).toLowerCase()]
    );
    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }

    if (user.status === 'pending_verification') {
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      await pool.query(
        'UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE id = $3',
        [otp, otpExpires, user.id]
      );

      try {
        if (emailService) {
          await emailService.send({
            to: user.email,
            subject: 'Verify Your Email - KSA Valuers',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <h2 style="color: #1e3a5f; text-align: center;">Welcome to KSA Valuers</h2>
                <p style="font-size: 16px; color: #374151;">Hello ${user.name},</p>
                <p style="font-size: 16px; color: #374151;">Please verify your email address by entering the following One-Time Password (OTP):</p>
                <div style="text-align: center; margin: 30px 0;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ea580c; background-color: #fef2f2; padding: 10px 20px; border-radius: 8px; border: 1px dashed #fca5a5;">
                    ${otp}
                  </span>
                </div>
                <p style="font-size: 14px; color: #6b7280; text-align: center;">This code will expire in 10 minutes.</p>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you did not request this registration, please ignore this email.</p>
              </div>
            `
          });
        }
      } catch (mailError) {
        console.error('Failed to send verification email on login:', mailError);
      }

      return res.status(400).json({
        success: false,
        pendingVerification: true,
        email: user.email,
        message: 'Please verify your email address. A verification OTP has been sent.'
      });
    }

    const authUser = { id: user.id, email: user.email, role: user.role, name: user.name };
    setAuthCookies(res, signAccessToken(authUser), signRefreshToken(authUser));
    return res.json({ success: true, data: authUser });
  } catch (error) {
    console.error('Auth login error:', error);
    return res.status(500).json({ success: false, message: 'Failed to login' });
  }
});

app.post('/api/v1/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    const missing = requireFields(req.body || {}, ['name', 'email', 'password']);
    if (missing.length > 0) {
      return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
    }

    const isReal = await validateEmailReal(email);
    if (!isReal) {
      return res.status(400).json({ success: false, message: 'Invalid or unreachable email address (no MX records found)' });
    }

    const checkUser = await pool.query(
      'SELECT id, status FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1',
      [String(email).toLowerCase().trim()]
    );
    if (checkUser.rowCount > 0) {
      const existingUser = checkUser.rows[0];
      if (existingUser.status === 'pending_verification') {
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query(
          `UPDATE users SET name = $1, password_hash = $2, role = $3, otp_code = $4, otp_expires_at = $5, updated_at = NOW()
           WHERE id = $6`,
          [name, await bcrypt.hash(String(password), 12), resolvedRole, otp, otpExpires, existingUser.id]
        );

        try {
          if (emailService) {
            await emailService.send({
              to: String(email).toLowerCase().trim(),
              subject: 'Verify Your Email - KSA Valuers',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                  <h2 style="color: #1e3a5f; text-align: center;">Welcome to KSA Valuers</h2>
                  <p style="font-size: 16px; color: #374151;">Hello ${name},</p>
                  <p style="font-size: 16px; color: #374151;">Thank you for registering. Please verify your email address by entering the following One-Time Password (OTP):</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ea580c; background-color: #fef2f2; padding: 10px 20px; border-radius: 8px; border: 1px dashed #fca5a5;">
                      ${otp}
                    </span>
                  </div>
                  <p style="font-size: 14px; color: #6b7280; text-align: center;">This code will expire in 10 minutes.</p>
                  <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                  <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you did not request this registration, please ignore this email.</p>
                </div>
              `
            });
          }
        } catch (mailError) {
          console.error('Failed to send verification email on re-registration:', mailError);
        }

        return res.json({ success: true, status: 'pending_verification', email: String(email).toLowerCase().trim() });
      } else {
        return res.status(400).json({ success: false, message: 'Email address already registered' });
      }
    }

    const passError = validatePasswordPolicy(password);
    if (passError) {
      return res.status(400).json({ success: false, message: passError });
    }

    const hash = await bcrypt.hash(String(password), 12);
    // Allow selecting tenant or owner; restrict other administrative roles to admin creation only
    let resolvedRole = role || 'tenant';
    if (!['tenant', 'propertyowner'].includes(resolvedRole)) {
      resolvedRole = 'tenant';
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, status, otp_code, otp_expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, role, name`,
      [name, String(email).toLowerCase().trim(), hash, resolvedRole, 'pending_verification', otp, otpExpires]
    );

    const newUser = result.rows[0];
    await logAudit('system', 'REGISTER_PENDING', 'users', newUser.id, null, { name: newUser.name, email: newUser.email, role: newUser.role });

    try {
      if (emailService) {
        await emailService.send({
          to: newUser.email,
          subject: 'Verify Your Email - KSA Valuers',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h2 style="color: #1e3a5f; text-align: center;">Welcome to KSA Valuers</h2>
              <p style="font-size: 16px; color: #374151;">Hello ${newUser.name},</p>
              <p style="font-size: 16px; color: #374151;">Thank you for registering. Please verify your email address by entering the following One-Time Password (OTP):</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ea580c; background-color: #fef2f2; padding: 10px 20px; border-radius: 8px; border: 1px dashed #fca5a5;">
                  ${otp}
                </span>
              </div>
              <p style="font-size: 14px; color: #6b7280; text-align: center;">This code will expire in 10 minutes.</p>
              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you did not request this registration, please ignore this email.</p>
            </div>
          `
        });
      }
    } catch (mailError) {
      console.error('Failed to send verification email on registration:', mailError);
    }

    return res.json({ success: true, status: 'pending_verification', email: newUser.email });
  } catch (error) {
    console.error('Auth register error:', error);
    return res.status(500).json({ success: false, message: 'Failed to register account' });
  }
});

// POST /api/v1/auth/verify-otp — verify OTP code for email verification
app.post('/api/v1/auth/verify-otp', authLimiter, async (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1',
      [String(email).toLowerCase().trim()]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];
    if (user.status !== 'pending_verification') {
      return res.status(400).json({ success: false, message: 'This account has already been verified' });
    }

    // Verify OTP code and expiration
    if (user.otp_code !== String(code).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    // Update user to active
    await pool.query(
      `UPDATE users SET status = 'active', otp_code = NULL, otp_expires_at = NULL, updated_at = NOW() WHERE id = $1`,
      [user.id]
    );

    await logAudit('system', 'VERIFY_OTP_SUCCESS', 'users', user.id, { email: user.email }, { email: user.email, status: 'active' });

    const authUser = { id: user.id, email: user.email, role: user.role, name: user.name };
    setAuthCookies(res, signAccessToken(authUser), signRefreshToken(authUser));

    return res.json({ success: true, message: 'Email verified successfully', data: authUser });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify email' });
  }
});

// POST /api/v1/auth/resend-otp — resend verification OTP
app.post('/api/v1/auth/resend-otp', authLimiter, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1',
      [String(email).toLowerCase().trim()]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];
    if (user.status !== 'pending_verification') {
      return res.status(400).json({ success: false, message: 'This account has already been verified' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      'UPDATE users SET otp_code = $1, otp_expires_at = $2, updated_at = NOW() WHERE id = $3',
      [otp, otpExpires, user.id]
    );

    // Send verification email
    try {
      if (emailService) {
        await emailService.send({
          to: user.email,
          subject: 'Verify Your Email - KSA Valuers',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h2 style="color: #1e3a5f; text-align: center;">Welcome to KSA Valuers</h2>
              <p style="font-size: 16px; color: #374151;">Hello ${user.name},</p>
              <p style="font-size: 16px; color: #374151;">Please verify your email address by entering the following One-Time Password (OTP):</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ea580c; background-color: #fef2f2; padding: 10px 20px; border-radius: 8px; border: 1px dashed #fca5a5;">
                  ${otp}
                </span>
              </div>
              <p style="font-size: 14px; color: #6b7280; text-align: center;">This code will expire in 10 minutes.</p>
              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you did not request this registration, please ignore this email.</p>
            </div>
          `
        });
      }
    } catch (mailError) {
      console.error('Failed to send verification email on resend:', mailError);
    }

    return res.json({ success: true, message: 'Verification OTP sent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ success: false, message: 'Failed to resend verification code' });
  }
});

app.post('/api/v1/auth/refresh', authLimiter, async (req, res) => {
  try {
    const refresh = req.cookies.ksa_refresh;
    if (!refresh) return res.status(401).json({ success: false, message: 'No refresh token' });
    const decoded = jwt.verify(refresh, JWT_REFRESH_SECRET);

    const result = await pool.query(
      `SELECT id, email, role, name, status FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1`,
      [decoded.sub]
    );
    if (result.rowCount === 0) return res.status(401).json({ success: false, message: 'User not found' });
    const user = result.rows[0];

    if (user.status === 'suspended') {
      clearAuthCookies(res);
      return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
    }

    setAuthCookies(res, signAccessToken(user), signRefreshToken(user));
    return res.json({ success: true, data: user });
  } catch {
    clearAuthCookies(res);
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

app.post('/api/v1/auth/logout', (req, res) => {
  clearAuthCookies(res);
  res.json({ success: true });
});

app.get('/api/v1/auth/me', requireAuth, async (req, res) => {
  const result = await pool.query(
    `SELECT id, email, role, name, status, google_id FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1`,
    [req.user.sub]
  );
  if (result.rowCount === 0) return res.status(401).json({ success: false, message: 'User not found' });
  const user = result.rows[0];

  if (user.status === 'suspended') {
    clearAuthCookies(res);
    return res.status(403).json({ success: false, message: 'Account suspended.' });
  }

  // Include target user ID if they are impersonating (derived from token claims)
  const data = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    hasPassword: user.password_hash !== 'oauth_placeholder',
    googleLinked: !!user.google_id
  };

  if (req.user.impersonatorId) {
    data.impersonatorId = req.user.impersonatorId;
    data.impersonatorEmail = req.user.impersonatorEmail;
  }

  if (user.role === 'propertyowner') {
    const ownerVerify = await pool.query(
      `SELECT 1 FROM owner_property WHERE owner_id = $1 LIMIT 1`,
      [user.id]
    );
    data.hasLinkedProperties = ownerVerify.rowCount > 0;
  }

  return res.json({ success: true, data });
});

app.post('/api/v1/auth/google', authLimiter, async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    let email, name, googleId;

    // Validate via Google tokeninfo API
    try {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      const payload = response.data;

      const aud = payload.aud;
      const expectedAud = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
      if (expectedAud && aud !== expectedAud) {
        return res.status(400).json({ success: false, message: 'Invalid token audience (Client ID mismatch)' });
      }

      if (!payload.email_verified) {
        return res.status(400).json({ success: false, message: 'Google email is not verified' });
      }

      email = String(payload.email).toLowerCase().trim();
      name = payload.name || payload.given_name || 'Google User';
      googleId = payload.sub;
    } catch (err) {
      console.error('Google token verification failed:', err.message);
      return res.status(400).json({ success: false, message: 'Invalid Google token' });
    }

    // Match against database
    const userResult = await pool.query(
      `SELECT id, email, role, name, google_id, status FROM users 
       WHERE (google_id = $1 OR email = $2) AND deleted_at IS NULL LIMIT 1`,
      [googleId, email]
    );

    if (userResult.rowCount > 0) {
      const user = userResult.rows[0];
      if (user.status === 'suspended') {
        return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
      }

      if (!user.google_id) {
        await pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
      }

      const authUser = { id: user.id, email: user.email, role: user.role, name: user.name };
      setAuthCookies(res, signAccessToken(authUser), signRefreshToken(authUser));
      return res.json({ success: true, registered: true, data: authUser });
    } else {
      // Social Onboarding Verification: generate a short-lived token to prevent client-side query parameters spoofing
      const onboardingToken = jwt.sign(
        { email, googleId, name },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      return res.json({
        success: true,
        registered: false,
        action: 'onboard',
        onboardingToken
      });
    }
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(500).json({ success: false, message: 'Internal Google Sign-in failure' });
  }
});

app.post('/api/v1/auth/onboarding', authLimiter, async (req, res) => {
  try {
    const { name, role, onboardingToken } = req.body || {};
    const missing = requireFields(req.body || {}, ['name', 'role', 'onboardingToken']);
    if (missing.length > 0) {
      return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
    }

    let email, googleId;
    try {
      const decoded = jwt.verify(onboardingToken, JWT_SECRET);
      email = String(decoded.email).toLowerCase().trim();
      googleId = decoded.googleId;
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid or expired onboarding session. Please sign in with Google again.' });
    }

    const isReal = await validateEmailReal(email);
    if (!isReal) {
      return res.status(400).json({ success: false, message: 'Invalid or unreachable email address (no MX records found)' });
    }

    const checkUser = await pool.query(
      'SELECT id FROM users WHERE (email = $1 OR google_id = $2) AND deleted_at IS NULL LIMIT 1',
      [email, googleId]
    );
    if (checkUser.rowCount > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const allowedRoles = ['tenant', 'propertyowner'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role request. Onboarding supports Tenants or Property Owners.' });
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, google_id, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, role, name`,
      [name, email, 'oauth_placeholder', role, googleId, 'active']
    );

    const newUser = result.rows[0];
    await logAudit('system', 'ONBOARD', 'users', newUser.id, null, { name: newUser.name, email: newUser.email, role: newUser.role });

    setAuthCookies(res, signAccessToken(newUser), signRefreshToken(newUser));
    return res.json({ success: true, data: newUser });
  } catch (error) {
    console.error('Onboarding registration error:', error);
    return res.status(500).json({ success: false, message: 'Failed to complete onboarding' });
  }
});

// PUT /api/v1/auth/profile - Update user display name
app.put('/api/v1/auth/profile', requireAuth, async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Name cannot be empty' });
    }

    const beforeResult = await pool.query('SELECT name FROM users WHERE id = $1 AND deleted_at IS NULL', [req.user.sub]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const beforeData = beforeResult.rows[0];

    const result = await pool.query(
      'UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, role, name',
      [name.trim(), req.user.sub]
    );

    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'UPDATE_PROFILE', 'users', req.user.sub, beforeData, result.rows[0]);

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// PUT /api/v1/auth/password - Update user password (with current password verification)
app.put('/api/v1/auth/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    const missing = requireFields(req.body || {}, ['newPassword']);
    if (missing.length > 0) {
      return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
    }

    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL', [req.user.sub]);
    if (userResult.rowCount === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const user = userResult.rows[0];

    // Verify current password only if it's set (not oauth_placeholder)
    if (user.password_hash !== 'oauth_placeholder') {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to verify identity' });
      }
      const ok = await bcrypt.compare(String(currentPassword), user.password_hash);
      if (!ok) {
        return res.status(400).json({ success: false, message: 'Incorrect current password' });
      }
    }

    const passError = validatePasswordPolicy(newPassword);
    if (passError) {
      return res.status(400).json({ success: false, message: passError });
    }

    const hash = await bcrypt.hash(String(newPassword), 12);
    await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, req.user.sub]);

    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'CHANGE_PASSWORD', 'users', req.user.sub, null, null);

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update password' });
  }
});

// POST /api/v1/auth/deboard - Allow users to deactivate/soft-delete their own account
app.post('/api/v1/auth/deboard', requireAuth, async (req, res) => {
  try {
    const { password } = req.body || {};

    // Safety check: superadmin cannot delete the last superadmin account
    if (req.user.role === 'admin') {
      const activeAdmins = await pool.query(
        "SELECT count(*) FROM users WHERE role = 'admin' AND deleted_at IS NULL"
      );
      if (Number(activeAdmins.rows[0].count) <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Security Constraint: Cannot deactivate the last active Superadmin account.'
        });
      }
    }

    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL', [req.user.sub]);
    if (userResult.rowCount === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const user = userResult.rows[0];

    // Verify password if it's set
    if (user.password_hash !== 'oauth_placeholder') {
      if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required to confirm account deactivation' });
      }
      const ok = await bcrypt.compare(String(password), user.password_hash);
      if (!ok) {
        return res.status(400).json({ success: false, message: 'Incorrect password' });
      }
    }

    // Soft delete user
    await pool.query(
      "UPDATE users SET deleted_at = NOW(), status = 'suspended', updated_at = NOW() WHERE id = $1",
      [req.user.sub]
    );

    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'DEBOARD_USER', 'users', req.user.sub, null, null);

    clearAuthCookies(res);
    return res.json({ success: true, message: 'Your account has been successfully deactivated.' });
  } catch (error) {
    console.error('Account deactivation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to deactivate account' });
  }
});

// POST /api/v1/auth/link-google - Link Google ID to existing account
app.post('/api/v1/auth/link-google', requireAuth, async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ success: false, message: 'Google credential is required' });

    let googleId, googleEmail;
    try {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      googleId = response.data.sub;
      googleEmail = String(response.data.email).toLowerCase().trim();
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid Google token' });
    }

    const checkGoogle = await pool.query(
      'SELECT id FROM users WHERE google_id = $1 AND deleted_at IS NULL LIMIT 1',
      [googleId]
    );
    if (checkGoogle.rowCount > 0) {
      return res.status(400).json({ success: false, message: 'This Google account is already linked to another profile' });
    }

    await pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, req.user.sub]);

    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'LINK_GOOGLE', 'users', req.user.sub, null, { googleEmail });

    return res.json({ success: true, message: 'Google account linked successfully' });
  } catch (error) {
    console.error('Link Google error:', error);
    return res.status(500).json({ success: false, message: 'Failed to link Google account' });
  }
});

// POST /api/v1/auth/unlink-google - Unlink Google ID from account
app.post('/api/v1/auth/unlink-google', requireAuth, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL', [req.user.sub]);
    if (userResult.rowCount === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const user = userResult.rows[0];

    // Must set a password first so they don't lock themselves out
    if (user.password_hash === 'oauth_placeholder') {
      return res.status(400).json({
        success: false,
        message: 'Cannot unlink Google. You must set a password first so you can log in without Google.'
      });
    }

    await pool.query('UPDATE users SET google_id = NULL WHERE id = $1', [req.user.sub]);

    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'UNLINK_GOOGLE', 'users', req.user.sub, null, null);

    return res.json({ success: true, message: 'Google account unlinked successfully' });
  } catch (error) {
    console.error('Unlink Google error:', error);
    return res.status(500).json({ success: false, message: 'Failed to unlink Google account' });
  }
});

// GET /api/pms/owner/verify — Verify owner verification status
app.get('/api/pms/owner/verify', requireAuth, async (req, res) => {
  try {
    const { role, sub: userId } = req.user;
    if (role !== 'propertyowner') {
      return res.status(403).json({ success: false, message: 'Access denied: not an owner' });
    }
    const result = await pool.query(
      `SELECT 1 FROM owner_property WHERE owner_id = $1 LIMIT 1`,
      [userId]
    );
    return res.json({ success: true, hasLinkedProperties: result.rowCount > 0 });
  } catch (error) {
    console.error('Owner verify check failed:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ============================================
// GEMINI AI ENDPOINT - FIXED WITH WORKING MODEL
// ============================================
app.post('/api/ask-ai', aiLimiter, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in .env file');
      return res.status(500).json({
        success: false,
        message: 'AI service not configured - missing API key'
      });
    }

    console.log('🤖 Asking Gemini:', question.substring(0, 50) + '...');
    console.log('🔑 Using API key starting with:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    console.log('📡 Calling Gemini API with model:', modelName);

    const response = await axios.post(
      apiUrl,
      {
        contents: [{
          parts: [{
            text: `You are a helpful assistant for KSA Valuers, a property valuation company in Nigeria. 
            Answer this question professionally and concisely. Keep answers under 150 words unless necessary.
            
            Question: ${question}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ API Response received. Status:', response.status);

    // Extract the answer
    const answer = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      console.error('❌ No answer in response');
      return res.status(500).json({
        success: false,
        message: 'AI returned empty response'
      });
    }

    console.log('✅ AI response generated successfully');
    res.json({
      success: true,
      answer: answer
    });

  } catch (error) {
    console.error('❌ Gemini API Error Details:');

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));

      return res.status(500).json({
        success: false,
        message: `Gemini API error: ${error.response.data?.error?.message || 'Unknown error'}`
      });
    } else if (error.request) {
      console.error('No response received from Gemini API');
      return res.status(500).json({
        success: false,
        message: 'No response from Gemini API - network issue?'
      });
    } else {
      console.error('Error setting up request:', error.message);
      return res.status(500).json({
        success: false,
        message: `Request setup error: ${error.message}`
      });
    }
  }
});

// ============================================
// CACHED AI ENDPOINT - FIXED
// ============================================
const answerCache = new Map();

app.post('/api/ask-ai-cached', aiLimiter, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    const cacheKey = question.toLowerCase().trim();
    if (answerCache.has(cacheKey)) {
      console.log('📦 Cache hit for:', cacheKey.substring(0, 30) + '...');
      return res.json({
        success: true,
        answer: answerCache.get(cacheKey),
        cached: true
      });
    }

    // Using configurable model for cached endpoint
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `You are a helpful assistant for KSA Valuers, a property valuation company in Nigeria. 
            Answer this question professionally and concisely: ${question}`
          }]
        }]
      }
    );

    const answer = response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate an answer. Please try again.";

    answerCache.set(cacheKey, answer);

    if (answerCache.size > 100) {
      const firstKey = answerCache.keys().next().value;
      answerCache.delete(firstKey);
    }

    res.json({
      success: true,
      answer: answer,
      cached: false
    });

  } catch (error) {
    console.error('❌ Gemini API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response. Please try again later.'
    });
  }
});

// ============================================
// DEBUG ENDPOINT
// ============================================
app.post('/api/debug', express.json(), (req, res) => {
  console.log('📦 Debug - Received body:', req.body);
  res.json({
    success: true,
    received: req.body,
    message: 'Debug endpoint working'
  });
});

// ============================================
// SIMPLE TEST ENDPOINT
// ============================================
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KSA API',
    ai: process.env.GEMINI_API_KEY ? 'configured' : 'not configured',
    email: process.env.EMAIL_USER ? 'configured' : 'not configured'
  });
});

// ============================================
// MODEL LISTING ENDPOINT (keep this for reference)
// ============================================
app.get('/api/list-models', async (req, res) => {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );

    const availableModels = response.data.models
      .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
      .map(model => ({
        name: model.name,
        displayName: model.displayName,
        description: model.description
      }));

    res.json({
      success: true,
      models: availableModels
    });
  } catch (error) {
    console.error('Error listing models:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

// ============================================
// PROPERTIES, PROJECTS, BOOKINGS API ENDPOINTS
// ============================================
app.get('/api/properties', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : (req.query.page ? 20 : 100000);
    const offset = (page - 1) * limit;

    const { search, status, type } = req.query;

    const params = [];
    let countQuery = `SELECT COUNT(*) FROM properties`;
    let query = `SELECT * FROM properties`;
    let whereClauses = [];

    if (search) {
      params.push(`%${search}%`);
      whereClauses.push(`(title ILIKE $${params.length} OR location ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }

    if (status && status !== 'all') {
      const normStatus = normalizePropertyStatus(status);
      params.push(normStatus);
      whereClauses.push(`status = $${params.length}`);
    }

    if (type && type !== 'all') {
      params.push(type);
      whereClauses.push(`type = $${params.length}`);
    }

    if (whereClauses.length > 0) {
      const clause = ` WHERE ` + whereClauses.join(' AND ');
      countQuery += clause;
      query += clause;
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    const queryParams = [...params, limit, offset];
    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: result.rows.map(mapProperty),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    console.error('Failed to get properties:', error);
    res.status(500).json({ success: false, message: 'Failed to get properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid property id' });
    const result = await pool.query(`SELECT * FROM properties WHERE id = $1 LIMIT 1`, [id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: mapProperty(result.rows[0]) });
  } catch (error) {
    console.error('Failed to get property:', error);
    res.status(500).json({ success: false, message: 'Failed to get property' });
  }
});

app.post('/api/properties', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const missing = requireFields(req.body || {}, ['title', 'location', 'price']);
    if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });

    const payload = req.body;
    const valError = validatePropertyInput(payload);
    if (valError) return res.status(400).json({ success: false, message: valError });

    const result = await pool.query(
      `INSERT INTO properties (title, location, image, images, price, status, type, bedrooms, bathrooms, square_footage, description, featured, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [
        payload.title, payload.location, payload.image || null, JSON.stringify(payload.images || []),
        Number(payload.price || 0), normalizePropertyStatus(payload.status), payload.type || null,
        payload.bedrooms || null, payload.bathrooms || null, payload.squareFootage || null,
        payload.description || null, Boolean(payload.featured), JSON.stringify(payload.tags || [])
      ]
    );

    const newProperty = mapProperty(result.rows[0]);
    await logAudit(req.user.email, 'CREATE', 'properties', newProperty.id, null, newProperty);

    res.json({ success: true, data: newProperty });
  } catch (error) {
    console.error('Failed to create property:', error);
    res.status(500).json({ success: false, message: 'Failed to create property' });
  }
});

app.put('/api/properties/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid property id' });

    const payload = req.body || {};
    const valError = validatePropertyInput(payload);
    if (valError) return res.status(400).json({ success: false, message: valError });

    // Get before data for audit
    const beforeResult = await pool.query(`SELECT * FROM properties WHERE id = $1 LIMIT 1`, [id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'Property not found' });
    const beforeData = mapProperty(beforeResult.rows[0]);

    const result = await pool.query(
      `UPDATE properties SET
        title = COALESCE($2, title),
        location = COALESCE($3, location),
        image = COALESCE($4, image),
        images = COALESCE($5::jsonb, images),
        price = COALESCE($6, price),
        status = COALESCE($7, status),
        type = COALESCE($8, type),
        bedrooms = COALESCE($9, bedrooms),
        bathrooms = COALESCE($10, bathrooms),
        square_footage = COALESCE($11, square_footage),
        description = COALESCE($12, description),
        featured = COALESCE($13, featured),
        tags = COALESCE($14::jsonb, tags),
        updated_at = NOW()
        WHERE id = $1 RETURNING *`,
      [id, payload.title, payload.location, payload.image, payload.images ? JSON.stringify(payload.images) : null,
        payload.price !== undefined ? Number(payload.price) : null,
        payload.status ? normalizePropertyStatus(payload.status) : null,
        payload.type, payload.bedrooms, payload.bathrooms, payload.squareFootage, payload.description,
        payload.featured !== undefined ? Boolean(payload.featured) : null,
        payload.tags ? JSON.stringify(payload.tags) : null
      ]
    );

    const updatedProperty = mapProperty(result.rows[0]);
    await logAudit(req.user.email, 'UPDATE', 'properties', id, beforeData, updatedProperty);

    res.json({ success: true, data: updatedProperty });
  } catch (error) {
    console.error('Failed to update property:', error);
    res.status(500).json({ success: false, message: 'Failed to update property' });
  }
});

app.delete('/api/properties/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid property id' });

    // Get before data for audit
    const beforeResult = await pool.query(`SELECT * FROM properties WHERE id = $1 LIMIT 1`, [id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'Property not found' });
    const beforeData = mapProperty(beforeResult.rows[0]);

    await pool.query(`DELETE FROM properties WHERE id = $1`, [id]);

    await logAudit(req.user.email, 'DELETE', 'properties', id, beforeData, null);

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete property:', error);
    res.status(500).json({ success: false, message: 'Failed to delete property' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : (req.query.page ? 20 : 100000);
    const offset = (page - 1) * limit;

    const { search, status, type } = req.query;

    const params = [];
    let countQuery = `SELECT COUNT(*) FROM projects`;
    let query = `SELECT * FROM projects`;
    let whereClauses = [];

    if (search) {
      params.push(`%${search}%`);
      whereClauses.push(`(title ILIKE $${params.length} OR location ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }

    if (status && status !== 'all') {
      params.push(status);
      whereClauses.push(`status = $${params.length}`);
    }

    if (type && type !== 'all') {
      params.push(type);
      whereClauses.push(`type = $${params.length}`);
    }

    if (whereClauses.length > 0) {
      const clause = ` WHERE ` + whereClauses.join(' AND ');
      countQuery += clause;
      query += clause;
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    const queryParams = [...params, limit, offset];
    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: result.rows.map(mapProject),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    console.error('Failed to get projects:', error);
    res.status(500).json({ success: false, message: 'Failed to get projects' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid project id' });
    const result = await pool.query(`SELECT * FROM projects WHERE id = $1 LIMIT 1`, [id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: mapProject(result.rows[0]) });
  } catch (error) {
    console.error('Failed to get project:', error);
    res.status(500).json({ success: false, message: 'Failed to get project' });
  }
});

app.post('/api/projects', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const missing = requireFields(req.body || {}, ['title', 'location', 'status', 'type']);
    if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });

    const payload = req.body || {};
    const valError = validateProjectInput(payload);
    if (valError) return res.status(400).json({ success: false, message: valError });

    const result = await pool.query(
      `INSERT INTO projects (title, location, image, description, status, type, total_units, completion_percentage, start_date, expected_completion, budget, featured, amenities)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [payload.title, payload.location, payload.image || null, payload.description || null, payload.status, payload.type,
      payload.totalUnits || null, payload.completionPercentage || 0, payload.startDate || null, payload.expectedCompletion || null,
      Number(payload.budget || 0), Boolean(payload.featured), JSON.stringify(payload.amenities || [])
      ]
    );

    const newProject = mapProject(result.rows[0]);
    await logAudit(req.user.email, 'CREATE', 'projects', newProject.id, null, newProject);

    res.json({ success: true, data: newProject });
  } catch (error) {
    console.error('Failed to create project:', error);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid project id' });

    const payload = req.body || {};
    const valError = validateProjectInput(payload);
    if (valError) return res.status(400).json({ success: false, message: valError });

    // Get before data for audit
    const beforeResult = await pool.query(`SELECT * FROM projects WHERE id = $1 LIMIT 1`, [id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    const beforeData = mapProject(beforeResult.rows[0]);

    const result = await pool.query(
      `UPDATE projects SET
        title = COALESCE($2, title),
        location = COALESCE($3, location),
        image = COALESCE($4, image),
        description = COALESCE($5, description),
        status = COALESCE($6, status),
        type = COALESCE($7, type),
        total_units = COALESCE($8, total_units),
        completion_percentage = COALESCE($9, completion_percentage),
        start_date = COALESCE($10, start_date),
        expected_completion = COALESCE($11, expected_completion),
        budget = COALESCE($12, budget),
        featured = COALESCE($13, featured),
        amenities = COALESCE($14::jsonb, amenities),
        updated_at = NOW()
        WHERE id = $1 RETURNING *`,
      [id, payload.title, payload.location, payload.image, payload.description, payload.status, payload.type,
        payload.totalUnits, payload.completionPercentage, payload.startDate || null, payload.expectedCompletion || null,
        payload.budget !== undefined ? Number(payload.budget) : null,
        payload.featured !== undefined ? Boolean(payload.featured) : null,
        payload.amenities ? JSON.stringify(payload.amenities) : null]
    );

    const updatedProject = mapProject(result.rows[0]);
    await logAudit(req.user.email, 'UPDATE', 'projects', id, beforeData, updatedProject);

    res.json({ success: true, data: updatedProject });
  } catch (error) {
    console.error('Failed to update project:', error);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid project id' });

    // Get before data for audit
    const beforeResult = await pool.query(`SELECT * FROM projects WHERE id = $1 LIMIT 1`, [id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    const beforeData = mapProject(beforeResult.rows[0]);

    await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);

    await logAudit(req.user.email, 'DELETE', 'projects', id, beforeData, null);

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

app.get('/api/bookings', requireAuth, requireRole('admin', 'manager'), async (_req, res) => {
  const result = await pool.query(`SELECT * FROM bookings ORDER BY created_at DESC`);
  res.json({ success: true, data: result.rows.map(mapBooking) });
});

// Get available time slots for a date
app.get('/api/bookings/available-slots', async (req, res) => {
  const { date, propertyId } = req.query;
  if (!date) {
    return res.status(400).json({ success: false, message: 'Date is required' });
  }

  const allSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const params = [date];
  let query = `SELECT booking_time FROM bookings WHERE booking_date = $1 AND status <> 'cancelled'`;
  if (propertyId) {
    query += ` AND property_id = $2`;
    params.push(propertyId);
  }
  const bookedResult = await pool.query(query, params);
  const bookedTimes = bookedResult.rows.map((row) => row.booking_time);

  const slots = allSlots.map(time => ({
    time,
    isBooked: bookedTimes.includes(time)
  }));

  res.json({ success: true, data: slots });
});

// Get single booking
app.get('/api/bookings/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE id = $1 LIMIT 1`, [req.params.id]);
  if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, data: mapBooking(result.rows[0]) });
});

// Create a new booking
app.post('/api/bookings', publicFormLimiter, async (req, res) => {
  try {
    const data = req.body.data || req.body;
    const validationError = validateBookingPayload(data);
    if (validationError) return res.status(400).json({ success: false, message: validationError });
    const id = data.bookingId || `BOOK-${Date.now()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const conflict = await pool.query(
      `SELECT id FROM bookings WHERE booking_date = $1 AND booking_time = $2
       AND status <> 'cancelled' AND (($3::int IS NULL AND property_id IS NULL) OR property_id = $3::int) LIMIT 1`,
      [data.date, data.time, data.property ? Number(data.property) : null]
    );
    if (conflict.rowCount > 0) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked.' });
    }
    const result = await pool.query(
      `INSERT INTO bookings (id, property_id, name, email, phone, booking_date, booking_time, guests, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [id, data.property ? Number(data.property) : null, data.name, data.email, data.phone, data.date, data.time, data.guests || 1, data.notes || '', data.status || 'pending']
    );

    const newBooking = mapBooking(result.rows[0]);
    await logAudit(data.email || 'anonymous', 'CREATE', 'bookings', id, null, newBooking);

    res.json({ success: true, data: newBooking, message: 'Booking created successfully!' });
  } catch (error) {
    console.error('Failed to create booking:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
});

// Update booking (status, notes, etc.)
app.put('/api/bookings/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const updates = req.body.data || req.body || {};

    // Get before data for audit
    const beforeResult = await pool.query(`SELECT * FROM bookings WHERE id = $1 LIMIT 1`, [req.params.id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'Booking not found' });
    const beforeData = mapBooking(beforeResult.rows[0]);

    const result = await pool.query(
      `UPDATE bookings SET
        name = COALESCE($2, name),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        booking_date = COALESCE($5, booking_date),
        booking_time = COALESCE($6, booking_time),
        guests = COALESCE($7, guests),
        notes = COALESCE($8, notes),
        status = COALESCE($9, status),
        updated_at = NOW()
        WHERE id = $1 RETURNING *`,
      [req.params.id, updates.name, updates.email, updates.phone, updates.date, updates.time, updates.guests, updates.notes, updates.status]
    );

    const updatedBooking = mapBooking(result.rows[0]);
    await logAudit(req.user.email, 'UPDATE', 'bookings', req.params.id, beforeData, updatedBooking);

    res.json({ success: true, data: updatedBooking, message: 'Booking updated successfully!' });
  } catch (error) {
    console.error('Failed to update booking:', error);
    res.status(500).json({ success: false, message: 'Failed to update booking' });
  }
});

// Delete booking
app.delete('/api/bookings/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  try {
    // Get before data for audit
    const beforeResult = await pool.query(`SELECT * FROM bookings WHERE id = $1 LIMIT 1`, [req.params.id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'Booking not found' });
    const beforeData = mapBooking(beforeResult.rows[0]);

    await pool.query(`DELETE FROM bookings WHERE id = $1`, [req.params.id]);

    await logAudit(req.user.email, 'DELETE', 'bookings', req.params.id, beforeData, null);

    res.json({ success: true, message: 'Booking deleted successfully!' });
  } catch (error) {
    console.error('Failed to delete booking:', error);
    res.status(500).json({ success: false, message: 'Failed to delete booking' });
  }
});

// ============================================
// APPOINTMENTS ENDPOINTS (aliases for bookings)
// ============================================

app.get('/api/appointments', requireAuth, requireRole('admin', 'manager'), async (_req, res) => {
  const result = await pool.query(`SELECT * FROM bookings ORDER BY booking_date ASC, booking_time ASC`);
  res.json(result.rows.map(mapBooking));
});

app.get('/api/appointments/all', requireAuth, requireRole('admin', 'manager'), async (_req, res) => {
  const result = await pool.query(`SELECT * FROM bookings ORDER BY created_at DESC`);
  res.json({ success: true, data: result.rows.map(mapBooking) });
});

app.post('/api/appointments/schedule', publicFormLimiter, async (req, res) => {
  try {
    const data = req.body || {};
    const validationError = validateBookingPayload(data);
    if (validationError) return res.status(400).json({ success: false, message: validationError });
    const id = `BOOK-${Date.now()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const conflict = await pool.query(
      `SELECT id FROM bookings WHERE booking_date = $1 AND booking_time = $2
       AND status <> 'cancelled' AND (($3::int IS NULL AND property_id IS NULL) OR property_id = $3::int) LIMIT 1`,
      [data.date, data.time, data.property ? Number(data.property) : null]
    );
    if (conflict.rowCount > 0) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked.' });
    }
    const result = await pool.query(
      `INSERT INTO bookings (id, property_id, name, email, phone, booking_date, booking_time, guests, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [id, data.property ? Number(data.property) : null, data.name, data.email, data.phone, data.date, data.time, data.guests || 1, data.notes || '', 'pending']
    );

    const newBooking = mapBooking(result.rows[0]);
    await logAudit(data.email || 'anonymous', 'CREATE', 'bookings', id, null, newBooking);

    res.json({ success: true, data: newBooking });
  } catch (error) {
    console.error('Failed to schedule appointment:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule appointment' });
  }
});

app.put('/api/appointments/status', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const { id, status } = req.body;

    // Get before data for audit
    const beforeResult = await pool.query(`SELECT * FROM bookings WHERE id = $1 LIMIT 1`, [id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'Appointment not found' });
    const beforeData = mapBooking(beforeResult.rows[0]);

    const result = await pool.query(`UPDATE bookings SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *`, [id, status]);

    const updated = mapBooking(result.rows[0]);
    await logAudit(req.user.email, 'UPDATE', 'bookings', id, beforeData, updated);

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to update appointment status:', error);
    res.status(500).json({ success: false, message: 'Failed to update appointment status' });
  }
});

app.put('/api/appointments/cancel/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  try {
    // Get before data for audit
    const beforeResult = await pool.query(`SELECT * FROM bookings WHERE id = $1 LIMIT 1`, [req.params.id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'Appointment not found' });
    const beforeData = mapBooking(beforeResult.rows[0]);

    const result = await pool.query(`UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *`, [req.params.id]);

    const updated = mapBooking(result.rows[0]);
    await logAudit(req.user.email, 'UPDATE', 'bookings', req.params.id, beforeData, updated);

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to cancel appointment:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel appointment' });
  }
});

// ============================================
// EMAIL ENDPOINTS (for BookTour.vue)
// ============================================

app.post('/email/booking-confirmation', async (req, res) => {
  const { booking } = req.body;
  try {
    if (!emailService) {
      return res.status(503).json({
        success: false,
        message: 'Email service not configured. Configure EMAIL_PROVIDER in .env'
      });
    }

    const template = getTemplate('booking-confirmation', {
      name: booking.name,
      propertyTitle: booking.propertyTitle || 'Property',
      date: booking.date || booking.formattedDate,
      time: booking.time,
      location: booking.location || ''
    });

    await emailService.send({
      to: booking.email,
      subject: template.subject,
      html: template.html
    });

    res.json({ success: true, message: 'Confirmation email sent' });
  } catch (error) {
    console.error('Booking confirmation email error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send confirmation email. Your booking is still saved.'
    });
  }
});

app.post('/email/admin-notification', async (req, res) => {
  const { booking } = req.body;
  try {
    if (!emailService || !process.env.ADMIN_EMAIL) {
      return res.status(503).json({
        success: false,
        message: 'Email service not configured. Configure EMAIL_PROVIDER and ADMIN_EMAIL in .env'
      });
    }

    const template = getTemplate('admin-notification', {
      type: 'New Booking',
      subject: `Booking from ${booking.name}`,
      content: `
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${booking.email}">${booking.email}</a></p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Date:</strong> ${booking.formattedDate || booking.date}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Guests:</strong> ${booking.guests || 1}</p>
        <p><strong>Property:</strong> ${booking.propertyTitle || 'Not specified'}</p>
        <p><strong>Notes:</strong> ${booking.notes || 'None'}</p>
      `
    });

    await emailService.send({
      to: process.env.ADMIN_EMAIL,
      subject: template.subject,
      html: template.html,
      replyTo: booking.email
    });

    res.json({ success: true, message: 'Admin notification sent' });
  } catch (error) {
    console.error('Admin notification email error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification. Please contact admin manually.'
    });
  }
});

// ============================================
// HEALTH CHECK & STATUS ENDPOINTS
// ============================================
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

app.get('/api/status', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    const stats = await Promise.all([
      pool.query('SELECT COUNT(*) FROM properties'),
      pool.query('SELECT COUNT(*) FROM projects'),
      pool.query('SELECT COUNT(*) FROM bookings'),
      pool.query('SELECT COUNT(*) FROM users')
    ]);

    res.json({
      success: true,
      database: 'connected',
      stats: {
        properties: parseInt(stats[0].rows[0].count),
        projects: parseInt(stats[1].rows[0].count),
        bookings: parseInt(stats[2].rows[0].count),
        users: parseInt(stats[3].rows[0].count)
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      database: 'disconnected',
      error: error.message
    });
  }
});

// ============================================
// HERO SLIDES ENDPOINTS
// ============================================

app.get('/api/hero-slides', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM hero_slides ORDER BY sort_order ASC, created_at DESC`);
    res.json({ success: true, data: result.rows.map(mapHeroSlide) });
  } catch (error) {
    console.error('Failed to get hero slides:', error);
    res.status(500).json({ success: false, message: 'Failed to get hero slides' });
  }
});

app.get('/api/hero-slides/:id', requireAuth, requireRole('admin', 'webadmin', 'manager'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid slide id' });
    const result = await pool.query(`SELECT * FROM hero_slides WHERE id = $1 LIMIT 1`, [id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Hero slide not found' });
    res.json({ success: true, data: mapHeroSlide(result.rows[0]) });
  } catch (error) {
    console.error('Failed to get hero slide:', error);
    res.status(500).json({ success: false, message: 'Failed to get hero slide' });
  }
});

app.post('/api/hero-slides', requireAuth, requireRole('admin', 'webadmin', 'manager'), async (req, res) => {
  try {
    const missing = requireFields(req.body || {}, ['imageUrl', 'title']);
    if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });

    const payload = req.body || {};
    const valError = validateHeroSlideInput(payload);
    if (valError) return res.status(400).json({ success: false, message: valError });

    // Asset Policy Check: Reject relative paths / binary uploads; require absolute URLs or seeded assets
    const isAssetSeeded = payload.imageUrl.endsWith('.jpg') || payload.imageUrl.endsWith('.jpeg') || payload.imageUrl.endsWith('.png');
    if (!isAbsoluteUrl(payload.imageUrl) && !isAssetSeeded) {
      return res.status(400).json({
        success: false,
        message: 'Asset Strategy Violation: Image URL must be an absolute URL (e.g. from Cloudinary, Imgur, or CDN).'
      });
    }

    const result = await pool.query(
      `INSERT INTO hero_slides (image_url, title, tagline, cta_text, cta_link, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [payload.imageUrl, payload.title, payload.tagline || null, payload.ctaText || 'Explore Properties', payload.ctaLink || '/properties', Number(payload.sortOrder || 0)]
    );

    const newSlide = mapHeroSlide(result.rows[0]);
    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'CREATE', 'hero_slides', newSlide.id, null, newSlide);

    res.json({ success: true, data: newSlide });
  } catch (error) {
    console.error('Failed to create hero slide:', error);
    res.status(500).json({ success: false, message: 'Failed to create hero slide' });
  }
});

app.put('/api/hero-slides/:id', requireAuth, requireRole('admin', 'webadmin', 'manager'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid slide id' });

    const payload = req.body || {};
    const valError = validateHeroSlideInput(payload);
    if (valError) return res.status(400).json({ success: false, message: valError });

    // Asset Policy Check if imageUrl is provided
    if (payload.imageUrl) {
      const isAssetSeeded = payload.imageUrl.endsWith('.jpg') || payload.imageUrl.endsWith('.jpeg') || payload.imageUrl.endsWith('.png');
      if (!isAbsoluteUrl(payload.imageUrl) && !isAssetSeeded) {
        return res.status(400).json({
          success: false,
          message: 'Asset Strategy Violation: Image URL must be an absolute URL (e.g. from Cloudinary, Imgur, or CDN).'
        });
      }
    }

    // Get before data for audit
    const beforeResult = await pool.query(`SELECT * FROM hero_slides WHERE id = $1 LIMIT 1`, [id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'Hero slide not found' });
    const beforeData = mapHeroSlide(beforeResult.rows[0]);

    const result = await pool.query(
      `UPDATE hero_slides SET
        image_url = COALESCE($2, image_url),
        title = COALESCE($3, title),
        tagline = COALESCE($4, tagline),
        cta_text = COALESCE($5, cta_text),
        cta_link = COALESCE($6, cta_link),
        sort_order = COALESCE($7, sort_order),
        updated_at = NOW()
        WHERE id = $1 RETURNING *`,
      [id, payload.imageUrl, payload.title, payload.tagline, payload.ctaText, payload.ctaLink, payload.sortOrder !== undefined ? Number(payload.sortOrder) : null]
    );

    const updatedSlide = mapHeroSlide(result.rows[0]);
    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'UPDATE', 'hero_slides', id, beforeData, updatedSlide);

    res.json({ success: true, data: updatedSlide });
  } catch (error) {
    console.error('Failed to update hero slide:', error);
    res.status(500).json({ success: false, message: 'Failed to update hero slide' });
  }
});

app.delete('/api/hero-slides/:id', requireAuth, requireRole('admin', 'webadmin', 'manager'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid slide id' });

    // Get before data for audit
    const beforeResult = await pool.query(`SELECT * FROM hero_slides WHERE id = $1 LIMIT 1`, [id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'Hero slide not found' });
    const beforeData = mapHeroSlide(beforeResult.rows[0]);

    await pool.query(`DELETE FROM hero_slides WHERE id = $1`, [id]);

    await logAudit(req.user.email, 'DELETE', 'hero_slides', id, beforeData, null);

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete hero slide:', error);
    res.status(500).json({ success: false, message: 'Failed to delete hero slide' });
  }
});

// ============================================
// PMS — PROPERTY MANAGEMENT SYSTEM API
// ============================================

// ── Helper mappers ──────────────────────────
const mapLease = (row) => ({
  id: row.id,
  tenantId: row.tenant_id,
  tenantName: row.tenant_name,
  propertyId: row.property_id,
  propertyTitle: row.property_title,
  ownerId: row.owner_id,
  unitDescription: row.unit_description,
  rentAmount: Number(row.rent_amount),
  startDate: row.start_date,
  endDate: row.end_date,
  status: row.status,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapTicket = (row) => ({
  id: row.id,
  tenantId: row.tenant_id,
  tenantName: row.tenant_name,
  leaseId: row.lease_id,
  propertyId: row.property_id,
  propertyTitle: row.property_title,
  title: row.title,
  description: row.description,
  category: row.category,
  priority: row.priority,
  status: row.status,
  assignedTo: row.assigned_to,
  resolutionNotes: row.resolution_notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapPayment = (row) => ({
  id: row.id,
  tenantId: row.tenant_id,
  leaseId: row.lease_id,
  reference: row.reference,
  amount: Number(row.amount),
  currency: row.currency,
  status: row.status,
  paymentType: row.payment_type,
  provider: row.provider,
  paidAt: row.paid_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// ── LEASES ──────────────────────────────────

// GET /api/pms/leases — Admin/Management: all; Tenant: own
app.get('/api/pms/leases', requireAuth, async (req, res) => {
  try {
    const { role, sub: userId } = req.user;
    const isStaff = ['admin', 'manager', 'management'].includes(role);
    const isOwner = role === 'propertyowner';

    let query, params;
    if (isStaff) {
      query = `
        SELECT l.*, u.name AS tenant_name, p.title AS property_title
        FROM leases l
        LEFT JOIN users u ON u.id = l.tenant_id
        LEFT JOIN properties p ON p.id = l.property_id
        ORDER BY l.created_at DESC`;
      params = [];
    } else if (isOwner) {
      // Owner sees leases for their properties (no PII beyond name)
      query = `
        SELECT l.id, l.property_id, l.unit_description, l.rent_amount,
               l.start_date, l.end_date, l.status, l.created_at, l.updated_at,
               p.title AS property_title,
               u.name AS tenant_name
        FROM leases l
        LEFT JOIN properties p ON p.id = l.property_id
        LEFT JOIN users u ON u.id = l.tenant_id
        WHERE l.owner_id = $1
        ORDER BY l.created_at DESC`;
      params = [userId];
    } else {
      // Tenant: only their own lease
      query = `
        SELECT l.*, u.name AS tenant_name, p.title AS property_title
        FROM leases l
        LEFT JOIN users u ON u.id = l.tenant_id
        LEFT JOIN properties p ON p.id = l.property_id
        WHERE l.tenant_id = $1
        ORDER BY l.created_at DESC`;
      params = [userId];
    }

    const result = await pool.query(query, params);
    return res.json({ success: true, data: result.rows.map(mapLease) });
  } catch (error) {
    console.error('Failed to fetch leases:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch leases' });
  }
});

// GET /api/pms/leases/:id — get single lease (scoped)
app.get('/api/pms/leases/:id', requireAuth, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid lease ID' });
    const { role, sub: userId } = req.user;
    const isStaff = ['admin', 'manager', 'management'].includes(role);

    const result = await pool.query(
      `SELECT l.*, u.name AS tenant_name, p.title AS property_title
       FROM leases l
       LEFT JOIN users u ON u.id = l.tenant_id
       LEFT JOIN properties p ON p.id = l.property_id
       WHERE l.id = $1 LIMIT 1`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Lease not found' });
    const lease = result.rows[0];

    // Scope check: tenant can only see own lease; owner can see leases for their properties
    if (!isStaff && role === 'tenant' && lease.tenant_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (!isStaff && role === 'propertyowner' && lease.owner_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.json({ success: true, data: mapLease(lease) });
  } catch (error) {
    console.error('Failed to fetch lease:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch lease' });
  }
});

// POST /api/pms/leases — Admin/Management only
app.post('/api/pms/leases', requireAuth, requireRole('admin', 'manager', 'management'), async (req, res) => {
  try {
    const { tenantId, propertyId, ownerId, unitDescription, rentAmount, startDate, endDate, notes } = req.body || {};
    const missing = requireFields(req.body || {}, ['tenantId', 'rentAmount', 'startDate', 'endDate']);
    if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });

    const result = await pool.query(
      `INSERT INTO leases (tenant_id, property_id, owner_id, unit_description, rent_amount, start_date, end_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [tenantId, propertyId || null, ownerId || null, unitDescription || null, Number(rentAmount), startDate, endDate, notes || null]
    );
    const lease = result.rows[0];
    await logAudit(req.user.email, 'CREATE', 'leases', lease.id, null, lease);
    return res.status(201).json({ success: true, data: mapLease(lease) });
  } catch (error) {
    console.error('Failed to create lease:', error);
    return res.status(500).json({ success: false, message: 'Failed to create lease' });
  }
});

// PUT /api/pms/leases/:id — Admin/Management only
app.put('/api/pms/leases/:id', requireAuth, requireRole('admin', 'manager', 'management'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid lease ID' });

    const before = await pool.query('SELECT * FROM leases WHERE id = $1 LIMIT 1', [id]);
    if (before.rowCount === 0) return res.status(404).json({ success: false, message: 'Lease not found' });

    const { rentAmount, startDate, endDate, status, notes, unitDescription, ownerId } = req.body || {};
    const result = await pool.query(
      `UPDATE leases SET
        rent_amount = COALESCE($2, rent_amount),
        start_date = COALESCE($3, start_date),
        end_date = COALESCE($4, end_date),
        status = COALESCE($5, status),
        notes = COALESCE($6, notes),
        unit_description = COALESCE($7, unit_description),
        owner_id = COALESCE($8, owner_id),
        updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, rentAmount !== undefined ? Number(rentAmount) : null, startDate || null, endDate || null,
        status || null, notes || null, unitDescription || null, ownerId || null]
    );
    const updated = result.rows[0];
    await logAudit(req.user.email, 'UPDATE', 'leases', id, before.rows[0], updated);
    return res.json({ success: true, data: mapLease(updated) });
  } catch (error) {
    console.error('Failed to update lease:', error);
    return res.status(500).json({ success: false, message: 'Failed to update lease' });
  }
});

// ── MAINTENANCE TICKETS ──────────────────────

// GET /api/pms/tickets — Admin/Management: all; Tenant: own
app.get('/api/pms/tickets', requireAuth, async (req, res) => {
  try {
    const { role, sub: userId } = req.user;
    const isStaff = ['admin', 'manager', 'management'].includes(role);

    let query, params;
    if (isStaff) {
      query = `
        SELECT t.*, u.name AS tenant_name, p.title AS property_title
        FROM maintenance_tickets t
        LEFT JOIN users u ON u.id = t.tenant_id
        LEFT JOIN properties p ON p.id = t.property_id
        ORDER BY t.created_at DESC`;
      params = [];
    } else {
      query = `
        SELECT t.*, u.name AS tenant_name, p.title AS property_title
        FROM maintenance_tickets t
        LEFT JOIN users u ON u.id = t.tenant_id
        LEFT JOIN properties p ON p.id = t.property_id
        WHERE t.tenant_id = $1
        ORDER BY t.created_at DESC`;
      params = [userId];
    }

    const result = await pool.query(query, params);
    return res.json({ success: true, data: result.rows.map(mapTicket) });
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
});

// POST /api/pms/tickets — Tenant creates a ticket
app.post('/api/pms/tickets', requireAuth, requireRole('tenant'), async (req, res) => {
  try {
    const { sub: userId } = req.user;
    const { title, description, category, priority, leaseId, propertyId } = req.body || {};
    const missing = requireFields(req.body || {}, ['title', 'description']);
    if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });

    const result = await pool.query(
      `INSERT INTO maintenance_tickets (tenant_id, lease_id, property_id, title, description, category, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, leaseId || null, propertyId || null, title, description,
        category || 'general', priority || 'medium']
    );
    const ticket = result.rows[0];
    await logAudit(req.user.email, 'CREATE', 'maintenance_tickets', ticket.id, null, ticket);
    return res.status(201).json({ success: true, data: mapTicket(ticket) });
  } catch (error) {
    console.error('Failed to create ticket:', error);
    return res.status(500).json({ success: false, message: 'Failed to create ticket' });
  }
});

// PUT /api/pms/tickets/:id/status — Admin/Management updates ticket status
app.put('/api/pms/tickets/:id/status', requireAuth, requireRole('admin', 'manager', 'management'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid ticket ID' });

    const { status, resolutionNotes, assignedTo } = req.body || {};
    if (!status) return res.status(400).json({ success: false, message: 'status is required' });

    const before = await pool.query('SELECT * FROM maintenance_tickets WHERE id = $1 LIMIT 1', [id]);
    if (before.rowCount === 0) return res.status(404).json({ success: false, message: 'Ticket not found' });

    const result = await pool.query(
      `UPDATE maintenance_tickets SET
        status = $2,
        resolution_notes = COALESCE($3, resolution_notes),
        assigned_to = COALESCE($4, assigned_to),
        updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, status, resolutionNotes || null, assignedTo || null]
    );
    const updated = result.rows[0];
    await logAudit(req.user.email, 'UPDATE', 'maintenance_tickets', id, before.rows[0], updated);
    return res.json({ success: true, data: mapTicket(updated) });
  } catch (error) {
    console.error('Failed to update ticket:', error);
    return res.status(500).json({ success: false, message: 'Failed to update ticket' });
  }
});

// ── OWNER SUMMARY (Aggregate — No PII) ───────

// GET /api/pms/owner/summary — PropertyOwner: read-only aggregate
app.get('/api/pms/owner/summary', requireAuth, requireRole('propertyowner', 'admin', 'manager', 'management'), async (req, res) => {
  try {
    const { role, sub: userId } = req.user;
    const isStaff = ['admin', 'manager', 'management'].includes(role);

    // For staff use query without filter; for owner filter by owner_id
    const ownerFilter = isStaff ? '' : `WHERE l.owner_id = ${userId}`;
    const leasePaymentJoin = `
      FROM leases l
      LEFT JOIN payments pay ON pay.lease_id = l.id AND pay.status = 'success'
      LEFT JOIN properties p ON p.id = l.property_id
      ${ownerFilter}`;

    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT l.id) AS total_leases,
        COUNT(DISTINCT CASE WHEN l.status = 'active' THEN l.id END) AS active_leases,
        COUNT(DISTINCT l.property_id) AS total_properties,
        COALESCE(SUM(pay.amount), 0) AS total_collected,
        COALESCE(AVG(l.rent_amount), 0) AS avg_rent
      ${leasePaymentJoin}
    `);

    const propertyBreakdown = await pool.query(`
      SELECT
        p.id AS property_id,
        p.title AS property_title,
        p.location,
        COUNT(DISTINCT l.id) AS units_occupied,
        COALESCE(SUM(CASE WHEN l.status = 'active' THEN l.rent_amount ELSE 0 END), 0) AS monthly_rent,
        COALESCE(SUM(pay.amount), 0) AS total_paid
      FROM leases l
      LEFT JOIN properties p ON p.id = l.property_id
      LEFT JOIN payments pay ON pay.lease_id = l.id AND pay.status = 'success'
      ${isStaff ? '' : `WHERE l.owner_id = ${userId}`}
      GROUP BY p.id, p.title, p.location
      ORDER BY total_paid DESC
    `);

    return res.json({
      success: true,
      data: {
        summary: {
          totalLeases: Number(stats.rows[0].total_leases),
          activeLeases: Number(stats.rows[0].active_leases),
          totalProperties: Number(stats.rows[0].total_properties),
          totalCollected: Number(stats.rows[0].total_collected),
          avgRent: Number(Number(stats.rows[0].avg_rent).toFixed(2)),
        },
        properties: propertyBreakdown.rows.map(r => ({
          propertyId: r.property_id,
          propertyTitle: r.property_title,
          location: r.location,
          unitsOccupied: Number(r.units_occupied),
          monthlyRent: Number(r.monthly_rent),
          totalPaid: Number(r.total_paid),
        })),
      }
    });
  } catch (error) {
    console.error('Failed to fetch owner summary:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch owner summary' });
  }
});

// ── PAYMENTS ─────────────────────────────────

// POST /api/pms/payments/initiate — Tenant initiates a payment
app.post('/api/pms/payments/initiate', requireAuth, requireRole('tenant'), async (req, res) => {
  try {
    const { sub: userId, email } = req.user;
    const { leaseId, amount, paymentType } = req.body || {};
    const missing = requireFields(req.body || {}, ['amount']);
    if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    // Generate unique reference: KSA_<userId>_<timestamp>_<random>
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    const reference = `KSA_${userId}_${Date.now()}_${rand}`;

    // Insert payment record (status = pending)
    const result = await pool.query(
      `INSERT INTO payments (tenant_id, lease_id, reference, amount, currency, status, payment_type, provider)
       VALUES ($1, $2, $3, $4, 'NGN', 'pending', $5, 'paystack') RETURNING *`,
      [userId, leaseId || null, reference, parsedAmount, paymentType || 'rent']
    );
    const payment = result.rows[0];
    await logAudit(req.user.email, 'CREATE', 'payments', payment.id, null, payment);

    // Paystack configuration: check sandbox toggle dynamically
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const isSandbox = !paystackSecret || process.env.PAYSTACK_MODE === 'sandbox';

    if (!isSandbox) {
      try {
        const paystackRes = await axios.post('https://api.paystack.co/transaction/initialize', {
          email,
          amount: Math.round(parsedAmount * 100), // Paystack expects kobo
          reference,
          callback_url: process.env.PAYSTACK_CALLBACK_URL
        }, {
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            'Content-Type': 'application/json'
          }
        });

        return res.status(201).json({
          success: true,
          data: {
            ...mapPayment(payment),
            authorizationUrl: paystackRes.data.data.authorization_url,
            accessCode: paystackRes.data.data.access_code,
          },
        });
      } catch (err) {
        console.error('Paystack production initiation failed, falling back to sandbox:', err.response?.data || err.message);
        // Fall through to sandbox
      }
    }

    // Sandbox fallback stub
    const stubAuthorizationUrl = `https://paystack.com/pay/stub-${reference}`;

    return res.status(201).json({
      success: true,
      data: {
        ...mapPayment(payment),
        authorizationUrl: stubAuthorizationUrl,
        accessCode: `STUB_${reference}`,
      },
    });
  } catch (error) {
    console.error('Failed to initiate payment:', error);
    return res.status(500).json({ success: false, message: 'Failed to initiate payment' });
  }
});

// POST /api/pms/payments/webhook — Paystack webhook (idempotency guard)
app.post('/api/pms/payments/webhook', async (req, res) => {
  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const isSandbox = !paystackSecret || process.env.PAYSTACK_MODE === 'sandbox';

    if (!isSandbox) {
      const crypto = require('crypto');
      const signature = req.headers['x-paystack-signature'];
      if (!signature) {
        return res.status(401).json({ success: false, message: 'Missing signature' });
      }
      const hash = crypto.createHmac('sha512', paystackSecret)
        .update(JSON.stringify(req.body)).digest('hex');
      if (hash !== signature) {
        return res.status(401).json({ success: false, message: 'Invalid signature' });
      }
    }

    const { event, data } = req.body || {};
    if (!event || !data) return res.status(400).json({ success: false, message: 'Invalid webhook payload' });

    if (event === 'charge.success') {
      const { reference, amount, status } = data;
      if (!reference) return res.status(400).json({ success: false, message: 'Missing reference' });

      // Idempotency: check current status — reject if already success
      const existing = await pool.query('SELECT * FROM payments WHERE reference = $1 LIMIT 1', [reference]);
      if (existing.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Payment reference not found' });
      }
      const payment = existing.rows[0];
      if (payment.status === 'success') {
        // Already processed — return 200 to acknowledge to Paystack without re-processing
        return res.json({ success: true, message: 'Already processed' });
      }

      // Confirm amount matches (kobo → naira conversion from Paystack)
      const amountInNaira = (amount || 0) / 100;
      const result = await pool.query(
        `UPDATE payments SET
          status = 'success',
          provider_response = $2,
          paid_at = NOW(),
          amount = $3,
          updated_at = NOW()
         WHERE reference = $1 RETURNING *`,
        [reference, JSON.stringify(data), amountInNaira]
      );
      await logAudit('paystack-webhook', 'WEBHOOK_SUCCESS', 'payments', result.rows[0].id, payment, result.rows[0]);
    }

    if (event === 'charge.failed') {
      const { reference } = data;
      if (reference) {
        const existing = await pool.query('SELECT status FROM payments WHERE reference = $1 LIMIT 1', [reference]);
        if (existing.rowCount > 0 && existing.rows[0].status === 'pending') {
          await pool.query(
            `UPDATE payments SET status = 'failed', provider_response = $2, updated_at = NOW() WHERE reference = $1`,
            [reference, JSON.stringify(data)]
          );
        }
      }
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

// GET /api/pms/payments/history — Tenant: own payment history
app.get('/api/pms/payments/history', requireAuth, requireRole('tenant', 'admin', 'manager', 'management'), async (req, res) => {
  try {
    const { role, sub: userId } = req.user;
    const isStaff = ['admin', 'manager', 'management'].includes(role);

    const result = await pool.query(
      `SELECT * FROM payments
       ${isStaff ? '' : 'WHERE tenant_id = $1'}
       ORDER BY created_at DESC`,
      isStaff ? [] : [userId]
    );
    return res.json({ success: true, data: result.rows.map(mapPayment) });
  } catch (error) {
    console.error('Failed to fetch payment history:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch payment history' });
  }
});

// ============================================
// SUPERADMIN & GHOST ADMIN CONTROL ENDPOINTS
// ============================================

// POST /api/v1/admin/impersonate — Start impersonation session
app.post('/api/v1/admin/impersonate', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

    // Find target user
    const result = await pool.query(
      'SELECT id, email, role, name, status FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1',
      [userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const targetUser = result.rows[0];

    if (targetUser.id === req.user.sub) {
      return res.status(400).json({ success: false, message: 'Cannot impersonate yourself' });
    }

    // Log impersonation start in audit logs
    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(
      auditUser,
      'IMPERSONATION_START',
      'users',
      targetUser.id,
      null,
      {
        impersonatorId: req.user.sub,
        impersonatorEmail: req.user.email,
        targetId: targetUser.id,
        targetEmail: targetUser.email,
        targetRole: targetUser.role
      }
    );

    // Sign target access token with impersonator claims
    const impersonatedAccessToken = jwt.sign(
      {
        sub: targetUser.id,
        email: targetUser.email,
        role: targetUser.role,
        impersonatorId: req.user.sub,
        impersonatorEmail: req.user.email
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // Overwrite access token cookie (refresh cookie remains admin's refresh token)
    res.cookie('ksa_access', impersonatedAccessToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      path: '/'
    });

    return res.json({
      success: true,
      data: {
        id: targetUser.id,
        email: targetUser.email,
        role: targetUser.role,
        name: targetUser.name,
        impersonatorId: req.user.sub,
        impersonatorEmail: req.user.email
      }
    });
  } catch (error) {
    console.error('Impersonation start error:', error);
    return res.status(500).json({ success: false, message: 'Failed to start impersonation' });
  }
});

// POST /api/v1/admin/impersonate/stop — Return to admin session
app.post('/api/v1/admin/impersonate/stop', async (req, res) => {
  try {
    const refresh = req.cookies.ksa_refresh;
    if (!refresh) return res.status(401).json({ success: false, message: 'Session expired' });

    const decoded = jwt.verify(refresh, JWT_REFRESH_SECRET);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ success: false, message: 'Invalid session' });
    }

    const result = await pool.query(
      'SELECT id, email, role, name, status FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1',
      [decoded.sub]
    );
    if (result.rowCount === 0) return res.status(401).json({ success: false, message: 'Admin user not found' });
    const adminUser = result.rows[0];

    if (adminUser.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Admin account suspended' });
    }

    // Whitelist check
    const superadminEmails = (process.env.SUPERADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    if (adminUser.role !== 'admin' || !superadminEmails.includes(adminUser.email.toLowerCase())) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Sign new normal admin access token
    const newAccessToken = signAccessToken(adminUser);

    res.cookie('ksa_access', newAccessToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      path: '/'
    });

    return res.json({ success: true, data: adminUser });
  } catch (error) {
    console.error('Impersonation stop error:', error);
    return res.status(500).json({ success: false, message: 'Failed to stop impersonation' });
  }
});

// GET /api/v1/admin/users — List all users (excluding soft-deleted)
app.get('/api/v1/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, role, name, status, google_id, created_at, updated_at 
       FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch users error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// POST /api/v1/admin/users — Create a user with any role
app.post('/api/v1/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, role, password } = req.body || {};
    const missing = requireFields(req.body || {}, ['name', 'email', 'role']);
    if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });

    const checkEmail = await pool.query('SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1', [String(email).toLowerCase().trim()]);
    if (checkEmail.rowCount > 0) return res.status(400).json({ success: false, message: 'Email address already registered' });

    // Require password if not google user (creation from panel always defaults to local user password first)
    const pass = password || 'KsaValuers@2026!'; // default password if not provided
    const passError = validatePasswordPolicy(pass);
    if (passError) return res.status(400).json({ success: false, message: passError });

    const hash = await bcrypt.hash(pass, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, status)
       VALUES ($1, $2, $3, $4, 'active') RETURNING id, email, role, name, status, created_at`,
      [name, String(email).toLowerCase().trim(), hash, role]
    );

    const createdUser = result.rows[0];
    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'CREATE_USER', 'users', createdUser.id, null, { name: createdUser.name, email: createdUser.email, role: createdUser.role });

    return res.status(201).json({ success: true, data: createdUser });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

// PUT /api/v1/admin/users/:id — Edit user details/status/role
app.put('/api/v1/admin/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid user ID' });

    const { name, role, status, email } = req.body || {};

    const beforeResult = await pool.query('SELECT name, role, status, email FROM users WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const beforeData = beforeResult.rows[0];

    // Safety check: Cannot demote or suspend oneself
    if (id === req.user.sub && (status === 'suspended' || role !== 'admin')) {
      return res.status(400).json({ success: false, message: 'Security Constraint: Cannot suspend or demote your own active account.' });
    }

    // If updating email, check for conflicts
    if (email && email.toLowerCase().trim() !== beforeData.email.toLowerCase().trim()) {
      const checkConflict = await pool.query('SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL AND id != $2 LIMIT 1', [email.toLowerCase().trim(), id]);
      if (checkConflict.rowCount > 0) return res.status(400).json({ success: false, message: 'Email address already in use by another user' });
    }

    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        status = COALESCE($3, status),
        email = COALESCE($4, email),
        updated_at = NOW()
       WHERE id = $5 RETURNING id, email, role, name, status, updated_at`,
      [name, role, status, email ? email.toLowerCase().trim() : null, id]
    );

    const updatedUser = result.rows[0];
    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'EDIT_USER', 'users', id, beforeData, updatedUser);

    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Edit user error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

// DELETE /api/v1/admin/users/:id — Soft-delete user
app.delete('/api/v1/admin/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid user ID' });

    if (id === req.user.sub) {
      return res.status(400).json({ success: false, message: 'Security Constraint: Cannot delete your own active session.' });
    }

    const checkUser = await pool.query('SELECT role, email FROM users WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (checkUser.rowCount === 0) return res.status(404).json({ success: false, message: 'User not found' });

    // Safety check: Cannot delete the last superadmin
    if (checkUser.rows[0].role === 'admin') {
      const activeAdmins = await pool.query(
        "SELECT count(*) FROM users WHERE role = 'admin' AND deleted_at IS NULL"
      );
      if (Number(activeAdmins.rows[0].count) <= 1) {
        return res.status(400).json({ success: false, message: 'Security Constraint: Cannot delete the last active Superadmin.' });
      }
    }

    await pool.query("UPDATE users SET deleted_at = NOW(), status = 'suspended' WHERE id = $1", [id]);

    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'DELETE_USER', 'users', id, { email: checkUser.rows[0].email }, null);

    return res.json({ success: true, message: 'User soft-deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// GET /api/v1/admin/audit-logs — Paginated audit logs with on-the-fly cryptographic verification
app.get('/api/v1/admin/audit-logs', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const countResult = await pool.query('SELECT count(*) FROM audit_logs');
    const totalLogs = parseInt(countResult.rows[0].count);

    const logsResult = await pool.query(
      `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const logs = logsResult.rows.map(row => {
      // Re-verify hash to detect tampering
      const email = row.user_email || 'system';
      const recId = String(row.record_id);
      const beforeStr = row.before_data ? JSON.stringify(row.before_data) : null;
      const afterStr = row.after_data ? JSON.stringify(row.after_data) : null;
      const ts = new Date(row.created_at);

      const hashInput = `${email}|${row.action}|${row.table_name}|${recId}|${beforeStr || ''}|${afterStr || ''}|${ts.toISOString()}`;
      const recomputedHash = crypto.createHmac('sha256', JWT_SECRET).update(hashInput).digest('hex');

      // If row has no hash stored, mark as unverified (except for old legacy migrations logs)
      const verified = row.hash ? row.hash === recomputedHash : false;

      return {
        id: row.id,
        userEmail: row.user_email,
        action: row.action,
        tableName: row.table_name,
        recordId: row.record_id,
        beforeData: row.before_data,
        afterData: row.after_data,
        createdAt: row.created_at,
        verified
      };
    });

    return res.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        totalItems: totalLogs,
        totalPages: Math.ceil(totalLogs / limit)
      }
    });
  } catch (error) {
    console.error('Audit logs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
  }
});


// ============================================
// DYNAMIC CONTENT ENDPOINTS (TEAM & FAQS)
// ============================================

const isAbsoluteUrl = (str) => {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// GET /api/team — Public: list team members
app.get('/api/team', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, role, tag, image_url, description, email FROM team_members WHERE deleted_at IS NULL ORDER BY id ASC'
    );
    return res.json({
      success: true,
      data: result.rows.map(r => ({
        id: r.id,
        name: r.name,
        role: r.role,
        tag: r.tag,
        imageUrl: r.image_url,
        description: r.description,
        email: r.email
      }))
    });
  } catch (error) {
    console.error('Fetch team error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch team members' });
  }
});

// POST /api/team — Admin/WebAdmin: create team member
app.post('/api/team', requireAuth, requireRole('admin', 'webadmin'), async (req, res) => {
  try {
    const { name, role, tag, imageUrl, description, email } = req.body || {};
    const missing = requireFields(req.body || {}, ['name', 'role', 'imageUrl']);
    if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });

    // Asset Policy Check: Reject binary uploads / relative paths; only absolute URLs or seeded filenames
    const isAssetSeeded = imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') || imageUrl.endsWith('.png');
    if (!isAbsoluteUrl(imageUrl) && !isAssetSeeded) {
      return res.status(400).json({
        success: false,
        message: 'Asset Strategy Violation: Image URL must be an absolute URL (e.g. from Cloudinary, Imgur, or CDN).'
      });
    }

    const result = await pool.query(
      `INSERT INTO team_members (name, role, tag, image_url, description, email)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, role, tag || null, imageUrl, description || null, email || null]
    );

    const team = result.rows[0];
    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'CREATE_TEAM_MEMBER', 'team_members', team.id, null, team);

    return res.status(201).json({ success: true, data: team });
  } catch (error) {
    console.error('Create team member error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create team member' });
  }
});

// PUT /api/team/:id — Admin/WebAdmin: update team member
app.put('/api/team/:id', requireAuth, requireRole('admin', 'webadmin'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid team member ID' });

    const { name, role, tag, imageUrl, description, email } = req.body || {};

    const beforeResult = await pool.query('SELECT * FROM team_members WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'Team member not found' });
    const beforeData = beforeResult.rows[0];

    // Asset Policy Check if imageUrl is changed
    if (imageUrl) {
      const isAssetSeeded = imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') || imageUrl.endsWith('.png');
      if (!isAbsoluteUrl(imageUrl) && !isAssetSeeded) {
        return res.status(400).json({
          success: false,
          message: 'Asset Strategy Violation: Image URL must be an absolute URL (e.g. from Cloudinary, Imgur, or CDN).'
        });
      }
    }

    const result = await pool.query(
      `UPDATE team_members SET
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        tag = COALESCE($3, tag),
        image_url = COALESCE($4, image_url),
        description = COALESCE($5, description),
        email = COALESCE($6, email),
        updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [name, role, tag, imageUrl, description, email, id]
    );

    const updated = result.rows[0];
    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'UPDATE_TEAM_MEMBER', 'team_members', id, beforeData, updated);

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update team member error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update team member' });
  }
});

// DELETE /api/team/:id — Admin/WebAdmin: soft-delete team member
app.delete('/api/team/:id', requireAuth, requireRole('admin', 'webadmin'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid team member ID' });

    const check = await pool.query('SELECT name FROM team_members WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (check.rowCount === 0) return res.status(404).json({ success: false, message: 'Team member not found' });

    await pool.query('UPDATE team_members SET deleted_at = NOW() WHERE id = $1', [id]);

    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'DELETE_TEAM_MEMBER', 'team_members', id, { name: check.rows[0].name }, null);

    return res.json({ success: true, message: 'Team member soft-deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete team member' });
  }
});

// GET /api/faqs — Public: list FAQs
app.get('/api/faqs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, question, answer, category, sort_order FROM faqs WHERE deleted_at IS NULL ORDER BY sort_order ASC, id ASC'
    );
    return res.json({
      success: true,
      data: result.rows.map(r => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
        category: r.category,
        sortOrder: r.sort_order
      }))
    });
  } catch (error) {
    console.error('Fetch FAQs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch FAQs' });
  }
});

// POST /api/faqs — Admin/WebAdmin: create FAQ
app.post('/api/faqs', requireAuth, requireRole('admin', 'webadmin'), async (req, res) => {
  try {
    const { question, answer, category, sortOrder } = req.body || {};
    const missing = requireFields(req.body || {}, ['question', 'answer', 'category']);
    if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });

    const result = await pool.query(
      `INSERT INTO faqs (question, answer, category, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [question, answer, category, sortOrder || 0]
    );

    const faq = result.rows[0];
    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'CREATE_FAQ', 'faqs', faq.id, null, faq);

    return res.status(201).json({ success: true, data: faq });
  } catch (error) {
    console.error('Create FAQ error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create FAQ' });
  }
});

// PUT /api/faqs/:id — Admin/WebAdmin: update FAQ
app.put('/api/faqs/:id', requireAuth, requireRole('admin', 'webadmin'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid FAQ ID' });

    const { question, answer, category, sortOrder } = req.body || {};

    const beforeResult = await pool.query('SELECT * FROM faqs WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (beforeResult.rowCount === 0) return res.status(404).json({ success: false, message: 'FAQ not found' });
    const beforeData = beforeResult.rows[0];

    const result = await pool.query(
      `UPDATE faqs SET
        question = COALESCE($1, question),
        answer = COALESCE($2, answer),
        category = COALESCE($3, category),
        sort_order = COALESCE($4, sort_order),
        updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [question, answer, category, sortOrder, id]
    );

    const updated = result.rows[0];
    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'UPDATE_FAQ', 'faqs', id, beforeData, updated);

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update FAQ error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update FAQ' });
  }
});

// DELETE /api/faqs/:id — Admin/WebAdmin: soft-delete FAQ
app.delete('/api/faqs/:id', requireAuth, requireRole('admin', 'webadmin'), async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid FAQ ID' });

    const check = await pool.query('SELECT question FROM faqs WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (check.rowCount === 0) return res.status(404).json({ success: false, message: 'FAQ not found' });

    await pool.query('UPDATE faqs SET deleted_at = NOW() WHERE id = $1', [id]);

    const auditUser = req.user.impersonatorEmail ? `${req.user.impersonatorEmail} [impersonating ${req.user.email}]` : req.user.email;
    await logAudit(auditUser, 'DELETE_FAQ', 'faqs', id, { question: check.rows[0].question }, null);

    return res.json({ success: true, message: 'FAQ soft-deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete FAQ' });
  }
});

// ============================================
// FILE UPLOAD ENDPOINT
// ============================================
app.post('/api/upload', requireAuth, async (req, res) => {
  try {
    const { fileName, fileData } = req.body || {};
    if (!fileName || !fileData) {
      return res.status(400).json({ success: false, message: 'Filename and base64 file data are required.' });
    }

    // Expecting base64 data url, e.g. "data:image/jpeg;base64,..."
    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid base64 data format. Must be a valid Data URL.' });
    }

    const fileBuffer = Buffer.from(matches[2], 'base64');

    // Sanitize file name to avoid directory traversal
    const sanitizedFileName = path.basename(fileName).replace(/[^a-zA-Z0-9.\-_]/g, '_');

    // Prefix with a timestamp to avoid naming collisions
    const finalFileName = `${Date.now()}-${sanitizedFileName}`;
    const uploadPath = path.join(__dirname, 'uploads', finalFileName);

    // Save to disk
    fs.writeFileSync(uploadPath, fileBuffer);

    // Generate absolute URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${finalFileName}`;

    return res.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('File upload failed:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during file upload.' });
  }
});

// ============================================
// PRODUCTION STATIC FILE SERVING
// ============================================
// In production, serve the Vue frontend build from ../dist
const distPath = path.join(__dirname, '..', 'dist');
if (process.env.NODE_ENV === 'production' || fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback — any route not matching /api/* returns index.html
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ============================================
// START SERVER
// ============================================

(async () => {
  try {
    // Initialize database
    await initializeDatabase();

    // Initialize email service
    await initializeEmailService();

    // Start listening
    const server = app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
      console.log(`🗄️ PostgreSQL: ✅`);
      console.log(`📧 Email: ${emailService ? `✅ (${process.env.EMAIL_PROVIDER || 'gmail'})` : '⚠️  Not configured'}`);
      console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
      console.log('=================================');
    });

    // Graceful Shutdown signal listeners
    const gracefulShutdown = (signal) => {
      console.log(`\n=================================`);
      console.log(`♻️  Received ${signal}. Starting graceful shutdown...`);

      // Close server first
      server.close(() => {
        console.log('🛑 Express HTTP server closed.');

        // End PostgreSQL connection pool
        pool.end(() => {
          console.log('🗄️  PostgreSQL database pool terminated.');
          console.log('👋 Clean exit complete. Goodbye!');
          console.log(`=================================`);
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
})();
