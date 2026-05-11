"use client";

import { Upload, RefreshCw, FileSpreadsheet } from "lucide-react";
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

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-animate flow steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
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

        {/* Animated Flow Diagram */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 mb-16">
          {/* Connecting Lines (Vector) */}
          <svg
            className="hidden md:block absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 pointer-events-none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <line
              x1="20%"
              y1="50%"
              x2="40%"
              y2="50%"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="8,4"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="24"
                to="0"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="60%"
              y1="50%"
              x2="80%"
              y2="50%"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="8,4"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="24"
                to="0"
                dur="2s"
                repeatCount="indefinite"
                begin="0.5s"
              />
            </line>
          </svg>

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4 z-10">
            <div
              className={`w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center transition-all duration-500 ${activeStep >= 0 ? "bg-cyan-500/40 border-cyan-300 shadow-lg shadow-cyan-500/25" : ""}`}
            >
              <Upload className="h-7 w-7 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Data</h3>
              <p className="text-sm text-zinc-400 max-w-xs">
                Import your Excel file with course details, student enrollments,
                and exam requirements.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 z-10">
            <div
              className={`w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center transition-all duration-500 ${activeStep >= 1 ? "bg-cyan-500/40 border-cyan-300 shadow-lg shadow-cyan-500/25" : ""}`}
            >
              <RefreshCw
                className={`h-7 w-7 text-cyan-400 transition-transform ${activeStep >= 1 ? "animate-spin" : ""}`}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Auto Generate</h3>
              <p className="text-sm text-zinc-400 max-w-xs">
                Our AI analyzes conflicts and creates optimal date sheets for
                fresher and repeater students.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 z-10">
            <div
              className={`w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center transition-all duration-500 ${activeStep >= 2 ? "bg-cyan-500/40 border-cyan-300 shadow-lg shadow-cyan-500/25" : ""}`}
            >
              <FileSpreadsheet className="h-7 w-7 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Download & Share</h3>
              <p className="text-sm text-zinc-400 max-w-xs">
                Get your conflict-free date sheet as PDF or Excel, and share it
                with students instantly.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
