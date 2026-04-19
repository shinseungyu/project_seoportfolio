import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function NaverSuccessPage() {
  return (
    <main className="relative min-h-screen bg-[#080c14]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-20 left-1/3 h-[500px] w-[500px] rounded-full bg-green-600/6 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#080c14]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors">
              <ArrowLeft size={14} /> 포트폴리오
            </Link>
            <span className="text-white/10">/</span>
            <span className="text-gray-600">네이버 SEO</span>
            <span className="text-white/10">/</span>
            <span className="text-emerald-400">성공</span>
          </div>
        </div>
      </header>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-40 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03]">
          <Lock size={24} className="text-gray-600" />
        </div>
        <div className="mt-4 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-400">
          🟢 네이버 SEO · 성공
        </div>
        <h1 className="mt-4 text-3xl font-bold text-white">준비 중</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
          네이버 성공 케이스 콘텐츠를 정리 중입니다.<br />곧 업데이트됩니다.
        </p>
        <Link href="/" className="mt-8 flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={14} /> 포트폴리오로 돌아가기
        </Link>
      </div>
    </main>
  );
}
