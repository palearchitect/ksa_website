# Strapi Integration Documentation

## Overview

The KSA Valuers website now uses a **Strapi Headless CMS** backend for managing properties and content. This document explains the integration architecture and how to set up the backend.

## Architecture

### API Service Layer (`src/services/api.js`)

The API service provides a centralized interface for all backend communication:

```javascript
import { propertyService, authService } from '@/services/api'

// Fetch properties
const response = await propertyService.getProperties({
  page: 1,
  pageSize: 10,
  sort: 'createdAt:desc'
})

// Create property
await propertyService.createProperty({
  title: 'Luxury Apartment',
  location: 'Ikoyi, Lagos',
  price: 450000000,
  ...
})
```

**Features:**
- Axios instance with Strapi base URL
- Automatic authentication token injection
- Error handling and 401 redirect
- Request/response interceptors
- Support for file uploads

### Properties Store (`src/stores/properties.js`)

Pinia store managing property state and API interactions:

```javascript
import { usePropertiesStore } from '@/stores/properties'

const store = usePropertiesStore()

// Fetch properties
await store.fetchProperties()

// Filter
store.setFilters({ status: 'For Sale', minPrice: 100000000 })

// Search
store.setSearchQuery('Lekki')
```

**Store Methods:**
- `fetchProperties(options)` - Get all properties with pagination/filtering
- `fetchProperty(id)` - Get single property
- `createProperty(data)` - Create new property
- `updateProperty(id, data)` - Update property
- `deleteProperty(id)` - Delete property
- `setSearchQuery(query)` - Filter by search
- `setFilters(filters)` - Apply filters
- `nextPage() / previousPage() / goToPage(n)` - Pagination

## Strapi Backend Setup

### 1. Create Strapi Project

```bash
# Create new Strapi project
npx create-strapi-app my-ksa-valuers --quickstart

# Or with TypeScript
npx create-strapi-app my-ksa-valuers --quickstart --typescript
```

### 2. Create Properties Collection Type

In Strapi Admin Panel:

**Navigation:** Content Manager → Create new collection type

**Collection Name:** `property`

**Fields:**
- `title` (String, required)
- `location` (String, required)
- `description` (Text)
- `price` (Number, required)
- `bedrooms` (Number, required)
- `bathrooms` (Number, required)
- `squareFootage` (Number, required)
- `status` (Enumeration: "For Sale", "For Rent", "Sold")
- `image` (Media, single file)
- `publishedAt` (Timestamp)

### 3. Set Permissions

**Settings → Users & Permissions → Roles → Public/Authenticated**

Enable:
- `find` (get all)
- `findOne` (get by id)
- `create` (for authenticated users)
- `update` (for authenticated users)
- `delete` (for authenticated users)

### 4. Create API Token (Optional)

For programmatic API access:
1. **Settings → API Tokens**
2. Create new token with all property permissions
3. Add to environment variable: `VITE_STRAPI_TOKEN`

## Configuration

### Environment Variables

Create `.env.local` file:

```env
# Strapi API URL
VITE_STRAPI_URL=http://localhost:1337/api

# Optional: API Token for authenticated requests
# VITE_STRAPI_TOKEN=your_api_token_here
```

### Components Using the Store

**PropertyList.vue** (Frontend)
```javascript
// Fetches all properties
await propertiesStore.fetchProperties()
// Supports search and filtering
propertiesStore.setSearchQuery('Lekki')
```

**AdminPropertyList.vue** (Admin)
```javascript
// Same store used for admin panel
// Handles CRUD operations via the store
await propertiesStore.deleteProperty(id)
```

## API Response Format

### Get Properties Response

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123",
      "title": "Luxury Apartment",
      "location": "Ikoyi, Lagos",
      "price": 450000000,
      "bedrooms": 4,
      "bathrooms": 3,
      "squareFootage": 5500,
      "status": "For Sale",
      "image": {
        "id": 1,
        "url": "/uploads/image.jpg",
        "name": "image.jpg"
      },
      "createdAt": "2024-01-16T00:00:00.000Z",
      "updatedAt": "2024-01-16T00:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

## Authentication

### JWT Token Flow

1. **Login:** User logs in with email/password
2. **Token Stored:** JWT token saved to `localStorage.authToken`
3. **Auto-Injection:** Token automatically added to all requests
4. **Token Refresh:** Handled by interceptors
5. **401 Handler:** Auto-redirects to login on unauthorized

### Using Auth Service

```javascript
import { authService } from '@/services/api'

// Register
const response = await authService.register('john', 'john@example.com', 'password')
localStorage.setItem('authToken', response.jwt)

// Login
const response = await authService.login('john@example.com', 'password')
localStorage.setItem('authToken', response.jwt)
```

## Error Handling

The store includes comprehensive error handling:

```javascript
try {
  await propertiesStore.fetchProperties()
} catch (error) {
  // Access error message
  console.error(propertiesStore.error)
  
  // Handle specific errors
  if (error.response?.status === 401) {
    // Unauthorized
  } else if (error.response?.status === 404) {
    // Not found
  }
}
```

## File Upload

Upload images to Strapi:

```javascript
import { propertyService } from '@/services/api'

const file = event.target.files[0]
const uploadedFile = await propertyService.uploadFile(file)
// Returns: { id, url, name, etc. }

// Use URL in property
 await propertiesStore.createProperty({
  title: 'New Property',
  image: uploadedFile.url,
  ...
})
```

## Deployment

### Deploy Strapi

1. **Hosting Options:**
   - Strapi Cloud (recommended)
   - Heroku
   - DigitalOcean
   - AWS
   - Your own server

2. **Update Environment:**
   ```env
   VITE_STRAPI_URL=https://your-strapi-instance.com/api
   ```

3. **Enable CORS** in Strapi:
   ```javascript
   // config/middlewares.js
   module.exports = [
     'strapi::errors',
     {
       name: 'strapi::cors',
       config: {
         enabled: true,
         origin: ['https://yourdomain.com'],
         credentials: true
       }
     }
   ]
   ```

## Troubleshooting

### CORS Errors

**Solution:** Configure Strapi CORS settings
```javascript
// config/middlewares.js
config: {
  origin: ['*'], // For development
}
```

### 401 Unauthorized

**Solutions:**
- Check token is valid
- Token not expired
- User has proper permissions
- API token included if using programmatic access

### Properties Not Loading

1. Check Strapi is running: `http://localhost:1337`
2. Verify environment variable: `VITE_STRAPI_URL`
3. Check collection exists: `property`
4. Verify permissions: Settings → Users & Permissions
5. Check browser console for API errors

## Best Practices

1. **Always use the store** for property operations
2. **Handle loading/error states** in components
3. **Implement pagination** for large datasets
4. **Cache frequently accessed data**
5. **Use proper permissions** in Strapi roles
6. **Validate data** before sending to API
7. **Keep API tokens secure** - never commit to git
8. **Use HTTPS** in production

## Next Steps

1. Set up Strapi backend locally or in cloud
2. Create properties collection with fields listed above
3. Configure permissions for public/authenticated access
4. Update `.env.local` with Strapi URL
5. Test API integration in browser DevTools
6. Deploy Strapi and update production environment
