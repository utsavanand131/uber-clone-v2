import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Mail, Lock, Eye, EyeOff, Car } from "lucide-react";

import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),

  rememberMe: z.boolean().optional(),
});

export default function CaptainLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data) => {
    setLoading(true);

    console.log(data);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md border-2 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          <CardTitle>Captain Login</CardTitle>
        </div>

        <CardDescription>Sign in to your captain account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                type="email"
                placeholder="captain@example.com"
                className="pl-10"
                {...register("email")}
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>

            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-black"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
            />

            <label className="text-sm cursor-pointer">Remember me</label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Don't have a captain account?
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <NavLink
            to="/captain-register"
            className="flex items-center justify-center"
          >
            Create Captain Account
          </NavLink>
        </Button>
      </CardFooter>
    </Card>
  );
}
