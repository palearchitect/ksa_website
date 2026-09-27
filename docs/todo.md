# KSA Valuers Project: Development Roadmap

## Phase 1: Frontend Enhancements & UX
- [ ] **Projects View:** Implement full-screen modal/view for `Projects.vue` matching `PropertiesPage.vue` style.
- [ ] **Image Handling:** Integrate local image upload functionality (in addition to URL support) across Admin Dashboard.
- [ ] **Testimonials:** Add "Client Feedback" submission button in `About.vue`.
- [ ] **Carousel Logic:**
  - [ ] Implement carousel for project images (if >1 image).
  - [ ] Implement randomized slide carousel for testimonials (if >3 entries).

## Phase 2: Team & Identity Management
- [x] **Team Management:** Add CRUD (Create, Read, Update, Delete) interface in `Team.vue` for managing staff.
- [x] **Authentication/Hierarchy:**
  - [x] Expand Signup/Login to support hierarchy: `Admin`, `Management`, `Tenant`, `PropertyOwner`.
  - [x] Implement Role-Based Access Control (RBAC) to differentiate dashboard views based on login hierarchy.

## Phase 3: Multi-Portal Property Management System (PMS)
- [x] **Core Infrastructure:**
  - [x] Implement Role-Based Redirects in `router.js` (Login redirects to `/dashboard/:role`).
  - [x] Configure Backend Middleware to scope all API requests based on `user_id` / `property_id`.
- [x] **Admin Dashboard (`/dashboard/admin`):**
  - [x] Maintain existing site-wide controls (Team, Content, Site Config).
  - [x] Add "PMS Gateway" to access Property, Tenant, and Financial modules.
- [x] **Management Dashboard (`/dashboard/management`):**
  - [x] Operational hub: Tenant Management & Lease Tracking.
  - [x] Maintenance Request tracking.
  - [x] Financial Reporting (Expenses/Income).
- [x] **Owner Dashboard (`/dashboard/owner`):**
  - [x] Read-only asset view: Occupancy status per property.
  - [x] Rent payment status & Net Income summary.
  - [x] *Constraint: Strictly hide all tenant PII.*
- [x] **Tenant Dashboard (`/dashboard/tenant`):**
  - [x] Payment gateway integration (Paystack/Flutterwave for cards + Bank Transfer details).
  - [x] Maintenance & Dispute ticketing system.
  
## Phase 4 Implementation - PMS Expansion & UX Refinement
1. Authentication & Security
- [x] Google OAuth Integration:
  - [x] Set up Google Cloud Console credentials client libraries.
  - [x] Implement Google Identity Services client script on `/admin/login`.
  - [x] Create backend endpoint to verify Google token and match against existing user email.
  - [x] Logic: If email exists, merge identity; if new, redirect to /onboarding.
- [x] Owner Verification Logic:
  - [x] Create middleware/guard to check user_role === 'property_owner'.
  - [x] Database Query: Check if user_email is linked to any property_id in the owner_property join table.
  - [x] Redirect: If no properties are linked, trigger "Access Denied" toast/alert and bounce to homepage.

2. Dashboard UX Upgrades
- [x] Global Property Switcher:
  - [x] Create a persistent `<PropertySwitcher/>` component in the Owner/Manager/Admin dashboard header.
  - [x] State Management: Update selectedPropertyId in Pinia store when changed.
  - [x] Reactivity: Force dashboard widgets to filter data based on the selected property_id.
- [x] UI/UX Modernization:
  - [x] Replace static data lists with "Quick Insight" Cards.
  - [x] Implement "Needs Attention" status indicators (e.g. colored urgency states).
  - [x] Add a global FAB (Floating Action Button) for core tasks (e.g. creating leases).

3. Contact Page & Map Integration
- [x] Leaflet.js Setup:
  - [x] Inject Leaflet CSS/JS and load client script.
  - [x] Replace static placeholder with dark CartoDB tile layer map.
  - [x] Set marker at the office location coordinates `[6.4623, 3.5794]`.

4. Implementation Checklist (Technical)
- [x] Database Schema:
  - [x] Add google_id column to users table.
  - [x] Create owner_property join table with indexing.
- [x] Frontend Routes:
  - [x] Add /onboarding route for new social signups.
  - [x] Refactor AdminLayout and DashboardLayout to handle the PropertySwitcher.

## Phase 5: Maintenance & Optimization
- [ ] Linting & Code Refactoring.
- [ ] Database Schema updates to support multi-tenant/owner relations.
---

## 🛠️ Code Issues & Refactoring Tasks

### 1. 🔴 Broken Error Captured Hook in `global/ErrorBoundary.vue`
* **File:** [ErrorBoundary.vue](file:///c:/Users/dell/OneDrive/Documents/website/src/components/global/ErrorBoundary.vue#L13-L23)
* **Issue:** The local function `errorCaptured` is defined in `<script setup>` but never registered with the Vue runtime. It does not capture render crashes.
* **Impact:** Any component using this error boundary (including `FAQ.vue`, `PropertyDetail.vue`, etc.) will fail silently on render errors.
* **Fix:** Import and use the `onErrorCaptured` lifecycle hook, similar to how it is done in [src/components/ErrorBoundary.vue](file:///c:/Users/dell/OneDrive/Documents/website/src/components/ErrorBoundary.vue#L37-L41):
  ```javascript
  import { ref, onErrorCaptured } from 'vue'
  const error = ref(null)
  onErrorCaptured((err) => {
    error.value = err?.message || 'Unknown error'
    return false
  })
  ```

### 2. 🟠 Duplicate Error Boundary Components
* **Files:** [src/components/ErrorBoundary.vue](file:///c:/Users/dell/OneDrive/Documents/website/src/components/ErrorBoundary.vue) & [src/components/global/ErrorBoundary.vue](file:///c:/Users/dell/OneDrive/Documents/website/src/components/global/ErrorBoundary.vue)
* **Issue:** Two separate implementations of error boundaries exist. One is used in `App.vue`, and the other is used across individual page views.
* **Fix:** Consolidate both files into a single, highly stylized global component under `src/components/global/ErrorBoundary.vue` and update all import statements.

### 3. 🟡 Missing Graceful Shutdown handlers in Express Backend
* **File:** [server.js](file:///c:/Users/dell/OneDrive/Documents/website/backend/server.js#L1597-L1618)
* **Issue:** When the process receives shutdown signals (`SIGTERM` or `SIGINT`), it exits abruptly.
* **Impact:** Open PostgreSQL pool connections remain dangling until timed out by the database server, which can exhaust connection slots in high-volume deploy environments.
* **Fix:** Add signal listeners to terminate active database pools cleanly:
  ```javascript
  const gracefulShutdown = () => {
    console.log('Shutting down server...');
    pool.end(() => {
      console.log('PostgreSQL pool closed.');
      process.exit(0);
    });
  };
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
  ```

### 4. 🟡 Simulated Chat Widget on Contact Page
* **File:** [Contact.vue](file:///c:/Users/dell/OneDrive/Documents/website/src/views/Contact.vue#L404-L412)
* **Issue:** The "Live Chat Support" component uses a local mock setTimeout reply rather than connecting to the server's Gemini AI endpoint (`/api/ask-ai`).
* **Fix:** Replace the mock timeout with a call to the server's Gemini API, or integrate a third-party chat service (e.g. Crisp/Tawk.to).
