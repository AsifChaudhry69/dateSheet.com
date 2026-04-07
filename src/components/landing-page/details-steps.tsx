import { FileSpreadsheet, RefreshCw, Upload } from "lucide-react";
import { AnimatedSection } from "../share/animated-section";

export const DetailsSteps = () => {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <AnimatedSection
        delay={100}
        className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-zinc-900/80 hover:-translate-y-2"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-all group-hover:bg-cyan-500 group-hover:text-zinc-950">
          <Upload className="h-7 w-7" />
        </div>
        <div className="absolute top-8 right-8 text-5xl font-bold text-zinc-800 group-hover:text-zinc-700 transition-colors">
          01
        </div>
        <h3 className="mb-3 text-xl font-semibold">Upload Excel File</h3>
        <p className="text-zinc-400 leading-relaxed">
          Prepare your Excel file with course codes, student enrollment data,
          including information about fresher and repeater students.
        </p>
      </AnimatedSection>

      <AnimatedSection
        delay={200}
        className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-zinc-900/80 hover:-translate-y-2"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-all group-hover:bg-cyan-500 group-hover:text-zinc-950">
          <RefreshCw className="h-7 w-7" />
        </div>
        <div className="absolute top-8 right-8 text-5xl font-bold text-zinc-800 group-hover:text-zinc-700 transition-colors">
          02
        </div>
        <h3 className="mb-3 text-xl font-semibold">Auto Processing</h3>
        <p className="text-zinc-400 leading-relaxed">
          Our algorithm analyzes course conflicts, student overlaps, and
          generates an optimized schedule that works for everyone.
        </p>
      </AnimatedSection>

      <AnimatedSection
        delay={300}
        className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-zinc-900/80 hover:-translate-y-2"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-all group-hover:bg-cyan-500 group-hover:text-zinc-950">
          <FileSpreadsheet className="h-7 w-7" />
        </div>
        <div className="absolute top-8 right-8 text-5xl font-bold text-zinc-800 group-hover:text-zinc-700 transition-colors">
          03
        </div>
        <h3 className="mb-3 text-xl font-semibold">Download Date Sheet</h3>
        <p className="text-zinc-400 leading-relaxed">
          Get your finalized date sheet in multiple formats. Share with
          students, faculty, and administration instantly.
        </p>
      </AnimatedSection>
    </div>
  );
};
