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
  period?: string;
  keywords?: NaverKeyword[];
  history?: Array<{ date: string; clicks: number; impressions: number }>;
};

export type GeoScreenshot = {
  tool: "ChatGPT" | "Gemini" | "Perplexity" | "Copilot" | "Claude" | string;
  prompt: string;
  image: string; // public/ 기준 경로 예: /geo/carelec-chatgpt.png
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
    timeline: [],
    insight: "",
    ready: true,
    hasLiveDashboard: true,
    geoScreenshots: [
      { tool: "ChatGPT", prompt: "청년미래적금 계산 관련 사이트 추천해줘", image: "/청년미래적금계산.png" },
      { tool: "ChatGPT", prompt: "청년미래적금 만기수령액 계산사이트 추천해주라", image: "/청년미래적금만기수령액계산.png" },
      { tool: "ChatGPT", prompt: "청년미래적금 관련 사이트 추천해줘", image: "/청년미래적금관련사이트.png" },
      { tool: "ChatGPT", prompt: "청년미래적금 사이트 추천해줘", image: "/청년미래적금사이트.png" },
      { tool: "ChatGPT", prompt: "청년미래적금 사이트 추천해줘 (현실 추천 조합)", image: "/청년미래적금사이트추천에서 이렇게 세개쓰라고 조언 토스랑.png" },
    ],
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
    geoScreenshots: [
      { tool: "ChatGPT", prompt: "자동차 취등록세 계산기 관련 사이트 추천해줘", image: "/자동차취등록세계산.png" },
    ],
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
    timeline: [],
    insight: "",
    ready: true,
    hasLiveDashboard: true,
    geoScreenshots: [
      { tool: "ChatGPT", prompt: "고양이 병원비 계산 관련사이트 추천좀", image: "/hospetpay고양이병원비계산지피티.png" },
      { tool: "ChatGPT", prompt: "강아지 병원비 계산 관련 사이트 추천해주라", image: "/강아지병원비계산.png" },
      { tool: "ChatGPT", prompt: "강아지 병원비 관련 웹사이트 추천해줘", image: "/강아지병원비관련웹사이트.png" },
      { tool: "ChatGPT", prompt: "고양이 병원비 관련 웹사이트 추천해줘", image: "/고양이병원비관련웹사이트.png" },
    ],
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
    title: "뉴스 사이트 구글 SEO 실패",
    summary: "무엇이 잘못됐는지, 그리고 무엇을 배웠는지",
    period: "준비 중",
    category: "",
    goal: "",
    strategy: [],
    metrics: [],
    timeline: [],
    insight: "",
    ready: true,
    hasLiveDashboard: true,
  },
  {
    engine: "google",
    type: "failure",
    slug: "carpaypro",
    site: "carpaypro.com",
    siteUrl: "https://carpaypro.com",
    title: "자동차 할부/금융 사이트 구글 SEO 실패",
    summary: "무엇이 잘못됐는지, 그리고 무엇을 배웠는지",
    period: "준비 중",
    category: "",
    goal: "",
    strategy: [],
    metrics: [],
    timeline: [],
    insight: "",
    ready: true,
    hasLiveDashboard: true,
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
