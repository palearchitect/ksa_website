require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { runMigrations } = require('./migrations/init');
const { createEmailService } = require('./services/emailService');
const { getTemplate } = require('./services/emailTemplates');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace-me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'replace-me-too';
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

// Middleware
app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : false,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

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
};

const clearAuthCookies = (res) => {
  res.clearCookie('ksa_access', { path: '/' });
  res.clearCookie('ksa_refresh', { path: '/' });
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
  if (!req.user || !roles.includes(req.user.role)) {
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
app.post('/api/contact', async (req, res) => {
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

// ============================================
// AUTH ENDPOINTS
// ============================================
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const missing = requireFields(req.body || {}, ['email', 'password']);
    if (missing.length > 0) {
      return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
    }

    const result = await pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [String(email).toLowerCase()]);
    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const authUser = { id: user.id, email: user.email, role: user.role, name: user.name };
    setAuthCookies(res, signAccessToken(authUser), signRefreshToken(authUser));
    return res.json({ success: true, data: authUser });
  } catch (error) {
    console.error('Auth login error:', error);
    return res.status(500).json({ success: false, message: 'Failed to login' });
  }
});

app.post('/api/v1/auth/refresh', async (req, res) => {
  try {
    const refresh = req.cookies.ksa_refresh;
    if (!refresh) return res.status(401).json({ success: false, message: 'No refresh token' });
    const decoded = jwt.verify(refresh, JWT_REFRESH_SECRET);
    const result = await pool.query(`SELECT id, email, role, name FROM users WHERE id = $1 LIMIT 1`, [decoded.sub]);
    if (result.rowCount === 0) return res.status(401).json({ success: false, message: 'User not found' });
    const user = result.rows[0];
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
  const result = await pool.query(`SELECT id, email, role, name FROM users WHERE id = $1 LIMIT 1`, [req.user.sub]);
  if (result.rowCount === 0) return res.status(401).json({ success: false, message: 'User not found' });
  return res.json({ success: true, data: result.rows[0] });
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

    // ✅ USING THE CORRECT MODEL FROM YOUR LIST: gemini-2.5-flash
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    console.log('📡 Calling Gemini API with model: gemini-2.5-flash');

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

    // Using gemini-2.5-flash for cached endpoint too
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
app.get('/api/properties', async (_req, res) => {
  const result = await pool.query(`SELECT * FROM properties ORDER BY created_at DESC`);
  res.json({ success: true, data: result.rows.map(mapProperty) });
});

app.get('/api/properties/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'Invalid property id' });
  const result = await pool.query(`SELECT * FROM properties WHERE id = $1 LIMIT 1`, [id]);
  if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Property not found' });
  res.json({ success: true, data: mapProperty(result.rows[0]) });
});

app.post('/api/properties', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const missing = requireFields(req.body || {}, ['title', 'location', 'price']);
  if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
  const payload = req.body;
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
  res.json({ success: true, data: mapProperty(result.rows[0]) });
});

app.put('/api/properties/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'Invalid property id' });
  const payload = req.body || {};
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
  if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Property not found' });
  res.json({ success: true, data: mapProperty(result.rows[0]) });
});

app.delete('/api/properties/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'Invalid property id' });
  const result = await pool.query(`DELETE FROM properties WHERE id = $1`, [id]);
  if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Property not found' });
  res.json({ success: true });
});

app.get('/api/projects', async (_req, res) => {
  const result = await pool.query(`SELECT * FROM projects ORDER BY created_at DESC`);
  res.json({ success: true, data: result.rows.map(mapProject) });
});

app.get('/api/projects/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'Invalid project id' });
  const result = await pool.query(`SELECT * FROM projects WHERE id = $1 LIMIT 1`, [id]);
  if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: mapProject(result.rows[0]) });
});

app.post('/api/projects', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const missing = requireFields(req.body || {}, ['title', 'location', 'status', 'type']);
  if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
  const payload = req.body || {};
  const result = await pool.query(
    `INSERT INTO projects (title, location, image, description, status, type, total_units, completion_percentage, start_date, expected_completion, budget, featured, amenities)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [payload.title, payload.location, payload.image || null, payload.description || null, payload.status, payload.type,
      payload.totalUnits || null, payload.completionPercentage || 0, payload.startDate || null, payload.expectedCompletion || null,
      Number(payload.budget || 0), Boolean(payload.featured), JSON.stringify(payload.amenities || [])
    ]
  );
  res.json({ success: true, data: mapProject(result.rows[0]) });
});

app.put('/api/projects/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'Invalid project id' });
  const payload = req.body || {};
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
  if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: mapProject(result.rows[0]) });
});

app.delete('/api/projects/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'Invalid project id' });
  const result = await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
  if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true });
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
app.post('/api/bookings', async (req, res) => {
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
  res.json({ success: true, data: mapBooking(result.rows[0]), message: 'Booking created successfully!' });
});

// Update booking (status, notes, etc.)
app.put('/api/bookings/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const updates = req.body.data || req.body || {};
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
  if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, data: mapBooking(result.rows[0]), message: 'Booking updated successfully!' });
});

// Delete booking
app.delete('/api/bookings/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const result = await pool.query(`DELETE FROM bookings WHERE id = $1`, [req.params.id]);
  if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, message: 'Booking deleted successfully!' });
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

app.post('/api/appointments/schedule', async (req, res) => {
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
  res.json({ success: true, data: mapBooking(result.rows[0]) });
});

app.put('/api/appointments/status', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const { id, status } = req.body;
  const result = await pool.query(`UPDATE bookings SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *`, [id, status]);
  if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Appointment not found' });
  res.json({ success: true, data: mapBooking(result.rows[0]) });
});

app.put('/api/appointments/cancel/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const result = await pool.query(`UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *`, [req.params.id]);
  if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Appointment not found' });
  res.json({ success: true, data: mapBooking(result.rows[0]) });
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
// START SERVER
// ============================================
(async () => {
  try {
    // Initialize database
    await initializeDatabase();

    // Initialize email service
    await initializeEmailService();

    // Start listening
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
      console.log(`🗄️ PostgreSQL: ✅`);
      console.log(`📧 Email: ${emailService ? `✅ (${process.env.EMAIL_PROVIDER || 'gmail'})` : '⚠️  Not configured'}`);
      console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
})();
