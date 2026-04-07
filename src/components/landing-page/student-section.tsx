import { CheckCircle2, GraduationCap, UserCheck } from "lucide-react";
import { AnimatedSection } from "../share/animated-section";

export const Student = () => {
  return (
    <section className="px-4 py-20 lg:px-12 border-t border-zinc-800/50">
      <AnimatedSection className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-400 mb-3">
            Smart Scheduling
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Handles All Student Types
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <AnimatedSection
            delay={100}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all hover:border-emerald-500/30"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fresher Students</h3>
                <p className="text-zinc-400">
                  First-time course takers with standard semester load
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Regular semester course scheduling",
                "Batch-wise exam slot allocation",
                "No time conflicts between core courses",
                "Adequate gap between consecutive exams",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-zinc-300 transition-all hover:translate-x-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection
            delay={200}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all hover:border-amber-500/30"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <UserCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Repeater Students
                </h3>
                <p className="text-zinc-400">
                  Students retaking courses from previous semesters
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Cross-semester conflict detection",
                "Mixed batch exam coordination",
                "Special slot allocation for repeat exams",
                "Priority scheduling to avoid clashes",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-zinc-300 transition-all hover:translate-x-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </AnimatedSection>
    </section>
  );
};
