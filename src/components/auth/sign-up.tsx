"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CalendarDays, Eye, EyeOff } from "lucide-react";

import { useRegister } from "../../services/use-sign-up";
import { useRouter } from "next/navigation";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const { mutate: registerUser, isPending } = useRegister();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    registerUser(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },

      {
        onSuccess: (response) => {
          toast.success(response.message);
        

          console.log("User Registered:", response);

        
          if (response.data?.token) {
            localStorage.setItem(
              "token",
              response.data.token,
            );
          }
          router.push("/dashboard");

          reset();
        },

        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950 px-4 py-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      {/* Logo */}
      <div className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2"
        >
          <CalendarDays className="h-7 w-7 text-cyan-400" />

          <span className="text-xl font-bold tracking-tight text-white">
            dateSheet.com
          </span>
        </Link>
      </div>

      {/* Form */}
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Create account
            </h1>

            <p className="text-zinc-400">
              Get started with dateSheet.com
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-zinc-400"
                >
                  Full Name
                </Label>

                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={`h-12 rounded-lg border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />

                {errors.name && (
                  <p className="text-sm text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-zinc-400"
                >
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`h-12 rounded-lg border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />

                {errors.email && (
                  <p className="text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-400"
                >
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    placeholder="Create a password"
                    {...register("password")}
                    className={`h-12 rounded-lg border-zinc-700 bg-zinc-800/50 pr-12 text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                      errors.password
                        ? "border-red-500"
                        : ""
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-zinc-400"
                >
                  Confirm Password
                </Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                    className={`h-12 rounded-lg border-zinc-700 bg-zinc-800/50 pr-12 text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : ""
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">
                    {
                      errors.confirmPassword
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-lg bg-cyan-500 font-medium text-white hover:bg-cyan-600"
              >
                {isPending
                  ? "Creating account..."
                  : "Sign Up"}
              </Button>
            </form>
          </div>

          <p className="text-center text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}