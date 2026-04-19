import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보 처리방침 | 청년미래적금',
  description: '청년미래적금 만기수령계산기 서비스의 개인정보 처리방침입니다.',
  alternates: { canonical: '/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-16 text-foreground">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">개인정보 처리방침</h1>
      <p className="mb-12 text-sm text-muted-foreground">최종 업데이트: 2026년 3월 8일</p>

      <div className="space-y-12 leading-relaxed">
        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">1. 개요</h2>
          <p>본 개인정보 처리방침은 <strong>fundfinpro.com</strong> (이하 &quot;사이트&quot;)이 운영하는 &quot;청년미래적금 계산기&quot; 서비스와 관련하여, 이용자의 개인정보를 어떻게 수집·이용·보호하는지를 설명합니다. 본 사이트를 이용함으로써 이 방침에 동의하는 것으로 간주합니다.</p>
        </section>

        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">2. 수집하는 정보</h2>
          <p>본 사이트는 다음과 같은 정보를 자동으로 수집할 수 있습니다:</p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li>방문 페이지, 체류 시간 등 사이트 이용 기록</li>
            <li>IP 주소, 브라우저 유형, 운영체제 정보</li>
            <li>쿠키 및 유사 추적 기술을 통한 데이터</li>
          </ul>
          <p className="mt-4">본 사이트는 회원가입 절차가 없으므로 이름, 이메일 등 직접적인 개인정보를 수집하지 않으며, 사용자가 계산기에 입력한 금액 정보는 서버에 저장되지 않고 브라우저 내에서만 처리됩니다.</p>
        </section>

        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">3. 정보의 이용 목적</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li>서비스 운영 및 에러 개선</li>
            <li>방문자 통계 분석 (Google Analytics)</li>
            <li>맞춤형 광고 제공 (Google AdSense)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">4. Google AdSense 및 제3자 광고</h2>
          <p>본 사이트는 <strong>Google AdSense</strong>를 통해 광고를 게재합니다. Google은 쿠키를 사용하여 이용자의 이전 방문 기록을 기반으로 관련 광고를 표시합니다.</p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google 개인정보 처리방침</a>에서 확인 가능합니다.</li>
            <li><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google 광고 설정</a>에서 개인화 광고를 비활성화할 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">5. 문의</h2>
          <p>이메일: <a href="mailto:tlsfkaus0711@gmail.com" className="text-primary hover:underline">tlsfkaus0711@gmail.com</a></p>
        </section>
      </div>
    </main>
  )
}
