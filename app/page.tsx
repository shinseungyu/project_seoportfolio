"use client"

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MousePointer2, MoveRight, Layers, TrendingUp, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { googleSuccessCases, googleFailureCases, type Case } from "@/data/cases";
import { AboutMe } from "@/components/about-me";

const HeroScene = dynamic(() => import("@/components/hero-scene-v2").then((mod) => mod.HeroSceneV2), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-transparent" />,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const typeStyle = {
  success: {
    label: "Success",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    icon: TrendingUp,
    accent: "emerald",
  },
  failure: {
    label: "Case Study",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
    icon: TrendingUp,
    accent: "indigo",
  },
};


function CaseCard({ c, isLight = false }: { c: Case, isLight?: boolean }) {
  const ts = typeStyle[c.type] || typeStyle.success;
  const Icon = ts.icon;
  const href = `/cases/${c.engine}/${c.type}/${c.slug}`;
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(c.hasLiveDashboard);

  useEffect(() => {
    let isMounted = true;
    if (c.hasLiveDashboard) {
      fetch(`/api/search-console?site=${c.slug}`)
        .then(res => res.json())
        .then(data => {
          if (isMounted && !data.error && data.summary) setApiData(data);
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [c.slug, c.hasLiveDashboard]);

  if (!c.ready) return null;

  const s = apiData?.summary;
  const isLive = !!apiData;

  const displayImpressionsRaw = s ? s.totalImpressions : parseInt(c.searchConsole?.impressions || "0", 10);
  const displayClicksRaw = s ? s.totalClicks : parseInt(c.searchConsole?.clicks || "0", 10);
  const displayAvgPosRaw = s ? parseFloat(s.avgPosition) : (c.searchConsole?.avgPosition || 0);

  const formatK = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
  const displayImpressions = s ? formatK(s.totalImpressions) : formatK(displayImpressionsRaw);
  const displayClicks = s ? formatK(s.totalClicks) : formatK(displayClicksRaw);
  const displayAvgPos = s ? s.avgPosition : (c.searchConsole?.avgPosition || "0");
  
  const coreKeyword = c.slug === 'carelec' ? "전기차 보조금 계산기" : (c.topKeyword?.keyword || "핵심 키워드");

  const h1 = Math.min((displayImpressionsRaw / 10000) * 100, 100);
  const h2 = Math.min((displayClicksRaw / 1000) * 100, 100);
  const h3 = Math.max(10, (30 - displayAvgPosRaw) / 30 * 100); 

  return (
    <Link href={href} className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-500 shadow-lg backdrop-blur-md p-5 cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
      isLight
        ? "bg-white/40 border-slate-200/50 hover:border-indigo-300 hover:bg-white/70 shadow-slate-200/50 hover:shadow-indigo-100"
        : "bg-[#080c14]/80 border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.03] shadow-black/50"
    }`}>
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ${
        isLight ? "from-indigo-500/10 via-transparent to-cyan-500/10" : "from-indigo-500/5 via-transparent to-emerald-500/5"
      }`} />

      <div className="flex items-start justify-between z-10 mb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${ts.bg} ${ts.border} border shadow-md transition-all duration-500 group-hover:scale-105`}>
            <Icon size={16} className={ts.text} />
          </div>
          <div className="space-y-0.5">
            <p className={`text-2xl font-black transition-colors tracking-tighter uppercase leading-none ${
              isLight ? "text-slate-900 group-hover:text-indigo-600" : "text-white group-hover:text-indigo-400"
            }`}>{c.site}</p>
            <div className="flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className={`text-[11px] font-bold uppercase tracking-[0.15em] ${
                isLight ? "text-slate-400" : "text-zinc-500"
              }`}>{isLive ? "Live Performance" : "Performance Report"}</p>
            </div>
          </div>
        </div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-110 group-hover:rotate-45 ${
          isLight ? "border-slate-200 bg-slate-50 group-hover:border-indigo-500 group-hover:bg-indigo-500 group-hover:shadow-md group-hover:shadow-indigo-200" : "border-white/10 bg-white/5 group-hover:border-indigo-500 group-hover:bg-indigo-500"
        }`}>
          <ArrowUpRight size={14} className={isLight ? "text-slate-500 group-hover:text-white" : "text-white group-hover:text-white"} />
        </div>
      </div>

      {/* 운영기간 + 대표키워드 */}
      <div className="flex items-center justify-between gap-2 mb-4 z-10 relative h-5">
        {loading ? (
          <div className={`h-4 w-24 rounded-full animate-pulse ${isLight ? "bg-slate-200" : "bg-white/5"}`} />
        ) : s?.firstSeen ? (
          <span className={`text-[11px] font-bold ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
            <span className={isLight ? "text-slate-800" : "text-white"}>
              {new Date(s.firstSeen).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, ".").replace(/\.$/, "")}
            </span>
            {" ~ 현재"}
          </span>
        ) : c.period && c.period !== "준비 중" ? (
          <span className={`text-[11px] font-bold ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
            <span className={isLight ? "text-slate-800" : "text-white"}>{c.period}</span>
            {" ~ 현재"}
          </span>
        ) : null}
        {c.repKeyword && (
          <span className={`text-[10px] font-semibold truncate max-w-[140px] text-right ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
            {c.repKeyword}
          </span>
        )}
      </div>

      <div className={`relative z-10 mb-4 h-48 w-full rounded-xl border p-4 flex items-end justify-around gap-4 transition-all shadow-inner overflow-hidden ${
        isLight ? "bg-slate-100/50 border-slate-200/50 group-hover:border-indigo-500/20" : "bg-black/20 border-white/[0.03] group-hover:border-indigo-500/20"
      }`}>
         <div className={`absolute inset-0 pointer-events-none ${isLight ? "opacity-[0.05]" : "opacity-[0.03]"}`} style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

         {loading ? (
            <div className="flex items-end justify-around w-full h-full gap-4">
              {[1, 2, 3].map(i => <div key={i} className={`w-12 rounded-t-lg animate-pulse h-1/2 ${isLight ? "bg-slate-200" : "bg-white/5"}`} />)}
            </div>
         ) : (
            <>
              <div className="flex flex-col items-center gap-2 w-full h-full justify-end group/bar">
                <div className={`relative w-full max-w-[56px] h-full rounded-t-lg overflow-hidden transition-colors ${isLight ? "bg-slate-200/50 group-hover/bar:bg-slate-200" : "bg-white/[0.02] group-hover/bar:bg-white/[0.05]"}`}>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-indigo-400 transition-all duration-1000 ease-out rounded-t-lg" style={{ height: `${h1}%` }} />
                </div>
                <div className="flex flex-col items-center">
                   <span className={`text-[11px] font-black uppercase tracking-widest ${isLight ? "text-slate-400" : "text-zinc-500"}`}>노출수</span>
                   <span className="text-[13px] font-black text-indigo-500/90">{displayImpressionsRaw.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 w-full h-full justify-end group/bar">
                <div className={`relative w-full max-w-[56px] h-full rounded-t-lg overflow-hidden transition-colors ${isLight ? "bg-slate-200/50 group-hover/bar:bg-slate-200" : "bg-white/[0.02] group-hover/bar:bg-white/[0.05]"}`}>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 transition-all duration-1000 ease-out rounded-t-lg" style={{ height: `${h2}%` }} />
                </div>
                <div className="flex flex-col items-center">
                   <span className={`text-[11px] font-black uppercase tracking-widest ${isLight ? "text-slate-400" : "text-zinc-500"}`}>클릭수</span>
                   <span className="text-[13px] font-black text-emerald-500/90">{displayClicksRaw.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 w-full h-full justify-end group/bar">
                <div className={`relative w-full max-w-[56px] h-full rounded-t-lg overflow-hidden transition-colors ${isLight ? "bg-slate-200/50 group-hover/bar:bg-slate-200" : "bg-white/[0.02] group-hover/bar:bg-white/[0.05]"}`}>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 transition-all duration-1000 ease-out rounded-t-lg" style={{ height: `${h3}%` }} />
                </div>
                <div className="flex flex-col items-center text-center">
                   <span className={`text-[11px] font-black uppercase tracking-widest truncate w-20 ${isLight ? "text-slate-400" : "text-zinc-500"}`}>{coreKeyword}</span>
                   <span className="text-[13px] font-black text-amber-500/90">평균 순위</span>
                </div>
              </div>
            </>
         )}
      </div>

      <div className={`relative z-10 grid grid-cols-3 gap-3 pt-4 border-t ${isLight ? "border-slate-200" : "border-white/5"}`}>
        <div className="space-y-0.5">
          <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${isLight ? "text-slate-400" : "text-zinc-600"}`}>Impressions</p>
          <div className="flex items-baseline gap-0.5">
            <p className={`text-3xl font-black tracking-tighter ${isLight ? "text-slate-900" : "text-white"}`}>{loading ? "--" : displayImpressions}</p>
            <span className={`text-sm font-bold ${isLight ? "text-slate-400" : "text-zinc-700"}`}>회</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${isLight ? "text-slate-400" : "text-zinc-600"}`}>Clicks</p>
          <div className="flex items-baseline gap-0.5">
            <p className="text-3xl font-black text-emerald-500 tracking-tighter">{loading ? "--" : displayClicks}</p>
            <span className={`text-sm font-bold ${isLight ? "text-slate-400" : "text-zinc-700"}`}>회</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${isLight ? "text-slate-400" : "text-zinc-600"}`}>Ranking</p>
          <div className="flex items-baseline gap-0.5">
            <p className="text-3xl font-black text-amber-500 tracking-tighter">{loading ? "--" : `#${displayAvgPos}`}</p>
            <span className={`text-sm font-bold ${isLight ? "text-slate-400" : "text-zinc-700"}`}>위</span>
          </div>
        </div>
      </div>

      {/* 클릭 유도 */}
      <div className={`mt-4 pt-3 border-t flex items-center justify-between transition-all duration-300 ${
        isLight ? "border-slate-100 opacity-40 group-hover:opacity-100" : "border-white/5 opacity-20 group-hover:opacity-60"
      }`}>
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLight ? "text-indigo-500" : "text-indigo-400"}`}>
          자세히 보기
        </span>
        <div className="flex items-center gap-1.5">
          {c.badges?.map((badge) =>
            badge === "snippet" ? (
              <span key="snippet" className="flex items-center gap-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black text-emerald-400 uppercase tracking-wide">
                ✦ 스니펫
              </span>
            ) : (
              <img
                key={badge}
                src={
                  badge === "google" ? "/구글.png"
                  : badge === "naver" ? "/naver_icon.png"
                  : badge === "claude" ? "/claude_icon.svg"
                  : "/chatgpt.png"
                }
                alt={badge}
                className="h-4 w-4 rounded-sm object-contain"
              />
            )
          )}
          <ArrowUpRight size={12} className={`ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isLight ? "text-indigo-400" : "text-indigo-500"}`} />
        </div>
      </div>
    </Link>
  );
}


export default function HomePage() {
  const container = useRef<HTMLDivElement>(null);
  const magneticRef = useRef<HTMLDivElement>(null);
  const totalSites = googleSuccessCases.length + googleFailureCases.length;

  const moveMagnetic = (e: React.MouseEvent) => {
    const rect = magneticRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(magneticRef.current, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power2.out" });
  };
  
  const resetMagnetic = () => {
    gsap.to(magneticRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
  };

  useGSAP(() => {
    gsap.from(".reveal-text", {
      yPercent: 100,
      stagger: 0.1,
      duration: 1.2,
      ease: "power4.out",
    });

    gsap.from(".bento-item", {
      scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 80%",
      },
      opacity: 0,
      y: 50,
      rotateX: -15,
      stagger: 0.1,
      duration: 1,
      ease: "back.out(1.7)",
    });

    const sections = gsap.utils.toArray(".panel");
    
    // Only apply horizontal scroll on Desktop (lg and up)
    let mm = gsap.matchMedia();
    
    mm.add("(min-width: 1024px)", () => {
      const scrollTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".horizontal-container",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          end: () => "+=300%",
          onUpdate: (self) => {
            gsap.to(".scroll-progress-bar", {
              scaleX: self.progress,
              transformOrigin: "left center",
              duration: 0.1,
              ease: "none"
            });
          }
        },
      });

      sections.forEach((panel: any) => {
        const elements = panel.querySelectorAll(".panel-content");
        gsap.from(elements, {
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: "left center",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 80,
          duration: 1.2,
          ease: "power4.out"
        });
      });
    });

    // Mobile/Tablet: Vertical Scroll Reveal
    mm.add("(max-width: 1023px)", () => {
      sections.forEach((panel: any) => {
        const elements = panel.querySelectorAll(".panel-content");
        gsap.from(elements, {
          scrollTrigger: {
            trigger: panel,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power2.out"
        });
      });
    });

    const counters = gsap.utils.toArray(".counter");
    counters.forEach((counter: any) => {
      const target = parseFloat(counter.getAttribute("data-value") || "0");
      counter.innerText = "0";
      gsap.to(counter, {
        scrollTrigger: {
          trigger: counter,
          start: "top 90%",
        },
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power2.out",
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="bg-[#050505] text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-0 z-0 opacity-40">
           <HeroScene />
        </div>
        
        <div className="relative z-10 text-center">
          <div className="mb-2 overflow-hidden">
            <p className="reveal-text text-lg font-semibold tracking-[0.4em] uppercase text-indigo-400">
              Hello,
            </p>
          </div>
          <div className="mb-4 overflow-hidden">
            <h1 className="reveal-text text-5xl font-black tracking-tighter text-white sm:text-7xl md:text-9xl lg:text-[10rem] uppercase leading-none">
              My
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="reveal-text text-5xl font-black tracking-tighter sm:text-7xl md:text-9xl lg:text-[10rem] uppercase leading-none text-gradient leading-none">
              Portfolio
            </h1>
          </div>

          <p className="mt-12 max-w-xl mx-auto text-sm font-medium text-zinc-500 leading-relaxed uppercase tracking-[0.3em]">
            Google SEO · 데이터 기반 성장 전략<br />
            Google Search Console API 실시간 데이터 연동
          </p>

          <div className="mt-20 flex justify-center">
            <div className="group relative h-[32rem] w-[25rem] overflow-hidden rounded-[3rem] border border-white/10 glass p-2 transition-all duration-700 hover:scale-[1.02] hover:border-indigo-500/30 shadow-2xl shadow-indigo-500/5">
              <img 
                src="/tab1.jpg" 
                alt="Profile" 
                className="h-full w-full rounded-[2.5rem] object-cover grayscale transition-all duration-[1.5s] group-hover:grayscale-0 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-10 left-10 right-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Registry ID: LAS-2026</span>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Principal Architect</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 animate-bounce text-zinc-700">
          <MoveRight size={24} className="rotate-90" />
        </div>
      </section>

      <AboutMe />

      {/* 2. Horizontal Scroll Section - Categorized Registry */}
      <section className="horizontal-container relative flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden bg-[#f3f5f8]">
        {/* Progress Bar - Only for Desktop Horizontal Scroll */}
        <div className="absolute top-0 left-0 z-[100] h-1.5 w-full bg-slate-200/50 overflow-hidden hidden lg:block">
          <div className="scroll-progress-bar h-full w-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 scale-x-0" />
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="absolute top-[20%] right-[-5%] w-[25%] h-[25%] rounded-full bg-violet-500/10 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Intro Panel */}
        <div className="panel flex min-h-screen lg:h-screen w-full lg:w-screen lg:flex-shrink-0 items-center justify-center px-10 relative overflow-hidden py-20 lg:py-0">
          <div className="panel-content max-w-4xl text-center relative z-10">
            <div className="relative inline-block mb-10">
              <Layers className="text-indigo-600 relative z-10" size={120} />
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
            </div>
            <div className="space-y-4">
              <span className="text-sm font-black text-indigo-500 uppercase tracking-[0.6em] block">SEO Performance</span>
              <h2 className="text-[10rem] font-black text-slate-900 leading-[0.8] uppercase tracking-tighter mix-blend-multiply opacity-90">
                Port<br />folio
              </h2>
            </div>
            <p className="mt-16 text-slate-400 text-xl font-medium uppercase tracking-[0.5em] flex items-center justify-center gap-4">
              <span className="h-[1px] w-12 bg-slate-200" />
              Portfolio Index
              <span className="h-[1px] w-12 bg-slate-200" />
            </p>
          </div>
          <div className="absolute right-12 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] font-black text-slate-300 uppercase tracking-[1em] whitespace-nowrap pointer-events-none">
            Registry Index • 2024-2026 • Optimized Systems
          </div>
        </div>
        
        {/* Panel: gwanse + carprotax */}
        <div className="panel flex min-h-screen lg:h-screen w-full lg:w-screen lg:flex-shrink-0 items-center justify-center px-6 sm:px-12 lg:px-24 py-20 lg:py-0">
          <div className="panel-content w-full max-w-5xl grid sm:grid-cols-2 gap-6">
            {[googleSuccessCases.find(c => c.slug === "gwanse")!, googleSuccessCases.find(c => c.slug === "carprotax")!].map(c => (
              <div key={c.slug} className="min-h-[400px]"><CaseCard c={c} isLight /></div>
            ))}
          </div>
        </div>

        {/* Panel: carelec + fundfinpro */}
        <div className="panel flex min-h-screen lg:h-screen w-full lg:w-screen lg:flex-shrink-0 items-center justify-center px-6 sm:px-12 lg:px-24 py-20 lg:py-0">
          <div className="panel-content w-full max-w-5xl grid sm:grid-cols-2 gap-6">
            {[googleSuccessCases.find(c => c.slug === "carelec")!, googleSuccessCases.find(c => c.slug === "fundfinpro")!].map(c => (
              <div key={c.slug} className="min-h-[400px]"><CaseCard c={c} isLight /></div>
            ))}
          </div>
        </div>

        {/* Panel: hospetpay + carpaypro */}
        <div className="panel flex min-h-screen lg:h-screen w-full lg:w-screen lg:flex-shrink-0 items-center justify-center px-6 sm:px-12 lg:px-24 py-20 lg:py-0">
          <div className="panel-content w-full max-w-5xl grid sm:grid-cols-2 gap-6">
            {[googleSuccessCases.find(c => c.slug === "hospetpay")!, googleFailureCases.find(c => c.slug === "carpaypro")!].map(c => (
              <div key={c.slug} className="min-h-[400px]"><CaseCard c={c} isLight /></div>
            ))}
          </div>
        </div>

        {/* End Panel */}
        <div className="panel flex min-h-[50vh] lg:h-screen w-full lg:w-screen lg:flex-shrink-0 items-center justify-center py-20 lg:py-0">
          <div className="panel-content max-w-md text-center">
            <div className="h-[1px] w-full bg-slate-200 mb-12" />
            <h2 className="text-9xl font-black text-slate-900 leading-none uppercase tracking-tighter mb-6">END</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.5em]">Comprehensive Archive Complete</p>
            <div className="h-[1px] w-full bg-slate-200 mt-12" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-60">
        <div className="grid gap-20 lg:grid-cols-2">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Live Registry Metrics</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">Aggregate search performance indices</p>
            </div>
            
            <div className="space-y-12">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="counter text-9xl font-black text-white" data-value={totalSites * 100}>0</span>
                  <span className="text-2xl font-bold text-indigo-500">+</span>
                </div>
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest mt-2">Indexed Growth Nodes</span>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="counter text-9xl font-black text-white" data-value="92">0</span>
                  <span className="text-2xl font-bold text-emerald-500">%</span>
                </div>
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest mt-2">Optimization Integrity</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-10">
            <div 
              ref={magneticRef}
              onMouseMove={moveMagnetic}
              onMouseLeave={resetMagnetic}
              className="group relative flex h-80 w-80 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] cursor-none shadow-2xl transition-shadow hover:shadow-indigo-500/20"
            >
              <div className="pointer-events-none flex flex-col items-center gap-2">
                <MousePointer2 className="text-indigo-400 mb-2 group-hover:scale-125 transition-transform" />
                <span className="text-sm font-bold text-white uppercase tracking-[0.2em]">Data Magnet</span>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white mix-blend-difference" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
