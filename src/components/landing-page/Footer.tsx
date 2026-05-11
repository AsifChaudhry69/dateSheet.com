import { CalendarDays } from "lucide-react";

export default function Footer() {
  return (
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
  );
}
