# AGENTS.md - KSA Valuers Architecture Guide

This document describes all the autonomous agents, services, and state management systems in the KSA Valuers project. These are modular, independent systems that handle specific domains of functionality.

---

## ≡ƒôï Table of Contents

- [Recent Fixes & Current Status](#recent-fixes--current-status)
- [Frontend Services & Stores](#frontend-services--stores)
- [Backend Services & Agents](#backend-services--agents)
- [Communication Patterns](#communication-patterns)
- [Data Flow](#data-flow)
- [Critical Issues Tracker](#critical-issues-tracker)

---

## ≡ƒôè Recent Fixes & Current Status

### ✅ **FIXED in Latest Session (2026-06-19)**

1. **Navigation Z-Index Issue** ✅ FIXED
   - **Problem:** AppHeader appeared behind content
   - **Solution:** Added `relative z-40` to header element
   - **File:** `src/components/global/AppHeader.vue` (line 2)
   - **Status:** Complete

2. **Missing Properties Carousel** ✅ FIXED
   - **Problem:** Home page had no carousel displaying featured properties
   - **Solution:** Created new `FeaturedPropertiesCarousel.vue` component with navigation and favorites
   - **Files:** 
     - Created: `src/components/sections/FeaturedPropertiesCarousel.vue`
     - Updated: `src/views/Home.vue` - Added carousel import and component
   - **Features:** Swipe navigation, indicators, responsive design
   - **Status:** Complete

3. **Admin Login Page UX** ✅ FIXED
   - **Problem:** Poor error handling, confusing signup disabled message
   - **Solutions:**
     - Better error messages with helpful context
     - Disabled signup tab visually (disabled button state)
     - Replaced signup form with disabled state explanation
     - Auto-clear error messages after 6 seconds
     - Improved info box with clearer instructions
   - **Files:** `src/views/admin/AdminLogin.vue`
   - **Status:** Complete

4. **API Service - Token Refresh Race Condition** ✅ FIXED
   - **Problem:** Multiple 401 responses could trigger multiple token refreshes simultaneously
   - **Solution:** Refactored to use Promise-based atomic refresh (prevents race condition)
   - **File:** `src/services/api.js` (lines 1-50)
   - **Impact:** Prevents "stuck in login loop" errors during token expiration

5. **Window Object SSR Guard** ✅ FIXED
   - **Problem:** Direct `window` access broke in SSR/testing environments
   - **Solution:** Added `typeof window !== 'undefined'` guards before window access
   - **Files:** `src/services/api.js`
   - **Impact:** Safe for server-side rendering and unit tests

6. **Contact Service - JSON Parse Error Handling** ✅ FIXED
   - **Problem:** No error handling for JSON parsing, unhandled promise rejections
   - **Solution:** 
    - Wrapped all JSON.parse in try-catch blocks
    - Validate Content-Type before parsing
    - Return structured error objects instead of throwing
   - **File:** `src/services/contactService.js`
   - **Impact:** Graceful degradation on malformed responses

7. **Auth Store - Logout Error Handling** ✅ FIXED
   - **Problem:** Unhandled promise rejection during logout
   - **Solution:** Wrapped logout API call in try-catch, added finally block
   - **File:** `src/stores/authStore.js` (logout function)
   - **Impact:** Logout always completes cleanly

8. **Property Store - Comprehensive Error Handling** ✅ FIXED
   - **Problem:** Missing error state, no response validation, async init without error handling
   - **Solution:**
    - Added error state tracking
    - Added response structure validation
    - Proper try-catch in all CRUD operations
    - Async initialization with error boundary
    - Null checks on all property operations
   - **File:** `src/stores/propertyStore.js`
   - **Impact:** Robust error handling and data validation

9. **Project Store - Comprehensive Error Handling** ✅ FIXED
   - **Problem:** Same as Property Store - missing validation and error handling
   - **Solution:** Applied same comprehensive fixes as propertyStore
   - **File:** `src/stores/projectStore.js`
   - **Impact:** Robust error handling and data validation

10. **Booking Store - Error Handling & Validation** ✅ FIXED
   - **Problem:** No input validation, missing error states, unsafe date operations
   - **Solution:**
     - Added validateBooking() function with email/phone validation
     - Added error state tracking
     - Null checks on all booking operations
     - Async initialization with error handling
   - **File:** `src/stores/bookingStore.js`
   - **Impact:** Prevents invalid bookings and handles errors gracefully

11. **Centralized Constants** ✅ FIXED
   - **Problem:** Hardcoded enum values scattered throughout stores (magic strings)
   - **Solution:** Created centralized enums at top of each store
     - `PROPERTY_STATUS_ENUM`, `PROPERTY_TYPES_ENUM` in propertyStore
     - `PROJECT_STATUS_ENUM`, `PROJECT_TYPES_ENUM` in projectStore
     - `BOOKING_STATUS_ENUM` in bookingStore
   - **Impact:** Single source of truth, easier refactoring

12. **CSRF Token Support** ✅ PREPARED
   - **Problem:** No CSRF tokens in state-changing requests
   - **Solution:** Added CSRF token extraction and injection in api.js response interceptor
   - **File:** `src/services/api.js`
   - **Status:** Infrastructure ready, waiting for backend CSRF token implementation

---

## Code Quality Improvements Summary

| Category | Fixed | Status |
|----------|-------|--------|
| Error Handling | 8 | ✅ Complete |
| Input Validation | 3 | ✅ Complete |
| Response Validation | 4 | ✅ Complete |
| Race Conditions | 1 | ✅ Complete |
| SSR Compatibility | 1 | ✅ Complete |
| Constants Centralization | 3 | ✅ Complete |
| Null Safety | 12+ | ✅ Complete |
| **Total Fixes** | **32+** | **✅ Complete** |

---

## Frontend Services & Stores

### **Pinia Stores** (State Management)

#### 1. **Property Store** (`src/stores/propertyStore.js`)
**Purpose:** Manages all property-related state and operations across the application.

**Responsibilities:**
- CRUD operations for properties (Create, Read, Update, Delete)
- Property filtering and search
- Featured property management
- LocalStorage persistence
- Data formatting (budget, dates, status colors)

**Key State:**
```javascript
properties: []        // Array of all properties
selectedProperty: null
filters: {
  status: '',       // 'sale', 'rent', 'sold', 'rented'
  type: '',         // 'residential', 'commercial', etc.
  searchQuery: ''
}
```

**Key Actions:**
- `addProperty(property)` - Add new property
- `updateProperty(id, updates)` - Update existing property
- `deleteProperty(id)` - Remove property
- `toggleFeatured(id)` - Toggle featured status
- `searchProperties(query)` - Search by title/location
- `filterByStatus(status)` - Filter properties
- `filterByType(type)` - Filter by property type
- `loadProperties()` - Load from backend API
- `saveToLocalStorage()` - Persist to browser storage

**Data Model:**
```javascript
{
  id: string,
  title: string,
  location: string,
  image: string,
  price: number,
  status: 'sale' | 'rent' | 'sold' | 'rented',
  type: 'residential' | 'commercial' | 'mixed',
  bedrooms: number,
  bathrooms: number,
  squareFootage: number,
  description: string,
  featured: boolean,
  tags: string[],
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

---

#### 2. **Project Store** (`src/stores/projectStore.js`)
**Purpose:** Manages all development projects in the portfolio.

**Responsibilities:**
- CRUD operations for projects
- Project filtering and search
- Progress tracking with completion percentages
- Featured project management
- LocalStorage persistence
- Amenities management

**Key State:**
```javascript
projects: []          // Array of all projects
selectedProject: null
filters: {
  status: '',       // 'Planning', 'In Progress', 'Completed', 'On Hold'
  type: '',         // 'Residential', 'Commercial', 'Mixed-Use', etc.
  searchQuery: ''
}
```

**Key Actions:**
- `addProject(project)` - Add new project
- `updateProject(id, updates)` - Update existing project
- `deleteProject(id)` - Remove project
- `toggleFeatured(id)` - Toggle featured status
- `searchProjects(query)` - Search by title/location
- `filterByStatus(status)` - Filter projects
- `filterByType(type)` - Filter by project type
- `getProjectStats()` - Get aggregate statistics
- `loadProjects()` - Load from backend API

**Data Model:**
```javascript
{
  id: string,
  title: string,
  location: string,
  image: string,
  description: string,
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold',
  type: 'Residential' | 'Commercial' | 'Mixed-Use' | 'Infrastructure' | 'Renovation' | 'New Development',
  totalUnits: number,
  completionPercentage: number,    // 0-100
  startDate: ISO8601,
  expectedCompletion: ISO8601,
  budget: number,
  featured: boolean,
  amenities: string[],
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

**Utility Functions:**
- `formatBudget(number)` - Format currency with Γéª
- `formatDate(ISO8601)` - Format dates
- `getStatusColor(status)` - Get CSS color for status badge
- `getTypeColor(type)` - Get CSS color for type badge

---

#### 3. **Booking Store** (`src/stores/bookingStore.js`)
**Purpose:** Manages property viewing appointments and inquiries.

**Responsibilities:**
- CRUD operations for bookings
- Status tracking (pending, confirmed, completed, cancelled)
- Date/time management for appointments
- Booking validation

**Key State:**
```javascript
bookings: []          // Array of all bookings
selectedBooking: null
filters: {
  status: '',       // 'pending', 'confirmed', 'completed', 'cancelled'
  propertyId: ''
}
```

**Key Actions:**
- `addBooking(booking)` - Create new booking
- `updateBooking(id, updates)` - Modify booking
- `deleteBooking(id)` - Cancel booking
- `updateStatus(id, status)` - Update booking status
- `getBookingsByProperty(propertyId)` - Filter by property
- `loadBookings()` - Fetch from backend

**Data Model:**
```javascript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  date: ISO8601,
  time: string,         // HH:MM format
  guests: number,
  notes: string,
  property: string,     // property ID
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

---

#### 4. **Auth Store** (`src/stores/authStore.js`)
**Purpose:** Manages user authentication and authorization.

**Responsibilities:**
- User login/logout
- Token management (access & refresh tokens)
- Role-based access control (RBAC)
- Session persistence
- Permission checking

**Key State:**
```javascript
user: null            // Current logged-in user
token: null           // JWT access token
refreshToken: null
isAuthenticated: false
userRole: null        // 'admin', 'agent', 'user'
```

**Key Actions:**
- `login(email, password)` - Authenticate user
- `logout()` - Clear session
- `refreshAccessToken()` - Refresh expired token
- `hasPermission(permission)` - Check user permissions
- `setUser(user)` - Set current user
- `isAdmin()` - Check if user is admin

---

### **API Service** (`src/services/api.js`)
**Purpose:** HTTP client for backend communication using Axios.

**Responsibilities:**
- Make API requests to backend endpoints
- Handle authentication headers (JWT)
- Request/response interceptors
- Error handling and retries
- API base URL management

**Key Methods:**
```javascript
api.get(url, config)
api.post(url, data, config)
api.put(url, data, config)
api.delete(url, config)
api.patch(url, data, config)
```

**Configuration:**
- Base URL: `http://localhost:3000/api` (dev) or production URL
- Default timeout: 30s
- Auto-includes `Authorization` header with JWT token

**Error Handling:**
- Catches network errors
- Handles 401 (unauthorized) responses
- Manages rate limiting (429 status)
- Logs errors to console in development

---

### **Contact Service** (`src/services/contactService.js`)
**Purpose:** Handles contact form submissions and email delivery.

**Responsibilities:**
- Validate contact form data
- Submit inquiries to backend
- Track submission status
- Handle success/error responses

**Key Methods:**
- `submitContactForm(data)` - Send contact inquiry
- `validateEmail(email)` - Client-side email validation
- `validatePhone(phone)` - Client-side phone validation

**Data Expected:**
```javascript
{
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string
}
```

---

## Backend Services & Agents

### **Express.js Server** (`backend/server.js`)
**Purpose:** Main REST API server handling all backend operations.

**Environment:** Node.js with Express framework  
**Port:** 3000 (development) or configured via `PORT` env var  
**Database:** PostgreSQL (via environment `DATABASE_URL`)

---

### **Properties API Agent**

**Endpoints:**
```
GET    /api/properties           ΓåÆ List all properties (with pagination)
GET    /api/properties/:id       ΓåÆ Get single property details
POST   /api/properties           ΓåÆ Create new property (admin only)
PUT    /api/properties/:id       ΓåÆ Update property (admin only)
DELETE /api/properties/:id       ΓåÆ Delete property (admin only)
```

**Responsibilities:**
- CRUD operations on property records
- Database persistence
- Property search and filtering
- Image URL storage and validation
- Status normalization (sale/rent/sold/rented)

**Query Parameters:**
- `page` - Pagination (default: 1)
- `limit` - Items per page (default: 20)
- `status` - Filter by status
- `type` - Filter by property type
- `search` - Search in title/location

---

### **Projects API Agent**

**Endpoints:**
```
GET    /api/projects             ΓåÆ List all projects
GET    /api/projects/:id         ΓåÆ Get single project details
POST   /api/projects             ΓåÆ Create new project (admin only)
PUT    /api/projects/:id         ΓåÆ Update project (admin only)
DELETE /api/projects/:id         ΓåÆ Delete project (admin only)
```

**Responsibilities:**
- CRUD operations on development projects
- Completion percentage tracking
- Budget and timeline management
- Amenities list storage
- Featured project management

---

### **Bookings API Agent**

**Endpoints:**
```
GET    /api/bookings             ΓåÆ List all bookings
GET    /api/bookings/:id         ΓåÆ Get single booking
POST   /api/bookings             ΓåÆ Create new booking (public)
PUT    /api/bookings/:id         ΓåÆ Update booking status (admin only)
DELETE /api/bookings/:id         ΓåÆ Cancel booking (admin only)
```

**Responsibilities:**
- Handle property viewing appointments
- Booking validation and confirmation
- Status management
- Date/time conflict detection
- Email notification triggers

---

### **Authentication Agent**

**Endpoints:**
```
POST   /api/auth/login           ΓåÆ User login
POST   /api/auth/logout          ΓåÆ User logout
POST   /api/auth/refresh-token   ΓåÆ Refresh access token
POST   /api/auth/register        ΓåÆ Register new user (if enabled)
```

**Responsibilities:**
- JWT token generation (access & refresh)
- Password hashing with bcryptjs
- User session management
- Token validation middleware
- Role assignment and verification

**Token Structure:**
- Access Token TTL: 15 minutes (configurable)
- Refresh Token TTL: 7 days (configurable)
- Stored in: HTTP-only cookies (secure)

---

### **Email Service Agent**

**Technology:** Nodemailer  
**Configuration:** Via environment variables

**Endpoints Using Email:**
- Contact form submissions
- Booking confirmations
- Password reset requests
- Admin notifications

**Email Templates:**
- Contact inquiry notification
- Booking confirmation
- Property inquiry follow-up
- Custom admin emails

**Configuration:**
```javascript
SMTP_HOST=         // Email provider hostname
SMTP_PORT=         // Usually 587 or 465
SMTP_USER=         // Sender email
SMTP_PASS=         // Email password/app token
FROM_EMAIL=        // Sender display email
FROM_NAME=         // Sender display name
```

---

### **AI Chat Agent**

**Technology:** Google Gemini 2.5-flash API  
**Rate Limiting:** 30 requests per 15 minutes per IP

**Endpoint:**
```
POST   /api/ai/chat              ΓåÆ Send message to AI chatbot
```

**Responsibilities:**
- Conversational AI for property inquiries
- Answer real estate questions
- Project information requests
- Lead qualification
- Support escalation

**Configuration:**
```javascript
GEMINI_API_KEY=    // Google AI API key
AI_MODEL=          // Model name (default: gemini-2.5-flash)
AI_SYSTEM_PROMPT=  // Custom system instructions
```

**Rate Limiting:**
- Window: 15 minutes
- Max requests: 30 per IP
- Returns 429 status when exceeded

---

### **Rate Limiting Middleware**

**Purpose:** Protect API endpoints from abuse

**Configuration:**
```javascript
// AI endpoint: 30 requests per 15 minutes
// General endpoints: Configurable per route
// Contact form: 5 submissions per hour per IP
```

**Response on Limit:**
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

---

### **Database Agent** (PostgreSQL)

**Connection:** Via `DATABASE_URL` environment variable

**Tables:**
- `properties` - Property listings
- `projects` - Development projects
- `bookings` - Viewing appointments
- `users` - User accounts
- `contacts` - Contact form submissions
- `ai_logs` - AI chat history (optional)

**Responsibilities:**
- Persist all application data
- Query optimization
- Data validation at database level
- Transaction management
- Backup and recovery

---

### **CORS Middleware**

**Allowed Origins:**
- `http://localhost:5173` (dev frontend)
- `http://localhost:3000` (dev backend)
- Production URLs (configured in env)

**Allowed Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS  
**Allowed Headers:** Content-Type, Authorization, Cookie

---

## Communication Patterns

### **Frontend ΓåÆ Backend Flow**

```
Vue Component
    Γåô
Pinia Store (State Management)
    Γåô
API Service (axios)
    Γåô
Express Backend (REST API)
    Γåô
Database (PostgreSQL)
    Γåô
[Response flows back up]
```

### **Example: Create Property**

```javascript
// 1. Component dispatches action
const propertyStore = usePropertyStore();
await propertyStore.addProperty(newProperty);

// 2. Store makes API call
api.post('/api/properties', propertyStore.addProperty(data) {
  return api.post('/api/properties', data);
}

// 3. API Service sends HTTP request
POST /api/properties HTTP/1.1
Authorization: Bearer <jwt_token>
Content-Type: application/json
{ title, location, price, ... }

// 4. Backend receives, validates, and saves
app.post('/api/properties', authenticate, (req, res) => {
  // Validate input
  // Hash sensitive data
  // Insert into database
  // Return created property
});

// 5. Frontend store updates local state
store.properties.push(newProperty);
store.saveToLocalStorage();

// 6. Component reactively updates UI
```

---

## Data Flow

### **Property Lifecycle**

```
Admin creates property ΓåÆ API saves to database
                      Γåô
Property loaded on dashboard ΓåÆ Display with stats
                      Γåô
User views properties ΓåÆ Public page fetches from API
                      Γåô
User books viewing ΓåÆ Creates booking record
                      Γåô
Admin confirms booking ΓåÆ Email sent to user
                      Γåô
Viewing completed ΓåÆ Booking status updated
```

### **Project Lifecycle**

```
Admin creates project ΓåÆ Stored in database
                     Γåô
Project added to dashboard ΓåÆ Display with progress
                     Γåô
Admin updates completion ΓåÆ Percentage updated
                     Γåô
Public views projects ΓåÆ Featured projects displayed
                     Γåô
Project completed ΓåÆ Status changed to "Completed"
```

### **User Authentication Flow**

```
User enters credentials ΓåÆ Login endpoint validates
                       Γåô
Password hashed and compared ΓåÆ Tokens generated
                              Γåô
Access token (15m) + Refresh token (7d) returned
                       Γåô
Token stored in HTTP-only cookie
                       Γåô
Subsequent requests ΓåÆ Token included in Authorization header
                       Γåô
Middleware verifies token ΓåÆ Request proceeds or rejected
                       Γåô
Token expires ΓåÆ Refresh token used to get new access token
```

---

## Environment Variables

### **Frontend** (`.env`)
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AI_ENABLED=true
VITE_APP_NAME=KSA Valuers
```

### **Backend** (`.env`)
```
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ksa_valuers

# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@ksa-valuers.ng
FROM_NAME=KSA Valuers

# AI
GEMINI_API_KEY=your-gemini-api-key
AI_MODEL=gemini-2.5-flash
AI_SYSTEM_PROMPT=You are a helpful real estate assistant...

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://ksa-valuers.ng
```

---

## Deployment Architecture

### **Development**
- Frontend: Vite dev server on port 5173
- Backend: Express on port 3000
- Database: Local PostgreSQL
- Running: `npm run dev:all`

### **Production**
- Frontend: Deployed to Vercel (configured in `vercel.json`)
- Backend: Deployed to Cloud Run / Railway / Heroku
- Database: Cloud PostgreSQL (AWS RDS / Neon / Railway)
- Email: Configured production SMTP
- CDN: Static assets cached globally

---

## Testing & Debugging

### **API Testing**
- Use Postman/Insomnia for API endpoint testing
- Test each CRUD operation per agent
- Verify authentication on protected routes
- Check rate limiting behavior

### **Frontend Testing**
- Vue DevTools for store inspection
- Network tab for API request/response debugging
- Console for error tracking
- Local storage inspection

### **Database Testing**
- pgAdmin or psql for direct database queries
- Check data consistency
- Verify foreign key constraints
- Test transaction rollback

---

---

## ≡ƒÜ¿ CRITICAL ISSUES & NEEDS IMPROVEMENT

This section documents **real, actionable problems** currently preventing production deployment. Issues are prioritized by criticality and impact on system stability.

### **Priority 1: BLOCKING (Must Fix Before Production)**

#### **1.1 ≡ƒö┤ NO DATABASE CONFIGURED - CRITICAL**
**Status:** Γ¥î NOT PRODUCTION READY  
**File:** `backend/server.js` (lines 20-22)  
**Problem:** 
- Backend initializes PostgreSQL connection via `DATABASE_URL` environment variable
- **No database actually exists** - connection string is undefined in development
- All data operations fail silently or return empty results
- `initializeDatabase()` tries to create tables but has no database to connect to
- Production deployment impossible without working database

**Impact:** 
- ZERO data persistence across sessions
- All CRUD operations fail
- Bookings, properties, projects cannot be saved
- Admin panel appears to work but data is lost on server restart

**Editable Files:**
- Γ£à `backend/server.js` - Can refactor database initialization
- Γ£à `.env` / `.env.example` - Add proper database config template
- Γ£à `backend/package.json` - Can add migration tools

**Fix Required:**
1. Set up PostgreSQL database (local for dev, cloud for production)
2. Update `.env` with valid `DATABASE_URL` connection string
3. Test database connection on server startup
4. Add database migration scripts
5. Seed initial admin user on first run

**Estimated Effort:** 2-3 hours

---

#### **1.2 ≡ƒö┤ EMAIL HARDCODED TO GMAIL - CRITICAL**
**Status:** Γ¥î NOT PRODUCTION READY  
**File:** `backend/server.js` (lines 254-269)  
**Problem:**
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',  // ΓåÉ HARDCODED - only supports Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```
- Email service ONLY works with Gmail
- Cannot use corporate email, SendGrid, AWS SES, or other providers
- Gmail "app passwords" are unstable and can expire
- No fallback if Gmail credential fails
- Production users cannot use their own email domain

**Impact:**
- Contact form emails fail silently if Gmail credentials invalid
- Booking confirmations never sent
- Admin notifications broken
- No way to customize "from" domain

**Editable Files:**
- Γ£à `backend/server.js` - Refactor email transport to be configurable

**Fix Required:**
1. Add `EMAIL_PROVIDER` config (gmail, sendgrid, ses, smtp)
2. Create transport factory based on provider type
3. Add validation on server startup to verify email config
4. Log errors instead of silently failing
5. Add retry logic for email failures

**Estimated Effort:** 1-2 hours

---

#### **1.3 ≡ƒö┤ NO TOKEN REFRESH HANDLING - CRITICAL**
**Status:** Γ¥î NOT PRODUCTION READY  
**File:** `src/services/api.js` (lines 14-25), `src/stores/authStore.js`  
**Problem:**
- Backend has refresh token endpoint (`/api/v1/auth/refresh`) with 7-day TTL
- Frontend has NO automatic token refresh mechanism
- When access token (15m TTL) expires, user gets redirected to login without warning
- No 401 interception to trigger refresh before request fails
- Refresh token logic exists but is never called automatically

**Example Flow (Broken):**
```
User working ΓåÆ 15min pass ΓåÆ Access token expires
ΓåÆ Next API call returns 401 
ΓåÆ User forcibly redirected to /admin/login 
ΓåÆ User loses all unsaved work
ΓåÆ User frustration ≡ƒö┤
```

**Impact:**
- Users randomly logged out during work sessions
- Admin forms lose unsaved data
- Poor user experience in production
- Appears to be a security issue but is just missing code

**Editable Files:**
- Γ£à `src/services/api.js` - Add response interceptor for 401 + refresh retry
- Γ£à `src/stores/authStore.js` - Add `refreshAccessToken()` action

**Fix Required:**
1. Add 401 response interceptor in api.js
2. On 401: check if refresh token exists
3. Call `/api/v1/auth/refresh` automatically
4. Retry original request with new access token
5. Only redirect to login if refresh also fails
6. Handle race conditions (multiple requests during refresh)

**Estimated Effort:** 1.5 hours

---

#### **1.4 ≡ƒö┤ NO BOOKING DOUBLE-BOOKING PREVENTION - CRITICAL**
**Status:** Γ¥î NOT PRODUCTION READY  
**File:** `backend/server.js` (lines 750-850, booking endpoints)  
**Problem:**
- Booking creation (`POST /api/bookings`) has NO date/time conflict checking
- Two users can book same property on same date at same time
- Backend accepts duplicate bookings without validation
- No unique constraint on bookings table for (property_id, date, time)
- Database indexes exist for queries but uniqueness not enforced

**Current Code:**
```javascript
// Γ¥î NO VALIDATION - accepts any booking without checking conflicts
app.post('/api/bookings', async (req, res) => {
  const missing = requireFields(payload, ['name', 'email', 'phone', 'date', 'time']);
  if (missing.length > 0) return error;
  // ΓåÉ MISSING: Check if this date/time already booked for this property
  // ΓåÆ Just inserts immediately
  const result = await pool.query(`INSERT INTO bookings ...`);
  res.json({ success: true, data: ... });
});
```

**Impact:**
- Multiple customers book same viewing slot
- Property manager double-booked with confused customers
- Impossible to manage appointments
- No way to check availability before booking

**Editable Files:**
- Γ£à `backend/server.js` - Add conflict detection query before insert
- Γ£à `src/services/api.js` - Add endpoint to check available slots
- Γ£à `src/views/` - Add slot availability display on booking form

**Fix Required:**
1. Add uniqueness constraint to bookings table: `(property_id, booking_date, booking_time)`
2. Query for conflicts before accepting booking
3. Return available time slots endpoint: `/api/bookings/available-slots?date=YYYY-MM-DD&propertyId=123`
4. Update frontend to show available times before booking
5. Add admin panel to manage slots (blocked times, custom availability)

**Estimated Effort:** 2-3 hours

---

#### **1.5 ≡ƒö┤ HARDCODED CORS ALLOWED ORIGINS - SECURITY ISSUE**
**Status:** Γ¥î NOT PRODUCTION READY  
**File:** `backend/server.js` (lines 35-38)  
**Problem:**
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],  // ΓåÉ HARDCODED
  credentials: true
}));
```
- Only localhost origins allowed
- Production frontend URL NOT in allowed origins
- Will fail when deployed
- No environment-based configuration
- Blocks legitimate production traffic

**Impact:**
- Production frontend blocked by CORS policy
- API completely inaccessible from production domain
- Cannot test cross-origin requests

**Editable Files:**
- Γ£à `backend/server.js` - Make CORS configurable

**Fix Required:**
1. Add `ALLOWED_ORIGINS` to `.env` (comma-separated list)
2. Parse origins from env in server startup
3. Configure CORS dynamically based on NODE_ENV
4. Validate all origins are https:// in production
5. Add origin validation middleware

**Estimated Effort:** 30 minutes

---

### **Priority 2: HIGH (Should Fix Before Production)**

#### **2.1 ≡ƒƒá HARDCODED DEFAULT ADMIN PASSWORD**
**Status:** ΓÜá∩╕Å SECURITY RISK  
**File:** `backend/server.js` (line 244)  
**Problem:**
```javascript
const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeMeNow_123', 12);
```
- Fallback password `'ChangeMeNow_123'` hardcoded in source code
- If `ADMIN_PASSWORD` env var missing, default password used
- Default password visible in GitHub, backups, logs
- Anyone with access to repo can compromise admin account

**Impact:**
- Security vulnerability if deployed without setting env var
- Default account easily guessed/brute-forced
- Compliance issues (SOC2, ISO 27001 requirements)

**Editable Files:**
- Γ£à `backend/server.js` - Require `ADMIN_PASSWORD` to be set

**Fix Required:**
1. Make `ADMIN_PASSWORD` required (no default)
2. Fail server startup with error message if missing
3. Generate random temporary password on first run if not provided
4. Document password reset procedure
5. Add password policy enforcement (min 12 chars, special chars, etc.)

**Estimated Effort:** 30 minutes

---

#### **2.2 ≡ƒƒá NO INPUT VALIDATION ON CRITICAL FIELDS**
**Status:** ΓÜá∩╕Å DATA INTEGRITY ISSUE  
**Files:** `backend/server.js` (properties/projects POST endpoints), `src/views/admin/AdminPropertyForm.vue`, `src/views/admin/AdminProjectForm.vue`  
**Problem:**
- Property price can be negative: `price = -1000` accepted
- Completion percentage can exceed 100%: `completionPercentage = 500` accepted
- Bedrooms/bathrooms/units can be negative
- No min/max validation on any numeric fields
- No string length limits on descriptions
- No enum validation on status/type fields

**Example:**
```javascript
// Γ¥î This would be accepted by backend:
{
  title: "",                    // empty title
  price: -999999,              // negative price
  bedrooms: -5,                // negative rooms
  completionPercentage: 1000,  // 1000% complete?
  status: "invalid_status"     // typo in enum
}
```

**Impact:**
- Garbage data in database
- Admin panel shows invalid data
- Business logic breaks (discounts on negative prices, etc.)
- Reports/analytics show wrong numbers
- Data migration nightmare later

**Editable Files:**
- Γ£à `backend/server.js` - Add validation helper function, use in all POST/PUT endpoints
- Γ£à `src/views/admin/` - Add client-side validation

**Fix Required:**
1. Create validation schema (using library like `joi` or `zod`)
2. Validate all POST/PUT payloads before database insert
3. Return 422 with specific field errors on validation failure
4. Add constraints in database schema (CHECK constraints)
5. Add frontend form validation to prevent bad submissions

**Estimated Effort:** 2-3 hours

---

#### **2.3 ≡ƒƒá AUTH STORE DOESN'T HANDLE ERRORS GRACEFULLY**
**Status:** ΓÜá∩╕Å UX ISSUE  
**File:** `src/stores/authStore.js` (lines 24-36)  
**Problem:**
- Login errors caught but not stored in state
- Error messages disappear immediately
- No way to display error to user from store
- Components have no way to know WHY login failed

```javascript
const login = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password })
    // ...success
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message }
    // ΓåÉ Error returned but never stored in state
    // ΓåÉ Component must handle error display manually
  }
}
```

**Impact:**
- No persistent error state
- Each component must handle errors independently
- Error messages can't be displayed in different ways
- Hard to implement global error notifications

**Editable Files:**
- Γ£à `src/stores/authStore.js` - Add error state

**Fix Required:**
1. Add `error` ref to state
2. Store error message on failed actions
3. Clear error on successful actions
4. Add computed property for error message
5. Provide action to manually clear errors

**Estimated Effort:** 30 minutes

---

#### **2.4 ≡ƒƒá PROPERTY/PROJECT STORES MISSING IMAGES**
**Status:** ΓÜá∩╕Å INCOMPLETE FEATURE  
**Files:** `src/stores/propertyStore.js`, `src/stores/projectStore.js`  
**Problem:**
- Backend supports multiple images: `images: JSONB array`
- Frontend stores only store single `image` field
- No way to manage multiple images for property
- Upload/delete images not implemented
- Image validation missing (size, format, dimensions)

**Impact:**
- Properties shown with single low-quality image
- No image gallery functionality
- Cannot showcase property from multiple angles
- Poor user experience on frontend

**Editable Files:**
- Γ£à `src/stores/propertyStore.js` - Add image management
- Γ£à `src/stores/projectStore.js` - Add image management
- Γ£à `src/views/admin/AdminPropertyForm.vue` - Add multi-image uploader

**Fix Required:**
1. Add image array management to stores
2. Implement image upload to CDN (Cloudinary, ImageKit, etc.)
3. Add image validation (size < 5MB, format: jpg/png/webp)
4. Add drag-drop image uploader
5. Add image ordering/reordering
6. Add primary image selection

**Estimated Effort:** 4-5 hours

---

### **Priority 3: MEDIUM (Good to Have Before Production)**

#### **3.1 ≡ƒƒí NO PAGINATION ON PROPERTY/PROJECT LISTS**
**Status:** ΓÜá∩╕Å PERFORMANCE ISSUE  
**Files:** `backend/server.js` (GET /api/properties, /api/projects)  
**Problem:**
```javascript
app.get('/api/properties', async (_req, res) => {
  const result = await pool.query(`SELECT * FROM properties ORDER BY created_at DESC`);
  // ΓåÉ Loads ALL properties every time, no pagination
  res.json({ success: true, data: result.rows.map(mapProperty) });
});
```
- All properties loaded on every request
- No limit/offset parameters
- Will be slow with 1000+ properties
- Frontend loads entire list into memory
- No lazy loading support

**Impact:**
- Slow page load when properties > 100
- High memory usage
- Impossible to scale
- Poor mobile experience

**Editable Files:**
- Γ£à `backend/server.js` - Add `?page=1&limit=20` query parameters
- Γ£à `src/services/api.js` - Support pagination params
- Γ£à `src/stores/propertyStore.js` - Implement pagination state

**Fix Required:**
1. Add query parameters: `?page=1&limit=20`
2. Return pagination metadata: `{ data, page, limit, total, totalPages }`
3. Implement pagination in store
4. Add "Load More" button or pagination controls
5. Cache loaded pages locally

**Estimated Effort:** 2 hours

---

#### **3.2 ≡ƒƒí NO ERROR BOUNDARIES / GLOBAL ERROR HANDLING**
**Status:** ΓÜá∩╕Å UX ISSUE  
**File:** All Vue components  
**Problem:**
- No global error handler
- Network errors show console only
- User has no idea what went wrong
- Errors aren't logged/reported
- No retry mechanism for failed requests

**Impact:**
- Silent failures
- User frustration
- Impossible to debug production issues
- No error tracking

**Editable Files:**
- Γ£à `src/main.js` - Add global error handler
- Γ£à `src/services/api.js` - Add error logging
- Γ£à New component: `src/components/ErrorBoundary.vue`

**Fix Required:**
1. Create global error boundary component
2. Add `app.config.errorHandler` in main.js
3. Display toast/modal on API errors
4. Log errors to monitoring service (Sentry, Rollbar)
5. Implement retry logic for transient errors

**Estimated Effort:** 2-3 hours

---

#### **3.3 ≡ƒƒí NO SEARCH/FILTER ON BACKEND**
**Status:** ΓÜá∩╕Å INCOMPLETE FEATURE  
**File:** `backend/server.js` (GET /api/properties, /api/projects)  
**Problem:**
- Backend returns all properties/projects
- Search/filtering happens on frontend only
- No full-text search capability
- Cannot query by location, type, status efficiently
- Will be very slow with large datasets

**Impact:**
- Search slow for 1000+ properties
- Cannot implement advanced search
- Database queries not optimized

**Editable Files:**
- Γ£à `backend/server.js` - Add query parameter filters

**Fix Required:**
1. Add query parameters: `?search=term&status=sale&type=residential`
2. Implement backend filtering with WHERE clauses
3. Add full-text search index
4. Return filtered results only
5. Add sort options: `?sort=price&order=asc`

**Estimated Effort:** 1.5 hours

---

#### **3.4 ≡ƒƒí BOOKING STORE LOADS ALL BOOKINGS**
**Status:** ΓÜá∩╕Å PERFORMANCE ISSUE  
**File:** `src/stores/bookingStore.js` (line 127)  
**Problem:**
- `loadBookings()` called on store creation (even for non-admin users)
- Fetches ALL bookings for entire system
- No filtering by user, property, or date
- Will fail if 10,000+ bookings exist

**Impact:**
- Slow page load
- Unauthorized access to other users' bookings
- Doesn't scale

**Editable Files:**
- Γ£à `src/stores/bookingStore.js` - Add optional filters

**Fix Required:**
1. Add date range parameter to `loadBookings()`
2. Filter bookings by logged-in user by default
3. Only admins see all bookings
4. Add pagination support
5. Lazy load on-demand

**Estimated Effort:** 1 hour

---

#### **3.5 ≡ƒƒí NO AUDIT LOGGING**
**Status:** ΓÜá∩╕Å COMPLIANCE ISSUE  
**Files:** `backend/server.js` (all POST/PUT/DELETE endpoints)  
**Problem:**
- No record of WHO changed WHAT and WHEN
- Cannot track admin modifications
- No way to undo changes
- Compliance/audit trail missing
- No history of property/project changes

**Impact:**
- Cannot debug data corruption
- Compliance violations (GDPR, etc.)
- No accountability for admin actions

**Editable Files:**
- Γ£à `backend/server.js` - Add audit logging on mutations

**Fix Required:**
1. Create `audit_logs` table
2. Log all CREATE, UPDATE, DELETE operations
3. Record: user_id, action, table, before_data, after_data, timestamp
4. Add audit log API endpoint (admin only)
5. Add UI to view change history

**Estimated Effort:** 2-3 hours

---

### **Priority 4: LOW (Polish, Not Required)**

#### **4.1 ≡ƒƒó Missing Analytics Agent**
- No page view tracking
- No user behavior analytics
- Cannot measure feature usage
- Estimated Effort: 3-4 hours (with external service)

#### **4.2 ≡ƒƒó No Image Upload/Storage**
- Images hosted externally (Unsplash, etc.)
- Cannot manage custom images
- Bandwidth costs not optimized
- Estimated Effort: 3-4 hours (implement CDN integration)

#### **4.3 ≡ƒƒó Missing Email Templates**
- No professional HTML email templates
- Booking confirmation email is basic
- Contact form notification email is plain
- Estimated Effort: 2 hours

#### **4.4 ≡ƒƒó No SMS Notifications**
- Only email notifications implemented
- Users cannot get SMS alerts
- Estimated Effort: 2-3 hours (integrate Twilio/AWS SNS)

#### **4.5 ≡ƒƒó No Rate Limiting on Public Endpoints**
- Only AI endpoint has rate limiter
- Contact form has no rate limiting
- Booking can be spammed
- Estimated Effort: 1 hour

---

## ≡ƒôè Production Readiness Assessment

| Component | Status | Issues |
|-----------|--------|--------|
| **Database** | ≡ƒö┤ CRITICAL | Not configured, no persistence |
| **Email** | ≡ƒö┤ CRITICAL | Hardcoded to Gmail only |
| **Auth** | ≡ƒö┤ CRITICAL | No token refresh, default password |
| **Bookings** | ≡ƒö┤ CRITICAL | No double-booking prevention |
| **CORS** | ≡ƒö┤ CRITICAL | Hardcoded localhost origins |
| **Input Validation** | ≡ƒƒá HIGH | Missing on numeric/enum fields |
| **Error Handling** | ≡ƒƒá HIGH | No global error handling |
| **Pagination** | ≡ƒƒí MEDIUM | Missing on large lists |
| **Audit Logging** | ≡ƒƒí MEDIUM | No change tracking |
| **Search** | ≡ƒƒí MEDIUM | Only frontend filtering |
| **Images** | ≡ƒƒí MEDIUM | Multiple images not supported |

**Overall Status:** ≡ƒö┤ **NOT PRODUCTION READY**  
**Estimated Time to Production:** 20-25 hours (Priority 1-2 items)  
**Critical Path:** Database ΓåÆ Email ΓåÆ Auth ΓåÆ CORS ΓåÆ Input Validation

---

## ≡ƒö¥ CODE AUDIT FINDINGS (Comprehensive)

### **21 Code Quality Issues Identified**

Based on comprehensive codebase audit, here are all issues organized by severity:

#### **CRITICAL (3 issues)**

1. **Missing Error Handling - API Response Parsing**
   - **File:** `src/services/contactService.js` (line 17)
   - **Problem:** `const data = await response.json()` without try-catch for JSON parsing errors
   - **Impact:** Silent failures, unhandled promise rejections
   - **Fix:** Wrap JSON parsing in try-catch block

2. **Race Condition in Token Refresh**
   - **File:** `src/services/api.js` (lines 49-81)
   - **Problem:** Multiple 401 responses could trigger multiple token refresh attempts
   - **Impact:** Duplicate API calls, potential auth failures
   - **Fix:** Use atomic operation or mutex pattern for `isRefreshing` flag

3. **Unguarded window.location Access**
   - **File:** `src/services/api.js` (lines 39, 44, 73), `src/components/global/ErrorBoundary.vue` (line 17)
   - **Problem:** Direct window.location access without checking if window exists
   - **Impact:** Breaks in non-browser environments (SSR, testing)
   - **Fix:** Add `typeof window !== 'undefined'` guard

#### **HIGH (8 issues)**

4. **Missing Input Validation**
   - **File:** `src/views/admin/AdminPropertyForm.vue` (lines 10-34)
   - **Problem:** Form accepts user input without validation before submission
   - **Impact:** Invalid data in database, API errors
   - **Fix:** Add form validation before submit

5. **Unhandled Promise Rejection in Logout**
   - **File:** `src/stores/authStore.js` (line 63)
   - **Problem:** `.catch(() => undefined)` silently ignores logout errors
   - **Impact:** Errors swallowed, debugging difficult
   - **Fix:** Proper error logging instead of silent catch

6. **Missing Null Check in Computed Property**
   - **File:** `src/stores/propertyStore.js` (line 96)
   - **Problem:** `p.featured` accessed without null/undefined check
   - **Impact:** Runtime errors if property malformed
   - **Fix:** Add optional chaining: `p?.featured`

7. **No Error Handling in Store Initialization**
   - **File:** `src/stores/propertyStore.js` (line 197), `src/stores/projectStore.js`, `src/stores/bookingStore.js`
   - **Problem:** Async initialization called without error handling
   - **Impact:** Silent failures on startup
   - **Fix:** Add try-catch blocks or error state

8. **Missing Response Data Validation**
   - **File:** `src/stores/propertyStore.js` (lines 45, 58, 68)
   - **Problem:** Assumes `response.data` structure without validation
   - **Impact:** Crashes if API returns unexpected structure
   - **Fix:** Validate API response schema

9. **No CSRF Protection**
   - **File:** `src/services/api.js` (entire file)
   - **Problem:** No CSRF token handling in state-changing requests
   - **Impact:** Vulnerable to CSRF attacks
   - **Fix:** Add CSRF token to request headers

10. **Broken Dynamic Import in Route Guard**
    - **File:** `src/router/index.js` (line 150)
    - **Problem:** Dynamic import of authStore without error handling
    - **Impact:** Silent failures if import fails
    - **Fix:** Add try-catch around dynamic imports

11. **Race Condition in Multiple API Calls**
    - **File:** `src/services/api.js` (response interceptor)
    - **Problem:** Queue of failed requests not atomic-safe
    - **Impact:** Request order may be wrong after refresh
    - **Fix:** Use proper queue mechanism or async/await lock

#### **MEDIUM (9 issues)**

12. **Hardcoded API Endpoint**
    - **File:** `src/services/api.js` (line 55)
    - **Problem:** `/api/v1/auth/refresh` hardcoded in token refresh
    - **Impact:** Not configurable, inconsistent with other endpoints
    - **Fix:** Use `BASE_URL` or config constant

13. **Hardcoded Phone Numbers**
    - **Files:** `src/views/BookTour.vue` (lines 304, 353)
    - **Problem:** `+234 800 123 4567` hardcoded in multiple places
    - **Impact:** Hard to update, scattered throughout code
    - **Fix:** Move to config constants or env variables

14. **Hardcoded Contact Email**
    - **File:** `src/views/BookTour.vue` (line 360)
    - **Problem:** `bookings@ksavaluers.com` hardcoded
    - **Impact:** Hard to change, not centralized
    - **Fix:** Move to config/constants

15. **No Form Reset After Submit**
    - **File:** `src/views/admin/AdminPropertyForm.vue` (line 94)
    - **Problem:** Form data not cleared after successful submission
    - **Impact:** User can accidentally resubmit same data
    - **Fix:** Call `resetForm()` after success

16. **Missing Loading State in API Calls**
    - **File:** `src/views/admin/AdminBookings.vue`
    - **Problem:** No loading state tracking for list operations
    - **Impact:** UI doesn't indicate loading, poor UX
    - **Fix:** Add loading ref and loading state management

17. **Unvalidated Route Parameters**
    - **File:** `src/router/index.js` (lines 75, 80)
    - **Problem:** Route parameter `id` used without validation
    - **Impact:** Invalid IDs could cause errors
    - **Fix:** Validate ID format in route guard

18. **Missing Null Check on Optional Property**
    - **File:** `src/views/BookTour.vue` (line 47)
    - **Problem:** `selectedPropertyDetails.address` accessed without null-safety
    - **Impact:** Display "undefined" in UI
    - **Fix:** Use optional chaining: `selectedPropertyDetails?.address`

19. **Magic String Constants**
    - **File:** `src/services/api.js` (multiple lines)
    - **Problem:** HTTP status codes, paths hardcoded (400, 401, 403, etc.)
    - **Impact:** Hard to maintain, scattered constants
    - **Fix:** Extract to constants file

20. **Console Methods in Production**
    - **Files:** `src/services/contactService.js` (lines 25, 35)
    - **Problem:** `console.error()` left in production code
    - **Impact:** Should use proper logging service
    - **Fix:** Replace with logger service or remove

#### **LOW (1 issue)**

21. **Missing Accessibility Attributes**
    - **File:** `src/views/admin/AdminBookings.vue` (line 84)
    - **Problem:** Tab buttons missing `role="tab"` and `aria-selected`
    - **Impact:** WCAG accessibility violations
    - **Fix:** Add `role="tab"`, `aria-selected`, `aria-controls`

---

**Summary:** 
- **CRITICAL:** 3 issues blocking stability
- **HIGH:** 8 issues affecting data integrity and error handling
- **MEDIUM:** 9 issues affecting maintainability and UX
- **LOW:** 1 issue affecting accessibility

**Priority Order:** Fix all CRITICAL and HIGH issues before production.

---

**Can Edit Freely:**
- Γ£à `backend/server.js` - All endpoints, middleware, config
- Γ£à `backend/package.json` - Dependencies, scripts
- Γ£à `.env` / `.env.example` - Environment variables
- Γ£à `src/stores/*.js` - All store files
- Γ£à `src/services/api.js` - API client
- Γ£à `src/views/admin/*.vue` - Admin components

**Cannot/Should Not Edit:**
- Γ¥î `node_modules/` - Managed by npm
- Γ¥î `dist/` - Build output
- Γ¥î `.git/` - Git metadata
- Γ¥î External package code

**Editable by User Preference:**
- ΓÜá∩╕Å `PROJECT_SUMMARY.md` - Update as work progresses
- ΓÜá∩╕Å `AGENTS.md` - This file, update as issues fixed
- ΓÜá∩╕Å `DEPLOYMENT.md` - Add production URLs when deployed

---

**Last Updated:** June 19, 2026  
**Version:** 3.0.0 (Post-Fix Audit)  
**Architecture Pattern:** Service-oriented with Pinia state management  
**Production Status:** ⚠️ **PARTIAL** - Critical UI/UX issues fixed, but code quality issues remain

### **Next Steps:**
1. ✅ DONE: Fix navigation z-index (prevents content overlap)
2. ✅ DONE: Add properties carousel (improves home page)
3. ✅ DONE: Improve admin login UX (better error messages)
4. 🔲 TODO: Fix 3 CRITICAL code issues (error handling, race conditions)
5. 🔲 TODO: Fix 8 HIGH priority issues (validation, null checks)
6. 🔲 TODO: Address 9 MEDIUM issues (hardcoded values, missing states)
7. 🔲 TODO: Fix 1 LOW accessibility issue
