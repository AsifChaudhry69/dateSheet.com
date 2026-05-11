# Auth Integration Guide

This document explains the authentication API integration using TanStack Query, Axios, and Middleware.

## Architecture Overview

### 1. **API Client with Axios** (`src/lib/api-client.ts`)

- Centralized axios instance with base URL configuration
- Request interceptor: Adds JWT token from localStorage to all requests
- Response interceptor: Handles 401 (Unauthorized) and 403 (Forbidden) responses
- Automatic redirect to sign-in on unauthorized access

### 2. **TanStack Query Setup** (`src/lib/query-client.ts`)

- QueryClient configuration with optimal cache timings
- 5 minutes staleTime for automatic refetch
- 10 minutes gcTime (garbage collection time)
- Automatic retry on failed queries/mutations

### 3. **Query Provider** (`src/lib/query-provider.tsx`)

- React component that wraps the app with QueryClientProvider
- Integrated into root layout for global access

### 4. **Auth Services** (`src/services/auth.service.ts`)

- `signUpUser()`: Register new user with name, email, password
- `signInUser()`: Login user with email and password
- `logoutUser()`: Clear authentication state
- Includes TypeScript interfaces for request/response types

### 5. **Auth Mutations** (`src/services/auth.mutations.ts`)

- `useSignUpMutation()`: Custom hook for signup
- `useSignInMutation()`: Custom hook for signin
- `useLogoutMutation()`: Custom hook for logout
- Automatic token storage in localStorage on success
- Error handling with console logging

### 6. **Middleware** (`src/middleware.ts`)

- Protected route handling
- Redirects unauthenticated users to sign-in page
- Redirects authenticated users away from auth pages
- Configurable public routes list

### 7. **Auth Components** (`src/components/auth/*.tsx`)

- Sign-up component with name field and password validation
- Sign-in component with email and password
- Integration with mutations and toast notifications
- Automatic redirect to dashboard on success

## File Structure

```
src/
├── lib/
│   ├── api-client.ts          # Axios instance with interceptors
│   ├── query-client.ts         # TanStack Query configuration
│   └── query-provider.tsx      # QueryClientProvider wrapper
├── services/
│   ├── auth.service.ts         # API service functions
│   └── auth.mutations.ts       # Custom hooks for mutations
├── middleware.ts               # Route protection middleware
├── app/
│   ├── layout.tsx              # Root layout with QueryProvider
│   ├── api/
│   │   └── auth/
│   │       ├── sign-in/route.ts    # Sign-in endpoint
│   │       └── register/route.ts   # Sign-up endpoint
│   └── (auth)/
│       ├── sign-in/page.tsx
│       └── sign-up/page.tsx
└── components/
    └── auth/
        ├── sign-in.tsx
        └── sign-up.tsx
```

## Environment Variables

Add to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
```

## Usage Example

### In a Component

```typescript
import { useSignInMutation } from "@/src/services/auth.mutations"
import { toast } from "sonner"

export function LoginForm() {
  const { mutate: signIn, isPending } = useSignInMutation()

  const handleLogin = (email: string, password: string) => {
    signIn(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast.success("Logged in!")
            // Navigate to dashboard
          }
        },
        onError: () => {
          toast.error("Login failed")
        },
      }
    )
  }

  return (
    <button onClick={() => handleLogin("user@example.com", "password123")} disabled={isPending}>
      {isPending ? "Logging in..." : "Login"}
    </button>
  )
}
```

## API Endpoints

### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clx1234abcd",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Sign In User

```
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "user": {
      "id": "clx1234abcd",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Key Features

✅ **Token Management**: Automatic JWT token storage and attachment to requests  
✅ **Error Handling**: Global error handling with automatic redirects  
✅ **Loading States**: `isPending` flag for UI feedback  
✅ **Toast Notifications**: Success/error feedback using Sonner  
✅ **Type Safety**: Full TypeScript support  
✅ **Protected Routes**: Middleware-based route protection  
✅ **Request Caching**: TanStack Query handles cache management  
✅ **Automatic Retry**: Failed requests are retried once

## Testing

1. Run the dev server:

   ```bash
   npm run dev
   ```

2. Navigate to `/sign-up` to create an account
3. Navigate to `/sign-in` to login
4. Check localStorage for `authToken` after successful login
5. Protected routes should redirect to login if not authenticated

## Troubleshooting

- **Token not persisting**: Check localStorage in browser DevTools
- **401 errors**: Verify JWT_SECRET matches between client and server
- **Redirects not working**: Check middleware configuration in `middleware.ts`
- **Mutations not firing**: Ensure QueryProvider is wrapped in layout
