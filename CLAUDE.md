# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run ESLint
pnpm lint

# Preview production build
pnpm preview
```

**Note**: This project uses `pnpm` as the package manager.

---

## Project Overview
**EaSafari Frontend** is a React 19 + TypeScript + Vite application designed as a dual-portal system for managing tourism-related services. It supports two primary user types: **Admin** and **Service Provider (Tourism Provider)**, with separate authentication flows, dashboards, and functionality.

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: TanStack Query (React Query) v5 for server-state
- **Forms**: React Hook Form + Zod (schema validation)
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Notifications**: react-hot-toast & Sonner

---

## Folder Structure & Architecture

### Core Directory Layout
```
src/
├── features/              # Feature-based modules (main architecture)
│   ├── auth/             # Shared admin auth logic
│   ├── admin/            # Admin portal features
│   │   ├── attraction/
│   │   ├── accommodation/
│   │   └── experience/
│   ├── provider/         # Service provider portal features
│   │   ├── auth/        # Provider-specific auth
│   │   ├── accommodation/
│   │   ├── experience/
│   │   ├── event/
│   │   ├── booking/
│   │   └── profile/
│   └── market/          # Marketplace/commerce features
├── layouts/             # Layout wrappers
│   ├── admin/          # Admin portal layout
│   └── provider/       # Provider portal layout
├── contexts/           # Global state (Authentication)
├── components/         # Shared components
│   ├── ui/            # Radix UI wrapper components
│   └── custom/        # Application-specific components
├── lib/               # Utilities & helpers
│   ├── api.ts         # Axios instance & request helpers
│   ├── queryKeys.ts   # TanStack Query key factory
│   └── utils.ts       # Utility functions
├── types/            # Global type definitions
├── routes/           # Routing configuration
└── assets/          # Static assets (images, etc.)
```

### Feature Module Structure (Standard Pattern)
Each feature follows this consistent structure:

```
feature/
├── pages/              # Page-level components
│   ├── FeaturePage.tsx
│   └── FeatureDetailsPage.tsx
├── components/         # UI components for this feature
│   ├── FeatureTable.tsx
│   ├── AddFeatureDialog.tsx
│   └── EditFeatureDialog.tsx
├── hooks/             # Custom React hooks (data fetching, mutations)
│   └── useFeature.ts
├── services/          # API service layer
│   └── featureService.ts
├── schemas/           # Zod validation schemas
│   └── featureSchemas.ts
├── types/             # TypeScript interfaces for this feature
│   └── featureTypes.ts
└── index.ts          # Barrel exports (main entry point)
```

---

## Authentication System

### Architecture Overview
The authentication system is divided into **two separate flows**:

#### 1. **Admin Authentication** (`/features/auth`)
- **Login Route**: `/admin/login`
- **Portal Route**: `/admin`
- **API Endpoint**: `POST /admin/auth/login`
- **Credentials**: Email + Password
- **Role**: "admin"

#### 2. **Provider (Service Provider) Authentication** (`/features/provider/auth`)
- **Login Route**: `/login`
- **Register Route**: `/register`
- **Portal Route**: `/provider`
- **API Endpoints**:
  - Login: `POST /provider/auth/login`
  - Register: `POST /provider/auth/register`
- **Role**: "service_provider"

### Authentication Flow

**1. Context-Based State Management** (`/contexts`)
```typescript
// AuthContext stores:
- user: User | null (contains id, email, name, role)
- isAuthenticated: boolean
- isLoading: boolean
- login(token, userData): void
- logout(): void
```

**2. Local Storage Persistence**
- Token stored as `localStorage.getItem("token")`
- User data stored as `localStorage.getItem("user")`
- Tokens automatically attached to requests via Axios interceptor

**3. Axios Request Interceptor** (`/lib/api.ts`)
```typescript
// Automatically adds bearer token to all requests
headers.Authorization = `Bearer ${token}`

