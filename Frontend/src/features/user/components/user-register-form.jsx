import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "sonner";

import { UserRound, Mail, Lock, Eye, EyeOff, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UserDataContext } from "../context/UserContext";

/* ---------------- Schema ---------------- */
const riderFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Must contain uppercase, lowercase, and a number",
    }),
});

export default function UserRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(riderFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formattedUser = {
        fullname: {
          firstname: data.firstName,
          lastname: data.lastName,
        },
        email: data.email,
        password: data.password,
      };

      const res = await axios.post(
        "http://localhost:5001/api/v1/users/register",
        formattedUser,
      );

      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);

      toast.success("User registered successfully");

      reset();
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserRound className="h-5 w-5" />
          <CardTitle>Rider Registration</CardTitle>
        </div>
        <CardDescription>
          Create your account to start booking rides
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="John"
                  {...register("firstName")}
                />
              </div>
              <p className="text-red-500 text-xs">
                {errors.firstName?.message}
              </p>
            </div>

            <div>
              <label className="text-sm">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Doe"
                  {...register("lastName")}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="john@example.com"
                {...register("email")}
              />
            </div>
            <p className="text-red-500 text-xs">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

              <Input
                className="pl-10 pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="text-red-500 text-xs">{errors.password?.message}</p>
          </div>

          {/* Submit */}
          <Button className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <NavLink to="/user-login">Already have an account? Login</NavLink>
        </Button>
      </CardFooter>
    </Card>
  );
}
