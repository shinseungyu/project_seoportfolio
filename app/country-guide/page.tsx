import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fundfinpro.com";

export const metadata: Metadata = {
  title: "국가별 해외직구 관세 가이드 | 미국·일본·중국·유럽 세금 비교",
  description:
    "미국·일본·중국·홍콩·호주·유럽·영국 해외직구 시 적용되는 관세율, 면세 한도, 통화, 주의사항을 국가별로 비교 정리했습니다. 직구 전 꼭 확인하세요.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/country-guide" },
  keywords: [
    "미국 직구 관세", "일본 직구 관세", "중국 직구 관세", "유럽 직구 관세",
    "해외직구 국가별 세금", "아마존 직구 관세", "직구 나라별 관세율", "영국 직구 세금",
  ],
  openGraph: {
    title: "국가별 해외직구 관세 가이드 | 미국·일본·중국·유럽 세금 비교",
    description:
      "미국·일본·중국·홍콩·호주·유럽·영국 직구 관세율과 면세 한도를 국가별로 비교했습니다.",
    url: `${SITE_URL}/country-guide`,
    type: "article",
    locale: "ko_KR",
    siteName: "2026 해외직구 관세계산기",
    images: [{ url: `${SITE_URL}/thumb.webp`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "국가별 해외직구 관세 가이드",
    description: "미국·일본·중국·유럽 직구 면세 한도와 관세율을 한눈에 비교하세요.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "국가별 해외직구 관세 가이드 | 미국·일본·중국·유럽 세금 비교",
  description: "7개국 직구 관세율·면세 한도·주의사항 국가별 비교 가이드",
  url: `${SITE_URL}/country-guide`,
  author: { "@type": "Organization", name: "2026 해외직구 관세계산기" },
  publisher: { "@type": "Organization", name: "2026 해외직구 관세계산기" },
  inLanguage: "ko",
};

const COUNTRIES_INFO = [
  {
    flag: "🇺🇸", name: "미국", currency: "USD", symbol: "$",
    exemption: "$200 USD (특별 면세)",
    popular: "아마존(Amazon), 이베이(eBay), 나이키, 갭",
    pros: "FTA 적용으로 면세 한도가 $200으로 높습니다. IT 기기, 의류, 스포츠용품이 인기 품목입니다.",
    caution: "관세율 13% 의류·신발이 많아 면세 한도를 초과하면 세금이 상당히 발생할 수 있습니다. 국제 배송비도 고려하세요.",
    color: "border-blue-200 bg-blue-50/30",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    flag: "🇯🇵", name: "일본", currency: "JPY", symbol: "¥",
    exemption: "$150 USD",
    popular: "라쿠텐(楽天), 야후쇼핑, 조조타운, 돈키호테",
    pros: "패션·화장품·전자제품이 국내보다 저렴한 경우가 많습니다. 엔저 시기에 환율 혜택을 누릴 수 있습니다.",
    caution: "엔화 환율 변동에 주의하세요. 일부 쇼핑몰은 해외 배송을 지원하지 않으며, 배송대행 이용 시 추가 비용이 발생합니다.",
    color: "border-red-200 bg-red-50/20",
    tagColor: "bg-red-100 text-red-700",
  },
  {
    flag: "🇨🇳", name: "중국", currency: "CNY", symbol: "¥",
    exemption: "$150 USD",
    popular: "알리익스프레스(AliExpress), 타오바오, 징동닷컴",
    pros: "생활용품, 전자제품 부품, 의류 등이 매우 저렴합니다. 배송비가 무료인 상품도 많습니다.",
    caution: "상품 품질 편차가 크고 배송 기간이 길 수 있습니다. 전자제품은 A/S가 어려울 수 있어 주의가 필요합니다.",
    color: "border-yellow-200 bg-yellow-50/20",
    tagColor: "bg-yellow-100 text-yellow-700",
  },
  {
    flag: "🇭🇰", name: "홍콩", currency: "HKD", symbol: "HK$",
    exemption: "$150 USD",
    popular: "HKTVmall, 고존(GOzone), 샤오미 홍콩 공식몰",
    pros: "중국 본토보다 품질 관리가 엄격하고 글로벌 제품을 저렴하게 구입할 수 있습니다.",
    caution: "홍콩 달러 환율을 반드시 확인하세요. 전자제품은 국내 전압(220V)·플러그 호환 여부를 체크하세요.",
    color: "border-pink-200 bg-pink-50/20",
    tagColor: "bg-pink-100 text-pink-700",
  },
  {
    flag: "🇦🇺", name: "호주", currency: "AUD", symbol: "A$",
    exemption: "$150 USD",
    popular: "THE ICONIC, Chemist Warehouse, Catch.com.au",
    pros: "건강보조식품, 우유·분유, 스킨케어 등이 인기 품목입니다. 영어권 국가라 상품 정보 파악이 쉽습니다.",
    caution: "호주 달러 환율이 USD보다 낮아 면세 기준 계산 시 환율 확인이 중요합니다. 배송비가 비싼 편입니다.",
    color: "border-orange-200 bg-orange-50/20",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    flag: "🇪🇺", name: "유럽 (EU)", currency: "EUR", symbol: "€",
    exemption: "$150 USD",
    popular: "자라(Zara), 아소스(ASOS), 파르파치(Farfetch), 마이테레사",
    pros: "명품·패션·화장품이 국내보다 저렴합니다. 특히 루이비통·에르메스 등 명품 가격 차이가 큽니다.",
    caution: "명품 구매 시 진품 여부와 A/S를 고려하세요. 부가세(VAT) 환급 가능 여부도 확인하면 좋습니다.",
    color: "border-indigo-200 bg-indigo-50/20",
    tagColor: "bg-indigo-100 text-indigo-700",
  },
  {
    flag: "🇬🇧", name: "영국", currency: "GBP", symbol: "£",
    exemption: "$150 USD",
    popular: "막스앤스펜서(M&S), 존루이스(John Lewis), 탑샵, 부츠(Boots)",
    pros: "패션, 뷰티, 티·식품류가 특히 인기입니다. 파운드화 약세 시기에 가성비가 좋습니다.",
    caution: "브렉시트 이후 EU와 별도 관세 체계가 적용되었습니다. GBP는 USD 대비 가치가 높아 면세 기준 환산 시 주의하세요.",
    color: "border-violet-200 bg-violet-50/20",
    tagColor: "bg-violet-100 text-violet-700",
  },
];

const RELATED = [
  { href: "/customs-guide", label: "관부가세 완벽 가이드",     desc: "CIF 기준·관세·부가세 계산법 정리" },
  { href: "/tax-exemption", label: "면세 한도 & 과세 기준 가이드", desc: "목록통관·합산과세 주의사항" },
];

export default function CountryGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-white">

        {/* 히어로 */}
        <section className="bg-gradient-to-b from-violet-50 to-white py-12 lg:py-16">
          <div className="mx-auto max-w-[900px] px-4 lg:px-8">
            <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
              <Link href="/" className="hover:text-indigo-500 transition-colors">홈</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-600 font-medium">국가별 직구 세금 가이드</span>
            </nav>
            <span className="inline-block text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full mb-4">
              국가별 가이드
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              국가별 해외직구 관세 가이드
              <span className="block text-xl sm:text-2xl font-bold text-violet-500 mt-1">
                미국 · 일본 · 중국 · 홍콩 · 호주 · 유럽 · 영국
              </span>
            </h1>
            <p className="text-gray-500 leading-relaxed">
              나라마다 다른 면세 한도, 인기 쇼핑몰, 주의사항까지 국가별로 한눈에 비교하세요.
              직구 전에 꼭 확인해야 할 정보를 모두 담았습니다.
            </p>
            {/* 국가 점프 링크 */}
            <div className="flex flex-wrap gap-2 mt-5">
              {COUNTRIES_INFO.map((c) => (
                <a key={c.name} href={`#${c.name}`}
                  className="text-2xl hover:scale-110 transition-transform" title={c.name}>
                  {c.flag}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 비교 테이블 */}
        <section className="py-8 border-b border-gray-100">
          <div className="mx-auto max-w-[900px] px-4 lg:px-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">7개국 면세 한도 & 통화 한눈에 비교</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">국가</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">통화</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">면세 한도</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">관세율 (의류 기준)</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRIES_INFO.map((c, i) => (
                    <tr key={c.name} className={`border-b border-gray-100 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                      <td className="px-4 py-3 font-medium text-gray-700">
                        <span className="mr-2">{c.flag}</span>{c.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.symbol} {c.currency}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${c.name === "미국" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                          {c.exemption}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">13%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 국가별 상세 */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-[900px] px-4 lg:px-8 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">국가별 직구 상세 가이드</h2>
            {COUNTRIES_INFO.map((c) => (
              <div key={c.name} id={c.name} className={`rounded-2xl border-2 p-6 ${c.color} scroll-mt-20`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{c.flag}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{c.name} 직구 가이드</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${c.tagColor}`}>
                        {c.currency} · 면세 {c.exemption}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white/80 rounded-xl p-3.5 border border-gray-200">
                    <p className="font-semibold text-gray-600 text-xs mb-1.5">🛍️ 인기 쇼핑몰</p>
                    <p className="text-gray-700 leading-relaxed">{c.popular}</p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-3.5 border border-green-200">
                    <p className="font-semibold text-green-600 text-xs mb-1.5">✅ 장점</p>
                    <p className="text-gray-700 leading-relaxed">{c.pros}</p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-3.5 border border-amber-200">
                    <p className="font-semibold text-amber-600 text-xs mb-1.5">⚠️ 주의사항</p>
                    <p className="text-gray-700 leading-relaxed">{c.caution}</p>
                  </div>
                </div>
                {/* 해당 국가로 계산기 바로가기 */}
                <div className="mt-4">
                  <Link href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                    {c.name} 기준으로 관부가세 계산하기 <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16">
          <div className="mx-auto max-w-[900px] px-4 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 p-6 text-center shadow-xl shadow-violet-200">
              <p className="text-white font-bold text-lg mb-2">원하는 나라·품목으로 바로 계산해보세요</p>
              <p className="text-violet-200 text-sm mb-4">7개국 실시간 환율 + 13개 대분류 품목별 관세율이 자동 적용됩니다.</p>
              <Link href="/"
                className="inline-flex items-center gap-2 bg-white text-violet-600 font-bold text-sm px-6 py-3 rounded-xl hover:bg-violet-50 transition-colors shadow-md">
                관부가세 계산기 바로가기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8">
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