// On 401 response:
// - Clears stored credentials
// - Redirects to /login
```

**4. Protected Routes** (`/components/custom/ProtectedRoute.tsx`)
```typescript
// Props: allowedRoles?: string[]
// Redirects based on:
// - User authentication status
// - User role (admin vs service_provider)
// - Defaults admin users to /admin, providers to /provider
```

**5. Login Flow Example** (`useLogin` hook)
```typescript
// Steps:
1. User submits credentials
2. Call authService.login()
3. On success: store token & user data via AuthContext.login()
4. AuthProvider updates state, persists to localStorage
5. Protected routes allow access
```

---

## Key Domain Features

### 1. **Attractions** (Admin & Market)
**Purpose**: Manage tourism attraction points with images, ratings, and categories
**Key Files**:
- Admin: `/features/admin/attraction/`
- Type: `Attraction` interface with id, name, description, address, rating, images, category_id, coordinates

**API Endpoints**:
- `GET /admin/attractions` - List all
- `GET /admin/attractions?category_id={id}` - Filter by category
- `GET /admin/attractions/{id}` - Get details
- `POST /admin/attractions` - Create (FormData with images)
- `GET /admin/attractions/categories` - List categories
- `POST /admin/attractions/categories` - Create category

**Key Hooks**:
- `useAttractions(categoryId?)` - Query attractions with optional category filter
- `useAttractionCategories()` - Query categories + create category mutation
- `useCreateAttraction()` - Create with FormData (handles file uploads)

---

### 2. **Accommodations** (Admin & Provider)
**Purpose**: Manage lodging properties, rooms, and booking availability

**Admin Path**: `/features/admin/accommodation/`
**Provider Path**: `/features/provider/accommodation/`

**Key Types**:
```typescript
Accommodation {
  id: number
  name: string
  description: string
  address: string
  rating: number
  category_id: number
  images: string[]
  rooms?: Room[]
}

Room {
  id: number
  accommodation_id: number
  name: string
  capacity: number
  price: number
  // ...
}
```

**Provider-Specific Features**:
- View list of own accommodations
- View accommodation details with rooms
- Add new accommodations
- Add rooms to accommodations
- Delete accommodations
- Edit accommodation details (page: `ProviderAccommodationDetailsPage`)

---

### 3. **Experiences** (Admin & Provider)
**Purpose**: Manage guided tours, activities, and experiences

**Structure**: Similar to accommodations
**Provider Routes**:
- `/provider/experiences` - List experiences
- `/provider/experiences/:id` - Details/edit

---

### 4. **Events** (Provider-Specific)
**Purpose**: Manage event listings with dates, capacity, and bookings

**Files**: `/features/provider/event/`
**Routes**:
- `/provider/events` - List events
- `/provider/events/:id` - Event details with edit/delete dialogs

**Key Features**:
- Create events with categories
- Edit event details
- Delete events
- Event-to-attraction relationships

---

### 5. **Bookings** (Provider-Specific)
**Purpose**: Manage and view bookings for accommodations and experiences

**Files**: `/features/provider/booking/`
**Routes**: `/provider/bookings`

**Key Features**:
- Tabbed interface: Experience Bookings | Accommodation Bookings
- View booking details (guest info, dates, status)
- Update booking status (pending → confirmed → completed, etc.)
- Filter and search bookings

**Booking Types**:
```typescript
ExperienceBooking {
  id: number
  experience_id: number
  guest_name: string
  date: string
  status: "pending" | "confirmed" | "completed"
}

