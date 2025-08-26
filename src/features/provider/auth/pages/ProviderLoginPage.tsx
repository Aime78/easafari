import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { ProviderLoginForm } from "../components/ProviderLoginForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ProviderLoginPage = () => {
  const [loginError, setLoginError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate, location]);

  const handleLoginError = (error: string) => {
    setLoginError(error);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 flex h-14 items-center px-6 lg:h-[60px] z-50">
        <div className="flex items-center gap-3 font-bold">
          <img
            src={logo}
            alt="Company Logo"
            className="w-22 h-22 object-contain"
          />
        </div>
      </div>

      <div className="relative w-full min-h-screen flex justify-center items-center pt-14">
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-gradient-to-br from-orange-400 via-green-400 to-blue-400"
              style={{
                clipPath: "polygon(100% 0, 100% 100%, 0 100%, 100% 25%)",
              }}
            />
            <div
              className="absolute inset-0 bg-white"
              style={{
                clipPath: "polygon(0 0, 100% 25%, 100% 0, 0 0)",
              }}
            />
          </div>
        </div>

        <Card className="w-[500px] shadow-lg backdrop-blur-md bg-white/95">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">
              Sign in to your account
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loginError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {loginError}
              </div>
            )}
            <ProviderLoginForm onLoginError={handleLoginError} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProviderLoginPage;
