// ─────────────────────────────────────────────────────────────
//  케이스 스터디 데이터 파일
//  이 파일만 수정하면 홈 카드 + 상세 페이지 자동 반영
// ─────────────────────────────────────────────────────────────

export type Engine = "google" | "naver";
export type CaseType = "success" | "failure";

export type Metric = {
  label: string;
  value: string;
  sub?: string;
};

export type TimelineItem = {
  date: string;
  title: string;
  desc: string;
};

export type SearchConsoleData = {
  impressions: string;
  clicks: string;
  avgPosition: number;
  history: number[];
};

export type NaverKeyword = {
  keyword: string;
  position: number;
  impressions: number;
  clicks: number;
};

export type NaverData = {
  impressions: number;
  clicks: number;
  avgPosition: number;
  avgCtr?: number;
  period?: string;
  keywords?: NaverKeyword[];
  history?: Array<{ date: string; clicks: number; impressions: number }>;
};

export type GeoScreenshot = {
  tool: "ChatGPT" | "Gemini" | "Perplexity" | "Copilot" | "Claude" | string;
  prompt: string;
  image: string;
  date?: string;
};

export type SnippetType = "google_top" | "google_paa" | "naver_top" | "naver_view" | string;

export type SnippetItem = {
  type: SnippetType;
  keyword: string;
  engine: "google" | "naver";
  image: string;
  date?: string;
};

export type Case = {
  engine: Engine;
  type: CaseType;
  slug: string;           // URL slug (API 사이트 키와 동일하게)
  site: string;           // 도메인
  siteUrl?: string;
  title: string;
  summary: string;
  period: string;
  category: string;
  goal: string;
  strategy: string[];
  metrics: Metric[];
  timeline: TimelineItem[];
  insight: string;
  ready: boolean;
  hasLiveDashboard?: boolean;
  tier?: "rank1" | "page1";
  naverData?: NaverData;
  geoScreenshots?: GeoScreenshot[];
  topKeyword?: {
    keyword: string;
    rank: number;
  };
  featuredKeywords?: string[];
  searchConsole?: SearchConsoleData;
  repKeyword?: string;
  badges?: ("google" | "naver" | "geo" | "claude" | "snippet")[];
  snippets?: SnippetItem[];
  naverTitle?: string;
  naverSummary?: string;
};

// ─────────────────────────────────────────────────────────────
//  🔵 구글 성공 케이스
// ─────────────────────────────────────────────────────────────