AccommodationBooking {
  id: number
  accommodation_id: number
  check_in: string
  check_out: string
  status: string
}
```

---

### 6. **Market/Marketplace** (Provider Feature)
**Purpose**: Manage e-commerce aspects (stores, products, categories, orders)

**Files**: `/features/market/`
**Routes**: `/provider/market`

**Components**: Tabbed interface with:
- **Stores Tab**: Store listing/management
- **Categories Tab**: Product category management
- **Products Tab**: Product CRUD
- **Orders Tab**: Order management

**Sub-structure**: `/features/market/feats/` contains:
- orders/
- stores/
- categories/
- products/

---

### 7. **Provider Profile/Settings** (Provider-Specific)
**Purpose**: Manage provider account information and business details

**Files**: `/features/provider/profile/`
**Routes**: `/provider/profile`

**Key Data**:
```typescript
ProviderProfile {
  id: string
  email: string
  name: string
  business_name?: string
  phone?: string
  address?: string
  description?: string
  verified: boolean
}
```

---

## State Management & Data Fetching

### TanStack Query (React Query) Integration

**1. Query Key Factory** (`/lib/queryKeys.ts`)
Centralized, hierarchical cache keys for all data fetches:

```typescript
// Example structure:
queryKeys = {
  attractions: {
    all: ["attractions"]
    lists: () => [...all, "list"]
    list: (filters) => [...lists(), {filters}]
    details: () => [...all, "detail"]
    detail: (id) => [...details(), id]
    search: (query) => [...all, "search", query]
  }
  provider: {
    accommodations: { /* similar structure */ }
    bookings: { /* similar structure */ }
    experiences: { /* similar structure */ }
    events: { /* similar structure */ }
  }
}
```

**2. Query Configuration** (`/src/main.tsx`)
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

**3. Hook Patterns**

**Read/Fetch Hooks** (useQuery):
```typescript
export const useAttractions = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId 
      ? queryKeys.attractions.list(`category-${categoryId}`)
      : queryKeys.attractions.lists(),
    queryFn: categoryId
      ? () => attractionService.getByCategory(categoryId)
      : attractionService.getAll,
  });
};
```

**Write/Mutation Hooks** (useMutation):
```typescript
export const useCreateAttraction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attractionService.create,
    onSuccess: () => {
      // Invalidate related caches
      queryClient.invalidateQueries({
        queryKey: queryKeys.attractions.lists(),
      });
    },
    onError: (error) => {
      console.error("Create failed:", error);
    },
  });
};
```

**4. Cache Invalidation Strategy**
- On successful mutation, invalidate related query keys
- This forces refetch of affected data
- Example: Creating an attraction invalidates `attractions.lists()`

---

## API Integration

### Axios Configuration (`/lib/api.ts`)

**Instance Setup**:
```typescript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

**Request Interceptor**:
- Automatically attaches Bearer token from localStorage

**Response Interceptor**:
- Handles 401: clears auth, redirects to login
- Converts errors to Error objects
- Distinguishes: API errors, network errors, request errors

**API Object Methods**:
```typescript
api = {
  get<T>(endpoint, options?)
  post<T, D>(endpoint, data?, options?)
  put<T, D>(endpoint, data?, options?)
  patch<T, D>(endpoint, data?, options?)
  delete<T>(endpoint, options?)
}
```

### Service Layer Pattern (`/features/*/services/*.ts`)

**Example: attractionService**:
```typescript
export const attractionService = {
  getAll: () => api.get("/admin/attractions"),
  getByCategory: (categoryId) => api.get(`/admin/attractions?category_id=${categoryId}`),
  getById: (id) => api.get(`/admin/attractions/${id}`),
  getCategories: () => api.get<AttractionCategory[]>("/admin/attractions/categories"),
  createCategory: (data: FormData | {name: string}) => {
    // Handle multipart/form-data for file uploads
    const headers = data instanceof FormData 
      ? { "Content-Type": "multipart/form-data" }
      : undefined
    return api.post("/admin/attractions/categories", data, {headers})
  },
  create: (data: FormData) => api.post("/admin/attractions", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
};
```

**Key Patterns**:
- Thin wrapper around axios instance
- Type-safe with TypeScript generics
- Handles FormData for file uploads
- Centralized endpoint definitions

---

## Forms & Validation

### Zod + React Hook Form Pattern

**1. Schema Definition** (`/features/*/schemas/*.ts`)
```typescript
export const createAttractionSchema = object({
  name: string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: string().min(1).max(1000),
  address: string().min(1).max(500),
  latitude: string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -90 && num <= 90;
  }, "Latitude must be between -90 and 90"),
  longitude: string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -180 && num <= 180;
  }, "Longitude must be between -180 and 180"),
  rating: string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 5;
  }, "Rating must be 0-5"),
  attraction_category_id: string().min(1, "Category is required"),
});
```

**2. Form Component Usage**
```typescript
type AddAttractionForm = z.infer<typeof createAttractionSchema>;

const form = useForm<AddAttractionForm>({
  resolver: zodResolver(createAttractionSchema),
  defaultValues: {
    name: "",
    description: "",
    // ...
  },
});

const onSubmit = (data: AddAttractionForm) => {
  // Data is already validated by Zod
  createAttractionMutation.mutate(data);
};
```

