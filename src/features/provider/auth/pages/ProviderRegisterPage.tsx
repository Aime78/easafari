import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { registerSchema } from "../schemas/providerAuthSchemas";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useProviderRegister } from "../hooks/useProviderAuth";
import logo from "@/assets/logo.png";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";

const ProviderRegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useProviderRegister();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      position: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    registerMutation.mutate(values);
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
              Create your provider account
            </CardTitle>
            <CardDescription>
              Enter your details to get started as a provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {registerMutation.error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {registerMutation.error.response?.data?.message ||
                  registerMutation.error.message ||
                  "Registration failed. Please try again."}
              </div>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Edwin Musiime"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="edwin@gmail.com"
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
                            placeholder="password"
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

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="256780203994"
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
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Position
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Position (eg. CEO, Manager, Secretary)"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  {registerMutation.isPending ? (
                    <Button disabled className="w-full h-11 text-lg">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full h-11 text-white font-bold cursor-pointer text-base"
                    >
                      Create Provider Account
                    </Button>
                  )}

                  <div className="text-center text-sm text-muted-foreground">
                    Already have a provider account?{" "}
                    <a
                      href="/login"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Sign in
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

export default ProviderRegisterPage;
