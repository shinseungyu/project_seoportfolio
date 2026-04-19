"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { Search, ArrowLeft, MousePointer2, MoveRight, Layers, LayoutGrid, Zap } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export default function GSAPLab() {
  const container = useRef<HTMLDivElement>(null)
  const magneticRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // 1. Text Reveal Animation
    gsap.from(".reveal-text", {
      yPercent: 100,
      stagger: 0.1,
      duration: 1.2,
      ease: "power4.out",
    })

    // 2. Bento Reveal (ScrollTrigger)
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
    })

    // 3. Horizontal Scroll Section
    const sections = gsap.utils.toArray(".panel")
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-container",
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + (container.current?.offsetWidth || 0),
      },
    })

    // 4. Data Counter
    const counters = gsap.utils.toArray(".counter")
    counters.forEach((counter: any) => {
      const target = parseInt(counter.innerText)
      counter.innerText = "0"
      gsap.to(counter, {
        scrollTrigger: {
          trigger: counter,
          start: "top 90%",
        },
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power2.out",
      })
    })

    // 5. Magnetic Button
    const moveMagnetic = (e: MouseEvent) => {
      const rect = magneticRef.current?.getBoundingClientRect()
      if (!rect) return
      
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      
      gsap.to(magneticRef.current, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.4,
        ease: "power2.out",
      })
    }

    const resetMagnetic = () => {
      gsap.to(magneticRef.current, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      })
    }

    magneticRef.current?.addEventListener("mousemove", (e) => moveMagnetic(e))
    magneticRef.current?.addEventListener("mouseleave", resetMagnetic)
  }, { scope: container })

  return (
    <div ref={container} className="bg-[#050505] text-slate-200 selection:bg-indigo-500/30">
      {/* Intro Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        
        <div className="mb-10 overflow-hidden">
          <h1 className="reveal-text text-5xl font-black tracking-tighter text-white sm:text-7xl md:text-9xl lg:text-[10rem] uppercase leading-none">
            Interaction
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="reveal-text text-5xl font-black tracking-tighter sm:text-7xl md:text-9xl lg:text-[10rem] uppercase leading-none text-gradient text-center">
            Laboratory
          </h1>
        </div>

        <p className="mt-12 max-w-xl text-center text-sm font-medium text-zinc-500 leading-relaxed uppercase tracking-[0.3em]">
          Premium animations powered by GSAP & ScrollTrigger.<br />
          Experience the difference of mechanical precision.
        </p>

        <div className="mt-20 animate-bounce text-zinc-700">
          <MoveRight size={24} className="rotate-90" />
        </div>
      </section>

      {/* 1. Bento Reveal Section */}
      <section className="mx-auto max-w-5xl px-6 py-40">
        <div className="mb-20 flex flex-col items-start gap-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <LayoutGrid size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Technique 01</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white">Bento Stagger Reveal</h2>
          <p className="max-w-md text-sm text-zinc-500">
            Elements smoothly emerge with perspective and weight as they enter the viewport.
          </p>
        </div>

        <div className="bento-grid grid gap-6 sm:grid-cols-3">
          <div className="bento-item glass col-span-2 h-[300px] rounded-3xl p-8 flex flex-col justify-end overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="relative text-2xl font-bold text-white">Large Focus</h3>
            <p className="relative text-sm text-zinc-500 mt-2 italic">01. Priority Node</p>
          </div>
          <div className="bento-item glass h-[300px] rounded-3xl p-8 flex flex-col items-center justify-center gap-4">
             <div className="h-20 w-20 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                <Zap size={30} className="text-emerald-400" />
             </div>
             <span className="text-xs font-bold text-zinc-400">Core Engine</span>
          </div>
          <div className="bento-item glass h-[250px] rounded-3xl p-8">
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-indigo-500" />
             </div>
             <p className="mt-4 text-xs font-bold text-zinc-500 uppercase tracking-tighter">Engagement</p>
          </div>
          <div className="bento-item glass col-span-2 h-[250px] rounded-3xl p-8 flex items-center justify-between">
             <div className="space-y-4">
                <div className="h-2 w-40 bg-zinc-800 rounded-full" />
                <div className="h-2 w-24 bg-zinc-800 rounded-full" />
                <div className="h-2 w-32 bg-zinc-800 rounded-full" />
             </div>
             <BarChart3Icon className="h-20 w-20 text-zinc-700 opacity-20" />
          </div>
        </div>
      </section>

      {/* 2. Horizontal Scroll Section */}
      <section className="horizontal-container flex h-screen overflow-hidden bg-zinc-950/50">
        <div className="panel flex h-screen w-screen flex-shrink-0 items-center justify-center px-10">
          <div className="max-w-md">
            <Layers className="mb-6 text-indigo-500" size={40} />
            <h2 className="text-5xl font-black text-white">Horizontal Processing</h2>
            <p className="mt-4 text-zinc-500">Scroll down to see the horizontal movement of context. This is ideal for timelines or gallery showcases.</p>
          </div>
        </div>
        <div className="panel flex h-screen w-screen flex-shrink-0 items-center justify-center bg-indigo-900/10">
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-40 w-40 rounded-2xl glass flex items-center justify-center text-zinc-700 text-3xl font-black">{i}</div>
            ))}
          </div>
        </div>
        <div className="panel flex h-screen w-screen flex-shrink-0 items-center justify-center">
          <h2 className="text-7xl font-black text-gradient">End of Stream</h2>
        </div>
      </section>

      {/* 3. Magnetic & Counters Section */}
      <section className="mx-auto max-w-5xl px-6 py-60">
        <div className="grid gap-20 md:grid-cols-2">
          {/* Counters */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Mechanical Counters</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Scroll triggered data visualization</p>
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="counter text-8xl font-black text-white">4500</span>
                  <span className="text-2xl font-bold text-indigo-500 border-b-4 border-indigo-500">+</span>
                </div>
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-tighter mt-2">Crawled Pages / Sec</span>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="counter text-8xl font-black text-white">99</span>
                  <span className="text-2xl font-bold text-emerald-500">%</span>
                </div>
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-tighter mt-2">Optimization Score</span>
              </div>
            </div>
          </div>

          {/* Magnetic */}
          <div className="flex flex-col items-center justify-center gap-10">
            <div 
              ref={magneticRef}
              className="group relative flex h-60 w-60 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] cursor-none shadow-2xl transition-shadow hover:shadow-indigo-500/10"
            >
              <div className="pointer-events-none flex flex-col items-center gap-2">
                <MousePointer2 className="text-indigo-400 mb-2 group-hover:scale-125 transition-transform" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Magnetic Zone</span>
              </div>
              
              {/* Fake cursor */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white mix-blend-difference" />
              </div>
            </div>
            
            <p className="text-center text-[10px] text-zinc-600 uppercase tracking-[0.4em]">
              Hover to engage magnetic force field
            </p>
          </div>
        </div>
      </section>

      {/* Footer / Back */}
      <section className="py-20 flex flex-col items-center justify-center border-t border-white/5">
        <Link 
          href="/"
          className="group flex items-center gap-3 text-sm font-bold text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Portfolio
        </Link>
      </section>
    </div>
  )
}

function BarChart3Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
}
