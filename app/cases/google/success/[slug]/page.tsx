"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AreaChart, Area, LineChart, Line,
  BarChart, Bar, Cell, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft, ExternalLink, RefreshCw, CheckCircle,
  Target, TrendingUp, Eye, MousePointer, CalendarDays, Hash,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { googleSuccessCases, googleFailureCases, type NaverData } from "@/data/cases";

type DayRow = { date: string; clicks: number; impressions: number; ctr: number; position: number };
type Keyword = { query: string; clicks: number; impressions: number; ctr: number; position: number };
type Summary = {
  totalClicks: number; totalImpressions: number; avgCtr: string; avgPosition: string;
  startDate: string; endDate: string; prevClicks: number; prevImpressions: number;
  firstSeen: string | null; top10Count: number; prevTop10Count: number;
};
type ApiData = { rows: DayRow[]; keywords: Keyword[]; summary: Summary; error?: string };

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
}
function pct(curr: number, prev: number) {
  if (!prev) return null;
  const v = Math.round(((curr - prev) / prev) * 100);
  return { v, up: v >= 0 };
}

// 전월 대비 배지
function Chg({ chg, invert = false }: { chg: { v: number; up: boolean } | null; invert?: boolean }) {
  if (!chg) return null;
  const good = invert ? !chg.up : chg.up; // 순위는 낮아지면(up=false) 좋음
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${good ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
      {chg.up ? "▲" : "▼"}{Math.abs(chg.v)}%
    </span>
  );
}

