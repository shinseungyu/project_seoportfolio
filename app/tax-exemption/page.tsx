import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fundfinpro.com";

export const metadata: Metadata = {
  title: "해외직구 면세 한도 & 과세 기준 완벽 정리 | 목록통관 150달러",
  description:
    "해외직구 면세 한도 150달러(미국 200달러) 기준과 목록통관·수입신고 차이를 정리했습니다. 합산과세·목록통관 배제 품목까지 실수 없이 알아보세요.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/tax-exemption" },
  keywords: [
    "해외직구 면세 한도", "목록통관 150달러", "해외직구 과세 기준",
    "합산과세", "목록통관 배제", "미국 직구 면세 200달러", "해외직구 세금 면제",
  ],
  openGraph: {
    title: "해외직구 면세 한도 & 과세 기준 완벽 정리",
    description:
      "면세 한도 150달러(미국 200달러) 기준과 목록통관·수입신고 차이를 정리했습니다. 합산과세 주의사항도 확인하세요.",
    url: `${SITE_URL}/tax-exemption`,
    type: "article",
    locale: "ko_KR",
    siteName: "2026 해외직구 관세계산기",
    images: [{ url: `${SITE_URL}/thumb.webp`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "해외직구 면세 한도 & 과세 기준 완벽 정리",
    description: "목록통관 150달러 기준·합산과세·배제품목까지 실수 없이 확인하세요.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "해외직구 면세 한도 & 과세 기준 완벽 정리 | 목록통관 150달러",
  description: "면세 한도·목록통관 조건·합산과세 기준 등 해외직구 세금 면제 조건 완벽 정리",
  url: `${SITE_URL}/tax-exemption`,
  author: { "@type": "Organization", name: "2026 해외직구 관세계산기" },
  publisher: { "@type": "Organization", name: "2026 해외직구 관세계산기" },
  inLanguage: "ko",
};

const RELATED = [
  { href: "/customs-guide", label: "관부가세 완벽 가이드",      desc: "CIF 기준·관세·부가세 계산법 정리" },
  { href: "/country-guide", label: "국가별 직구 세금 가이드",   desc: "미국·일본·중국·유럽 국가별 비교" },
];

export default function TaxExemptionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-white">

        {/* 히어로 */}
        <section className="bg-gradient-to-b from-green-50 to-white py-12 lg:py-16">
          <div className="mx-auto max-w-[800px] px-4 lg:px-8">
            <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
              <Link href="/" className="hover:text-indigo-500 transition-colors">홈</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-600 font-medium">면세 한도 & 과세 기준</span>
            </nav>
            <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full mb-4">
              면세 가이드
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              해외직구 면세 한도 & 과세 기준
              <span className="block text-xl sm:text-2xl font-bold text-green-600 mt-1">
                목록통관 150달러 완벽 정리
              </span>
            </h1>
            <p className="text-gray-500 leading-relaxed">
              어느 금액까지 세금이 면제되는지, 면세를 적용받으려면 어떤 조건을 충족해야 하는지
              국가별 기준부터 합산과세 주의사항까지 빠짐없이 정리했습니다.
            </p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-[800px] px-4 lg:px-8 space-y-14">

            {/* 1. 국가별 면세 한도 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-green-500 text-white text-sm flex items-center justify-center font-bold flex-shrink-0">1</span>
                국가별 면세 한도 한눈에 비교
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                한국 세관의 면세 기준금액은 <strong>물품가격 + 현지 배송비 + 수수료</strong>를 포함한 총 결제 금액을
                USD로 환산한 값입니다. 단, 국제 배송비와 보험료는 면세 기준 산정에서 제외됩니다.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div className="p-5 rounded-2xl bg-green-50 border-2 border-green-400 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🇺🇸</span>
                    <p className="font-bold text-green-700">미국 (특별 면세 한도)</p>
                  </div>
                  <p className="text-3xl font-extrabold text-green-600 mb-1">$200 USD 이하</p>
                  <p className="text-sm text-gray-600">한-미 FTA 적용으로 일반 면세 한도($150)보다 높은 $200가 적용됩니다.</p>
                  <div className="mt-3 p-3 bg-white rounded-xl border border-green-200 text-xs text-gray-500">
                    ✔ 물품가격 + 현지 배송비 합산 $200 이하<br/>
                    ✔ 목록통관으로 관부가세 전액 면제
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-400 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🇯🇵🇨🇳🇭🇰🇦🇺🇪🇺🇬🇧</span>
                    <p className="font-bold text-blue-700">그 외 국가 (일반 한도)</p>
                  </div>
                  <p className="text-3xl font-extrabold text-blue-600 mb-1">$150 USD 이하</p>
                  <p className="text-sm text-gray-600">일본·중국·홍콩·호주·유럽·영국 등 미국 이외 국가는 $150 이하 면세.</p>
                  <div className="mt-3 p-3 bg-white rounded-xl border border-blue-200 text-xs text-gray-500">
                    ✔ 물품가격 + 현지 배송비 합산 $150 이하<br/>
                    ✔ 목록통관으로 관부가세 전액 면제
                  </div>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 leading-relaxed">
                  <strong>주의:</strong> 기준금액은 USD 환산값입니다. 일본 엔화로 결제했더라도
                  세관 고시 환율로 USD 환산 후 면세 여부를 판정합니다.
                </p>
              </div>
            </div>

            {/* 2. 목록통관 vs 수입신고 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-500 text-white text-sm flex items-center justify-center font-bold flex-shrink-0">2</span>
                목록통관 vs 수입신고 차이
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div className="p-5 rounded-2xl bg-green-50 border border-green-300">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="font-bold text-green-700">목록통관 (면세)</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5 flex-shrink-0">▸</span>면세 한도 이하 물품</li>
                    <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5 flex-shrink-0">▸</span>관세·부가세 전액 면제</li>
                    <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5 flex-shrink-0">▸</span>통관 절차 간소화, 빠른 수령</li>
                    <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5 flex-shrink-0">▸</span>개인 사용 목적 물품에 한정</li>
                  </ul>
                </div>
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <p className="font-bold text-amber-700">수입신고 (과세)</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 flex-shrink-0">▸</span>면세 한도 초과 물품</li>
                    <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 flex-shrink-0">▸</span>관세 + 부가세 납부 필요</li>
                    <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 flex-shrink-0">▸</span>간이통관 또는 일반통관 적용</li>
                    <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 flex-shrink-0">▸</span>목록통관 배제 품목도 수입신고</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. 목록통관 배제 품목 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-red-500 text-white text-sm flex items-center justify-center font-bold flex-shrink-0">3</span>
                목록통관 배제 품목 주의
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                아래 품목들은 금액이 면세 한도 이하여도 <strong>목록통관이 불가</strong>하며,
                수입신고를 통해 관부가세를 납부해야 합니다.
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { item: "의약품·한약재·의료기기", note: "식약처 허가 필요" },
                  { item: "건강기능식품", note: "식약처 인정 제품만 허용" },
                  { item: "농·축·수산물 및 가공식품", note: "검역 대상" },
                  { item: "주류", note: "주세·교육세 별도 부과" },
                  { item: "화장품 (기능성·일부)", note: "식약처 심사 필요" },
                  { item: "총포·도검·화약류", note: "반입 자체 불가" },
                  { item: "지식재산권 침해 물품", note: "위조품 포함" },
                  { item: "동식물 및 검역 대상", note: "검역 증명서 필요" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl border border-red-200 bg-red-50/50">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{item.item}</p>
                      <p className="text-xs text-gray-400">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. 합산과세 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-orange-500 text-white text-sm flex items-center justify-center font-bold flex-shrink-0">4</span>
                합산과세 완벽 이해
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>합산과세</strong>란 같은 날 같은 해외 쇼핑몰에서 여러 건의 물품을 구매한 경우,
                각 건의 금액을 합산해 과세 여부를 판단하는 제도입니다.
              </p>
              <div className="space-y-3 mb-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm font-bold text-gray-700 mb-2">합산과세 적용 조건 (3가지 모두 충족 시)</p>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    <li className="flex items-start gap-2"><span className="text-indigo-500 flex-shrink-0 font-bold">①</span>동일인(수취인 동일)</li>
                    <li className="flex items-start gap-2"><span className="text-indigo-500 flex-shrink-0 font-bold">②</span>동일 날짜에 구매</li>
                    <li className="flex items-start gap-2"><span className="text-indigo-500 flex-shrink-0 font-bold">③</span>동일 해외 판매자(쇼핑몰)</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-bold text-amber-700 mb-2">📌 합산과세 예시</p>
                  <p className="text-sm text-gray-600">아마존에서 같은 날 $80 신발 + $90 의류를 각각 주문 → 합산 $170이 되어 $150 초과로 과세 대상이 될 수 있습니다.</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                * 단, 쇼핑몰이 다르거나 날짜가 다른 경우에는 합산과세가 적용되지 않을 수 있습니다.
                구체적인 적용 여부는 세관 판단에 따릅니다.
              </p>
            </div>

            {/* CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 p-6 text-center shadow-xl shadow-green-200">
              <p className="text-white font-bold text-lg mb-2">면세 여부를 직접 확인해보세요</p>
              <p className="text-green-100 text-sm mb-4">실시간 환율 기반으로 면세 한도 초과 여부를 바로 계산해드립니다.</p>
              <Link href="/"
                className="inline-flex items-center gap-2 bg-white text-green-600 font-bold text-sm px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-md">
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
