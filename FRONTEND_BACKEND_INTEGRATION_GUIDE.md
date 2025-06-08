# Frontend Developer Guide: Backend API Integration with Callback URLs

## Overview

This guide provides comprehensive instructions for frontend developers on how to properly integrate with the Fashion Analysis backend API using callback URLs, authentication, and proper configuration.

## Table of Contents

1. [Backend API Structure](#backend-api-structure)
2. [Frontend Configuration](#frontend-configuration)
3. [API Client Setup](#api-client-setup)
4. [Authentication Flow](#authentication-flow)
5. [Making API Calls](#making-api-calls)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Backend API Structure

### Base URL and Endpoints

The backend runs on `http://localhost:5000` with the following structure:

```
Base URL: http://localhost:5000/api
```

### Available Endpoints

| Category | Endpoint | Description |
|----------|----------|-------------|
| **Health** | `GET /api/health/ping` | API status check |
| **Health** | `GET /api/health/db` | Database connection check |
| **Auth** | `POST /api/auth/register` | User registration |
| **Auth** | `POST /api/auth/login` | User login |
| **Auth** | `POST /api/auth/refresh` | Token refresh |
| **Auth** | `POST /api/auth/logout` | User logout |
| **User** | `GET /api/user/profile` | Get user profile |
| **User** | `PUT /api/user/profile` | Update user profile |
| **Dashboard** | `GET /api/dashboard/analytics` | Dashboard data |
| **Dashboard** | `GET /api/dashboard/recent-activity` | Recent user activity |
| **Wardrobe** | `GET /api/wardrobe/items` | Get wardrobe items |
| **Wardrobe** | `POST /api/wardrobe/items` | Add wardrobe item |
| **Analysis** | `POST /api/analysis/analyze` | Analyze outfit |
| **Analysis** | `GET /api/analysis/history` | Analysis history |

---

## Frontend Configuration

### 1. Next.js Proxy Configuration

The frontend uses Next.js rewrites to proxy API calls to the backend, avoiding CORS issues:

**File: `frontend/next.config.ts`**
```typescript
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};
```

### 2. Environment Variables

**File: `frontend/.env.local`**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=/api  # Use proxied path for development

# OAuth Configuration (if using)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## API Client Setup

### 1. Centralized API Client

**File: `frontend/app/api/apiClient.ts`**
```typescript
import axios from 'axios';
import useStore from '@/store/useStore';

// Use proxied path for development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create main API client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth tokens
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await refreshClient.post('/auth/refresh', {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          const { access_token } = response.data;
          localStorage.setItem('accessToken', access_token);
          useStore.getState().setToken(access_token);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        useStore.getState().logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Service Layer Architecture

Create service files for each API category:

```
frontend/app/api/services/
├── auth-service.ts
├── user-service.ts
├── dashboard-service.ts
├── wardrobe-service.ts
├── analysis-service.ts
└── recommendation-service.ts
```

---

## Authentication Flow

### 1. Login Process

**File: `frontend/app/api/services/auth-service.ts`**
```typescript
import apiClient from '../apiClient';
import useStore from '@/store/useStore';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password
    });
    
    const { user, access_token, refresh_token } = response.data;
    
    // Store tokens
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    
    // Update store
    useStore.getState().setToken(access_token);
    useStore.getState().setUser(user);
    
    return user;
  } catch (error) {
    throw new Error('Login failed. Please check your credentials.');
  }
};
```

### 2. Session Initialization

**Component Usage:**
```typescript
import { useEffect } from 'react';
import { initializeSession } from '@/app/api/services/auth-service';

export function useAuthInitialization() {
  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeSession();
      } catch (error) {
        console.error('Session initialization failed:', error);
      }
    };
    
    initAuth();
  }, []);
}
```

### 3. Protected Route Implementation

**File: `frontend/src/middleware.ts`**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
```

---

## Making API Calls

### 1. Service Pattern Implementation

**Dashboard Service Example:**
```typescript
// frontend/app/api/services/dashboard-service.ts
import apiClient from '../apiClient';

interface AnalyticsData {
  totalAnalyses: { value: number; trend: string };
  wardrobeItems: { value: number; trend: string };
  styleScoreAverage: { value: string; trend: string };
}

class DashboardService {
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await apiClient.get('/dashboard/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }
  
  async getRecentActivity(): Promise<Activity[]> {
    try {
      const response = await apiClient.get('/dashboard/recent-activity');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }
}

export default new DashboardService();
```

### 2. Component Integration

**React Component Usage:**
```typescript
import React, { useState, useEffect } from 'react';
import dashboardService from '@/app/api/services/dashboard-service';

export function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <p>Total Analyses: {analytics?.totalAnalyses.value}</p>
        <p>Trend: {analytics?.totalAnalyses.trend}</p>
      </div>
    </div>
  );
}
```

### 3. File Upload Example

