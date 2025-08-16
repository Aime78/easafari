import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLayout from "@/layout/AppLayout";
import RegisterPage from "@/pages/register/RegisterPage";
// import ProtectedRoute from "@/components/custom/ProtectedRoute";
import AccommodationsPage from "@/pages/accommodations/AccommodationsPage";
import ExperiencesPage from "@/pages/experiences/ExperiencesPage";

const LoginPage = lazy(() => import("@/features/auth").then(module => ({ default: module.LoginPage })));
const AttractionsPage = lazy(() => import("@/features/attraction").then(module => ({ default: module.AttractionsPage })));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <AppLayout />
      // <ProtectedRoute>
      // </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/attractions" replace />,
      },
      {
        path: "attractions",
        element: <AttractionsPage />,
      },
      {
        path: "attractions/:categorySlug",
        element: <AttractionsPage />,
      },
      {
        path: "accommodations",
        element: <AccommodationsPage />,
      },
      {
        path: "accommodations/:categorySlug",
        element: <AccommodationsPage />,
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
