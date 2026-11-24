"use client"

import { useState } from "react";
import { Hospital, CalendarDays, Plus } from "lucide-react";
import { clinic, clinicMetrics, monthEntries } from "@/data/clinic";

function monthLabel(m: string) {
  const [y, mo] = m.split("-");
  return { year: y, month: `${parseInt(mo, 10)}월` };
}

export function ClinicSection() {
  // 내용이 있는 가장 최근 달을 기본 선택
  const filled = monthEntries.filter((e) => e.title || e.items.length);
  const [active, setActive] = useState(
    (filled[filled.length - 1] ?? monthEntries[0]).month,
  );
  const entry = monthEntries.find((e) => e.month === active) ?? monthEntries[0];
  const isEmpty = !entry.title && entry.items.length === 0;

  return (
    <section className="relative border-t border-white/5 bg-[#050505] px-6 py-32">
      <div className="mx-auto max-w-6xl space-y-24">
        {/* 1. 프로젝트 소개 */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
              <Hospital size={16} className="text-indigo-400" />
            </span>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">
              {clinic.eyebrow}
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white sm:text-6xl">
            {clinic.name}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400">{clinic.summary}</p>

          <dl className="mt-10 grid gap-6 border-t border-white/5 pt-8 sm:grid-cols-3">
            <div>
              <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">입사</dt>
              <dd className="mt-1 text-lg font-bold text-white">
                {clinic.joinedAt.replaceAll("-", ".")} ~ 현재
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">역할</dt>
              <dd className="mt-1 text-lg font-bold text-white">{clinic.role}</dd>
            </div>
            {clinic.domain && (
              <div>
                <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">사이트</dt>
                <dd className="mt-1 text-lg font-bold text-white">{clinic.domain}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* 2. 성과 (6월 ~ 현재) */}
        <div>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400">Results</p>
              <h3 className="mt-2 text-3xl font-black tracking-tighter text-white sm:text-4xl">
                6월부터 현재까지의 성과
              </h3>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
              Google Search Console
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {clinicMetrics.map((m) => (
              <div
                key={m.key}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  {m.label}
                </p>
                {m.value === null ? (
                  <p className="mt-4 text-sm font-bold text-zinc-600">GSC API 연동 예정</p>
                ) : (
                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tighter text-white">
                      {m.value.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-zinc-600">{m.unit}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. 월별 타임라인 */}
        <div>
          <div className="mb-8 flex items-center gap-3">
            <CalendarDays size={18} className="text-indigo-400" />
            <h3 className="text-3xl font-black tracking-tighter text-white sm:text-4xl">월별 기록</h3>
          </div>

          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            {/* 월 선택 */}
            <div
              role="tablist"
              aria-label="월 선택"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {monthEntries.map((e) => {
                const l = monthLabel(e.month);
                const has = !!(e.title || e.items.length);
                const on = e.month === active;
                return (
                  <button
                    key={e.month}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(e.month)}
                    className={`flex shrink-0 items-center justify-between gap-6 rounded-xl border px-5 py-4 text-left transition-all ${
                      on
                        ? "border-indigo-500/40 bg-indigo-500/10"
                        : "border-white/5 bg-white/[0.02] hover:border-white/15"
                    }`}
                  >
                    <span>
                      <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                        {l.year}
                      </span>
                      <span className={`block text-xl font-black ${on ? "text-white" : "text-zinc-400"}`}>
                        {l.month}
                      </span>
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${has ? "bg-emerald-500" : "bg-zinc-700"}`}
                      title={has ? "기록 있음" : "기록 예정"}
                    />
                  </button>
                );
              })}
            </div>

            {/* 선택한 달 내용 */}
            <div
              role="tabpanel"
              className="min-h-[280px] rounded-2xl border border-white/5 bg-white/[0.02] p-8"
            >
              {isEmpty ? (
                <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 text-zinc-600">
                  <Plus size={24} />
                  <p className="text-sm font-bold">
                    {monthLabel(entry.month).month} 기록 예정
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400">
                    {monthLabel(entry.month).year}.{entry.month.split("-")[1]}
                  </p>
                  <h4 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {entry.title}
                  </h4>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-bold text-indigo-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="mt-6 space-y-3">
                    {entry.items.map((it) => (
                      <li key={it} className="flex gap-3 text-base leading-relaxed text-zinc-300">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        {it}
                      </li>
                    ))}
                  </ul>

                  {entry.metrics && entry.metrics.length > 0 && (
                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6 sm:grid-cols-4">
                      {entry.metrics.map((m) => (
                        <div key={m.label}>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                            {m.label}
                          </p>
                          <p className="mt-1 text-2xl font-black text-white">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
