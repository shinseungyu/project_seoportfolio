import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fundfinpro.com";

export const metadata: Metadata = {
  title: "해외직구 관부가세 완벽 가이드 | CIF·관세·부가세 계산법",
  description:
    "해외직구 관부가세란 무엇인지, CIF 과세가격 기준부터 관세·부가세 계산법까지 알기 쉽게 정리했습니다. 미국·일본·중국 직구 시 꼭 알아야 할 필수 세금 가이드.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/customs-guide" },
  keywords: [
    "관부가세란", "해외직구 관세", "해외직구 부가세", "CIF 과세가격",
    "관세 계산법", "해외직구 세금 가이드", "수입관세", "직구 관세율",
  ],
  openGraph: {
    title: "해외직구 관부가세 완벽 가이드 | CIF·관세·부가세 계산법",
    description:
      "해외직구 관부가세란 무엇인지, CIF 과세가격 기준부터 관세·부가세 계산법까지 알기 쉽게 정리했습니다.",
    url: `${SITE_URL}/customs-guide`,
    type: "article",
    locale: "ko_KR",
    siteName: "2026 해외직구 관세계산기",
    images: [{ url: `${SITE_URL}/thumb.webp`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "해외직구 관부가세 완벽 가이드",
    description: "CIF 과세가격 기준·관세·부가세 계산법을 알기 쉽게 정리했습니다.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "해외직구 관부가세 완벽 가이드 | CIF·관세·부가세 계산법",
  description: "해외직구 관부가세란 무엇인지, CIF 과세가격 기준부터 관세·부가세 계산법까지 정리",
  url: `${SITE_URL}/customs-guide`,
  author: { "@type": "Organization", name: "2026 해외직구 관세계산기" },
  publisher: { "@type": "Organization", name: "2026 해외직구 관세계산기" },
  inLanguage: "ko",
};

// ─── 관련 페이지 링크 ─────────────────────────────────────────────────────────
const RELATED = [
  { href: "/tax-exemption", label: "면세 한도 & 과세 기준 가이드", desc: "국가별 면세 기준과 목록통관 조건" },
  { href: "/country-guide", label: "국가별 직구 세금 가이드",       desc: "미국·일본·중국·유럽 국가별 비교" },
];

export default function CustomsGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-white">

        {/* 히어로 */}
        <section className="bg-gradient-to-b from-indigo-50 to-white py-12 lg:py-16">
          <div className="mx-auto max-w-[800px] px-4 lg:px-8">
            {/* 브레드크럼 */}
            <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
              <Link href="/" className="hover:text-indigo-500 transition-colors">홈</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-600 font-medium">관부가세 완벽 가이드</span>
            </nav>
            <span className="inline-block text-xs font-semibold text-indigo-500 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full mb-4">
              세금 가이드
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              해외직구 관부가세 완벽 가이드
              <span className="block text-xl sm:text-2xl font-bold text-indigo-500 mt-1">
                CIF 과세가격 · 관세 · 부가세 계산법
              </span>
            </h1>
            <p className="text-gray-500 leading-relaxed">
              해외직구를 처음 시작하면 세금 구조가 복잡하게 느껴질 수 있습니다.
              이 가이드에서는 관부가세의 개념부터 실제 계산법까지 단계별로 쉽게 설명합니다.
            </p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-[800px] px-4 lg:px-8 space-y-14">

            {/* 1. 관부가세란 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-500 text-white text-sm flex items-center justify-center font-bold flex-shrink-0">1</span>
                관부가세란 무엇인가?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>관부가세</strong>는 <strong>관세(關稅)</strong>와 <strong>부가가치세(附加價値稅)</strong>를 합쳐 부르는 말입니다.
                해외에서 물품을 구매해 국내로 반입할 때 세관이 부과하는 세금으로,
                일정 금액을 초과하는 물품에 적용됩니다.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <p className="text-sm font-bold text-indigo-700 mb-2">관세 (Customs Duty)</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    수입 물품에 부과하는 세금으로, 품목·원산지에 따라 0%~36%까지 다양하게 적용됩니다.
                    세율은 관세청이 고시하는 품목별 세율표를 기준으로 합니다.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-violet-50 border border-violet-200">
                  <p className="text-sm font-bold text-violet-700 mb-2">부가가치세 (VAT)</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    모든 과세 수입 물품에 일률적으로 <strong>10%</strong>가 부과됩니다.
                    과세가격(CIF)과 관세를 합한 금액에 10%를 곱해 산정합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. CIF 기준 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-violet-500 text-white text-sm flex items-center justify-center font-bold flex-shrink-0">2</span>
                CIF 과세가격 기준이란?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                한국 세관은 수입 물품의 <strong>과세가격</strong>을 CIF(Cost + Insurance + Freight) 기준으로 산정합니다.
                단순히 물품가격만이 아니라 보험료와 국제 운임(배송비)까지 포함한 금액입니다.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 mb-5">
                {[
                  { label: "C — Cost", color: "bg-indigo-50 border-indigo-200 text-indigo-700", desc: "물품 구매 가격 + 현지 배송비 + 수수료 등 실제 결제 금액" },
                  { label: "I — Insurance", color: "bg-violet-50 border-violet-200 text-violet-700", desc: "운송 중 파손·분실에 대비한 보험료. 소액이라 생략되는 경우도 많습니다." },
                  { label: "F — Freight", color: "bg-purple-50 border-purple-200 text-purple-700", desc: "한국까지 도착하는 국제 운임(배송비). 해운·항공 모두 포함됩니다." },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl border-2 ${item.color}`}>
                    <p className="font-bold text-sm mb-1.5">{item.label}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-mono text-sm text-gray-700">
                <p className="font-bold text-indigo-600 mb-1">CIF 과세가격 = 물품가격 + 현지배송비 + 국제운임 + 보험료</p>
                <p className="text-xs text-gray-500 mt-1">* 이 값을 기준으로 관세율과 부가세율이 적용됩니다.</p>
              </div>
            </div>

            {/* 3. 관부가세 계산법 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-green-500 text-white text-sm flex items-center justify-center font-bold flex-shrink-0">3</span>
                관부가세 계산 방법 단계별 이해
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                계산 순서는 ① 과세가격 산출 → ② 관세 계산 → ③ 부가세 계산 순으로 진행됩니다.
              </p>
              <div className="space-y-3 mb-5">
                {[
                  { step: "① 과세가격(CIF) 산출", formula: "물품가격 × 적용 환율 + 국제운임", color: "bg-blue-50 border-blue-200", tag: "기준값" },
                  { step: "② 관세 계산", formula: "CIF 과세가격 × 관세율(%)", color: "bg-amber-50 border-amber-200", tag: "세금①" },
                  { step: "③ 부가세 계산", formula: "(CIF 과세가격 + 관세) × 10%", color: "bg-orange-50 border-orange-200", tag: "세금②" },
                  { step: "④ 총 납부 세액", formula: "관세 + 부가세", color: "bg-indigo-50 border-indigo-200", tag: "합계" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${item.color}`}>
                    <div>
                      <p className="text-sm font-bold text-gray-700">{item.step}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{item.formula}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 bg-white/80 px-2.5 py-1 rounded-lg border border-gray-200 whitespace-nowrap ml-3">{item.tag}</span>
                  </div>
                ))}
              </div>

              {/* 예시 */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                <p className="text-sm font-bold text-gray-700 mb-3">
                  📌 계산 예시: 미국 쇼핑몰에서 의류 $250 구매 (환율 1,380원, 국제배송비 25,000원, 관세율 13%)
                </p>
                <div className="space-y-2 text-sm">
                  {[
                    ["과세가격", "$250 × 1,380원 + 25,000원 = 370,000원"],
                    ["관세 (13%)", "370,000 × 0.13 = 48,100원"],
                    ["부가세 (10%)", "(370,000 + 48,100) × 0.1 = 41,810원"],
                    ["총 납부 세액", "48,100 + 41,810 = 89,910원"],
                    ["최종 예상 비용", "370,000 + 89,910 = 459,910원"],
                  ].map(([label, val], i) => (
                    <div key={i} className={`flex justify-between py-2 px-3 rounded-lg ${i===4 ? "bg-indigo-100 font-bold" : "bg-white border border-gray-100"}`}>
                      <span className="text-gray-600">{label}</span>
                      <span className={i===4 ? "text-indigo-700" : "text-gray-700 font-semibold"}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. 주요 품목별 관세율 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-white text-sm flex items-center justify-center font-bold flex-shrink-0">4</span>
                주요 품목별 관세율 한눈에 보기
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { cat: "컴퓨터·스마트폰·도서", rate: "0%", color: "bg-green-50 border-green-200 text-green-700" },
                  { cat: "스킨케어·색조화장품·헤어케어", rate: "6.5%", color: "bg-blue-50 border-blue-200 text-blue-700" },
                  { cat: "의류·신발·가방·모자", rate: "13%", color: "bg-violet-50 border-violet-200 text-violet-700" },
                  { cat: "일반 가전·가구·생활용품", rate: "8%", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
                  { cat: "주류(와인·맥주)", rate: "15%", color: "bg-amber-50 border-amber-200 text-amber-700" },
                  { cat: "향수", rate: "18%", color: "bg-orange-50 border-orange-200 text-orange-700" },
                  { cat: "조제분유", rate: "36%", color: "bg-red-50 border-red-200 text-red-700" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 ${item.color}`}>
                    <span className="text-sm font-medium text-gray-700">{item.cat}</span>
                    <span className={`text-sm font-extrabold ${item.color.split(" ").find(c=>c.startsWith("text-"))}`}>{item.rate}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">* 관세율은 품목 세번(HS Code)에 따라 다를 수 있으며, 정확한 세율은 관세청에 문의하세요.</p>
            </div>

            {/* CTA — 계산기 */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 p-6 text-center shadow-xl shadow-indigo-200">
              <p className="text-white font-bold text-lg mb-2">직접 계산해보고 싶으신가요?</p>
              <p className="text-indigo-200 text-sm mb-4">실시간 환율과 품목별 관세율이 자동 적용되는 계산기로 바로 확인하세요.</p>
              <Link href="/"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-md">
                관부가세 계산기 바로가기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 관련 글 */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">관련 가이드</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {RELATED.map((item) => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
