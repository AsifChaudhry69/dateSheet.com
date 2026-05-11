"use client";

import { CheckCircle2, Users, FileSpreadsheet, RefreshCw, CalendarDays, Upload } from "lucide-react";
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

export default function Features() {
  return (
    <section className="px-4 py-20 lg:px-12 border-t border-zinc-800/50">
      <AnimatedSection className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-400 mb-3">
            Features
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything You Need
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: CheckCircle2,
              title: "Conflict Detection",
              desc: "Automatically detects and resolves scheduling conflicts",
            },
            {
              icon: Users,
              title: "Multi-Batch Support",
              desc: "Handle multiple batches and departments simultaneously",
            },
            {
              icon: FileSpreadsheet,
              title: "Export Options",
              desc: "Download as PDF, Excel, or share via link",
            },
            {
              icon: RefreshCw,
              title: "Quick Revisions",
              desc: "Make changes and regenerate schedule instantly",
            },
            {
              icon: CalendarDays,
              title: "Custom Date Ranges",
              desc: "Set exam period, exclude holidays and weekends",
            },
            {
              icon: Upload,
              title: "Drag & Drop Upload",
              desc: "Simply drag your Excel file to get started",
            },
          ].map((feature, i) => (
            <AnimatedSection
              key={i}
              delay={i * 100}
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 transition-all hover:border-cyan-500/30 hover:bg-zinc-900/60 hover:-translate-y-1 group"
            >
              <feature.icon className="h-6 w-6 text-cyan-400 mb-4 transition-transform group-hover:scale-110" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400">{feature.desc}</p>
            </AnimatedSection>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}