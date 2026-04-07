import { CalendarDays, ChevronRight, FileSpreadsheet, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export const FlowDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 mb-16">
      <svg
        className="hidden md:block absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
            dur="1s"
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
            dur="1s"
            repeatCount="indefinite"
          />
        </line>
      </svg>

      <div
        className={`relative flex flex-col items-center text-center transition-all duration-500 ${activeStep === 0 ? "scale-110" : "scale-100 opacity-70"}`}
      >
        <div
          className={`mb-4 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-500 ${activeStep === 0 ? "bg-cyan-500 text-zinc-950 shadow-lg shadow-cyan-500/50" : "bg-zinc-800 text-cyan-400"}`}
        >
          <FileSpreadsheet className="h-10 w-10" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Excel File</h3>
        <p className="text-sm text-zinc-400 max-w-[150px]">Upload your data</p>
      </div>

      <ChevronRight className="hidden md:block h-8 w-8 text-cyan-400 animate-pulse" />

      <div
        className={`relative flex flex-col items-center text-center transition-all duration-500 ${activeStep === 1 ? "scale-110" : "scale-100 opacity-70"}`}
      >
        <div
          className={`mb-4 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-500 ${activeStep === 1 ? "bg-cyan-500 text-zinc-950 shadow-lg shadow-cyan-500/50" : "bg-zinc-800 text-cyan-400"}`}
        >
          <Zap className="h-10 w-10" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Processing</h3>
        <p className="text-sm text-zinc-400 max-w-[150px]">
          AI analyzes conflicts
        </p>
      </div>

      <ChevronRight className="hidden md:block h-8 w-8 text-cyan-400 animate-pulse" />

      <div
        className={`relative flex flex-col items-center text-center transition-all duration-500 ${activeStep === 2 ? "scale-110" : "scale-100 opacity-70"}`}
      >
        <div
          className={`mb-4 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-500 ${activeStep === 2 ? "bg-cyan-500 text-zinc-950 shadow-lg shadow-cyan-500/50" : "bg-zinc-800 text-cyan-400"}`}
        >
          <CalendarDays className="h-10 w-10" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Date Sheet</h3>
        <p className="text-sm text-zinc-400 max-w-[150px]">Download & share</p>
      </div>
    </div>
  );
};
