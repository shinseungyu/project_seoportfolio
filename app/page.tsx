"use client"

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Search, ArrowLeft, MousePointer2, MoveRight, Layers, LayoutGrid, Zap, Globe, BarChart3, TrendingUp, TrendingDown, ChevronRight, Lock, ArrowUpRight, Trophy, CheckCircle2, Target, Lightbulb } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { googleCases, naverCases, googleSuccessCases, googleFailureCases, type Case } from "@/data/cases";
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
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
    icon: TrendingDown,
    accent: "rose",
  },
};

function MiniBarChart({ data, height }: { data: number[], height: number }) {
  if (!data || data.length === 0) return null;
  const sampleData = data.slice(-30);
  const max = Math.max(...sampleData, 1);

  return (
    <div className="flex items-end justify-between w-full gap-[2px]" style={{ height: height }}>
      {sampleData.map((d, i) => {
        const heightPct = Math.max((d / max) * 100, 4);
        return (
          <div key={i} className="flex-1 h-full bg-indigo-500/5 rounded-t-sm relative group">
            <div 
              className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm transition-all duration-700 ease-out"
              style={{ height: `${heightPct}%` }}
            />
            {/* Tooltip on hover */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-500 text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-white font-bold">
              {d}
            </div>
          </div>
        );
      })}
    </div>
  );
}

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

  const displayImpressions = s ? (s.totalImpressions >= 1000 ? (s.totalImpressions / 1000).toFixed(1) + 'K' : s.totalImpressions) : (c.searchConsole?.impressions || "0");
  const displayClicks = s ? (s.totalClicks >= 1000 ? (s.totalClicks / 1000).toFixed(1) + 'K' : s.totalClicks) : (c.searchConsole?.clicks || "0");
  const displayAvgPos = s ? s.avgPosition : (c.searchConsole?.avgPosition || "0");
  
  const coreKeyword = c.slug === 'carelec' ? "전기차 보조금 계산기" : (c.topKeyword?.keyword || "핵심 키워드");

  const h1 = Math.min((displayImpressionsRaw / 10000) * 100, 100);
  const h2 = Math.min((displayClicksRaw / 1000) * 100, 100);
  const h3 = Math.max(10, (30 - displayAvgPosRaw) / 30 * 100); 

  return (
    <Link href={href} className={`group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border transition-all duration-700 shadow-2xl backdrop-blur-md p-10 ${
      isLight 
        ? "bg-white/40 border-slate-200/50 hover:bg-white/60 shadow-slate-200/50" 
        : "bg-[#080c14]/80 border-white/5 hover:bg-white/[0.03] shadow-black/50"
    }`}>
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ${
        isLight ? "from-indigo-500/10 via-transparent to-cyan-500/10" : "from-indigo-500/5 via-transparent to-emerald-500/5"
      }`} />
      
      <div className="flex items-start justify-between z-10 mb-10">
        <div className="flex items-center gap-5">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${ts.bg} ${ts.border} border shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-indigo-500/10`}>
            <Icon size={24} className={ts.text} />
          </div>
          <div className="space-y-1">
            <p className={`text-[38px] font-black transition-colors tracking-tighter uppercase leading-none ${
              isLight ? "text-slate-900 group-hover:text-indigo-600" : "text-white group-hover:text-indigo-400"
            }`}>{c.site}</p>
            <div className="flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className={`text-[18px] font-bold uppercase tracking-[0.2em] ${
                isLight ? "text-slate-400" : "text-zinc-500"
              }`}>{isLive ? "Live Performance" : "Performance Report"}</p>
            </div>
          </div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all group-hover:rotate-45 duration-500 ${
          isLight ? "border-slate-200 bg-slate-50 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10" : "border-white/10 bg-white/5 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10"
        }`}>
          <ArrowUpRight size={18} className={isLight ? "text-slate-600 group-hover:text-indigo-600" : "text-white group-hover:text-indigo-400"} />
        </div>
      </div>

      <div className={`relative z-10 mb-10 h-64 w-full rounded-3xl border p-10 flex items-end justify-around gap-10 transition-all shadow-inner overflow-hidden ${
        isLight ? "bg-slate-100/50 border-slate-200/50 group-hover:border-indigo-500/20" : "bg-black/20 border-white/[0.03] group-hover:border-indigo-500/20"
      }`}>
         <div className={`absolute inset-0 pointer-events-none ${isLight ? "opacity-[0.05]" : "opacity-[0.03]"}`} style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
         
         {loading ? (
            <div className="flex items-end justify-around w-full h-full gap-8">
              {[1, 2, 3].map(i => <div key={i} className={`w-20 rounded-t-xl animate-pulse h-1/2 ${isLight ? "bg-slate-200" : "bg-white/5"}`} />)}
            </div>
         ) : (
            <>
              <div className="flex flex-col items-center gap-4 w-full h-full justify-end group/bar">
                <div className={`relative w-full max-w-[80px] h-full rounded-t-2xl overflow-hidden transition-colors ${isLight ? "bg-slate-200/50 group-hover/bar:bg-slate-200" : "bg-white/[0.02] group-hover/bar:bg-white/[0.05]"}`}>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-indigo-400 transition-all duration-1000 ease-out rounded-t-2xl" style={{ height: `${h1}%` }} />
                </div>
                <div className="flex flex-col items-center">
                   <span className={`text-[20px] font-black uppercase tracking-widest ${isLight ? "text-slate-400" : "text-zinc-500"}`}>노출수</span>
                   <span className="text-[22px] font-black text-indigo-500/90">{displayImpressionsRaw.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 w-full h-full justify-end group/bar">
                <div className={`relative w-full max-w-[80px] h-full rounded-t-2xl overflow-hidden transition-colors ${isLight ? "bg-slate-200/50 group-hover/bar:bg-slate-200" : "bg-white/[0.02] group-hover/bar:bg-white/[0.05]"}`}>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 transition-all duration-1000 ease-out rounded-t-2xl" style={{ height: `${h2}%` }} />
                </div>
                <div className="flex flex-col items-center">
                   <span className={`text-[20px] font-black uppercase tracking-widest ${isLight ? "text-slate-400" : "text-zinc-500"}`}>클릭수</span>
                   <span className="text-[22px] font-black text-emerald-500/90">{displayClicksRaw.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 w-full h-full justify-end group/bar">
                <div className={`relative w-full max-w-[80px] h-full rounded-t-2xl overflow-hidden transition-colors ${isLight ? "bg-slate-200/50 group-hover/bar:bg-slate-200" : "bg-white/[0.02] group-hover/bar:bg-white/[0.05]"}`}>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 transition-all duration-1000 ease-out rounded-t-2xl" style={{ height: `${h3}%` }} />
                </div>
                <div className="flex flex-col items-center text-center">
                   <span className={`text-[20px] font-black uppercase tracking-widest truncate w-32 ${isLight ? "text-slate-400" : "text-zinc-500"}`}>{coreKeyword}</span>
                   <span className="text-[22px] font-black text-amber-500/90">평균 순위</span>
                </div>
              </div>
            </>
         )}
      </div>

      <div className={`relative z-10 grid grid-cols-3 gap-6 pt-8 border-t ${isLight ? "border-slate-200" : "border-white/5"}`}>
        <div className="space-y-1">
          <p className={`text-[20px] font-black uppercase tracking-[0.2em] ${isLight ? "text-slate-400" : "text-zinc-600"}`}>Impressions</p>
          <div className="flex items-baseline gap-1">
            <p className={`text-[44px] font-black tracking-tighter ${isLight ? "text-slate-900" : "text-white"}`}>{loading ? "---" : displayImpressions}</p>
            <span className={`text-lg font-bold ${isLight ? "text-slate-400" : "text-zinc-700"}`}>회</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className={`text-[20px] font-black uppercase tracking-[0.2em] ${isLight ? "text-slate-400" : "text-zinc-600"}`}>Clicks</p>
          <div className="flex items-baseline gap-1">
            <p className="text-[44px] font-black text-emerald-500 tracking-tighter">{loading ? "---" : displayClicks}</p>
            <span className={`text-lg font-bold ${isLight ? "text-slate-400" : "text-zinc-700"}`}>회</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className={`text-[20px] font-black uppercase tracking-[0.2em] ${isLight ? "text-slate-400" : "text-zinc-600"}`}>Ranking</p>
          <div className="flex items-baseline gap-1">
            <p className="text-[44px] font-black text-amber-500 tracking-tighter">{loading ? "---" : `#${displayAvgPos}`}</p>
            <span className={`text-lg font-bold ${isLight ? "text-slate-400" : "text-zinc-700"}`}>위</span>
          </div>
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
          <div className="mb-4 overflow-hidden">
            <h1 className="reveal-text text-5xl font-black tracking-tighter text-white sm:text-7xl md:text-9xl lg:text-[10rem] uppercase leading-none">
              Interaction
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="reveal-text text-5xl font-black tracking-tighter sm:text-7xl md:text-9xl lg:text-[10rem] uppercase leading-none text-gradient leading-none">
              Architect
            </h1>
          </div>

          <p className="mt-12 max-w-xl mx-auto text-sm font-medium text-zinc-500 leading-relaxed uppercase tracking-[0.3em]">
            Google SEO & Data-Driven Growth Systems.<br />
            Experience the precision of algorithmic optimization.
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
              <span className="text-sm font-black text-indigo-500 uppercase tracking-[0.6em] block">Technical Registry</span>
              <h2 className="text-[10rem] font-black text-slate-900 leading-[0.8] uppercase tracking-tighter mix-blend-multiply opacity-90">
                Data<br />Archive
              </h2>
            </div>
            <p className="mt-16 text-slate-400 text-xl font-medium uppercase tracking-[0.5em] flex items-center justify-center gap-4">
              <span className="h-[1px] w-12 bg-slate-200" />
              Algorithm Performance Index
              <span className="h-[1px] w-12 bg-slate-200" />
            </p>
          </div>
          <div className="absolute right-12 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] font-black text-slate-300 uppercase tracking-[1em] whitespace-nowrap pointer-events-none">
            Registry Index • 2024-2026 • Optimized Systems
          </div>
        </div>
        
        {/* Google Success Panel 1 */}
        <div className="panel flex min-h-screen lg:h-screen w-full lg:w-screen lg:flex-shrink-0 flex-col items-center justify-center px-6 sm:px-12 lg:px-24 py-20 lg:py-0">
          <div className="panel-content w-full max-w-7xl">
            <div className="grid lg:grid-cols-[1fr,1.5fr] gap-20 items-center">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-3 rounded-full border border-indigo-200 bg-white px-6 py-2 shadow-sm">
                   <Zap className="text-indigo-500" size={16} />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Phase 01: Core Architecture</span>
                </div>
                <div>
                  <h3 className="text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8">
                    Google <br/> 
                    <span className="text-indigo-600">SEO</span>
                  </h3>
                  <p className="text-xl font-medium text-slate-500 leading-relaxed">
                    검색엔진이 코드를 이해하는 방식을 최적화했습니다. <br/>
                    <span className="text-slate-900 font-bold underline decoration-indigo-500/30">Core Web Vitals</span> 개선과 <span className="text-slate-900 font-bold underline decoration-indigo-500/30">JSON-LD 마크업</span>으로 크롤링 효율을 극대화한 사례입니다.
                  </p>
                </div>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                 {googleSuccessCases.slice(0, 2).map(c => <div key={c.slug} className="h-full min-h-[480px]"><CaseCard c={c} isLight={true} /></div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Google Success Panel 2 */}
        <div className="panel flex min-h-screen lg:h-screen w-full lg:w-screen lg:flex-shrink-0 flex-col items-center justify-center px-6 sm:px-12 lg:px-24 py-20 lg:py-0">
          <div className="panel-content w-full max-w-7xl">
            <div className="grid lg:grid-cols-[1.5fr,1fr] gap-20 items-center">
              <div className="grid gap-8 sm:grid-cols-2 order-2 lg:order-1">
                 {googleSuccessCases.slice(2, 4).map(c => <div key={c.slug} className="h-full min-h-[480px]"><CaseCard c={c} isLight={true} /></div>)}
              </div>
              <div className="space-y-10 order-1 lg:order-2">
                <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-white px-6 py-2 shadow-sm">
                   <Lightbulb className="text-amber-500" size={16} />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Phase 02: Authority Build</span>
                </div>
                <div>
                  <h3 className="text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8">
                    Content <br/> 
                    <span className="text-amber-500">Power</span>
                  </h3>
                  <p className="text-xl font-medium text-slate-500 leading-relaxed">
                    E-E-A-T를 알고리즘에 입증했습니다. <br/>
                    <span className="text-slate-900 font-bold underline decoration-amber-500/30">토픽 클러스터링</span> 기반의 전략 설계로 고경쟁 키워드 상위권을 점유한 사례입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Failure Panel */}
        <div className="panel flex min-h-screen lg:h-screen w-full lg:w-screen lg:flex-shrink-0 flex-col items-center justify-center px-6 sm:px-12 lg:px-24 py-20 lg:py-0 bg-rose-50/30">
          <div className="panel-content w-full max-w-6xl">
            <div className="mb-16 flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-3 rounded-full border border-rose-200 bg-white px-8 py-3 shadow-sm">
                 <TrendingDown className="text-rose-500" size={18} />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600">Strategic Retrospective</span>
              </div>
              <h3 className="text-6xl font-black text-slate-900 uppercase tracking-tighter">Algorithm Post-Mortem</h3>
              <p className="text-slate-500 max-w-xl mx-auto font-medium">실패를 통한 정교한 학습 과정입니다.</p>
            </div>
            <div className="grid w-full gap-10 sm:grid-cols-2">
               {googleFailureCases.map(c => <div key={c.slug} className="h-full min-h-[480px]"><CaseCard c={c} isLight={true} /></div>)}
            </div>
          </div>
        </div>

        {/* Naver Panel */}
        <div className="panel flex min-h-screen lg:h-screen w-full lg:w-screen lg:flex-shrink-0 flex-col items-center justify-center px-6 sm:px-12 lg:px-24 py-20 lg:py-0 bg-emerald-50/30">
          <div className="panel-content w-full max-w-6xl">
            <div className="mb-16 flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-3 rounded-full border border-emerald-200 bg-white px-8 py-3 shadow-sm">
                 <BarChart3 className="text-emerald-500" size={18} />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Local Ecosystem</span>
              </div>
              <h3 className="text-6xl font-black text-slate-900 uppercase tracking-tighter">Hyper-Local Optimization</h3>
              <p className="text-slate-500 max-w-xl mx-auto font-medium">네이버 검색 생태계에 최적화된 로컬 검색 전략입니다.</p>
            </div>
            <div className="grid w-full gap-10 sm:grid-cols-2">
               {naverCases.map(c => <div key={c.slug} className="h-full min-h-[480px]"><CaseCard c={c} isLight={true} /></div>)}
            </div>
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
