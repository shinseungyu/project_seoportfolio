"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between px-6 rounded-2xl transition-all duration-300 ${
          scrolled ? "glass mx-4 py-2.5 shadow-2xl" : "bg-transparent py-2"
        }`}
        aria-label="Global"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Search size={16} className="text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white">
                SEO<span className="text-indigo-400"> Portfolio</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Search Analytics</span>
            </div>
          </Link>

        </div>

        <div className="flex items-center gap-3">
          <div className="hidden h-4 w-px bg-white/10 md:block" />
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400/90 tracking-wider">LIVE DATA</span>
          </div>
          
        </div>
      </nav>

    </header>
  )
}
