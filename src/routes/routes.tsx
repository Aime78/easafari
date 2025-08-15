import AppLayout from "@/layout/AppLayout";
import AttractionsPage from "@/pages/attractions/AttractionsPage";
import LoginPage from "@/pages/login/LoginPage";
import RegisterPage from "@/pages/register/RegisterPage";
import ProtectedRoute from "@/components/custom/ProtectedRoute";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AccommodationsPage from "@/pages/accommodations/AccommodationsPage";
import ExperiencesPage from "@/pages/experiences/ExperiencesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
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
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
