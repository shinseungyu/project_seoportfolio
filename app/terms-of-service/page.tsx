import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | 청년미래적금',
  description: '청년미래적금 계산기 서비스의 이용약관입니다.',
  alternates: { canonical: '/terms-of-service' },
}

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-16 text-foreground">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">이용약관</h1>
      <p className="mb-12 text-sm text-muted-foreground">최종 업데이트: 2026년 3월 8일</p>

      <div className="space-y-12 leading-relaxed">
        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">제1조 (목적)</h2>
          <p>본 약관은 <strong>fundfinpro.com</strong> (이하 &quot;사이트&quot;)이 제공하는 &quot;청년미래적금 계산기&quot; 서비스의 이용 조건 및 절차, 이용자와 사이트 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">제2조 (서비스의 내용)</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li>청년미래적금 만기수령액 자동 계산 서비스</li>
            <li>청년 적금 및 재테크 관련 가이드 </li>
            <li>관련 광고 서비스 (Google AdSense)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">제3조 (면책 조항)</h2>
          <p>본 사이트에서 제공하는 적금 한도 및 만기 수령액 계산 결과는 <strong>단순 참고용</strong>이며, 어떠한 법적 효력도 갖지 않습니다. 실제 이자 지급액과 정부 기여금은 가입 시점의 정책과 가입 은행의 심사 결과, 우대금리 충족 여부 등에 따라 달라질 수 있습니다. 계산 결과에 기반한 재무적 결정에 대해 본 사이트는 어떠한 책임도 지지 않습니다.</p>
        </section>

        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">제4조 (이용자의 의무)</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li>서비스를 불법적인 목적으로 이용하는 행위 금지</li>
            <li>본 사이트의 콘텐츠를 무단으로 복제·당 사이트 외 배포하는 행위 금지</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">제5조 (문의)</h2>
          <p>이메일: <a href="mailto:tlsfkaus0711@gmail.com" className="text-primary hover:underline">tlsfkaus0711@gmail.com</a></p>
        </section>
      </div>
    </main>
  )
}