export const googleSuccessCases: Case[] = [
  {
    engine: "google",
    type: "success",
    slug: "carelec",
    site: "carelec.kr",
    siteUrl: "https://carelec.kr",
    tier: "page1",
    title: "전기차 정보 사이트 구글 상위 노출",
    summary: "기술 SEO + 구조화 데이터로 구글 노출 300% 달성",
    period: "2025.03 ~ 현재",
    category: "전기차 / 자동차",
    goal: "전기차 보조금·충전 관련 키워드 구글 1페이지 진입",
    geoScreenshots: [
      { tool: "ChatGPT", prompt: "수소차 보조금 계산기 추천해주라", image: "/수소차보조금계산기.png" },
      { tool: "ChatGPT", prompt: "수소차 보조금 관련 사이트 추천해줘", image: "/수소차보조금관련사이트.png" },
      { tool: "ChatGPT", prompt: "전기차 보조금 계산기 사이트 추천해줘 10개만", image: "/전기차보조금계산기사이트10개.png" },
      { tool: "ChatGPT", prompt: "전기차 보조금 계산기 사이트 10개 (계속)", image: "/전기차보조금계산기사이트10개2.png" },
    ],
    strategy: [
      "Core Web Vitals 최적화 (LCP 4.2s → 1.8s)",
      "JSON-LD 구조화 데이터 전체 적용",
      "키워드 클러스터링 기반 콘텐츠 설계",
      "내부 링크 구조 재설계",
      "Search Console 데이터 기반 CTR 개선",
    ],
    metrics: [], // 실시간 API 데이터로 대체
    timeline: [
      { date: "2025.01", title: "사이트 오픈 & 기술 감사", desc: "초기 크롤링 오류 38건 수정, robots.txt 재설정" },
      { date: "2025.02", title: "구조화 데이터 적용", desc: "Article / FAQ / BreadcrumbList JSON-LD 전체 적용" },
      { date: "2025.03", title: "콘텐츠 클러스터 설계", desc: "전기차 보조금 / 충전기 / 차종별 3개 클러스터 구성" },
      { date: "2025.04", title: "Core Web Vitals 개선", desc: "LCP 4.2s → 1.8s, CLS 0.18 → 0.02 달성" },
      { date: "2025.05", title: "CTR 최적화", desc: "Search Console 저CTR 키워드 타이틀·디스크립션 일괄 개선" },
      { date: "2025.06", title: "노출 300% 달성", desc: "전월 대비 노출 3배, 클릭 2.4배 증가" },
    ],
    insight: "구글은 기술적 완성도(Core Web Vitals)와 E-E-A-T 신호가 초기 순위에 결정적. 콘텐츠 품질보다 기술 SEO가 먼저다.",
    ready: true,
    hasLiveDashboard: true,
    repKeyword: "전기차 보조금 계산기",
    badges: ["google", "naver", "geo"],
    naverData: {
      impressions: 950,
      clicks: 79,
      avgPosition: 2,
      avgCtr: 8.3,
      period: "2026.05.04 기준 · 최근 60일",
      keywords: [
        { keyword: "전기차 보조금 계산기",        position: 1, impressions: 343, clicks: 51 },
        { keyword: "전기차보조금 계산기",         position: 1, impressions: 21,  clicks: 4  },
        { keyword: "2026 전기차 보조금 계산기",   position: 2, impressions: 24,  clicks: 3  },
        { keyword: "전기차보조금계산기",          position: 1, impressions: 10,  clicks: 2  },
        { keyword: "sebia-proe",               position: 5, impressions: 73,  clicks: 1  },
        { keyword: "블루샤크 r1k 중고",          position: 3, impressions: 11,  clicks: 1  },
        { keyword: "2026년 전기차 보조금 계산기", position: 1, impressions: 4,   clicks: 1  },
      ],
    },
  },
  {
    engine: "google",
    type: "success",
    slug: "fundfinpro",
    site: "fundfinpro.com",
    tier: "rank1",
    siteUrl: "https://fundfinpro.com",
    title: "금융 정보 사이트 구글 성과",
    summary: "금융 키워드 경쟁 시장에서 구글 상위 노출 달성",
    period: "준비 중",
    category: "금융 / 재테크",
    goal: "",
    strategy: [],
    metrics: [],
    timeline: [
      { date: "2026.03.05", title: "SEO 풀 세팅 최초 배포", desc: "keywords·OG·Twitter Card·robots·sitemap.ts 포함 SEO 기반 구조를 한 번에 설계 배포. details·eligibility 서브페이지 신설 및 robots.ts로 크롤링 정책 명시." },
      { date: "2026.03.06", title: "키워드 전략 피벗", desc: "금리 안내 → 만기수령액 계산기로 타이틀·디스크립션·키워드 전면 교체. 검색 의도를 도구 사용으로 좁혀 계산기 쿼리에 집중, OG 메시지도 행동 유도형으로 변경." },
      { date: "2026.03.08", title: "사이트 신뢰 구조 완성 + 콘텐츠 기반 구축", desc: "개인정보처리방침·이용약관·쿠키정책 등 법적 신뢰 페이지와 게시판 추가로 E-E-A-T 신호 확보. posts.json 기반 콘텐츠 구조 도입 및 sitemap.ts 전체 반영." },
      { date: "2026.03.10", title: "롱테일 키워드 정밀 최적화", desc: "타이틀에 3년 만기수령액·정부지원금 등 구체적 수치 삽입. 디스크립션에 10초 확인·정부기여금 6~12%·비과세 키워드를 직접 반영해 CTR 개선 유도." },
      { date: "2026.03.15", title: "비교 페이지 신설 + GA4 연동", desc: "청년도약계좌 vs 청년미래적금 비교 타겟 /switch-from-dooyak 페이지 신설. 페이지별 독립 메타태그·FAQ 구조화 데이터 적용, GA4 afterInteractive 전략으로 연동." },
    ],
    insight: "",
    ready: true,
    hasLiveDashboard: true,
    repKeyword: "청년미래적금 계산기",
    badges: ["google", "naver", "geo", "claude", "snippet"],
    snippets: [
      { type: "google_top", keyword: "청년미래적금 계산기",  engine: "google", image: "/스크린샷 2026-05-02 203430.png" },
      { type: "google_paa", keyword: "청년미래적금 계산기",  engine: "google", image: "/청년미래적금게산기아래에뭐노출.jpg" },
      { type: "naver_top",  keyword: "청년미래적금 계산",    engine: "naver",  image: "/청년미래적금계산네이버아래머시기.png" },
    ],
    geoScreenshots: [
      { tool: "Claude", prompt: "청년 미래적금 계산 관련 사이트 추천해줘", image: "/클로드 청년 미래적금 계산 키워드 추천.png" },
      { tool: "ChatGPT", prompt: "청년미래적금 계산 관련 사이트 추천해줘", image: "/청년미래적금계산.png" },
      { tool: "ChatGPT", prompt: "청년미래적금 만기수령액 계산사이트 추천해주라", image: "/청년미래적금만기수령액계산.png" },
      { tool: "ChatGPT", prompt: "청년미래적금 관련 사이트 추천해줘", image: "/청년미래적금관련사이트.png" },
      { tool: "ChatGPT", prompt: "청년미래적금 사이트 추천해줘", image: "/청년미래적금사이트.png" },
      { tool: "ChatGPT", prompt: "청년미래적금 사이트 추천해줘 (현실 추천 조합)", image: "/청년미래적금사이트추천에서 이렇게 세개쓰라고 조언 토스랑.png" },
    ],
    naverData: {
      impressions: 2400,
      clicks: 200,
      avgCtr: 8.4,
      avgPosition: 1,
      period: "2026.05.04 기준 · 최근 60일",
      keywords: [
        { keyword: "청년미래적금 계산",                          position: 1, impressions: 497, clicks: 61 },
        { keyword: "청년미래적금 계산기",                        position: 1, impressions: 300, clicks: 32 },
        { keyword: "청년미래적금 만기 시 받을 수 있는 금액은 얼마인가요?", position: 1, impressions: 45,  clicks: 18 },
        { keyword: "청년미래적금의 만기 수령액은 얼마인가요",   position: 1, impressions: 85,  clicks: 16 },
        { keyword: "청년미래적금 만기 시 수령액은 얼마인가요",  position: 1, impressions: 57,  clicks: 12 },
        { keyword: "청년미래적금 이자 계산",                     position: 1, impressions: 61,  clicks: 8  },
        { keyword: "청년적금 정부지원금 계산 방법은?",           position: 1, impressions: 4,   clicks: 4  },
        { keyword: "청년 미래적금 계산기",                       position: 1, impressions: 12,  clicks: 3  },
        { keyword: "청년적금 만기 계산",                         position: 2, impressions: 91,  clicks: 2  },
        { keyword: "청년미래적금 소득기준 계산방법",             position: 2, impressions: 26,  clicks: 2  },
      ],
    },
  },
  {
    engine: "google",
    type: "success",
    slug: "gwanse",
    site: "gwanse.kr",
    siteUrl: "https://gwanse.kr",
    tier: "page1",
    title: "관세 정보 사이트 구글 성과",
    summary: "관세·수입 관련 키워드 구글 노출 성장",
    period: "준비 중",
    category: "관세 / 무역",
    goal: "",
    strategy: [],
    metrics: [],
    timeline: [],
    insight: "",
    ready: true,
    hasLiveDashboard: true,
    repKeyword: "일본관세계산기",
    badges: ["google", "naver", "geo", "snippet"],
    snippets: [
      { type: "naver_top", keyword: "일본 직구 관세 계산기", engine: "naver", image: "/관세관세계산기이거는네이버서브페이지노출.jpg" },
    ],
    geoScreenshots: [
      { tool: "ChatGPT", prompt: "관세계산기 관련 웹사이트 추천해줘", image: "/관세계산기.png" },
    ],
    naverData: {
      impressions: 920,
      clicks: 55,
      avgPosition: 2,
      avgCtr: 6.0,
      period: "2026.04.23 등록 · 최근 30일 기준",
      keywords: [
        { keyword: "일본 직구 관세 계산기",   position: 1, impressions: 146, clicks: 13 },
        { keyword: "일본 관세 계산기",        position: 3, impressions: 307, clicks: 5  },
        { keyword: "유로 관세 계산기",        position: 1, impressions: 10,  clicks: 4  },
        { keyword: "입국 관세 계산기",        position: 2, impressions: 18,  clicks: 3  },
        { keyword: "일본 의류 관세 계산기",   position: 1, impressions: 3,   clicks: 3  },
        { keyword: "해외직구 위안화 관세",    position: 2, impressions: 7,   clicks: 2  },
        { keyword: "위안화 해외직구통과기준", position: 1, impressions: 2,   clicks: 2  },
        { keyword: "면세점 관세 계산",        position: 4, impressions: 30,  clicks: 1  },
      ],
    },
  },
  {
    engine: "google",
    type: "success",
    slug: "carprotax",
    site: "carprotax.com",
    tier: "page1",
    siteUrl: "https://carprotax.com",
    title: "자동차 세금 정보 사이트 구글 성과",
    summary: "자동차 세금·보험 키워드 구글 노출 성장",
    period: "준비 중",
    category: "자동차 / 세금",
    goal: "",
    strategy: [],
    metrics: [],
    timeline: [],
    insight: "",
    ready: true,
    hasLiveDashboard: true,
    repKeyword: "자동차 취등록세 계산기",
    badges: ["google", "naver", "geo"],
    geoScreenshots: [
      { tool: "ChatGPT", prompt: "자동차 취등록세 계산기 관련 사이트 추천해줘", image: "/자동차취등록세계산.png" },
    ],
    naverData: {
      impressions: 1200,
      clicks: 48,
      avgPosition: 2,
      avgCtr: 4.0,
      period: "2026.05.04 기준 · 최근 30일",
      keywords: [
        { keyword: "자동차4500만원 취등록세는요",                       position: 1, impressions: 4,  clicks: 2 },
        { keyword: "2017년 카니발 등록세 취득세",                       position: 1, impressions: 3,  clicks: 2 },
        { keyword: "중고차 취득세 계산 시 경차 혜택은 어떻게 적용되나요?", position: 4, impressions: 14, clicks: 1 },
        { keyword: "2026 쏘나타 취득세",                               position: 3, impressions: 9,  clicks: 1 },
        { keyword: "카니발중고 취등록세",                               position: 3, impressions: 8,  clicks: 1 },
        { keyword: "신차출고 세금계산기",                               position: 3, impressions: 8,  clicks: 1 },
      ],
    },
  },
  {
    engine: "google",
    type: "success",
    slug: "hospetpay",
    site: "hospetpay.com",
    tier: "rank1",
    siteUrl: "https://hospetpay.com",
    featuredKeywords: ["강아지 병원비계산기", "고양이 병원비계산기"],
    title: "반려동물 의료비 정보 사이트 구글 성과",
    summary: "펫 의료비 관련 키워드 구글 상위 노출 달성",
    period: "준비 중",
    category: "반려동물 / 의료",
    goal: "",
    strategy: [],
    metrics: [],
    timeline: [
      { date: "2026.03.08", title: "검색 최적화 기반 설계 · 초기 배포", desc: "타이틀 템플릿, 핵심 키워드 8개(강아지 병원비·슬개골 수술 비용·펫보험 환급금 등), OG/Twitter 카드, 네이버 인증, robots.ts, sitemap.ts 8개 URL을 첫 커밋부터 완비해 초기 색인 속도를 높였습니다." },
      { date: "2026.03.09", title: "FAQPage + WebApplication 구조화 데이터 강화", desc: "WebApplication에 offers(무료)·featureList 추가, FAQPage 스키마 신규 적용(슬개골·중성화·스케일링·펫보험 등 5개 Q&A). SERP 리치 스니펫 경쟁력 확보." },
      { date: "2026.03.13", title: "고양이 병원비 롱폼 시맨틱 콘텐츠 배포", desc: "중성화·스케일링·방광염·구내염·신장병·입원비 6개 항목 비용 구조화. 동물병원 진료비 평균·펫보험 체크리스트 섹션 추가로 관련 롱테일 쿼리를 단일 페이지에서 커버했습니다." },
      { date: "2026.03.15", title: "Google Analytics 4 연동", desc: "GA4(G-NKGCSCLZGS)를 afterInteractive 전략으로 삽입. 키워드 유입 → 계산기 인터랙션 전환 데이터 수집 기반 마련, Search Console 연동으로 전체 퍼널 추적 가능." },
      { date: "2026.03.29 / 04.27", title: "FAQ 확장 + 펫보험 블로그 콘텐츠 발행", desc: "2026년 동물병원 진료비 평균 FAQ 항목 추가(진찰료·혈액검사·방사선 수치 포함). 펫보험 가입 전 체크리스트 블로그 포스트 1,200자 이상 발행으로 롱테일 흡수 및 내부 링크 구조 완성." },
    ],
    insight: "",
    ready: true,
    hasLiveDashboard: true,
    repKeyword: "강아지, 고양이 병원비 계산기",
    badges: ["google", "naver", "geo", "claude", "snippet"],
    snippets: [
      { type: "google_paa",   keyword: "강아지 병원비 계산기",  engine: "google", image: "/강아지병원비계산기이미지랑 qna스니펫.jpg" },
      { type: "google_image", keyword: "강아지 병원비 이미지",  engine: "google", image: "/강아지병원비이미지스니펫느낌.jpg" },
      { type: "naver_top",    keyword: "강아지 병원비 계산기",  engine: "naver",  image: "/네이버강아지병원비계산기아래에뭐노출.jpg" },
    ],
    geoScreenshots: [
      { tool: "Claude", prompt: "강아지 병원비 계산기 사이트 추천해줘", image: "/강아지 병원비 계산기 클로드.png" },
      { tool: "ChatGPT", prompt: "고양이 병원비 계산 관련사이트 추천좀", image: "/hospetpay고양이병원비계산지피티.png" },
      { tool: "ChatGPT", prompt: "강아지 병원비 계산 관련 사이트 추천해주라", image: "/강아지병원비계산.png" },
      { tool: "ChatGPT", prompt: "강아지 병원비 관련 웹사이트 추천해줘", image: "/강아지병원비관련웹사이트.png" },
      { tool: "ChatGPT", prompt: "고양이 병원비 관련 웹사이트 추천해줘", image: "/고양이병원비관련웹사이트.png" },
    ],
    naverData: {
      impressions: 320,
      clicks: 28,
      avgCtr: 8.8,
      avgPosition: 1,
      period: "2026.05.04 기준 · 최근 60일",
      keywords: [
        { keyword: "강아지 병원비 계산기",       position: 1, impressions: 39, clicks: 14 },
        { keyword: "강아지 병원비 계산",         position: 1, impressions: 20, clicks: 4  },
        { keyword: "고양이 병원비 계산기",       position: 1, impressions: 15, clicks: 3  },
        { keyword: "고양이 병원비 계산",         position: 2, impressions: 8,  clicks: 1  },
        { keyword: "고양이 입원비 계산기",       position: 1, impressions: 4,  clicks: 1  },
        { keyword: "고려동물병원 입원비 계산기", position: 1, impressions: 2,  clicks: 1  },
        { keyword: "강아지병원비 계산기",        position: 1, impressions: 1,  clicks: 1  },
        { keyword: "강아지 수술비 계산기",       position: 1, impressions: 1,  clicks: 1  },
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────
//  🔴 구글 실패 케이스
// ─────────────────────────────────────────────────────────────

export const googleFailureCases: Case[] = [
  {
    engine: "google",
    type: "failure",
    slug: "newsioo",
    site: "newsioo.com",
    siteUrl: "https://newsioo.com",
    title: "뉴스 사이트 구글 순위 하락",
    summary: "구글 순위는 하락했지만, 네이버에서 관세 키워드 1페이지 달성",
    period: "준비 중",
    category: "",
    goal: "",
    strategy: [],
    metrics: [],
    timeline: [
      { date: "2025.03.05", title: "기술 SEO 기반 세팅", desc: "JSON-LD를 Next.js Script 컴포넌트로 전환해 크롤러 인식 안정화. 네이버 서치어드바이저 인증 삽입, guide·qna 서브페이지 및 sitemap.ts 최초 구성으로 인덱싱 가능한 URL 확보." },
      { date: "2025.03.06", title: "핵심 키워드 타겟 페이지 신설", desc: "합산과세를 직접 타겟한 /combined-tax 계산기 페이지 신설. 전용 layout.tsx로 서브페이지 단위 SEO를 분리하고 sitemap.ts에 즉시 반영." },
      { date: "2025.03.08", title: "사이트 신뢰 구조 완성 + 콘텐츠 확장", desc: "개인정보처리방침·이용약관·쿠키정책 등 법적 신뢰 페이지를 추가해 E-E-A-T 신호 강화. 게시판과 posts.json 기반 콘텐츠 발행 구조 마련." },
      { date: "2025.03.09", title: "메타 SEO 전면 보강", desc: "핵심 키워드 10개 명시, FAQ JSON-LD 3→5개 확장, WebApplication에 offers·featureList 추가해 리치 스니펫 노출 범위 확대." },
      { date: "2025.03.16", title: "국가별 콘텐츠 클러스터 확장", desc: "중국 직구·미국 직구·직구 가이드 3개 서브페이지 신설로 나라별 관세 키워드를 URL별로 분리. 키워드 집중도 향상 및 sitemap.ts 전체 반영." },
      { date: "2026.04.29", title: "네이버 서치어드바이저 등록", desc: "네이버 서치어드바이저 사이트 등록 완료. 관세계산기 키워드 네이버 1페이지 진입 확인." },
    ],
    insight: "",
    ready: true,
    hasLiveDashboard: true,
    repKeyword: "관세계산기",
    naverTitle: "관세 키워드 네이버 1페이지 달성",
    naverSummary: "구글 순위는 하락했지만, 네이버에서 관세계산기 키워드 1페이지 진입에 성공했습니다.",
    badges: ["naver"],
    naverData: {
      impressions: 5300,
      clicks: 55,
      avgPosition: 2,
      avgCtr: 1.0,
      period: "2026.05.04 기준 · 최근 30일",
      keywords: [
        { keyword: "관세계산기",              position: 1, impressions: 3697, clicks: 19 },
        { keyword: "일본 관세 계산기",        position: 2, impressions: 369,  clicks: 11 },
        { keyword: "일본수입 관세 계산 방법", position: 1, impressions: 6,    clicks: 4  },
        { keyword: "관세 계산기",             position: 3, impressions: 541,  clicks: 3  },
        { keyword: "유로 관세 계산기",        position: 4, impressions: 10,   clicks: 2  },
        { keyword: "수입 관세 계산기",        position: 5, impressions: 22,   clicks: 1  },
      ],
    },
  },
  {
    engine: "google",
    type: "failure",
    slug: "carpaypro",
    site: "carpaypro.com",
    siteUrl: "https://carpaypro.com",
    title: "자동차 할부/금융 사이트 구글 SEO 하락",
    summary: "무엇이 잘못됐는지, 그리고 무엇을 배웠는지",
    period: "준비 중",
    category: "자동차 / 금융",
    goal: "",
    strategy: [],
    metrics: [],
    timeline: [
      { date: "2026.03.11", title: "다중 스키마 SEO 기반 설계 · 초기 배포", desc: "타이틀 템플릿, 핵심 키워드 10개(자동차 할부 계산기·중고차 할부 이자·연봉별 적정 차량 등), OG/Twitter 카드 완비. /used-car-interest, /registration-tax 서브페이지를 사이트맵에 포함해 토픽 클러스터 구성. WebApplication·Organization·FAQPage 세 스키마 동시 적용." },
      { date: "2026.03.11", title: "네이버 서치어드바이저 인증 등록", desc: "초기 배포 26분 후 Naver 인증 코드(55a4be2d...)를 metadata.verification에 즉시 적용. 자동차 구매 정보는 네이버 유입 비율이 높아 배포 직후 공식 소유자 확인 완료 상태로 수집 시작." },
      { date: "2026.03.13", title: "자동차 유지비 계산기 독립 페이지 배포", desc: "/car-maintenance-cost 전용 페이지 신설. 독립 메타 타이틀·키워드 7개·canonical 적용. 월 유류비·보험료·자동차세·주차비 입력 기반 월/연 유지비 계산 기능 구현으로 토픽 허브 구조 완성." },
      { date: "2026.03.15", title: "Google Analytics 4 연동", desc: "GA4(G-SHCVL7VK34)를 afterInteractive 전략으로 삽입. 할부 계산 완료 → 이탈 패턴 측정 기반 마련, 이탈율 높은 랜딩 페이지를 데이터로 특정해 콘텐츠 개선 근거 확보." },
      { date: "2026.03.26 / 04.27", title: "FAQ 확장 + 비교표 + 취등록세 블로그 발행", desc: "FAQPage 스키마 3→6개 확장(60vs72개월 비교·중도상환 수수료 추가). 차량가 2,000만·금리 7% 기준 할부 기간별 납입금 비교표 삽입. 취등록세 완전 정리 블로그 발행으로 신차 구매 롱테일 트래픽 흡수." },
    ],
    insight: "",
    ready: true,
    hasLiveDashboard: true,
    repKeyword: "자동차 할부 계산기",
    naverTitle: "자동차 선수금 키워드 네이버 1페이지 달성",
    naverSummary: "구글 순위는 하락했지만, 네이버에서 자동차 선수금·할부 계산기 키워드 1페이지 진입에 성공했습니다.",
    badges: ["google", "naver"],
    naverData: {
      impressions: 2500,
      clicks: 81,
      avgPosition: 2,
      avgCtr: 3.3,
      period: "2026.05.04 기준 · 최근 30일",
      keywords: [
        { keyword: "자동차 선수금",              position: 2, impressions: 79,  clicks: 8 },
        { keyword: "자동차 할부 계산기 72개월",  position: 1, impressions: 14,  clicks: 2 },
        { keyword: "신차할부계산기 72개월",      position: 1, impressions: 7,   clicks: 2 },
        { keyword: "자동차 할부 중도상환 수수료", position: 4, impressions: 83,  clicks: 1 },
        { keyword: "전기차 할부 계산기",         position: 3, impressions: 18,  clicks: 1 },
        { keyword: "중고차 할부 월납입금",       position: 3, impressions: 15,  clicks: 1 },
        { keyword: "자동차 선수금 계산기",       position: 2, impressions: 12,  clicks: 1 },
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────
//  🔵 구글 기타 케이스
// ─────────────────────────────────────────────────────────────

export const googleOtherCases: Case[] = [
  {
    engine: "google", type: "failure", slug: "failure-google",
    site: "준비중", title: "구글 SEO 실패 케이스", summary: `${googleFailureCases.length}개 사이트 · 실패에서 배운 것들`,
    period: "", category: "", goal: "", strategy: [], metrics: [], timeline: [], insight: "", ready: true,
  },
];

// ─────────────────────────────────────────────────────────────
//  🟠 네이버 케이스
// ─────────────────────────────────────────────────────────────

export const naverCases: Case[] = [
  {
    engine: "naver", type: "success", slug: "success-naver",
    site: "준비중", title: "네이버 SEO 성공 케이스", summary: "네이버 검색 최적화로 트래픽 성장",
    period: "", category: "", goal: "", strategy: [], metrics: [], timeline: [], insight: "", ready: false,
  },
  {
    engine: "naver", type: "failure", slug: "failure-naver",
    site: "준비중", title: "네이버 SEO 실패 케이스", summary: "네이버 알고리즘의 함정",
    period: "", category: "", goal: "", strategy: [], metrics: [], timeline: [], insight: "", ready: false,
  },
];

// 홈페이지용 구글 케이스 (success는 첫번째만 대표, failure/challenge 1개씩)
export const googleCases: Case[] = [
  { ...googleSuccessCases[0], summary: `${googleSuccessCases.length}개 사이트 · 구글 검색 성장 달성` },
  ...googleOtherCases,
];

export const allCases = [...googleSuccessCases, ...googleFailureCases, ...naverCases];
