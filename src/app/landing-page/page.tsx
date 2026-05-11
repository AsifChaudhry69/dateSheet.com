"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import Hero from "../../components/landing-page/Hero";
import HowItWorks from "../../components/landing-page/HowItWorks";
import Features from "../../components/landing-page/Features";
import Testimonials from "../../components/landing-page/Testimonials";
import Footer from "../../components/landing-page/Footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
        <div
          className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12 animate-fade-in">
        <Link href="/" className="flex items-center gap-2 group">
          <CalendarDays className="h-7 w-7 text-cyan-400 transition-transform group-hover:rotate-12" />
          <span className="text-xl font-bold tracking-tight">
            dateSheet<span className="text-cyan-400">.com</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            >
              Login
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-medium transition-all hover:scale-105">
              Register
            </Button>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}