**3. Form Components** (shadcn/ui wrappers)
- `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>`
- These components integrate with React Hook Form
- Automatic error message display

---

## Routing Structure

### Route Configuration (`/routes/routes.tsx`)

**Authentication Routes** (public):
- `GET /admin/login` → AdminLoginPage
- `GET /login` → ProviderLoginPage
- `GET /register` → ProviderRegisterPage

**Admin Portal** (protected: role="admin"):
```
/admin
├── /attractions          → AttractionsPage
├── /attractions/:categorySlug
├── /accommodations       → AccommodationsPage
├── /accommodations/:categorySlug
├── /experiences         → ExperiencesPage
└── /experiences/:categorySlug
```

**Provider Portal**:
```
/provider
├── /dashboard          → Dashboard (temp: AttractionsPage)
├── /market            → MarketPage (stores, products, categories, orders)
├── /attractions       → ProviderAttractionsPage
├── /attractions/:id
├── /accommodations    → ProviderAccommodationsPage
├── /accommodations/:id → ProviderAccommodationDetailsPage
├── /experiences       → ProviderExperiencesPage
├── /experiences/:id
├── /events            → ProviderEventsPage
├── /events/:id        → ProviderEventDetailsPage
├── /bookings          → BookingsPage (tabbed: experience + accommodation)
└── /profile           → ProviderSettingsPage
```

### Protected Route Component
```typescript
<ProtectedRoute allowedRoles={["admin"]}>
  <AdminLayout />
</ProtectedRoute>

// Features:
// - Checks authentication status
// - Validates user role against allowedRoles
// - Shows loading spinner while checking
// - Redirects unauthenticated users to /login
// - Redirects unauthorized users based on role
```

### Code Splitting
- Uses React.lazy() + Suspense for route components
- Fallback: `<div>Loading...</div>`
- Reduces initial bundle size

---

## Layout System

### Admin Layout (`/layouts/admin/AdminLayout.tsx`)
```
┌─────────────────────────────────────┐
│ AdminHeader                         │
├──────────┬──────────────────────────┤
│          │                          │
│ Admin    │  Page Content (Outlet)   │
│ Sidebar  │  - AttractionsPage       │
│          │  - AccommodationsPage    │
│          │  - ExperiencesPage       │
│          │                          │
└──────────┴──────────────────────────┘
```

**Features**:
- 2-column grid layout
- Responsive: 220px sidebar on mobile, 240px on larger screens
- ScrollArea for main content
- Sonner Toaster for notifications

### Provider Layout (`/layouts/provider/ProviderLayout.tsx`)
- Similar structure to admin
- Different sidebar navigation (market, events, bookings, etc.)

---

## Common Patterns & Conventions

### 1. **Component Organization**
```typescript
// Dialog components follow this pattern:
interface ComponentProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const AddItemDialog = ({ children, onSuccess }: ComponentProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm();
  const mutation = useMutation();

  const handleSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess?.();
        setOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <Form>
          {/* Form fields */}
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
```

### 2. **File Upload Handling**
```typescript
// FormData pattern for multipart uploads:
const formData = new FormData();
formData.append("name", data.name);
formData.append("thumbnail", file);

// Array handling:
files.forEach((file, index) => {
  formData.append(`images[${index}]`, file);
});

// Service call with appropriate headers:
api.post("/endpoint", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
```

### 3. **Notification System**
```typescript
// Custom wrapper: /components/custom/ToastNotification
toastNotification.success("Title", "Message");
toastNotification.error("Title", "Error message");

// Also supports react-hot-toast and Sonner
```

### 4. **Error Handling**
```typescript
// Service errors are typed:
export interface ApiErrorResponse extends Error {
  response?: {
    status: number;
    statusText: string;
    data?: { message?: string };
  };
  code?: string;
}

// In hooks:
onError: (error: ApiErrorResponse) => {
  const message = error.response?.data?.message || error.message;
  console.error("Operation failed:", message);
};
```

