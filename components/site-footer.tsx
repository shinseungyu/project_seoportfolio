import Link from "next/link"
import { Search, Mail, Globe, Github } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-[#050505] py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>
      
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-[1fr,auto,auto]">
          <div className="flex flex-col items-start gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Search size={16} className="text-indigo-400" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white uppercase">
                SEO<span className="text-indigo-400"> Portfolio</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
              Technical SEO specialist and search data analyst. Leveraging real-time API data to drive organic growth and measurable results.
            </p>
            <div className="flex items-center gap-4">
              <Link href="mailto:tlsfkaus0711@gmail.com" className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] transition-colors hover:border-indigo-500/30">
                <Mail size={16} className="text-zinc-500 transition-colors group-hover:text-indigo-400" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Navigation</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/" className="text-xs font-semibold text-zinc-500 transition-colors hover:text-white">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Legal</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/privacy-policy" className="text-xs font-semibold text-zinc-500 transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-xs font-semibold text-zinc-500 transition-colors hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 md:flex-row">
          <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
            © 2026 newsioo.com • SEARCH ANALYTICS PORTFOLIO
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            SYSTEMS OPERATIONAL
          </div>
        </div>
      </div>
    </footer>
  )
}
