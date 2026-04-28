"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AreaChart, Area, LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft, ExternalLink, RefreshCw,
  Target, TrendingUp, TrendingDown, Eye, MousePointer, CalendarDays, Hash,
} from "lucide-react";
import { googleFailureCases, type NaverData } from "@/data/cases";

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

function Chg({ chg, invert = false }: { chg: { v: number; up: boolean } | null; invert?: boolean }) {
  if (!chg) return null;
  const good = invert ? !chg.up : chg.up;
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
        <CalendarDays size={13} className="text-red-400" />
        <span className="text-xs font-semibold text-white">운영 기간</span>
        <span className="ml-auto rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-[11px] font-bold text-red-400">{diffMonths}개월 경과</span>
      </div>
      <div className="mb-2.5 flex items-end justify-between text-xs">
        <div><div className="font-semibold text-white">{startLabel}</div><div className="mt-0.5 text-[10px] text-gray-600">배포일</div></div>
        <div className="text-right"><div className="font-semibold text-red-400">{nowLabel}</div><div className="mt-0.5 text-[10px] text-gray-600">오늘</div></div>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-red-500 via-rose-500 to-red-400" />
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

export default function FailureCaseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const c = googleFailureCases.find((x) => x.slug === slug);

  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState("");
  const [activeTab, setActiveTab] = useState<"google" | "naver" | "geo">("google");

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
        <Link href="/cases/google/failure" className="mt-4 block text-sm text-red-400">목록으로</Link>
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
    { label: "총 클릭수",      value: (s?.totalClicks ?? 0).toLocaleString(),      chg: clickChg,  icon: MousePointer, color: "text-indigo-400", border: "border-indigo-500/20", bg: "bg-indigo-500/5" },
    { label: "총 노출수",      value: (s?.totalImpressions ?? 0).toLocaleString(), chg: imprChg,   icon: Eye,          color: "text-red-400",    border: "border-red-500/20",    bg: "bg-red-500/5" },
    { label: "평균 CTR",       value: `${s?.avgCtr ?? "0"}%`,                      chg: null,       icon: TrendingUp,   color: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/5" },
    { label: "평균 순위",      value: `#${s?.avgPosition ?? "0"}`,                 chg: null,       icon: Target,       color: "text-amber-400",  border: "border-amber-500/20",  bg: "bg-amber-500/5" },
    { label: "1페이지 키워드", value: `${s?.top10Count ?? 0}개`,                   chg: top10Chg,  icon: Hash,         color: "text-cyan-400",   border: "border-cyan-500/20",   bg: "bg-cyan-500/5" },
  ];

  const rankColor = (pos: number) => {
    const p = Math.round(pos);
    if (p <= 5)  return { bar: "bg-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (p <= 10) return { bar: "bg-indigo-500",  text: "text-indigo-400",  bg: "bg-indigo-500/10" };
    if (p <= 20) return { bar: "bg-amber-500",   text: "text-amber-400",   bg: "bg-amber-500/10" };
    return            { bar: "bg-gray-600",       text: "text-gray-500",    bg: "bg-white/5" };
  };

  const filteredKw = keywords
    .filter((kw) => kw.position > 3)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 6);

  return (
    <main className="relative min-h-screen bg-[#080c14]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/3 h-[500px] w-[500px] rounded-full bg-red-600/6 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-rose-600/4 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#080c14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-600">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors"><ArrowLeft size={12} /> 포트폴리오</Link>
            <span className="text-white/10">/</span>
            <Link href="/cases/google/failure" className="hover:text-gray-300 transition-colors">구글 실패</Link>
            <span className="text-white/10">/</span>
            <span className="text-white font-medium">{c.site}</span>
          </nav>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
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

        {/* 배너 */}
        <div className="relative overflow-hidden rounded-2xl border border-red-500/15 bg-gradient-to-br from-red-950/40 to-[#080c14] p-6">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          <div className="absolute left-0 top-0 h-full w-0.5 bg-red-500" />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-0.5 text-[11px] font-bold text-red-400">🔴 구글 SEO · 실패</span>
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

        {/* 탭 */}
        <div className="flex gap-1.5 rounded-2xl border border-white/8 bg-white/[0.02] p-1.5">
          {(["google", "naver", "geo"] as const).map((tab) => {
            const labels = { google: "🔵 Google", naver: "🟢 Naver", geo: "🤖 GEO" };
            const descs  = { google: "검색엔진",   naver: "네이버",   geo: "생성형 AI" };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex flex-col items-center gap-0.5 rounded-xl py-3.5 px-4 transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-400 hover:bg-white/5"
                }`}
              >
                <span className="text-sm font-black tracking-wide">{labels[tab]}</span>
                <span className={`text-[10px] font-medium ${activeTab === tab ? "text-gray-400" : "text-gray-700"}`}>{descs[tab]}</span>
              </button>
            );
          })}
        </div>

        {/* Naver 탭 */}
        {activeTab === "naver" && (() => {
          const nd: NaverData | undefined = c.naverData;
          if (!nd) return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] py-24">
              <span className="text-3xl">🚧</span>
              <p className="text-sm font-bold text-white">네이버 데이터 미등록</p>
              <p className="text-xs text-gray-600">cases.ts의 naverData 필드에 값을 입력하면 표시됩니다.</p>
            </div>
          );
          const naverKpis = [
            { label: "총 클릭수", value: nd.clicks.toLocaleString(),      color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5", icon: MousePointer },
            { label: "총 노출수", value: nd.impressions.toLocaleString(), color: "text-indigo-400",  border: "border-indigo-500/20",  bg: "bg-indigo-500/5",  icon: Eye },
            { label: "평균 순위", value: `#${nd.avgPosition}`,            color: "text-amber-400",   border: "border-amber-500/20",   bg: "bg-amber-500/5",   icon: Target },
          ];
          return (
            <div className="space-y-5">
              {nd.period && <p className="text-[11px] text-gray-600 text-right">{nd.period}</p>}
              <div className="grid grid-cols-3 gap-3">
                {naverKpis.map(item => (
                  <div key={item.label} className={`rounded-2xl border ${item.border} ${item.bg} p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-gray-500">{item.label}</span>
                      <item.icon size={12} className={item.color} />
                    </div>
                    <div className={`text-2xl font-extrabold tabular-nums ${item.color}`}>{item.value}</div>
                  </div>
                ))}
              </div>
              {nd.history && nd.history.length > 0 && (
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <p className="text-sm font-bold text-white mb-1">클릭수 · 노출수 추이</p>
                  <p className="text-[11px] text-gray-600 mb-4">네이버 서치어드바이저 데이터</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={nd.history} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="nc-f" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                      <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
                      <Tooltip content={<ChartTip />} />
                      <Area type="monotone" dataKey="impressions" stroke="#6366f1" strokeWidth={1.5} fill="none" dot={false} />
                      <Area type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} fill="url(#nc-f)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              {nd.keywords && nd.keywords.length > 0 && (
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <p className="text-sm font-bold text-white mb-1">키워드 순위</p>
                  <p className="text-[11px] text-gray-600 mb-4">네이버 검색 상위 키워드</p>
                  <div className="space-y-3">
                    {nd.keywords.map(kw => {
                      const p = kw.position;
                      const color = p <= 3 ? "bg-emerald-500" : p <= 10 ? "bg-indigo-500" : "bg-amber-500";
                      const textColor = p <= 3 ? "text-emerald-400" : p <= 10 ? "text-indigo-400" : "text-amber-400";
                      const barW = Math.max(6, Math.round((30 / p) * 100));
                      return (
                        <div key={kw.keyword}>
                          <div className="mb-1 flex items-center justify-between gap-3">
                            <span className="truncate text-xs font-medium text-gray-200">{kw.keyword}</span>
                            <div className="flex shrink-0 items-center gap-2">
                              <span className="text-[11px] tabular-nums text-gray-600">{kw.impressions.toLocaleString()} 노출</span>
                              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold bg-white/5 ${textColor}`}>#{p}위</span>
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
              )}
            </div>
          );
        })()}

        {/* GEO 탭 */}
        {activeTab === "geo" && (() => {
          const shots = c.geoScreenshots;
          if (!shots || shots.length === 0) return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] py-24">
              <span className="text-3xl">🤖</span>
              <p className="text-sm font-bold text-white">GEO 캡처 미등록</p>
              <p className="text-xs text-gray-600">cases.ts의 geoScreenshots 필드에 이미지 경로를 추가하면 표시됩니다.</p>
            </div>
          );
          return (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <p className="text-sm font-bold text-white mb-1">GEO · 생성형 엔진 최적화</p>
              <p className="text-[11px] text-gray-600 mb-5">AI 답변 안에 이 사이트 정보가 포함된 캡처</p>
              <div className="space-y-6">
                {shots.map((shot, i) => (
                  <div key={i} className="rounded-xl border border-white/5 overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border-b border-white/5">
                      <span className="text-xs font-black text-white">{shot.tool}</span>
                      <span className="text-white/20">·</span>
                      <span className="text-xs text-gray-500 flex-1 truncate">"{shot.prompt}"</span>
                      {shot.date && <span className="text-[10px] text-gray-700 shrink-0">{shot.date}</span>}
                    </div>
                    <img src={shot.image} alt={`${shot.tool} - ${shot.prompt}`} className="w-full object-contain bg-white/[0.01]" />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Google 탭 */}
        {activeTab === "google" && (
        <div className="space-y-5">

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Search Console 핵심 지표</h2>
            {s?.startDate && <span className="text-[11px] text-gray-600">{s.startDate} ~ {s.endDate} · 90일</span>}
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

        {!loading && chartData.length > 0 && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">노출수 · 클릭수 추이</p>
                  <p className="text-[11px] text-gray-600 mt-0.5">Google 검색 결과 노출 및 클릭 (90일)</p>
                </div>
                <div className="flex gap-3 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-red-500" />노출수</span>
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-indigo-500" />클릭수</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`fc-${slug}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id={`fi-${slug}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis yAxisId="l" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
                  <Tooltip content={<ChartTip />} />
                  <Area yAxisId="r" type="monotone" dataKey="impressions" stroke="#ef4444" strokeWidth={1.5} fill={`url(#fi-${slug})`} dot={false} activeDot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} />
                  <Area yAxisId="l" type="monotone" dataKey="clicks"      stroke="#6366f1" strokeWidth={2}   fill={`url(#fc-${slug})`} dot={false} activeDot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

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
                  <YAxis reversed tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} axisLine={false} width={36} tickFormatter={(v) => `#${v}`} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="position" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="mt-1 text-center text-[10px] text-gray-700">↑ 위로 갈수록 상위 노출</p>
            </div>
          </div>
        )}

        {!loading && filteredKw.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">경쟁 키워드 순위</p>
                <p className="text-[11px] text-gray-600 mt-0.5">노출 많은 순 · 4위 이하 상위 6개</p>
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
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${rc.bg} ${rc.text}`}>#{Math.round(kw.position)}위</span>
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

        {(c.period !== "준비 중" || s?.firstSeen) && (
          <PeriodCard period={c.period} firstSeen={s?.firstSeen} />
        )}

        {(c.goal || c.strategy.length > 0) && (
          <div className="grid gap-4 md:grid-cols-2">
            {c.goal && (
              <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
                <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white">
                  <Target size={12} className="text-red-400" /> 실패 원인
                </h2>
                <p className="text-sm leading-relaxed text-gray-400">{c.goal}</p>
              </div>
            )}
            {c.strategy.length > 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
                <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white">
                  <TrendingDown size={12} className="text-red-400" /> 시도한 것들
                </h2>
                <ul className="space-y-2">
                  {c.strategy.map((str) => (
                    <li key={str} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="mt-0.5 shrink-0 text-red-500 text-xs">✕</span>{str}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {c.timeline.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
            <h2 className="mb-5 text-xs font-bold uppercase tracking-wide text-white">실행 타임라인</h2>
            <div>
              {c.timeline.map((t, i) => (
                <div key={t.date} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < c.timeline.length - 1 && <div className="absolute left-[14px] top-7 h-full w-px bg-white/5" />}
                  <div className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-[11px] font-bold text-red-400">{i + 1}</div>
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

        {c.insight && (
          <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-5">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-white">💡 핵심 인사이트</h2>
            <p className="text-sm leading-relaxed text-gray-400">{c.insight}</p>
          </div>
        )}

        </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Link href="/cases/google/failure" className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-white transition-colors">
            <ArrowLeft size={12} /> 실패 케이스 목록
          </Link>
          <Link href="/" className="text-xs text-gray-700 hover:text-gray-400 transition-colors">포트폴리오 홈</Link>
        </div>
      </div>
    </main>
  );
}
