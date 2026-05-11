"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays, Eye, EyeOff } from "lucide-react"
import { useSignIn } from "../../services/use-sign-in"  // 👈

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: signIn, isPending } = useSignIn()  // 👈

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 👇 no longer async — mutation handles everything
  const onSubmit = (data: SignInFormData) => {
    signIn({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950 px-4 py-6">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2">
          <CalendarDays className="h-7 w-7 text-cyan-400" />
          <span className="text-xl font-bold tracking-tight text-white">
            dateSheet.com
          </span>
        </Link>
      </div>

      {/* Centered Form */}
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-zinc-400">Sign in to your account</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-zinc-400">
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
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-zinc-400">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`h-12 rounded-lg border-zinc-700 bg-zinc-800/50 pr-12 text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* 👇 isPending replaces isSubmitting */}
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-lg bg-cyan-500 font-medium text-white transition-all hover:bg-cyan-600"
              >
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>

          <p className="text-center text-zinc-400">
            {"Don't have an account? "}
            <Link href="/sign-up" className="font-medium text-cyan-400 transition-colors hover:text-cyan-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}