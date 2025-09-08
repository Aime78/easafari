import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { AdminLayout } from "@/layouts/admin";
import { ProviderLayout } from "@/layouts/provider";
import ProtectedRoute from "@/components/custom/ProtectedRoute";
import MarketPage from "@/features/market/categories/pages/MarketPage";

const LoginPage = lazy(() =>
  import("@/features/auth").then((module) => ({ default: module.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("@/features/auth").then((module) => ({ default: module.RegisterPage }))
);

const AdminAttractionsPage = lazy(() =>
  import("@/features/attraction").then((module) => ({
    default: module.AttractionsPage,
  }))
);
const AdminAccommodationsPage = lazy(() =>
  import("@/features/accommodation").then((module) => ({
    default: module.AccommodationsPage,
  }))
);
const AdminExperiencesPage = lazy(() =>
  import("@/features/experience").then((module) => ({
    default: module.ExperiencesPage,
  }))
);

// Provider Pages - For now, using the same components as admin
// These will be replaced with provider-specific components later
const ProviderDashboardPage = lazy(() =>
  import("@/features/attraction").then((module) => ({
    default: module.AttractionsPage, // Temporary - replace with actual dashboard
  }))
);
const ProviderAttractionsPage = lazy(() =>
  import("@/features/attraction").then((module) => ({
    default: module.AttractionsPage,
  }))
);
const ProviderAccommodationsPage = lazy(() =>
  import("@/features/accommodation").then((module) => ({
    default: module.AccommodationsPage,
  }))
);
const ProviderExperiencesPage = lazy(() =>
  import("@/features/experience").then((module) => ({
    default: module.ExperiencesPage,
  }))
);

const router = createBrowserRouter([
  {
    path: "login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "register",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterPage />
      </Suspense>
    ),
  },

  // Admin Portal Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/attractions" replace />,
      },
      {
        path: "attractions",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminAttractionsPage />
          </Suspense>
        ),
      },
      {
        path: "attractions/:categorySlug",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminAttractionsPage />
          </Suspense>
        ),
      },
      {
        path: "accommodations",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminAccommodationsPage />
          </Suspense>
        ),
      },
      {
        path: "accommodations/:categorySlug",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminAccommodationsPage />
          </Suspense>
        ),
      },
      {
        path: "experiences",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminExperiencesPage />
          </Suspense>
        ),
      },
      {
        path: "experiences/:categorySlug",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminExperiencesPage />
          </Suspense>
        ),
      },
    ],
  },

  // Provider Portal Routes
  {
    path: "/provider",
    element: (
      <ProtectedRoute allowedRoles={["provider"]}>
        <ProviderLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/provider/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProviderDashboardPage />
          </Suspense>
        ),
      },
      {
        path: "market",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MarketPage />
            {/*  <TestMarketApi />*/}
          </Suspense>
        ),
      },
      {
        path: "attractions",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProviderAttractionsPage />
          </Suspense>
        ),
      },
      {
        path: "attractions/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProviderAttractionsPage />
          </Suspense>
        ),
      },
      {
        path: "accommodations",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProviderAccommodationsPage />
          </Suspense>
        ),
      },
      {
        path: "accommodations/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProviderAccommodationsPage />
          </Suspense>
        ),
      },
      {
        path: "experiences",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProviderExperiencesPage />
          </Suspense>
        ),
      },
      {
        path: "experiences/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProviderExperiencesPage />
          </Suspense>
        ),
      },
    ],
  },

  // Root redirect based on user role (for now redirect to admin)
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },

  // Catch all - 404
  {
    path: "*",
    element: <div>404 - Page not found</div>,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
