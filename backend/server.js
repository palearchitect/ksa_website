require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace-me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'replace-me-too';
const ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_TTL || '15m';
const REFRESH_TOKEN_TTL = process.env.JWT_REFRESH_TTL || '7d';
const IS_PROD = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

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
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
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

const initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      image TEXT,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      price NUMERIC NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'sale',
      type TEXT,
      bedrooms INTEGER,
      bathrooms INTEGER,
      square_footage INTEGER,
      description TEXT,
      featured BOOLEAN NOT NULL DEFAULT false,
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      image TEXT,
      description TEXT,
      status TEXT NOT NULL,
      type TEXT NOT NULL,
      total_units INTEGER,
      completion_percentage INTEGER DEFAULT 0,
      start_date DATE,
      expected_completion DATE,
      budget NUMERIC DEFAULT 0,
      featured BOOLEAN DEFAULT false,
      amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      property_id INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      booking_date DATE NOT NULL,
      booking_time TEXT NOT NULL,
      guests INTEGER NOT NULL DEFAULT 1,
      notes TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings (booking_date, booking_time);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_bookings_property_date_time ON bookings (property_id, booking_date, booking_time);`);

  const existingAdmin = await pool.query(`SELECT id FROM users WHERE email = $1 LIMIT 1`, ['admin@ksavaluers.com']);
  if (existingAdmin.rowCount === 0) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeMeNow_123', 12);
    await pool.query(
      `INSERT INTO users (email, password_hash, role, name) VALUES ($1, $2, $3, $4)`,
      ['admin@ksavaluers.com', hash, 'admin', 'Admin User']
    );
    console.log('✅ Seeded default admin user');
  }
};

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email connection
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email config error:', error.message);
  } else {
    console.log('✅ Email server ready');
  }
});

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

    const mailOptions = {
      from: `"KSA Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `Website Contact: ${subject}`,
      html: `
        <h3>New Contact from KSA Website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)`,
      [name, email, phone || null, subject, message]
    );
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });

  } catch (error) {
    console.error('Email error:', error);
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
// EMAIL STUB ENDPOINTS (for BookTour.vue)
// ============================================

app.post('/email/booking-confirmation', async (req, res) => {
  const { booking } = req.body;
  try {
    if (process.env.EMAIL_USER) {
      await transporter.sendMail({
        from: `"KSA Bookings" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: `Booking Confirmation - ${booking.bookingId}`,
        html: `
          <h3>Tour Booking Confirmation</h3>
          <p>Dear ${booking.name},</p>
          <p>Your property tour has been scheduled:</p>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p><strong>Date:</strong> ${booking.formattedDate || booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p>We will contact you shortly to confirm. Thank you!</p>
          <p>- KSA Valuers Team</p>
        `
      });
    }
    res.json({ success: true, message: 'Confirmation email sent' });
  } catch (error) {
    console.error('Booking confirmation email error:', error);
    res.json({ success: true, message: 'Booking saved (email delivery pending)' });
  }
});

app.post('/email/admin-notification', async (req, res) => {
  const { booking } = req.body;
  try {
    if (process.env.EMAIL_USER && process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: `"KSA Website" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Tour Booking - ${booking.bookingId}`,
        html: `
          <h3>New Tour Booking Received</h3>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p><strong>Name:</strong> ${booking.name}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          <p><strong>Date:</strong> ${booking.formattedDate || booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Guests:</strong> ${booking.guests || 1}</p>
          <p><strong>Notes:</strong> ${booking.notes || 'None'}</p>
        `
      });
    }
    res.json({ success: true, message: 'Admin notification sent' });
  } catch (error) {
    console.error('Admin notification email error:', error);
    res.json({ success: true, message: 'Notification pending' });
  }
});

// ============================================
// START SERVER
// ============================================
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
      console.log(`🗄️ PostgreSQL: ✅`);
      console.log(`📧 Email: ${process.env.EMAIL_USER ? '✅' : '❌'}`);
      console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
      console.log('=================================');
    });
  })
  .catch((error) => {
    console.error('❌ Failed to initialize database:', error.message);
    process.exit(1);
  });
