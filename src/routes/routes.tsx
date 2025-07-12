import AppLayout from "@/layout/AppLayout";
import LoginPage from "@/pages/login/LoginPage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,

  },
  {
    path: "login",
    element: <LoginPage />,
  },
  
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
