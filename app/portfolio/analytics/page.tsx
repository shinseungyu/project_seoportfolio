"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AreaChart, Area,
  BarChart, Bar, Cell, LabelList,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft, RefreshCw, ExternalLink,
  MousePointer, Eye, TrendingUp, TrendingDown, Target, Search,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────
type DayRow = { date: string; clicks: number; impressions: number; ctr: number; position: number };
type Keyword = { query: string; clicks: number; impressions: number; ctr: number; position: number };
type Summary = {
  totalClicks: number; totalImpressions: number;
  avgCtr: string; avgPosition: string;
  startDate: string; endDate: string;
  prevClicks: number; prevImpressions: number;
  firstSeen: string | null;
  top10Count: number;
  prevTop10Count: number;
};
type ApiResponse = { rows: DayRow[]; keywords: Keyword[]; summary: Summary; error?: string };

// ── 유틸 ──────────────────────────────────────────────────────────────
function pctChange(curr: number, prev: number) {
  if (!prev) return null;
  const v = Math.round(((curr - prev) / prev) * 100);
  return { v, up: v >= 0 };
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
}
function daysSince(d: string) {
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
}

// ── 스켈레톤 ──────────────────────────────────────────────────────────
function Skel({ h = "h-20", w = "w-full" }: { h?: string; w?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.05] ${h} ${w}`} />;
}

// ── Tooltip ───────────────────────────────────────────────────────────
function ChartTip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1424]/98 px-4 py-3 shadow-2xl backdrop-blur-xl text-sm">
      <p className="mb-2 text-xs text-gray-500">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 py-0.5">
          <span className="h-1.5 w-3 rounded-full" style={{ background: p.color }} />
          <span className="w-20 text-gray-400 capitalize">{p.name}</span>
          <span className="ml-2 font-semibold tabular-nums text-white">
            {p.name === "ctr" ? `${(p.value * 100).toFixed(2)}%`
              : p.name === "position" ? `#${p.value.toFixed(1)}`
              : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── 스파크라인 ────────────────────────────────────────────────────────
function Spark({ data, k, color, gradId }: { data: DayRow[]; k: keyof DayRow; color: string; gradId: string }) {
  return (
    <ResponsiveContainer width="100%" height={52}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey={k as string} stroke={color} strokeWidth={1.5}
          fill={`url(#${gradId})`} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── KPI 카드 ──────────────────────────────────────────────────────────
function KpiCard({ label, value, change, icon: Icon, color, accentFrom, accentTo, data, dataKey, gradId }: {
  label: string; value: string;
  change?: { v: number; up: boolean } | null;
  icon: React.FC<{ size?: number; className?: string }>; color: string;
  accentFrom: string; accentTo: string;
  data: DayRow[]; dataKey: keyof DayRow; gradId: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5">
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accentFrom} ${accentTo}`} />
      <div className={`absolute -top-8 right-3 h-20 w-20 rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-opacity ${color}`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</span>
          <Icon size={13} className="text-gray-600" />
        </div>
        <div className="mt-3 text-[2.2rem] font-bold leading-none tracking-tight text-white">{value}</div>
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          {change ? (
            <span className={`flex items-center gap-0.5 font-medium ${change.up ? "text-emerald-400" : "text-red-400"}`}>
              {change.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {change.up ? "+" : ""}{change.v}%
            </span>
          ) : null}
          <span className="text-gray-600">전월 대비</span>
        </div>
        <div className="mt-3 -mx-1">
          <Spark data={data} k={dataKey} color={
            gradId === "sp-clicks" ? "#6366f1"
            : gradId === "sp-impr" ? "#10b981"
            : gradId === "sp-ctr" ? "#8b5cf6"
            : "#f59e0b"
          } gradId={gradId} />
        </div>
      </div>
    </div>
  );
}

// ── 5대 지표 바 차트 ──────────────────────────────────────────────────
const METRIC_COLORS = ["#6366f1", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4"];

function MetricsSummaryChart({ s, page1Count }: { s: Summary; page1Count: number }) {
  const items = [
    { label: "총 클릭수",      display: s.totalClicks.toLocaleString(),  pct: 100 },
    { label: "총 노출수",      display: s.totalImpressions.toLocaleString(), pct: 100 },
    { label: "평균 CTR",       display: `${s.avgCtr}%`,                  pct: Math.min(parseFloat(s.avgCtr) / 5 * 100, 100) },
    { label: "평균 순위",      display: `#${s.avgPosition}`,             pct: Math.max(0, (20 - parseFloat(s.avgPosition)) / 20 * 100) },
    { label: "1페이지 키워드", display: `${page1Count}개`,               pct: Math.min(page1Count / 50 * 100, 100) },
  ];

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm">
      <div className="mb-5">
        <h2 className="font-semibold text-white">5대 지표 요약</h2>
        <p className="mt-0.5 text-xs text-gray-600">각 지표의 상대적 달성도 · 실제 수치 레이블 표시</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={items} margin={{ top: 44, right: 16, left: 16, bottom: 8 }} barSize={72}>
          <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 13, fontWeight: 500 }} tickLine={false} axisLine={false} />
          <YAxis hide domain={[0, 115]} />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as (typeof items)[0];
              return (
                <div className="rounded-xl border border-white/10 bg-[#0d1424]/98 px-4 py-2.5 text-sm shadow-xl">
                  <p className="font-semibold text-white">{d.label}</p>
                  <p className="text-gray-300 text-base font-bold">{d.display}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="pct" radius={[8, 8, 0, 0]}>
            {items.map((_, i) => (
              <Cell key={i} fill={METRIC_COLORS[i]} fillOpacity={0.9} />
            ))}
            <LabelList
              dataKey="display"
              position="top"
              style={{ fill: "#f9fafb", fontSize: 15, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── 순위 뱃지 ─────────────────────────────────────────────────────────
function RankBadge({ pos }: { pos: number }) {
  const p = Math.round(pos);
  if (p <= 3) return <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400">#{p}</span>;
  if (p <= 10) return <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-bold text-indigo-400">#{p}</span>;
  if (p <= 20) return <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-400">#{p}</span>;
  return <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs font-bold text-gray-500">#{p}</span>;
}

// ── 메인 ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/search-console");
      const json: ApiResponse = await res.json();
      setData(json);
      setUpdatedAt(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
    } catch {
      setData({ rows: [], keywords: [], summary: {} as Summary, error: "데이터 로드 실패" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const rows = data?.rows ?? [];
  const keywords = data?.keywords ?? [];
  const s = data?.summary;
  const chartData = rows.map((r) => ({ ...r, date: fmtDate(r.date) }));

  const clickChange = s ? pctChange(s.totalClicks, s.prevClicks) : null;
  const imprChange = s ? pctChange(s.totalImpressions, s.prevImpressions) : null;
  const launched = s?.firstSeen ?? null;
  const days = launched ? daysSince(launched) : null;
  const page1Count = s?.top10Count ?? keywords.filter((kw) => kw.position <= 10).length;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#080c14]">
      {/* 배경 글로우 */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-20 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] rounded-full bg-violet-600/6 blur-[100px]" />
      </div>

      {/* 헤더 */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#080c14]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors">
              <ArrowLeft size={14} /> 포트폴리오
            </Link>
            <span className="text-white/10">/</span>
            <span className="text-gray-300">SEO 성과 대시보드</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              실시간
            </span>
            {updatedAt && <span className="text-xs text-gray-600">{updatedAt} 업데이트</span>}
            <button onClick={fetchData} disabled={loading}
              className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-4 py-1.5 text-xs text-gray-400 hover:border-white/15 hover:text-white transition-all disabled:opacity-40">
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
              새로고침
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl space-y-7 px-6 py-10">

        {/* ── 사이트 정보 배너 ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15">
              <Search size={18} className="text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">carelec.kr</h1>
                <a href="https://carelec.kr" target="_blank" rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-400 transition-colors">
                  <ExternalLink size={13} />
                </a>
              </div>
              <p className="text-xs text-gray-500">전기차 충전·보조금 정보 사이트 · Google Search Console API 연동</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{days !== null ? `${days}일` : "-"}</div>
              <div className="text-xs text-gray-600">운영 기간</div>
            </div>
            <div className="h-8 w-px bg-white/8" />
            <div>
              <div className="text-xs text-gray-600 mb-0.5">최초 노출일</div>
              <div className="text-sm font-medium text-gray-300">{launched ?? "-"}</div>
            </div>
            {s?.startDate && (
              <>
                <div className="h-8 w-px bg-white/8" />
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">조회 기간</div>
                  <div className="text-sm font-medium text-gray-300">{s.startDate} ~ {s.endDate}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 에러 */}
        {!loading && data?.error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm">
            <p className="font-semibold text-red-300">⚠ API 연결 오류</p>
            <p className="mt-1 text-red-400/60">{data.error}</p>
          </div>
        )}

        {/* ── KPI 4개 ── */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            [0,1,2,3].map(i => <Skel key={i} h="h-44" />)
          ) : (
            <>
              <KpiCard label="총 클릭수" value={(s?.totalClicks ?? 0).toLocaleString()}
                change={clickChange} icon={MousePointer}
                color="bg-indigo-500" accentFrom="from-transparent" accentTo="via-indigo-500/60 to-transparent"
                data={rows} dataKey="clicks" gradId="sp-clicks" />
              <KpiCard label="총 노출수" value={(s?.totalImpressions ?? 0).toLocaleString()}
                change={imprChange} icon={Eye}
                color="bg-emerald-500" accentFrom="from-transparent" accentTo="via-emerald-500/60 to-transparent"
                data={rows} dataKey="impressions" gradId="sp-impr" />
              <KpiCard label="평균 CTR" value={`${s?.avgCtr ?? "0.00"}%`}
                icon={TrendingUp}
                color="bg-violet-500" accentFrom="from-transparent" accentTo="via-violet-500/60 to-transparent"
                data={rows} dataKey="ctr" gradId="sp-ctr" />
              <KpiCard label="평균 게재순위" value={`#${s?.avgPosition ?? "0"}`}
                icon={Target}
                color="bg-amber-500" accentFrom="from-transparent" accentTo="via-amber-500/60 to-transparent"
                data={rows} dataKey="position" gradId="sp-pos" />
            </>
          )}
        </div>

        {/* ── 5대 지표 바 차트 ── */}
        {!loading && s && (
          <MetricsSummaryChart s={s} page1Count={page1Count} />
        )}
        {loading && <Skel h="h-64" />}

        {/* ── 클릭 & 노출 추이 ── */}
        {loading ? <Skel h="h-72" /> : chartData.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-white">클릭수 &amp; 노출수 추이</h2>
                <p className="mt-0.5 text-xs text-gray-600">최근 30일 일별 데이터</p>
              </div>
              <div className="flex gap-6 text-right">
                <div>
                  <div className="flex items-center justify-end gap-1.5 text-xs text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />클릭수
                  </div>
                  <div className="text-xl font-bold text-indigo-400">{(s?.totalClicks ?? 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="flex items-center justify-end gap-1.5 text-xs text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />노출수
                  </div>
                  <div className="text-xl font-bold text-emerald-400">{(s?.totalImpressions ?? 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gc-clicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gc-impr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#374151", fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis yAxisId="l" tick={{ fill: "#374151", fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
                <YAxis yAxisId="r" orientation="right" tick={{ fill: "#374151", fontSize: 10 }} tickLine={false} axisLine={false} width={46} />
                <Tooltip content={<ChartTip />} />
                <Area yAxisId="l" type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} fill="url(#gc-clicks)" dot={false} activeDot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} />
                <Area yAxisId="r" type="monotone" dataKey="impressions" stroke="#10b981" strokeWidth={2} fill="url(#gc-impr)" dot={false} activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── CTR + 순위 나란히 ── */}
        {!loading && chartData.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">CTR 추이</h2>
                  <p className="text-xs text-gray-600">클릭률 30일</p>
                </div>
                <span className="text-2xl font-bold text-violet-400">{s?.avgCtr}%</span>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gc2-ctr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#374151", fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: "#374151", fontSize: 9 }} tickLine={false} axisLine={false} width={32} tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="ctr" stroke="#8b5cf6" strokeWidth={2} fill="url(#gc2-ctr)" dot={false} activeDot={{ r: 3, fill: "#8b5cf6", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">평균 게재순위 추이</h2>
                  <p className="text-xs text-gray-600">낮을수록 상위 노출</p>
                </div>
                <span className="text-2xl font-bold text-amber-400">#{s?.avgPosition}</span>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#ffffff06" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#374151", fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis reversed tick={{ fill: "#374151", fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="position" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── 키워드 순위 테이블 ── */}
        {!loading && keywords.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <div>
                <h2 className="font-semibold text-white">키워드 순위</h2>
                <p className="mt-0.5 text-xs text-gray-600">노출수 기준 상위 키워드 · 최근 30일</p>
              </div>
              <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-gray-500">
                상위 10개 키워드
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">키워드</th>
                    <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600">순위</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">클릭</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">노출</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords
                    .sort((a, b) => b.impressions - a.impressions)
                    .slice(0, 10)
                    .map((kw, i) => (
                    <tr key={kw.query} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 w-4 text-right">{i + 1}</span>
                          <span className="font-medium text-gray-200">{kw.query}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <RankBadge pos={kw.position} />
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold text-indigo-400">{kw.clicks.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-emerald-400">{kw.impressions.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-violet-400">{(kw.ctr * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 일별 데이터 테이블 ── */}
        {!loading && chartData.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm">
            <div className="border-b border-white/5 px-6 py-4">
              <h2 className="font-semibold text-white">일별 성과</h2>
              <p className="mt-0.5 text-xs text-gray-600">최근 30일 날짜별 상세</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["날짜", "클릭수", "노출수", "CTR", "게재순위"].map((h, i) => (
                      <th key={h} className={`px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-600 ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...chartData].reverse().map((row) => (
                    <tr key={row.date} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 text-gray-400">{row.date}</td>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold text-indigo-400">{row.clicks.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-emerald-400">{row.impressions.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-violet-400">{(row.ctr * 100).toFixed(2)}%</td>
                      <td className="px-5 py-3 text-right">
                        <RankBadge pos={row.position} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
