# KSA Valuers (Kayode Segun & Associates) - Deployment Guide

## Project Overview
KSA Valuers is a modern real estate website built with Vue 3, Pinia, Vue Router, Tailwind CSS, and an Express.js backend with Gemini AI integration.

**Tech Stack:**
- **Frontend**: Vue 3 (Composition API), Vite, Pinia, Vue Router, Tailwind CSS
- **Backend**: Express.js, Nodemailer, Gemini AI (2.5-flash)
- **Database**: LocalStorage (frontend), expandable to MongoDB/PostgreSQL

---

## Prerequisites

- Node.js v18+ and npm
- Modern browser (Chrome, Firefox, Edge)
- Gmail account (for email functionality)
- Gemini AI API key (for chatbot)

---

## Installation

### 1. Clone & Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Variables

Create `.env` file in the **backend/** directory:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
ADMIN_EMAIL=admin@ksavaluers.com

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Server Port
PORT=3000
```

**Note**: For Gmail, use [App-Specific Password](https://support.google.com/accounts/answer/185833)

---

## Development

### Run Frontend & Backend Together

```bash
npm run dev:all
```

This runs:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:3000`

### Run Separately

```bash
# Frontend only
npm run dev

# Backend only
cd backend
npm run dev
```

---

## Production Build

### 1. Build Frontend

```bash
npm run build
```

Output: `dist/` folder

### 2. Preview Production Build

```bash
npm run preview
```

### 3. Deploy Backend

```bash
cd backend
npm start
```

---

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**
1. Push to GitHub
2. Connect to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables (if needed)

**Backend (Railway/Render):**
1. Push backend folder to Git
2. Connect to Railway/Render
3. Set start command: `npm start`
4. Add environment variables

### Option 2: Netlify (Frontend) + Heroku (Backend)

**Frontend (Netlify):**
1. Drag & drop `dist/` folder, or
2. Connect GitHub repo
3. Build command: `npm run build`
4. Publish directory: `dist`

**Backend (Heroku):**
```bash
cd backend
heroku create ksa-valuers-api
git push heroku main
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-password
heroku config:set GEMINI_API_KEY=your-key
```

### Option 3: DigitalOcean/AWS (Full Stack)

1. Setup Ubuntu server
2. Install Node.js, nginx
3. Clone repository
4. Configure nginx as reverse proxy
5. Use PM2 for process management:

```bash
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name ksa-backend

# Serve frontend
pm2 serve dist/ 5173 --name ksa-frontend
```

---

## Admin Access

### Login
- Navigate to `/admin/login`
- Default setup uses JWT stored in localStorage
- Admin token key: `adminToken`

### Protected Routes
All `/admin/*` routes require authentication. If not logged in, users are redirected to `/admin/login`.

---

## API Endpoints

### Backend API (Port 3000)

**Contact Form:**
```
POST /api/contact
Body: { name, email, phone, subject, message }
```

**AI Chatbot:**
```
POST /api/ask-ai
Body: { question }
```

**Health Check:**
```
GET /api/health
GET /api/test
```

---

## Configuration

### Update Site Information

**Title & Meta Tags** - `index.html`:
```html
<title>KSA Valuers - Real Estate Valuation in Nigeria</title>
<meta name="description" content="..." />
```

**Dynamic SEO** - Use `useSEO` composable in views:
```javascript
import { useSEO } from '@/hooks/useSEO'

useSEO({
  title: 'Properties - KSA Valuers',
  description: 'Browse our property listings...'
})
```

---

## Troubleshooting

### Common Issues

**1. Backend not responding**
- Check if backend is running on port 3000
- Verify `.env` file exists in `backend/` folder
- Check backend logs: `cd backend && npm run dev`

**2. Email not sending**
- Verify Gmail App Password is correct
- Check `EMAIL_USER` and `EMAIL_PASS` in `.env`
- Test with: `GET http://localhost:3000/api/health`

**3. AI chatbot not working**
- Verify `GEMINI_API_KEY` is valid
- Check API quota at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Test with: `POST http://localhost:3000/api/ask-ai`

**4. Admin routes not working**
- Clear localStorage: `localStorage.clear()`
- Check if `adminToken` exists after login
- Verify JWT token format in console

**5. Build errors**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist node_modules/.vite`

---

## Security Checklist

Before production:
- [ ] Change default admin credentials
- [ ] Use HTTPS for production
- [ ] Set CORS to specific domains (not `*`)
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting on all API endpoints
- [ ] Add input validation on backend
- [ ] Set secure cookie flags if using sessions
- [ ] Review and update Content Security Policy

---

## Production Checklist

- [ ] All routes work correctly
- [ ] No console errors or warnings
- [ ] All API endpoints are functional
- [ ] Admin panel fully operational
- [ ] Email sending works
- [ ] AI chatbot responds correctly
- [ ] Mobile responsive design tested
- [ ] SEO meta tags set correctly
- [ ] Images load from CDN or optimized
- [ ] Performance tested (Lighthouse score > 90)
- [ ] Analytics integrated (Google Analytics, etc.)
- [ ] Error logging configured (Sentry, LogRocket)

---

## Support & Contact

For technical support or questions:
- **Dev Team**: Contact your development team
- **Email**: admin@ksavaluers.com
- **Documentation**: See project README.md

---

## Version

**Current Version**: 1.0.0  
**Last Updated**: March 2026  
**Framework Versions**:
- Vue: 3.4.0
- Vite: 4.5.0
- Express: 5.2.1
- Node: 18+

---

**Built with ❤️ for KSA Valuers (Kayode Segun & Associates)**
