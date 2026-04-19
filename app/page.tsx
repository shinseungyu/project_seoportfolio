"use client"

import { useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Search, ArrowLeft, MousePointer2, MoveRight, Layers, LayoutGrid, Zap, Globe, BarChart3, TrendingUp, TrendingDown, ChevronRight, Lock, ArrowUpRight } from "lucide-react";
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

function CaseCard({ c }: { c: Case }) {
  const ts = typeStyle[c.type];
  const Icon = ts.icon;
  const href = `/cases/${c.engine}/${c.type}`;
  const count = c.type === "success" ? googleSuccessCases.length : googleFailureCases.length;

  if (!c.ready) {
    return (
      <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.03] bg-white/[0.01] p-8 transition-all duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-white/5`}>
              <Lock size={16} className="text-zinc-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Locked Case</span>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold text-zinc-500">{c.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700">{c.summary}</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-3xl glass p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.03] hover:border-white/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ts.bg} border ${ts.border} transition-transform duration-500 group-hover:scale-110`}>
            <Icon size={18} className={ts.text} />
          </div>
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${ts.text}`}>{ts.label}</span>
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{c.engine} Engine</span>
          </div>
        </div>
        <div className="rounded-full bg-white/5 p-2">
          <ArrowUpRight size={14} className="text-zinc-400" />
        </div>
      </div>
      <div className="mt-8 flex-1">
        <h3 className="text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-indigo-300">
          {c.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
          {c.summary}
        </p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const container = useRef<HTMLDivElement>(null);
  const magneticRef = useRef<HTMLDivElement>(null);
  const totalSites = googleSuccessCases.length + googleFailureCases.length;

  useGSAP(() => {
    // 1. Text Reveal Animation
    gsap.from(".reveal-text", {
      yPercent: 100,
      stagger: 0.1,
      duration: 1.2,
      ease: "power4.out",
    });

    // 2. Bento Reveal
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

    // 3. Horizontal Scroll
    const sections = gsap.utils.toArray(".panel");
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-container",
        pin: true,
        scrub: 1,
        // snap: 1 / (sections.length - 1), // Removed for manual control
        anticipatePin: 1,
        end: () => "+=300%", // Longer, heavier scroll distance
      },
    });

    // 4. Data Counter
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

    // 5. Magnetic Button
    const moveMagnetic = (e: MouseEvent) => {
      const rect = magneticRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(magneticRef.current, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power2.out" });
    };
    const resetMagnetic = () => {
      gsap.to(magneticRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    };
    magneticRef.current?.addEventListener("mousemove", (e) => moveMagnetic(e));
    magneticRef.current?.addEventListener("mouseleave", resetMagnetic);
  }, { scope: container });

  return (
    <div ref={container} className="bg-[#050505] text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Intro Section */}
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
            Technical SEO & Data-Driven Growth Systems.<br />
            Experience the precision of algorithmic optimization.
          </p>

          {/* User Photo: Significantly Larger & More Prominent */}
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
      <section className="horizontal-container flex h-screen overflow-hidden bg-zinc-950/50">
        {/* Intro Panel */}
        <div className="panel flex h-screen w-screen flex-shrink-0 items-center justify-center px-10">
          <div className="max-w-2xl text-center">
            <Layers className="mx-auto mb-10 text-indigo-500" size={80} />
            <h2 className="text-8xl font-black text-white leading-none uppercase tracking-tighter">Case<br />Registry</h2>
            <p className="mt-10 text-zinc-500 text-lg uppercase tracking-[0.4em]">Algorithm Domination Index</p>
          </div>
        </div>
        
        {/* Google Success Panel */}
        <div className="panel flex h-screen w-screen flex-shrink-0 flex-col items-center justify-center px-12 sm:px-24 bg-indigo-950/5">
          <div className="mb-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-6 py-2">
               <Globe className="text-indigo-400" size={18} />
               <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Chapter 01: Google Success</span>
            </div>
            <h3 className="text-4xl font-bold text-white uppercase tracking-tighter">E-E-A-T Optimization</h3>
          </div>
          <div className="grid w-full max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
             {googleSuccessCases.slice(0, 3).map(c => <div key={c.slug} className=""><CaseCard c={c} /></div>)}
          </div>
        </div>

        {/* Google Failure Panel */}
        <div className="panel flex h-screen w-screen flex-shrink-0 flex-col items-center justify-center px-12 sm:px-24 bg-rose-950/5">
          <div className="mb-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-rose-500/20 bg-rose-500/5 px-6 py-2">
               <TrendingDown className="text-rose-400" size={18} />
               <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-300">Chapter 02: Strategic Retrospective</span>
            </div>
            <h3 className="text-4xl font-bold text-white uppercase tracking-tighter">Algorithm Post-Mortem</h3>
          </div>
          <div className="grid w-full max-w-6xl gap-10 sm:grid-cols-2">
             {googleFailureCases.map(c => <div key={c.slug} className=""><CaseCard c={c} /></div>)}
          </div>
        </div>

        {/* Naver Panel */}
        <div className="panel flex h-screen w-screen flex-shrink-0 flex-col items-center justify-center px-12 sm:px-24 bg-emerald-950/5">
          <div className="mb-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-6 py-2">
               <BarChart3 className="text-emerald-400" size={18} />
               <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Chapter 03: Naver Ecosystem</span>
            </div>
            <h3 className="text-4xl font-bold text-white uppercase tracking-tighter">Hyper-Local Optimization</h3>
          </div>
          <div className="grid w-full max-w-6xl gap-10 sm:grid-cols-2">
             {naverCases.map(c => <div key={c.slug} className=""><CaseCard c={c} /></div>)}
          </div>
        </div>

        <div className="panel flex h-screen w-screen flex-shrink-0 items-center justify-center">
          <div className="max-w-md text-center">
            <h2 className="text-7xl font-black text-gradient leading-none uppercase">End of Chapter</h2>
            <p className="mt-4 text-zinc-500">More technical data follows in the registry below.</p>
          </div>
        </div>
      </section>

      {/* 3. Magnetic & Counters Section */}
      <section className="mx-auto max-w-6xl px-6 py-60">
        <div className="grid gap-20 lg:grid-cols-2">
          {/* Counters */}
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

          {/* Magnetic Zone */}
          <div className="flex flex-col items-center justify-center gap-10">
            <div 
              ref={magneticRef}
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

      {/* Final Grid for remaining cases */}
      <section className="mx-auto max-w-6xl px-6 pb-40">
        <div className="mb-12 flex items-center justify-between">
           <h3 className="text-2xl font-bold text-white">Remaining Registry</h3>
           <Globe className="text-zinc-800" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
           {googleCases.slice(3).map(c => <CaseCard key={c.slug} c={c} />)}
           {naverCases.map(c => <CaseCard key={c.slug} c={c} />)}
        </div>
      </section>
    </div>
  );
}
