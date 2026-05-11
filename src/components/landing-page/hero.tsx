"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Animation hook for fade-in on scroll
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

// Animated section component
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-4 pt-20 pb-24 text-center lg:pt-32 lg:pb-32">
      <AnimatedSection className="max-w-4xl space-y-6">
        <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">
          Automated Exam Scheduling
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
          Generate Exam Date Sheets in Minutes
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400 leading-relaxed">
          Upload your Excel file with course data and let our intelligent system
          automatically generate conflict-free date sheets for both fresher and
          repeater students.
        </p>
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-medium gap-2 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all"
            >
              Login to Dashboard
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </section>
  );
}
