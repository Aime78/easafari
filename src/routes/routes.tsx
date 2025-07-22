import AppLayout from "@/layout/AppLayout";
import AttractionsPage from "@/pages/attractions/AttractionsPage";
import LoginPage from "@/pages/login/LoginPage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "attractions",
        element: <AttractionsPage />
      },
      {
        path: "attractions/national-parks",
        element: <AttractionsPage />
      },
      {
        path: "attractions/cultural-heritage",
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
