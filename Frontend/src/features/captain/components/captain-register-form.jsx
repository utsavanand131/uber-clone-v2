import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";

import { Mail, Lock, Eye, EyeOff, User, Car } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const captainSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),

  email: z.string().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain uppercase, lowercase and a number",
    }),

  vehicleColor: z.string().min(2, "Vehicle color is required"),

  vehiclePlate: z.string().min(3, "Vehicle plate number is required"),

  vehicleCapacity: z.string().min(1, "Vehicle capacity is required"),

  vehicleType: z.enum(["car", "auto", "motorcycle"]),
});

export default function CaptainRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(captainSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      vehicleColor: "",
      vehiclePlate: "",
      vehicleCapacity: "",
      vehicleType: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formattedCaptain = {
        fullname: {
          firstname: data.firstName,
          lastname: data.lastName,
        },
        email: data.email,
        password: data.password,
        vehicles: {
          color: data.vehicleColor,
          plate: data.vehiclePlate,
          capacity: Number(data.vehicleCapacity),
          vehicleType: data.vehicleType,
        },
      };

      console.log("Sending:", formattedCaptain);

      const res = await axios.post(
        "https://uber-clone-backend-5exd.onrender.com/api/v1/captain/register",
        formattedCaptain,
      );

      console.log("SUCCESS:", res.data);

      localStorage.setItem("token", res.data.token);

      toast.success("Captain registered successfully");

      navigate("/");
    } catch (err) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      console.log("ERROR:", err);

      toast.error(
        err.response?.data?.message ||
          err.response?.error?.[0]?.msg ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl border-2 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          <CardTitle>Captain Registration</CardTitle>
        </div>

        <CardDescription>
          Create your captain account to start accepting rides.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>

                <div className="relative mt-2">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    placeholder="John"
                    className="pl-10"
                    {...register("firstName")}
                  />
                </div>

                <p className="text-sm text-red-500">
                  {errors.firstName?.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Last Name</label>

                <div className="relative mt-2">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    placeholder="Doe"
                    className="pl-10"
                    {...register("lastName")}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>

              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  {...register("email")}
                />
              </div>

              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>

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

              <p className="text-sm text-red-500">{errors.password?.message}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Information</h3>
            {/* Vehicle Type */}

            <div>
              <label className="text-sm font-medium">Vehicle Type</label>

              <div className="grid grid-cols-3 gap-3 mt-2">
                <label className="flex items-center gap-2 border rounded-md p-3 cursor-pointer">
                  <input
                    type="radio"
                    value="car"
                    {...register("vehicleType")}
                  />
                  Car
                </label>

                <label className="flex items-center gap-2 border rounded-md p-3 cursor-pointer">
                  <input
                    type="radio"
                    value="auto"
                    {...register("vehicleType")}
                  />
                  Auto
                </label>

                <label className="flex items-center gap-2 border rounded-md p-3 cursor-pointer">
                  <input
                    type="radio"
                    value="motorcycle"
                    {...register("vehicleType")}
                  />
                  Motorcycle
                </label>
              </div>

              <p className="text-sm text-red-500">
                {errors.vehicleType?.message}
              </p>
            </div>

            {/* Vehicle Color */}

            <div>
              <label className="text-sm font-medium">Vehicle Color</label>

              <Input
                placeholder="White"
                className="mt-2"
                {...register("vehicleColor")}
              />

              <p className="text-sm text-red-500">
                {errors.vehicleColor?.message}
              </p>
            </div>

            {/* License Plate */}

            <div>
              <label className="text-sm font-medium">License Plate</label>

              <Input
                placeholder="DL 01 AB 1234"
                className="mt-2"
                {...register("vehiclePlate")}
              />

              <p className="text-sm text-red-500">
                {errors.vehiclePlate?.message}
              </p>
            </div>

            {/* Capacity */}

            <div>
              <label className="text-sm font-medium">Vehicle Capacity</label>

              <select
                className="w-full border rounded-md h-10 px-3 mt-2 bg-background"
                {...register("vehicleCapacity")}
              >
                <option value="">Select Capacity</option>
                <option value="2">2 Persons</option>
                <option value="4">4 Persons</option>
                <option value="5">5 Persons</option>
                <option value="7">7 Persons</option>
              </select>

              <p className="text-sm text-red-500">
                {errors.vehicleCapacity?.message}
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
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
              Already have an account?
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <NavLink to="/captain-login">Login</NavLink>
        </Button>
      </CardFooter>
    </Card>
  );
}
