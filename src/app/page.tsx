"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Upload,
  Users,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  UserCheck,
  Star,
  Zap,
  Shield,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Header from "../components/landing-page/header";
import { AnimatedSection } from "../components/share/animated-section";
import Hero from "../components/landing-page/hero";
import { FlowDiagram } from "../components/landing-page/animated-flow-diagram";
import { DetailsSteps } from "../components/landing-page/details-steps";
import { Student } from "../components/landing-page/student-section";
import { Excel } from "../components/landing-page/excel-input-format-section";
import { Feature } from "next/dist/build/webpack/plugins/telemetry-plugin/telemetry-plugin";
import { Features } from "../components/landing-page/features-grid";
import { Testimonials } from "../components/landing-page/testimonials";

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for small institutions",
    features: [
      "Up to 500 students",
      "1 department",
      "Basic conflict detection",
      "PDF export",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For growing institutions",
    features: [
      "Up to 5,000 students",
      "Unlimited departments",
      "Advanced conflict detection",
      "PDF, Excel & Share link",
      "Repeater student handling",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "/month",
    description: "For large universities",
    features: [
      "Unlimited students",
      "Multi-campus support",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white overflow-x-hidden">
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
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <Header />

      <main className="relative z-10 flex-1">
        <Hero />
        <section className="px-4 py-20 lg:px-12">
          <AnimatedSection className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <p className="text-sm font-medium uppercase tracking-widest text-cyan-400 mb-3">
                How It Works
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Simple 3-Step Process
              </h2>
            </div>
            <FlowDiagram />
            <DetailsSteps />
          </AnimatedSection>
        </section>
        <Student />
        <Excel />
        <Features />

        
        <Testimonials/>

        {/* Pricing Section */}
        <section className="px-4 py-20 lg:px-12 border-t border-zinc-800/50">
          <AnimatedSection className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <p className="text-sm font-medium uppercase tracking-widest text-cyan-400 mb-3">
                Pricing
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl mb-4">
                Choose Your Plan
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Start free and scale as your institution grows. All plans
                include automatic updates and security patches.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {pricingPlans.map((plan, i) => (
                <AnimatedSection
                  key={i}
                  delay={i * 100}
                  className={`relative rounded-2xl border p-8 transition-all hover:-translate-y-2 ${plan.popular ? "border-cyan-500 bg-zinc-900/80 shadow-lg shadow-cyan-500/10" : "border-zinc-800 bg-zinc-900/50"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-cyan-500 px-4 py-1 text-sm font-medium text-zinc-950">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-zinc-400">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 mt-2">
                      {plan.description}
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-3 text-zinc-300"
                      >
                        <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up" className="block">
                    <Button
                      className={`w-full transition-all ${plan.popular ? "bg-cyan-500 text-zinc-950 hover:bg-cyan-400" : "bg-zinc-800 hover:bg-zinc-700 text-white"}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 lg:px-12">
          <AnimatedSection className="mx-auto max-w-4xl text-center">
            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-12 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <Shield className="h-12 w-12 text-cyan-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold sm:text-4xl mb-4">
                  Ready to Simplify Your Scheduling?
                </h2>
                <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                  Join universities and institutions already using dateSheet.com
                  to generate conflict-free exam schedules in minutes.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-medium gap-2 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                    >
                      Create Free Account
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-zinc-700 text-white hover:bg-zinc-800 transition-all"
                    >
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Stats Section */}
        <section className="px-4 py-16 lg:px-12 border-t border-zinc-800/50">
          <AnimatedSection className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: "500+", label: "Institutions" },
                { value: "2M+", label: "Students Scheduled" },
                { value: "99.9%", label: "Conflict-Free Rate" },
                { value: "24/7", label: "Support Available" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold text-cyan-400 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 px-6 py-8 lg:px-12">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-cyan-400" />
            <span className="font-semibold">
              dateSheet<span className="text-cyan-400">.com</span>
            </span>
          </div>
          <p className="text-sm text-zinc-500">
            {"© 2026 dateSheet.com. All rights reserved."}
          </p>
        </div>
      </footer>
    </div>
  );
}
