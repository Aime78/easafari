import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLayout from "@/layout/AppLayout";

const LoginPage = lazy(() =>
  import("@/features/auth").then((module) => ({ default: module.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("@/features/auth").then((module) => ({ default: module.RegisterPage }))
);
const AttractionsPage = lazy(() =>
  import("@/features/attraction").then((module) => ({
    default: module.AttractionsPage,
  }))
);
const AccommodationsPage = lazy(() =>
  import("@/features/accommodation").then((module) => ({
    default: module.AccommodationsPage,
  }))
);
const ExperiencesPage = lazy(() =>
  import("@/features/experience").then((module) => ({
    default: module.ExperiencesPage,
  }))
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout />
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/attractions" replace />,
      },
      {
        path: "attractions",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AttractionsPage />
          </Suspense>
        ),
      },
      {
        path: "attractions/:categorySlug",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AttractionsPage />
          </Suspense>
        ),
      },
      {
        path: "accommodations",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AccommodationsPage />
          </Suspense>
        ),
      },
      {
        path: "accommodations/:categorySlug",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AccommodationsPage />
          </Suspense>
        ),
      },
      {
        path: "experiences",
        element: <ExperiencesPage />,
      },
      {
        path: "experiences/:categorySlug",
        element: <ExperiencesPage />,
      },
    ],
  },
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
    element: <RegisterPage />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
