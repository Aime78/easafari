import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { signInSchema } from "../schemas/authSchemas";
import { useLogin } from "../hooks/useAuth";

interface LoginFormProps {
  onLoginError?: (error: string) => void;
  className?: string;
}

export const LoginForm = ({ onLoginError, className }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

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
    loginMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        const from = location.state?.from?.pathname || "/attractions";
        navigate(from, { replace: true });
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : "An error occurred";
        onLoginError?.(errorMessage);
      },
    });
  }

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email</FormLabel>
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
                <FormLabel className="text-sm font-medium">Password</FormLabel>
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
    </div>
  );
};
