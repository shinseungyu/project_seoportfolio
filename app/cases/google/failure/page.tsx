import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, TrendingDown } from "lucide-react";
import { googleFailureCases } from "@/data/cases";

export default function GoogleFailureListPage() {
  return (
    <main className="relative min-h-screen bg-[#080c14]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/3 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-rose-600/4 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#080c14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center px-6 py-3.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-600">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <ArrowLeft size={12} /> 포트폴리오
            </Link>
            <span className="text-white/10">/</span>
            <span>구글 SEO</span>
            <span className="text-white/10">/</span>
            <span className="text-red-400 font-medium">실패</span>
          </nav>
        </div>
      </header>

      <div className="relative mx-auto max-w-4xl px-6 py-10">
        {/* 헤더 */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10">
                <TrendingDown size={15} className="text-red-400" />
              </div>
              <span className="rounded-full border border-red-500/20 bg-red-500/8 px-3 py-0.5 text-[11px] font-bold text-red-400">
                구글 SEO · 실패
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">구글 실패 케이스</h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Search Console API 실시간 연동 · {googleFailureCases.length}개 사이트
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
            </span>
            <span className="text-[11px] text-indigo-400">실시간 데이터</span>
          </div>
        </div>

        {/* 카드 */}
        <div className="grid gap-4 sm:grid-cols-2">
          {googleFailureCases.map((c) => (
            <Link
              key={c.slug}
              href={`/cases/google/failure/${c.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/25 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-red-950/30"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
              <div className="absolute left-0 top-0 h-full w-0.5 bg-red-500" />

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{c.site}</span>
                      <ExternalLink size={11} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </div>
                    {c.category && (
                      <span className="mt-1.5 inline-block rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-gray-500">
                        {c.category}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] text-indigo-400">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    </span>
                    Live
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-gray-400">{c.summary}</p>

                {c.period && c.period !== "준비 중" && (
                  <p className="mt-2 text-[11px] text-gray-600">📅 {c.period}</p>
                )}

                <div className="mt-4 flex gap-1.5">
                  <span className="rounded-full border border-indigo-500/20 bg-indigo-500/8 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">🔵 Google</span>
                  {c.naverData && <span className="rounded-full border border-emerald-500/20 bg-emerald-500/8 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">🟢 Naver</span>}
                  {c.geoScreenshots && c.geoScreenshots.length > 0 && <span className="rounded-full border border-violet-500/20 bg-violet-500/8 px-2 py-0.5 text-[10px] font-semibold text-violet-400">🤖 GEO</span>}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[11px] text-gray-700">Search Console 데이터 포함</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-red-400 group-hover:gap-2 transition-all">
                    케이스 보기 <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