function PeriodCard({ period, firstSeen }: { period: string; firstSeen?: string | null }) {
  let startDate: Date;
  let startLabel: string;
  if (firstSeen) {
    startDate = new Date(firstSeen);
    startLabel = `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일`;
  } else {
    const match = period?.match(/(\d{4})\.(\d{2})(?:\.(\d{2}))?/);
    if (!match) return null;
    const y = parseInt(match[1]), m = parseInt(match[2]), d = match[3] ? parseInt(match[3]) : 1;
    startDate = new Date(y, m - 1, d);
    startLabel = match[3] ? `${y}년 ${m}월 ${d}일` : `${y}년 ${m}월`;
  }
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const diffMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
  const nowLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays size={13} className="text-indigo-400" />
        <span className="text-xs font-semibold text-white">운영 기간</span>
        <span className="ml-auto rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-bold text-indigo-400">
          {diffMonths}개월 운영 중
        </span>
      </div>
      <div className="mb-2.5 flex items-end justify-between text-xs">
        <div><div className="font-semibold text-white">{startLabel}</div><div className="mt-0.5 text-[10px] text-gray-600">배포일</div></div>
        <div className="text-right"><div className="font-semibold text-emerald-400">{nowLabel}</div><div className="mt-0.5 text-[10px] text-gray-600">오늘</div></div>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500" />
      </div>
      <p className="mt-2.5 text-center text-[11px] text-gray-600">
        <span className="font-semibold text-gray-400">{diffDays.toLocaleString()}일째</span> 운영 · SC 데이터 축적 중
      </p>
    </div>
  );
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1424]/98 px-4 py-3 shadow-2xl backdrop-blur-xl text-xs">
      <p className="mb-2 text-gray-500">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 py-0.5">
          <span className="h-1.5 w-3 rounded-full" style={{ background: p.color }} />
          <span className="w-16 text-gray-400">{p.name === "impressions" ? "노출수" : p.name === "clicks" ? "클릭수" : p.name === "position" ? "순위" : p.name}</span>
          <span className="ml-1 font-bold tabular-nums text-white">
            {p.name === "position" ? `#${p.value.toFixed(1)}` : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function CaseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const c = googleSuccessCases.find((x) => x.slug === slug);

  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState("");
  const [activeTab, setActiveTab] = useState<"google" | "naver" | "geo" | "claude" | "snippet">("google");
  const [geoIdx, setGeoIdx] = useState(0);
  const [claudeIdx, setClaudeIdx] = useState(0);
  const [snippetIdx, setSnippetIdx] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search-console?site=${slug}`);
      setData(await res.json());
      setUpdatedAt(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
    } catch {
      setData({ rows: [], keywords: [], summary: {} as Summary, error: "로드 실패" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (slug) fetchData(); }, [slug]);

  if (!c) return (
    <main className="flex min-h-screen items-center justify-center bg-[#080c14]">
      <div className="text-center">
        <p className="text-gray-500">케이스를 찾을 수 없습니다.</p>
        <Link href="/cases/google/success" className="mt-4 block text-sm text-indigo-400">목록으로</Link>
      </div>
    </main>
  );

  const rows = data?.rows ?? [];
  const keywords = data?.keywords ?? [];
  const s = data?.summary;
  const chartData = rows.map((r) => ({ ...r, date: fmtDate(r.date) }));
  const clickChg = s ? pct(s.totalClicks, s.prevClicks) : null;
  const imprChg = s ? pct(s.totalImpressions, s.prevImpressions) : null;
  const top10Chg = s ? pct(s.top10Count, s.prevTop10Count) : null;

  const kpis = [
    { label: "총 클릭수", value: (s?.totalClicks ?? 0).toLocaleString(), chg: clickChg, icon: MousePointer, color: "text-indigo-400", border: "border-indigo-500/20", bg: "bg-indigo-500/5" },
    { label: "총 노출수", value: (s?.totalImpressions ?? 0).toLocaleString(), chg: imprChg, icon: Eye, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
    { label: "평균 CTR", value: `${s?.avgCtr ?? "0"}%`, chg: null, icon: TrendingUp, color: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/5" },
    { label: "평균 순위", value: `#${s?.avgPosition ?? "0"}`, chg: null, icon: Target, color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
    { label: "1페이지 키워드", value: `${s?.top10Count ?? 0}개`, chg: top10Chg, icon: Hash, color: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/5" },
  ];

  const rankColor = (pos: number) => {
    const p = Math.round(pos);
    if (p <= 5)  return { bar: "bg-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (p <= 10) return { bar: "bg-indigo-500",  text: "text-indigo-400",  bg: "bg-indigo-500/10" };
    if (p <= 20) return { bar: "bg-amber-500",   text: "text-amber-400",   bg: "bg-amber-500/10" };
    return            { bar: "bg-gray-600",       text: "text-gray-500",    bg: "bg-white/5" };
  };

  const ALL_ORDER: { slug: string; type: "success" | "failure" }[] = [
    { slug: "carelec",    type: "success" },
    { slug: "carprotax",  type: "success" },
    { slug: "fundfinpro", type: "success" },
    { slug: "hospetpay",  type: "success" },
    { slug: "gwanse",     type: "success" },
    { slug: "newsioo",    type: "failure" },
    { slug: "carpaypro",  type: "failure" },
  ];
  type NavInfo = { slug: string; site: string; repKeyword?: string; title: string; href: string };
  const toNav = (e: { slug: string; type: "success" | "failure" }): NavInfo | null => {
    const found = e.type === "success"
      ? googleSuccessCases.find(x => x.slug === e.slug)
      : googleFailureCases.find(x => x.slug === e.slug);
    return found ? { slug: found.slug, site: found.site, repKeyword: found.repKeyword, title: found.title, href: `/cases/google/${e.type}/${found.slug}` } : null;
  };
  const allIdx = ALL_ORDER.findIndex(x => x.slug === slug);
  const prevNav = allIdx > 0 ? toNav(ALL_ORDER[allIdx - 1]) : null;
  const nextNav = allIdx < ALL_ORDER.length - 1 ? toNav(ALL_ORDER[allIdx + 1]) : null;

  const featured = c.featuredKeywords ?? [];
  const normalize = (s: string) => s.replace(/\s/g, "").toLowerCase();
  const pinnedKw = featured
    .map(f => keywords.find(k => normalize(k.query) === normalize(f)))
    .filter(Boolean) as typeof keywords;
  const pinnedQueries = new Set(pinnedKw.map(k => k.query));
  const restKw = keywords
    .filter(k => !pinnedQueries.has(k.query))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, Math.max(0, 30 - pinnedKw.length));
  const filteredKw = [...pinnedKw, ...restKw];

  return (
    <main className="relative min-h-screen bg-[#080c14]">

      {/* ── 플로팅 이전/다음 버튼 ── */}
      {prevNav && (
        <Link
          href={prevNav.href}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-30 group flex items-center gap-3 rounded-r-2xl border border-l-0 border-indigo-400/30 bg-gradient-to-r from-indigo-700 to-indigo-600 pl-3 pr-3 py-4 md:pl-4 md:pr-5 md:py-5 shadow-2xl shadow-indigo-900/70 backdrop-blur-sm transition-all duration-300 hover:from-indigo-600 hover:to-indigo-500 md:hover:pr-7 hover:shadow-indigo-500/50"
        >
          <ChevronLeft size={20} className="text-white shrink-0" />
          <div className="hidden md:flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200/60">이전 포트폴리오</span>
            <span className="text-sm font-extrabold text-white leading-tight">{prevNav.site}</span>
            {prevNav.repKeyword && (
              <span className="text-[11px] text-indigo-200/70 truncate max-w-[120px]">{prevNav.repKeyword}</span>
            )}
          </div>
        </Link>
      )}
      {nextNav && (
        <Link
          href={nextNav.href}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 group flex items-center gap-3 rounded-l-2xl border border-r-0 border-indigo-400/30 bg-gradient-to-l from-indigo-700 to-indigo-600 pr-3 pl-3 py-4 md:pr-4 md:pl-5 md:py-5 shadow-2xl shadow-indigo-900/70 backdrop-blur-sm transition-all duration-300 hover:from-indigo-600 hover:to-indigo-500 md:hover:pl-7 hover:shadow-indigo-500/50"
        >
          <div className="hidden md:flex flex-col gap-0.5 text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200/60">다음 포트폴리오</span>
            <span className="text-sm font-extrabold text-white leading-tight">{nextNav.site}</span>
            {nextNav.repKeyword && (
              <span className="text-[11px] text-indigo-200/70 truncate max-w-[120px]">{nextNav.repKeyword}</span>
            )}
          </div>
          <ChevronRight size={20} className="text-white shrink-0" />
        </Link>
      )}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/6 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-600/4 blur-[120px]" />
      </div>

      {/* 헤더 */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#080c14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-600">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors"><ArrowLeft size={12} /> 포트폴리오</Link>
            <span className="text-white/10">/</span>
            <span className="text-white font-medium">{c.site}</span>
          </nav>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              실시간{updatedAt && ` · ${updatedAt}`}
            </span>
            <button onClick={fetchData} disabled={loading}
              className="flex items-center gap-1 rounded-full border border-white/8 px-2.5 py-1 text-[11px] text-gray-500 hover:border-white/15 hover:text-white transition-all disabled:opacity-40">
              <RefreshCw size={10} className={loading ? "animate-spin" : ""} /> 새로고침
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-4xl space-y-5 px-6 py-8">

        {/* 케이스 배너 */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-950/40 to-[#080c14] p-6">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="absolute left-0 top-0 h-full w-0.5 bg-emerald-500" />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">🟢 구글 SEO · 성공</span>
                {c.category && <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-gray-500">{c.category}</span>}
              </div>
              <h1 className="text-2xl font-extrabold text-white">{c.title}</h1>
              <p className="mt-1 text-sm text-gray-400">{c.summary}</p>
            </div>
            <a href={c.siteUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-indigo-400 hover:border-indigo-500/30 hover:text-indigo-300 transition-all">
              {c.site} <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* ── 탭 ── */}
        {(() => {
          const claudeShots = (c.geoScreenshots ?? []).filter(s => s.tool === "Claude");
          const snippets = c.snippets ?? [];
          const tabs = [
            { id: "google",  icon: "/구글.png",         label: "Google",  desc: "검색엔진",   filter: "",                    active: "bg-white/10 text-white",          descActive: "text-gray-400" },
            { id: "naver",   icon: "/naver_icon.png",   label: "Naver",   desc: "네이버",     filter: "",                    active: "bg-white/10 text-white",          descActive: "text-gray-400" },
            { id: "geo",     icon: "/chatgpt.png",      label: "ChatGPT", desc: "생성형 AI",  filter: "brightness-0 invert", active: "bg-white/10 text-white",          descActive: "text-gray-400" },
            ...(claudeShots.length > 0 ? [
              { id: "claude", icon: "/claude_icon.svg", label: "Claude",  desc: "생성형 AI",  filter: "",                    active: "bg-orange-500/15 text-orange-300", descActive: "text-orange-400/70" },
            ] : []),
            ...(snippets.length > 0 ? [
              { id: "snippet", icon: "/구글.png",       label: "스니펫",  desc: "검색노출",   filter: "",                    active: "bg-emerald-500/15 text-emerald-300", descActive: "text-emerald-400/70" },
            ] : []),
          ];
          return (
            <div className="flex gap-1.5 rounded-2xl border border-white/8 bg-white/[0.02] p-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex flex-col items-center gap-1 rounded-xl py-3 px-2 transition-all duration-200 ${
                    activeTab === tab.id ? tab.active + " shadow-sm" : "text-gray-600 hover:text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {tab.id === "snippet" ? (
                    <span className={`text-base leading-none ${activeTab === tab.id ? "opacity-100" : "opacity-30"}`}>✦</span>
                  ) : (
                    <img src={tab.icon} alt={tab.label} className={`h-5 w-5 object-contain transition-opacity duration-200 ${tab.filter} ${activeTab === tab.id ? "opacity-100" : "opacity-40"}`} />
                  )}
                  <span className="text-[11px] font-bold tracking-wide">{tab.label}</span>
                  <span className={`text-[10px] font-medium ${activeTab === tab.id ? tab.descActive : "text-gray-700"}`}>{tab.desc}</span>
                </button>
              ))}
            </div>
          );
        })()}

        {/* ── Naver 탭 ── */}
        {activeTab === "naver" && (() => {
          const nd: NaverData | undefined = c.naverData;
          if (!nd) return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] py-24">
              <span className="text-3xl">🚧</span>
              <p className="text-sm font-bold text-white">네이버 데이터 미등록</p>
              <p className="text-xs text-gray-600">cases.ts의 naverData 필드에 값을 입력하면 표시됩니다.</p>
            </div>
          );
          const NAVER_COLORS = ["#10b981", "#6366f1", "#8b5cf6"];
          const naverKpiItems = [
            { label: "총 클릭수", display: nd.clicks.toLocaleString(),                      pct: 100 },
            { label: "총 노출수", display: nd.impressions.toLocaleString(),                 pct: 100 },
            { label: "평균 CTR",  display: nd.avgCtr != null ? `${nd.avgCtr}%` : "-",       pct: Math.min((nd.avgCtr ?? 0) / 10 * 100, 100) },
          ];
          return (
            <div className="space-y-5">
              {nd.period && <p className="text-[11px] text-gray-600 text-right">{nd.period}</p>}
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <p className="text-sm font-bold text-white mb-1">네이버 지표 요약</p>
                <p className="text-[11px] text-gray-600 mb-4">실제 수치 레이블 · 상대적 달성도 비교</p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={naverKpiItems} margin={{ top: 40, right: 16, left: 16, bottom: 8 }} barSize={64}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }} tickLine={false} axisLine={false} />
                    <YAxis hide domain={[0, 115]} />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload as (typeof naverKpiItems)[0];
                        return (
                          <div className="rounded-xl border border-white/10 bg-[#0d1424]/98 px-4 py-2.5 text-sm shadow-xl">
                            <p className="font-semibold text-white">{d.label}</p>
                            <p className="text-base font-bold text-gray-200">{d.display}</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="pct" radius={[8, 8, 0, 0]}>
                      {naverKpiItems.map((_, i) => <Cell key={i} fill={NAVER_COLORS[i]} fillOpacity={0.9} />)}
                      <LabelList dataKey="display" position="top" style={{ fill: "#f9fafb", fontSize: 14, fontWeight: 700 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {nd.history && nd.history.length > 0 && (
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">클릭수 · 노출수 추이</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">네이버 서치어드바이저 데이터</p>
                    </div>
                    <div className="flex gap-3 text-[11px] text-gray-600">
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-indigo-500" />노출수</span>
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-emerald-500" />클릭수</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={nd.history} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="nc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                      <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
                      <Tooltip content={<ChartTip />} />
                      <Area type="monotone" dataKey="impressions" stroke="#6366f1" strokeWidth={1.5} fill="none" dot={false} />
                      <Area type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} fill="url(#nc)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              {nd.keywords && nd.keywords.length > 0 && (() => {
                const kwChartData = nd.keywords!.map(kw => ({
                  name: kw.keyword.length > 9 ? kw.keyword.slice(0, 9) + "…" : kw.keyword,
                  fullName: kw.keyword,
                  clicks: kw.clicks,
                  impressions: kw.impressions,
                  position: kw.position,
                  ctr: kw.impressions > 0 ? +((kw.clicks / kw.impressions) * 100).toFixed(1) : 0,
                }));
                const maxImpr = Math.max(...nd.keywords!.map(k => k.impressions));
                return (
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-5">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">키워드별 노출 · 클릭</p>
                          <p className="text-[11px] text-gray-600 mt-0.5">네이버 서치어드바이저 TOP 키워드</p>
                        </div>
                        <div className="flex gap-3 text-[11px] text-gray-600">
                          <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-indigo-500" />노출수</span>
                          <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-emerald-500" />클릭수</span>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={kwChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={2}>
                          <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
                          <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 9 }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = kwChartData.find(x => x.name === payload[0].payload.name);
                              return (
                                <div className="rounded-xl border border-white/10 bg-[#0d1424]/98 px-4 py-3 shadow-2xl text-xs">
                                  <p className="mb-2 font-bold text-white">{d?.fullName}</p>
                                  <p className="text-indigo-400">노출 {d?.impressions.toLocaleString()}</p>
                                  <p className="text-emerald-400">클릭 {d?.clicks}</p>
                                  <p className="text-violet-400">CTR {d?.ctr}%</p>
                                  <p className="text-amber-400">#{d?.position}위</p>
                                </div>
                              );
                            }}
                          />
                          <Bar dataKey="impressions" fill="#6366f1" fillOpacity={0.7} radius={[3,3,0,0]} maxBarSize={32} />
                          <Bar dataKey="clicks"      fill="#10b981" fillOpacity={0.9} radius={[3,3,0,0]} maxBarSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {nd.keywords!.map(kw => {
                        const p = kw.position;
                        const color = p <= 3 ? "bg-emerald-500" : p <= 10 ? "bg-indigo-500" : "bg-amber-500";
                        const barW = Math.max(4, Math.round((kw.impressions / maxImpr) * 100));
                        return (
                          <div key={kw.keyword}>
                            <div className="mb-1 flex items-center justify-between gap-3">
                              <span className="truncate text-xs font-medium text-gray-200">{kw.keyword}</span>
                              <div className="flex shrink-0 items-center gap-2">
                                <span className="text-[11px] tabular-nums text-gray-600">{kw.impressions.toLocaleString()} 노출</span>
                                <span className="text-[11px] tabular-nums text-gray-600">{kw.clicks} 클릭</span>
                              </div>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                              <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${barW}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* ── GEO 탭 (ChatGPT) ── */}
        {activeTab === "geo" && (() => {
          const shots = (c.geoScreenshots ?? []).filter(s => s.tool !== "Claude");
          if (shots.length === 0) return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] py-24">
              <span className="text-3xl">🤖</span>
              <p className="text-sm font-bold text-white">GEO 캡처 미등록</p>
              <p className="text-xs text-gray-600">cases.ts의 geoScreenshots 필드에 이미지 경로를 추가하면 표시됩니다.</p>
            </div>
          );
          const cur = shots[geoIdx];
          return (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <p className="text-sm font-bold text-white mb-1">ChatGPT · 생성형 엔진 최적화</p>
              <p className="text-[11px] text-gray-600 mb-4">ChatGPT 답변 안에 이 사이트가 직접 언급된 캡처 모음</p>

              {/* 설명 카드 */}
              <div key={`desc-${geoIdx}`} className="animate-geo-fade mb-4 flex items-start gap-3 rounded-xl border border-indigo-500/15 bg-indigo-500/[0.05] px-4 py-3">
                <span className={`shrink-0 rounded-lg border px-2.5 py-0.5 text-[11px] font-bold flex items-center gap-1 ${
                  cur.tool === "Claude"
                    ? "border-orange-400/40 bg-gradient-to-r from-orange-500/20 to-amber-500/15 text-orange-300"
                    : "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                }`}>
                  {cur.tool === "Claude" && <span>✦</span>}
                  {cur.tool}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium leading-relaxed text-gray-200">"{cur.prompt}"</p>
                  {cur.date && <p className="mt-1 text-[10px] text-gray-600">{cur.date}</p>}
                </div>
                <span className="shrink-0 tabular-nums text-[11px] text-gray-700">{geoIdx + 1}/{shots.length}</span>
              </div>

              {/* 이미지 + 사이드 버튼 */}
              <div className="relative overflow-hidden rounded-xl border border-white/5">
                <div key={geoIdx} className="animate-geo-fade">
                  <img src={cur.image} alt={`${cur.tool} - ${cur.prompt}`} className="w-full object-contain bg-white/[0.01]" />
                </div>
                {shots.length > 1 && (
                  <>
                    <button
                      onClick={() => setGeoIdx(i => Math.max(0, i - 1))}
                      disabled={geoIdx === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-0"
                    ><ChevronLeft size={16} /></button>
                    <button
                      onClick={() => setGeoIdx(i => Math.min(shots.length - 1, i + 1))}
                      disabled={geoIdx === shots.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-0"
                    ><ChevronRight size={16} /></button>
                  </>
                )}
              </div>

              {/* 도트 */}
              {shots.length > 1 && (
                <div className="mt-3 flex justify-center gap-1.5">
                  {shots.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setGeoIdx(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === geoIdx ? "w-5 bg-indigo-400" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── Claude 탭 ── */}
        {activeTab === "claude" && (() => {
          const shots = (c.geoScreenshots ?? []).filter(s => s.tool === "Claude");
          if (shots.length === 0) return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-orange-500/15 bg-orange-500/[0.03] py-24">
              <img src="/claude_icon.svg" alt="Claude" className="h-10 w-10 opacity-40" />
              <p className="text-sm font-bold text-white">Claude 캡처 미등록</p>
              <p className="text-xs text-gray-600">cases.ts의 geoScreenshots에 tool: "Claude" 항목을 추가하면 표시됩니다.</p>
            </div>
          );
          const cur = shots[claudeIdx];
          return (
            <div className="rounded-2xl border border-orange-500/15 bg-orange-500/[0.03] p-5">
              <div className="flex items-center gap-2 mb-1">
                <img src="/claude_icon.svg" alt="Claude" className="h-4 w-4" />
                <p className="text-sm font-bold text-white">Claude · 생성형 엔진 최적화</p>
              </div>
              <p className="text-[11px] text-gray-600 mb-4">Claude 답변 안에 이 사이트가 직접 언급된 캡처 모음</p>

              <div key={`claude-desc-${claudeIdx}`} className="animate-geo-fade mb-4 flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/[0.07] px-4 py-3">
                <span className="shrink-0 rounded-lg border border-orange-400/40 bg-gradient-to-r from-orange-500/20 to-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-orange-300 flex items-center gap-1">
                  ✦ Claude
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium leading-relaxed text-gray-200">"{cur.prompt}"</p>
                  {cur.date && <p className="mt-1 text-[10px] text-gray-600">{cur.date}</p>}
                </div>
                <span className="shrink-0 tabular-nums text-[11px] text-gray-700">{claudeIdx + 1}/{shots.length}</span>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-orange-500/10">
                <div key={claudeIdx} className="animate-geo-fade">
                  <img src={cur.image} alt={cur.prompt} className="w-full object-contain bg-white/[0.01]" />
                </div>
                {shots.length > 1 && (
                  <>
                    <button onClick={() => setClaudeIdx(i => Math.max(0, i - 1))} disabled={claudeIdx === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-0">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => setClaudeIdx(i => Math.min(shots.length - 1, i + 1))} disabled={claudeIdx === shots.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-0">
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>
              {shots.length > 1 && (
                <div className="mt-3 flex justify-center gap-1.5">
                  {shots.map((_, i) => (
                    <button key={i} onClick={() => setClaudeIdx(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === claudeIdx ? "w-5 bg-orange-400" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── 스니펫 탭 ── */}
        {activeTab === "snippet" && (() => {
          const shots = c.snippets ?? [];
          const LABEL: Record<string, { ko: string; color: string; bg: string; border: string }> = {
            google_top:   { ko: "구글 상단노출",  color: "text-blue-300",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
            google_paa:   { ko: "구글 관련질문",  color: "text-violet-300",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
            google_image: { ko: "구글 이미지",    color: "text-sky-300",     bg: "bg-sky-500/10",     border: "border-sky-500/20" },
            naver_top:    { ko: "네이버 1위",     color: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            naver_view:   { ko: "네이버 VIEW",    color: "text-green-300",   bg: "bg-green-500/10",   border: "border-green-500/20" },
          };
          if (shots.length === 0) return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03] py-24">
              <span className="text-3xl">✦</span>
              <p className="text-sm font-bold text-white">스니펫 캡처 미등록</p>
              <p className="text-xs text-gray-600">cases.ts의 snippets 필드에 이미지 경로를 추가하면 표시됩니다.</p>
            </div>
          );
          const cur = shots[snippetIdx];
          const meta = LABEL[cur.type] ?? { ko: cur.type, color: "text-gray-300", bg: "bg-white/5", border: "border-white/10" };
          return (
            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03] p-5">
              <p className="text-sm font-bold text-white mb-1">검색 스니펫 · 노출 증거</p>
              <p className="text-[11px] text-gray-600 mb-4">구글·네이버 검색 결과에 직접 노출된 캡처 모음</p>

              {/* 스니펫 종류 선택 바 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {shots.map((s, i) => {
                  const m = LABEL[s.type] ?? { ko: s.type, color: "text-gray-300", bg: "bg-white/5", border: "border-white/10" };
                  return (
                    <button
                      key={i}
                      onClick={() => setSnippetIdx(i)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold transition-all ${
                        snippetIdx === i ? `${m.bg} ${m.border} ${m.color}` : "border-white/8 bg-white/[0.02] text-gray-600 hover:text-gray-400"
                      }`}
                    >
                      <span>{s.engine === "google" ? "🔵" : "🟢"}</span>
                      {m.ko}
                    </button>
                  );
                })}
              </div>

              {/* 현재 스니펫 설명 */}
              <div className={`mb-4 flex items-center gap-3 rounded-xl border ${meta.border} ${meta.bg} px-4 py-3`}>
                <span className={`shrink-0 rounded-lg border ${meta.border} px-2.5 py-0.5 text-[11px] font-bold ${meta.color}`}>
                  {meta.ko}
                </span>
                <p className={`text-xs font-semibold ${meta.color}`}>"{cur.keyword}"</p>
                {cur.date && <p className="ml-auto text-[10px] text-gray-600 shrink-0">{cur.date}</p>}
              </div>

              {/* 이미지 */}
              <div className="relative overflow-hidden rounded-xl border border-emerald-500/10">
                <div key={snippetIdx} className="animate-geo-fade">
                  <img src={cur.image} alt={cur.keyword} className="w-full object-contain bg-white/[0.01]" />
                </div>
                {shots.length > 1 && (
                  <>
                    <button onClick={() => setSnippetIdx(i => Math.max(0, i - 1))} disabled={snippetIdx === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-0">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => setSnippetIdx(i => Math.min(shots.length - 1, i + 1))} disabled={snippetIdx === shots.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-0">
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {activeTab === "google" && (
        <div className="space-y-5">

        {/* ── KPI 대시보드 ── */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Search Console 핵심 지표</h2>
            {s?.startDate && (
              <span className="text-[11px] text-gray-600">{s.startDate} ~ {s.endDate} · 90일</span>
            )}
          </div>

          {!loading && data?.error && (
            <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">{data.error}</div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse rounded-2xl bg-white/5 h-28" />)
              : kpis.map((item) => (
                <div key={item.label} className={`relative overflow-hidden rounded-2xl border ${item.border} ${item.bg} p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-gray-500">{item.label}</span>
                    <item.icon size={12} className={item.color} />
                  </div>
                  <div className={`text-2xl font-extrabold tabular-nums ${item.color}`}>{item.value}</div>
                  <div className="mt-1.5 flex items-center gap-1">
                    <Chg chg={item.chg} invert={item.label === "평균 순위"} />
                    {item.chg && <span className="text-[10px] text-gray-700">전분기 대비</span>}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* ── 5대 지표 바 차트 ── */}
        {!loading && s && (() => {
          const COLORS = ["#6366f1", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4"];
          const items = [
            { label: "총 클릭수",      display: s.totalClicks.toLocaleString(),     pct: 100 },
            { label: "총 노출수",      display: s.totalImpressions.toLocaleString(), pct: 100 },
            { label: "평균 CTR",       display: `${s.avgCtr}%`,                      pct: Math.min(parseFloat(s.avgCtr) / 5 * 100, 100) },
            { label: "평균 순위",      display: `#${s.avgPosition}`,                 pct: Math.max(0, (20 - parseFloat(s.avgPosition)) / 20 * 100) },
            { label: "1페이지 키워드", display: `${s.top10Count}개`,                 pct: Math.min(s.top10Count / 50 * 100, 100) },
          ];
          return (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <p className="text-sm font-bold text-white mb-1">5대 지표 요약</p>
              <p className="text-[11px] text-gray-600 mb-4">실제 수치 레이블 · 상대적 달성도 비교</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={items} margin={{ top: 44, right: 16, left: 16, bottom: 8 }} barSize={72}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }} tickLine={false} axisLine={false} />
                  <YAxis hide domain={[0, 115]} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload as (typeof items)[0];
                      return (
                        <div className="rounded-xl border border-white/10 bg-[#0d1424]/98 px-4 py-2.5 text-sm shadow-xl">
                          <p className="font-semibold text-white">{d.label}</p>
                          <p className="text-base font-bold text-gray-200">{d.display}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="pct" radius={[8, 8, 0, 0]}>
                    {items.map((_, i) => <Cell key={i} fill={COLORS[i]} fillOpacity={0.9} />)}
                    <LabelList dataKey="display" position="top" style={{ fill: "#f9fafb", fontSize: 14, fontWeight: 700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })()}

        {/* ── 그래프 2개 위아래 ── */}
        {!loading && chartData.length > 0 && (
          <div className="space-y-3">
            {/* 위: 노출수 + 클릭수 */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">노출수 · 클릭수 추이</p>
                  <p className="text-[11px] text-gray-600 mt-0.5">Google 검색 결과 노출 및 클릭 (90일)</p>
                </div>
                <div className="flex gap-3 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-emerald-500" />노출수</span>
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-indigo-500" />클릭수</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`gc-${slug}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id={`gi-${slug}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis yAxisId="l" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
                  <Tooltip content={<ChartTip />} />
                  <Area yAxisId="r" type="monotone" dataKey="impressions" stroke="#10b981" strokeWidth={1.5} fill={`url(#gi-${slug})`} dot={false} activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} />
                  <Area yAxisId="l" type="monotone" dataKey="clicks"      stroke="#6366f1" strokeWidth={2}   fill={`url(#gc-${slug})`} dot={false} activeDot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 아래: 평균 순위 추이 */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">평균 게재순위 추이</p>
                  <p className="text-[11px] text-gray-600 mt-0.5">낮을수록 상위 노출 (90일)</p>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
                  <span className="h-1.5 w-3 rounded-full bg-amber-500" />순위
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis reversed tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} width={36}
                    tickFormatter={(v) => `#${v}`} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="position" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="mt-1 text-center text-[10px] text-gray-700">↑ 위로 갈수록 상위 노출</p>
            </div>
          </div>
        )}

        {/* ── 경쟁 키워드 순위 ── */}
        {!loading && filteredKw.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">경쟁 키워드 순위</p>
                <p className="text-[11px] text-gray-600 mt-0.5">노출 많은 순 · 상위 30개</p>
              </div>
              <div className="flex gap-3 text-[10px] text-gray-700">
                <span className="flex items-center gap-1"><span className="h-1.5 w-2 rounded-full bg-emerald-500" />1~5위</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-2 rounded-full bg-indigo-500" />6~10위</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-2 rounded-full bg-amber-500" />11~20위</span>
              </div>
            </div>
            <div className="space-y-4">
              {filteredKw.map((kw) => {
                const rc = rankColor(kw.position);
                const w = Math.max(6, Math.round((30 / kw.position) * 100));
                return (
                  <div key={kw.query}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="truncate text-xs font-medium text-gray-200">{kw.query}</span>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[11px] tabular-nums text-gray-600">{kw.impressions.toLocaleString()} 노출</span>
                        <span className="text-[11px] tabular-nums text-gray-600">{(kw.ctr * 100).toFixed(1)}% CTR</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${rc.bg} ${rc.text}`}>#{Math.floor(kw.position)}위</span>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <div className={`h-full rounded-full ${rc.bar} transition-all duration-700`} style={{ width: `${w}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 운영 기간 ── */}
        {(c.period !== "준비 중" || s?.firstSeen) && (
          <PeriodCard period={c.period} firstSeen={s?.firstSeen} />
        )}

        {/* ── 목표 & 전략 ── */}
        {(c.goal || c.strategy.length > 0) && (
          <div className="grid gap-4 md:grid-cols-2">
            {c.goal && (
              <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
                <h2 className="mb-3 flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wide">
                  <Target size={12} className="text-indigo-400" /> 초기 목표
                </h2>
                <p className="text-sm leading-relaxed text-gray-400">{c.goal}</p>
              </div>
            )}
            {c.strategy.length > 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
                <h2 className="mb-3 flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wide">
                  <TrendingUp size={12} className="text-indigo-400" /> 실행 전략
                </h2>
                <ul className="space-y-2">
                  {c.strategy.map((str) => (
                    <li key={str} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle size={12} className="mt-0.5 shrink-0 text-emerald-500" />{str}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ── 타임라인 ── */}
        {c.timeline.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
            <h2 className="mb-5 text-xs font-bold uppercase tracking-wide text-white">실행 타임라인</h2>
            <div>
              {c.timeline.map((t, i) => (
                <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < c.timeline.length - 1 && <div className="absolute left-[14px] top-7 h-full w-px bg-white/5" />}
                  <div className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[11px] font-bold text-indigo-400">{i + 1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-gray-600">{t.date}</span>
                      <span className="text-sm font-semibold text-white">{t.title}</span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 인사이트 ── */}
        {c.insight && (
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.03] p-5">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-white">💡 핵심 인사이트</h2>
            <p className="text-sm leading-relaxed text-gray-400">{c.insight}</p>
          </div>
        )}

        </div>
        )}

        {/* ── 이전 / 다음 포트폴리오 ── */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {prevNav ? (
            <Link
              href={prevNav.href}
              className="group flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/[0.03] p-5 hover:border-indigo-500/40 hover:bg-white/[0.06] transition-all duration-300"
            >
              <div className="flex items-center gap-1.5 text-[11px] text-gray-600 group-hover:text-indigo-400 transition-colors">
                <ChevronLeft size={13} /> 이전 포트폴리오
              </div>
              <p className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors truncate">{prevNav.site}</p>
              <p className="text-[11px] text-gray-600 truncate">{prevNav.repKeyword ?? prevNav.title}</p>
            </Link>
          ) : (
            <div />
          )}
          {nextNav ? (
            <Link
              href={nextNav.href}
              className="group flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-right hover:border-indigo-500/40 hover:bg-white/[0.06] transition-all duration-300"
            >
              <div className="flex items-center justify-end gap-1.5 text-[11px] text-gray-600 group-hover:text-indigo-400 transition-colors">
                다음 포트폴리오 <ChevronRight size={13} />
              </div>
              <p className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors truncate">{nextNav.site}</p>
              <p className="text-[11px] text-gray-600 truncate">{nextNav.repKeyword ?? nextNav.title}</p>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  );
}
