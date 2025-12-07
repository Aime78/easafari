import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { AdminLayout } from "@/layouts/admin";
import { ProviderLayout } from "@/layouts/provider";
import ProtectedRoute from "@/components/custom/ProtectedRoute";
import PageLoader from "@/components/custom/PageLoader";
import MarketPage from "@/features/market/pages/MarketPage";

const LoginPage = lazy(() =>
  import("@/features/auth").then((module) => ({ default: module.LoginPage }))
);
// const RegisterPage = lazy(() =>
//   import("@/features/auth").then((module) => ({ default: module.RegisterPage }))
// );

const AdminAttractionsPage = lazy(() =>
  import("@/features/admin/attraction").then((module) => ({
    default: module.AttractionsPage,
  }))
);
const AdminAccommodationsPage = lazy(() =>
  import("@/features/admin/accommodation").then((module) => ({
    default: module.AccommodationsPage,
  }))
);
const AdminExperiencesPage = lazy(() =>
  import("@/features/admin/experience").then((module) => ({
    default: module.ExperiencesPage,
  }))
);

// Provider Pages - For now, using the same components as admin
// These will be replaced with provider-specific components later
const ProviderRegisterPage = lazy(() =>
  import("@/features/provider/auth").then((module) => ({
    default: module.ProviderRegisterPage,
  }))
);

const ProviderLoginPage = lazy(() =>
  import("@/features/provider/auth").then((module) => ({
    default: module.ProviderLoginPage,
  }))
);

const ProviderDashboardPage = lazy(() =>
  import("@/features/provider/dashboard").then((module) => ({
    default: module.ProviderDashboardPage,
  }))
);
const ProviderAttractionsPage = lazy(() =>
  import("@/features/admin/attraction").then((module) => ({
    default: module.AttractionsPage,
  }))
);
const ProviderAccommodationsPage = lazy(() =>
  import("@/features/provider/accommodation").then((module) => ({
    default: module.ProviderAccommodationsPage,
  }))
);
const ProviderAccommodationDetailsPage = lazy(() =>
  import(
    "@/features/provider/accommodation/pages/ProviderAccommodationDetailsPage"
  ).then((module) => ({
    default: module.default,
  }))
);
const ProviderExperiencesPage = lazy(() =>
  import("@/features/provider/experience").then((module) => ({
    default: module.ProviderExperiencesPage,
  }))
);
const ProviderEventsPage = lazy(() =>
  import("@/features/provider/event").then((module) => ({
    default: module.ProviderEventsPage,
  }))
);
const ProviderEventDetailsPage = lazy(() =>
  import("@/features/provider/event").then((module) => ({
    default: module.ProviderEventDetailsPage,
  }))
);
const ProviderSettingsPage = lazy(() =>
  import("@/features/provider/profile").then((module) => ({
    default: module.ProviderSettingsPage,
  }))
);
const ProviderBookingsPage = lazy(() =>
  import("@/features/provider/booking").then((module) => ({
    default: module.BookingsPage,
  }))
);

const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProviderRegisterPage />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProviderLoginPage />
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
          <Suspense fallback={<PageLoader />}>
            <AdminAttractionsPage />
          </Suspense>
        ),
      },
      {
        path: "attractions/:categorySlug",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminAttractionsPage />
          </Suspense>
        ),
      },
      {
        path: "accommodations",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminAccommodationsPage />
          </Suspense>
        ),
      },
      {
        path: "accommodations/:categorySlug",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminAccommodationsPage />
          </Suspense>
        ),
      },
      {
        path: "experiences",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminExperiencesPage />
          </Suspense>
        ),
      },
      {
        path: "experiences/:categorySlug",
        element: (
          <Suspense fallback={<PageLoader />}>
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
      <ProviderLayout />
      // <ProtectedRoute allowedRoles={["service_provider"]}>
      // </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/provider/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProviderDashboardPage />
          </Suspense>
        ),
      },
      {
        path: "market",
        element: (
          <Suspense fallback={<PageLoader />}>
            <MarketPage />
            {/*  <TestMarketApi />*/}
          </Suspense>
        ),
      },
      {
        path: "attractions",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProviderAttractionsPage />
          </Suspense>
        ),
      },
      {
        path: "attractions/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProviderAttractionsPage />
          </Suspense>
        ),
      },
      {
        path: "accommodations",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProviderAccommodationsPage />
          </Suspense>
        ),
      },
      {
        path: "accommodations/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProviderAccommodationDetailsPage />
          </Suspense>
        ),
      },
      {
        path: "experiences",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProviderExperiencesPage />
          </Suspense>
        ),
      },
      {
        path: "experiences/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProviderExperiencesPage />
          </Suspense>
        ),
      },
      {
        path: "events",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProviderEventsPage />
          </Suspense>
        ),
      },
      {
        path: "events/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProviderEventDetailsPage />
          </Suspense>
        ),
      },
      {
        path: "bookings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProviderBookingsPage />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProviderSettingsPage />
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