### 5. **Data Transformation**
```typescript
// Helper: /lib/utils.ts
export const categoryToSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

// Usage in routes:
const selectedCategory = categories.find(
  cat => categoryToSlug(cat.name) === categorySlug
);
```

### 6. **Conditional Rendering in Hooks**
```typescript
// Hooks return multiple values for flexibility:
const {
  data: attractions,
  isLoading,
  error,
  refetch,
  createMutation,
  isCreating,
} = useAttractions();

// Components handle different states:
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage />;
return <Table data={attractions} />;
```

---

## Image Handling

**Patterns** (`/lib/imageUtils.ts`):
- Thumbnail: Main/featured image for list views
- Gallery: Multiple images for detail views
- FormData for upload (multipart)
- File preview before upload

**API Handling**:
- Server returns image URLs as strings
- Client stores file objects during form state
- Fallback images for missing thumbnails

---

## Development Workflow

### Adding a New Feature Module

1. **Create folder structure** under `/features/{area}/{feature}`
2. **Define types** in `types/featureTypes.ts`
3. **Create schemas** in `schemas/featureSchemas.ts` (Zod)
4. **Write service** in `services/featureService.ts` (API calls)
5. **Write hooks** in `hooks/useFeature.ts` (TanStack Query)
6. **Create components** in `components/` (UI components)
7. **Create pages** in `pages/` (route-level components)
8. **Export everything** in `index.ts` (barrel export)
9. **Add routes** in `/routes/routes.tsx`

### Example Service Implementation
```typescript
// services/exampleService.ts
import { api } from "@/lib/api";
import type { Example } from "../types/exampleTypes";

export const exampleService = {
  getAll: () => api.get<Example[]>("/endpoint"),
  getById: (id: string) => api.get<Example>(`/endpoint/${id}`),
  create: (data: CreateExampleData) => 
    api.post<Example>("/endpoint", data),
  update: (id: string, data: UpdateExampleData) =>
    api.put<Example>(`/endpoint/${id}`, data),
  delete: (id: string) => api.delete(`/endpoint/${id}`),
};
```

---

## Environment Variables

```bash
# .env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Usage in code**:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `/main.tsx` | App entry point, QueryClient setup, AuthProvider wrap |
| `/App.tsx` | Router setup |
| `/routes/routes.tsx` | Route definitions and protection |
| `/contexts/AuthContext.tsx` | Auth state provider |
| `/lib/api.ts` | Axios instance and request helpers |
| `/lib/queryKeys.ts` | Query key factory for caching |
| `/components/custom/ProtectedRoute.tsx` | Route protection component |
| `/components/ui/*` | Radix UI wrapper components |

---

## Common Issues & Solutions

### 1. **Form Data Not Submitting**
- Ensure `Content-Type: multipart/form-data` header
- FormData fields must match backend expectations
- Files appended as `FormData.append(key, File)`

### 2. **Query Cache Not Updating**
- Check query keys match between fetch and invalidation
- Use `queryClient.invalidateQueries({ queryKey: [...keys...] })`
- Verify `staleTime` not preventing refetch

### 3. **Authentication Issues**
- Check token in localStorage: `localStorage.getItem("token")`
- Verify Axios interceptor adding Authorization header
- Confirm 401 handling redirects to login

### 4. **Image Upload Failures**
- Verify file input accepts correct mime types
- Check FormData append keys match backend
- Ensure thumbnail + images[] structure correct

---

## Testing Considerations

- Unit tests: Schemas (Zod), utilities
- Integration tests: Services, hooks
- E2E tests: Routes, auth flows, CRUD operations
- Mock API: Use TanStack Query mock adapters

---

## Performance Optimizations

1. **Code Splitting**: Lazy-loaded routes reduce bundle
2. **Caching**: 5-minute stale time, smart invalidation
3. **Selective Refetch**: `refetchOnWindowFocus: false`
4. **Image Optimization**: Thumbnails + lazy loading consideration
5. **Form Validation**: Client-side with Zod prevents bad requests

---

## Future Considerations

- Dashboard implementation (currently temp AttractionsPage)
- Real-time updates for bookings (WebSocket)
- Offline support for provider apps
- Advanced filtering and search
- Report generation for providers
- Multi-language support
- Dark mode (theme system ready with next-themes)