**File Upload Service:**
```typescript
// frontend/app/api/services/analysis-service.ts
import apiClient from '../apiClient';

export const analyzeOutfit = async (imageFile: File, analysisType?: string) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (analysisType) {
      formData.append('analysis_type', analysisType);
    }

    const response = await apiClient.post('/analysis/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Analysis failed. Please try again.');
  }
};
```

---

## Error Handling

### 1. Global Error Handler

**Error Handler Service:**
```typescript
// frontend/app/api/services/error-handler.ts
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    switch (error.response?.status) {
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred.';
    }
  }
  
  return 'Network error. Please check your connection.';
};
```

### 2. Error Boundary Component

**Error Boundary:**
```typescript
// frontend/components/ErrorBoundary.tsx
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Best Practices

### 1. **Use TypeScript Interfaces**

Define clear interfaces for all API responses:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  preferences?: UserPreferences;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
```

### 2. **Implement Loading States**

Always provide loading feedback:

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  
  try {
    await apiCall();
    // Success handling
  } catch (err) {
    setError(handleApiError(err));
  } finally {
    setLoading(false);
  }
};
```

### 3. **Cache API Responses**

Use React Query or SWR for caching:

```typescript
import { useQuery } from '@tanstack/react-query';
import dashboardService from '@/app/api/services/dashboard-service';

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ['dashboard', 'analytics'],
    queryFn: () => dashboardService.getAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### 4. **Environment-Specific Configuration**

```typescript
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.yourdomain.com/api';
  }
  return '/api'; // Use Next.js proxy in development
};
```

---

## Troubleshooting

### 1. **Common Issues and Solutions**

#### CORS Errors
```javascript
// Check Next.js proxy configuration
// Ensure backend CORS settings include frontend origin
// Verify the backend is running on correct port
```

#### Authentication Issues
```javascript
// Clear localStorage and try again
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');

// Check token expiration
const token = localStorage.getItem('accessToken');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token expires:', new Date(payload.exp * 1000));
}
```

#### Network Connectivity
```javascript
// Test backend connectivity
fetch('/api/health/ping')
  .then(response => console.log('Backend status:', response.status))
  .catch(error => console.error('Backend not accessible:', error));
```

### 2. **Debug Helper Script**

**File: `frontend/debug-auth.js`**
```javascript
// Run in browser console to debug authentication
console.log("=== AUTHENTICATION DEBUG ===");

const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

console.log("Access Token:", accessToken ? "Present" : "Missing");
console.log("Refresh Token:", refreshToken ? "Present" : "Missing");

// Test API connectivity
fetch('/api/dashboard/analytics')
  .then(response => {
    console.log("API Status:", response.status);
    if (response.status === 401) {
      console.log("❌ Authentication failed - need to login");
    } else if (response.status === 200) {
      console.log("✅ API accessible and authenticated");
    }
  })
  .catch(error => console.log("❌ API connection failed:", error));
```

### 3. **Health Check Workflow**

1. **Check Backend Status:**
   ```bash
   curl http://localhost:5000/api/health/ping
   ```

2. **Check Frontend Proxy:**
   ```bash
   curl http://localhost:3000/api/health/ping
   ```

3. **Verify Authentication:**
   ```javascript
   // In browser console
   fetch('/api/dashboard/analytics', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
     }
   })
   ```

---

## Quick Start Checklist

- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Environment variables configured
- [ ] Next.js proxy working (`/api` routes forward to backend)
- [ ] Authentication tokens stored in localStorage
- [ ] API services importing shared `apiClient`
- [ ] Error handling implemented
- [ ] Loading states added to components

---

## API Endpoint Examples

### Authentication
```typescript
// Login
const user = await apiClient.post('/auth/login', { email, password });

// Register
const user = await apiClient.post('/auth/register', { name, email, password });

// Refresh token
const tokens = await apiClient.post('/auth/refresh');
```

### Dashboard Data
```typescript
// Get analytics
const analytics = await apiClient.get('/dashboard/analytics');

// Get recent activity
const activity = await apiClient.get('/dashboard/recent-activity');

// Get style trends
const trends = await apiClient.get('/dashboard/style-trends');
```

### Wardrobe Management
```typescript
// Get wardrobe items
const items = await apiClient.get('/wardrobe/items');

// Add wardrobe item
const formData = new FormData();
formData.append('image', file);
formData.append('name', itemName);
const item = await apiClient.post('/wardrobe/items', formData);
```

### Outfit Analysis
```typescript
// Analyze outfit
const formData = new FormData();
formData.append('image', file);
const analysis = await apiClient.post('/analysis/analyze', formData);

// Get analysis history
const history = await apiClient.get('/analysis/history');
```

---

## Support

For additional help:

1. Check the API documentation: `backend/API_DOCUMENTATION.md`
2. Review session management fixes: `SESSION_MANAGEMENT_FIXES.md`
3. Use the health check script: `health_check.py`
4. Run the debug script in browser console: `frontend/debug-auth.js`

Remember to always test your API integration in both development and production environments!
