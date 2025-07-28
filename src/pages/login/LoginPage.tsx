import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { signInSchema } from "@/lib/schemaValidation";
import { useLogin, useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const loginMutation = useLogin();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/attractions';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoginError("");
    
    loginMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        setLoginError("");

        const from = location.state?.from?.pathname || '/attractions';
        navigate(from, { replace: true });
      },
      onError: (error: any) => {
        console.error('Login error:', error);

        if (error?.response?.status === 401 || error?.response?.status === 400) {
          setLoginError("Invalid email or password. Please check your credentials and try again.");
        } else if (error?.response?.status === 422) {
          setLoginError("Please check your email format and password requirements.");
        } else if (error?.message?.includes('Network Error') || error?.code === 'ERR_NETWORK') {
          setLoginError("Unable to connect to the server. Please check your internet connection.");
        } else {
          setLoginError("An unexpected error occurred. Please try again later.");
        }
      }
    });
  }

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
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
                  {loginError && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {loginError}
                    </div>
                  )}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              className="h-11"
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={toggleShowPassword}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    {loginMutation.isPending ? (
                      <Button disabled className="w-full h-11 text-lg">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full h-11 text-white font-bold cursor-pointer text-base"
                      >
                        Sign In
                      </Button>
                    )}

                    <div className="text-center text-sm text-muted-foreground">
                      <a
                        href="/forgot-password"
                        className="hover:text-primary underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <a
                        href="/register"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Sign up
                      </a>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
      </div>
    </>
  );
};

export default LoginPage;
