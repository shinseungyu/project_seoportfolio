// 일본 대형 클리닉 사이트 — 입사 이후 성과/월별 기록 데이터
// 내용은 전부 여기서만 수정하면 화면에 반영된다.

export type MonthEntry = {
  /** "2026-06" 형식. 타임라인 순서와 라벨에 쓰인다 */
  month: string;
  /** 달 요약 한 줄 */
  title: string;
  /** 세부 내용 (글머리표) */
  items: string[];
  /** 태그 (선택) */
  tags?: string[];
  /** 그 달의 결과 수치 (선택). 예: { label: "클릭", value: "1,200" } */
  metrics?: { label: string; value: string }[];
};

export const clinic = {
  eyebrow: "Main Project",
  name: "일본 대형 클리닉 사이트",
  // TODO: 클리닉명·도메인 공개 여부 확정 후 입력
  domain: "",
  joinedAt: "2026-06-22",
  role: "SEO 운영 · 콘텐츠 자동화",
  summary:
    "입사 이후 일본 대형 클리닉 사이트의 검색 성과를 운영하며 얻은 결과와, 그 결과를 만든 작업 과정을 정리합니다.",
};

/** GSC API 연동 전까지는 value 를 null 로 두면 '연동 예정' 으로 표시된다 */
export const clinicMetrics: { key: string; label: string; unit: string; value: number | null }[] = [
  { key: "impressions", label: "Impressions", unit: "회", value: null },
  { key: "clicks", label: "Clicks", unit: "회", value: null },
  { key: "ctr", label: "CTR", unit: "%", value: null },
  { key: "position", label: "Avg. Position", unit: "위", value: null },
];

export const monthEntries: MonthEntry[] = [
  {
    month: "2026-06",
    title: "입사 · 현황 파악",
    items: ["6월 22일 입사", "사이트 구조·검색 현황 파악"],
    tags: ["Onboarding"],
  },
  {
    month: "2026-07",
    title: "블로그 자동화 프로그램 개발",
    items: ["블로그 자동화 프로그램 개발 (6월 22일 입사 ~ 7월)"],
    tags: ["Automation", "Blog"],
  },
  { month: "2026-08", title: "", items: [] },
  { month: "2026-09", title: "", items: [] },
  { month: "2026-10", title: "", items: [] },
  { month: "2026-11", title: "", items: [] },
];
