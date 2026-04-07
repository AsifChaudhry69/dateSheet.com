"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
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
  );
};

export default Header;