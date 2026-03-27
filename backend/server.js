require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();

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
// PROPERTIES & PROJECTS API ENDPOINTS
// ============================================

// In-memory storage (replace with database in production)
let properties = [];
let projects = [];
let bookings = [];
let bookingIdCounter = 1;

// Properties endpoints
app.get('/api/properties', (req, res) => {
  res.json({ success: true, data: properties });
});

app.get('/api/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === parseInt(req.params.id));
  if (property) {
    res.json({ success: true, data: property });
  } else {
    res.status(404).json({ success: false, message: 'Property not found' });
  }
});

app.post('/api/properties', (req, res) => {
  const newProperty = {
    id: properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  properties.unshift(newProperty);
  res.json({ success: true, data: newProperty, message: '✅ Property created successfully!' });
});

app.put('/api/properties/:id', (req, res) => {
  const index = properties.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    properties[index] = {
      ...properties[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json({ success: true, data: properties[index], message: '✅ Property updated successfully!' });
  } else {
    res.status(404).json({ success: false, message: 'Property not found' });
  }
});

app.delete('/api/properties/:id', (req, res) => {
  const initialLength = properties.length;
  properties = properties.filter(p => p.id !== parseInt(req.params.id));
  if (properties.length < initialLength) {
    res.json({ success: true, message: '✅ Property deleted successfully!' });
  } else {
    res.status(404).json({ success: false, message: 'Property not found' });
  }
});

// Projects endpoints
app.get('/api/projects', (req, res) => {
  res.json({ success: true, data: projects });
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (project) {
    res.json({ success: true, data: project });
  } else {
    res.status(404).json({ success: false, message: 'Project not found' });
  }
});

app.post('/api/projects', (req, res) => {
  const newProject = {
    id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  projects.unshift(newProject);
  res.json({ success: true, data: newProject, message: '✅ Project created successfully!' });
});

app.put('/api/projects/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    projects[index] = {
      ...projects[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json({ success: true, data: projects[index], message: '✅ Project updated successfully!' });
  } else {
    res.status(404).json({ success: false, message: 'Project not found' });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  const initialLength = projects.length;
  projects = projects.filter(p => p.id !== parseInt(req.params.id));
  if (projects.length < initialLength) {
    res.json({ success: true, message: '✅ Project deleted successfully!' });
  } else {
    res.status(404).json({ success: false, message: 'Project not found' });
  }
});

// ============================================
// BOOKINGS / APPOINTMENTS API ENDPOINTS
// ============================================

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, data: bookings });
});

// Get available time slots for a date
app.get('/api/bookings/available-slots', (req, res) => {
  const { date, propertyId } = req.query;
  if (!date) {
    return res.status(400).json({ success: false, message: 'Date is required' });
  }

  const allSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const bookedForDate = bookings.filter(b => {
    const matchDate = b.date === date && b.status !== 'cancelled';
    if (propertyId) return matchDate && b.property === propertyId;
    return matchDate;
  });
  const bookedTimes = bookedForDate.map(b => b.time);

  const slots = allSlots.map(time => ({
    time,
    isBooked: bookedTimes.includes(time)
  }));

  res.json({ success: true, data: slots });
});

// Get single booking
app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (booking) {
    res.json({ success: true, data: booking });
  } else {
    res.status(404).json({ success: false, message: 'Booking not found' });
  }
});

// Create a new booking
app.post('/api/bookings', (req, res) => {
  const data = req.body.data || req.body;
  const id = data.bookingId || `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  const newBooking = {
    id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    date: data.date,
    time: data.time,
    guests: data.guests || 1,
    notes: data.notes || '',
    property: data.property || null,
    status: data.status || 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Check for duplicate time slot
  const duplicate = bookings.find(
    b => b.date === newBooking.date && b.time === newBooking.time && b.status !== 'cancelled'
  );
  if (duplicate) {
    return res.status(409).json({ success: false, message: 'This time slot is already booked.' });
  }

  bookings.unshift(newBooking);
  res.json({ success: true, data: newBooking, message: 'Booking created successfully!' });
});

// Update booking (status, notes, etc.)
app.put('/api/bookings/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  const updates = req.body.data || req.body;
  bookings[index] = {
    ...bookings[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  res.json({ success: true, data: bookings[index], message: 'Booking updated successfully!' });
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
  const initialLength = bookings.length;
  bookings = bookings.filter(b => b.id !== req.params.id);
  if (bookings.length < initialLength) {
    res.json({ success: true, message: 'Booking deleted successfully!' });
  } else {
    res.status(404).json({ success: false, message: 'Booking not found' });
  }
});

// ============================================
// APPOINTMENTS ENDPOINTS (aliases for bookings)
// ============================================

app.get('/api/appointments', (req, res) => {
  res.json(bookings);
});

app.get('/api/appointments/all', (req, res) => {
  res.json({ success: true, data: bookings });
});

app.post('/api/appointments/schedule', (req, res) => {
  const data = req.body;
  const newBooking = {
    id: `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    date: data.date,
    time: data.time,
    property: data.property || null,
    guests: data.guests || 1,
    notes: data.notes || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  bookings.unshift(newBooking);
  res.json({ success: true, data: newBooking });
});

app.put('/api/appointments/status', (req, res) => {
  const { id, status } = req.body;
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }
  bookings[index].status = status;
  bookings[index].updatedAt = new Date().toISOString();
  res.json({ success: true, data: bookings[index] });
});

app.put('/api/appointments/cancel/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }
  bookings[index].status = 'cancelled';
  bookings[index].updatedAt = new Date().toISOString();
  res.json({ success: true, data: bookings[index] });
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER ? '✅' : '❌'}`);
  console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
  console.log(`🏠 Properties API: ✅`);
  console.log(`🏗️ Projects API: ✅`);
  console.log('=================================');
});
