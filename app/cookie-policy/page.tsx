import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '쿠키 정책 | 청년미래적금',
  description: '청년미래적금 계산기 서비스의 쿠키 정책입니다.',
  alternates: { canonical: '/cookie-policy' },
}

export default function CookiePolicyPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-16 text-foreground">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">쿠키 정책</h1>
      <p className="mb-12 text-sm text-muted-foreground">최종 업데이트: 2026년 3월 8일</p>

      <div className="space-y-12 leading-relaxed">
        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">1. 쿠키란 무엇인가요?</h2>
          <p>쿠키(Cookie)는 웹사이트가 이용자의 브라우저에 저장하는 작은 텍스트 파일입니다. 방문 기록, 환경 설정 등을 저장하여 더 나은 사용자 경험을 제공하는 데 활용됩니다.</p>
        </section>

        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">2. 사용하는 쿠키의 종류</h2>
          <h3 className="mt-6 mb-2 text-lg font-bold">분석/통계 쿠키 및 광고 쿠키 (Google Analytics, Google AdSense)</h3>
          <p>방문자 수 확인 및 맞춤형 광고 제공을 위해 사용합니다. Google의 <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">개인정보처리방침</a>을 따릅니다.</p>
        </section>

        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">3. 쿠키 관리 방법</h2>
          <p>브라우저 설정에서 쿠키를 관리하거나 차단할 수 있습니다.</p>
          <p className="mt-4">
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google 광고 설정</a>에서 맞춤 광고를 끌 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">4. 문의</h2>
          <p>이메일: <a href="mailto:tlsfkaus0711@gmail.com" className="text-primary hover:underline">tlsfkaus0711@gmail.com</a></p>
        </section>
      </div>
    </main>
  )
}
