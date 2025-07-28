import AppLayout from "@/layout/AppLayout";
import AttractionsPage from "@/pages/attractions/AttractionsPage";
import LoginPage from "@/pages/login/LoginPage";
import ProtectedRoute from "@/components/custom/ProtectedRoute";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

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
        element: <Navigate to="/attractions" replace />
      },
      {
        path: "attractions",
        element: <AttractionsPage />
      },
      {
        path: "attractions/:categorySlug",
        element: <AttractionsPage />
      }
    ]
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
