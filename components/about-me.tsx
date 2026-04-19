"use client"

import { useRef } from "react"
import { Layout, Server, Sparkles, Target, MoveDown } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      phase: "01",
      title: "Strategic Discovery",
      subtitle: "Planning & Strategy",
      icon: Layout,
      tags: ["Strategy", "UX Design"],
      desc: "비즈니스의 목적을 분석하고 타겟 키워드에 최적화된 시각적 전략을 수립합니다. 단순 디자인을 넘어 전술적인 기획으로부터 성장의 단초를 찾습니다.",
      bg: "bg-[#050505]",
      accent: "text-indigo-400",
      glow: "from-indigo-500/10"
    },
    {
      phase: "02",
      title: "Semantic Engineering",
      subtitle: "0 to 1 SEO Build",
      icon: Server,
      tags: ["HTML", "Semantic", "Schema"],
      desc: "검색 엔진이 가장 선호하는 시멘틱 마크업을 통해 사이트의 뼈대를 구축합니다. 0에서 1을 만드는 과정에 이미 완벽한 SEO 관점을 녹여냅니다.",
      bg: "bg-[#060606]",
      accent: "text-emerald-400",
      glow: "from-emerald-500/10"
    },
    {
      phase: "03",
      title: "AI-Powered Efficiency",
      subtitle: "Augmented Development",
      icon: Sparkles,
      tags: ["Vercel AI", "v0", "Cursor"],
      desc: "디자인과 개발 전반에 AI를 활용하여 극강의 효율을 만들어냅니다. 기술의 한계를 AI로 돌파하여 고퀄리티 결과물을 빠른 속도로 제공합니다.",
      bg: "bg-[#050505]",
      accent: "text-rose-400",
      glow: "from-rose-500/10"
    },
    {
      phase: "04",
      title: "End-to-End Delivery",
      subtitle: "A to Z Implementation",
      icon: Target,
      tags: ["Vercel", "PHP", "Git", "Deploy"],
      desc: "기획부터 퍼블리싱, 배포까지 전 과정을 직접 책임집니다. 디자인에서 배포까지의 모든 접점을 제어함으로써 완벽한 최적화 시스템을 완성합니다.",
      bg: "bg-[#070707]",
      accent: "text-indigo-400",
      glow: "from-indigo-500/10"
    }
  ]

  useGSAP(() => {
    const phases = gsap.utils.toArray(".phase-layer")
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=250%", // Faster transitions: 2.5 screens worth of scroll instead of 4
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    })

    phases.forEach((phase: any, i) => {
      // Phase Entrance (fade in from slightly below)
      if (i > 0) {
        tl.fromTo(phase, 
          { opacity: 0, y: 30, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" }
        )
      } else {
        // Initial state for first phase
        gsap.set(phase, { opacity: 1, y: 0, filter: "blur(0px)" })
      }

      // Duration to "Hold" the phase visible
      tl.to({}, { duration: 1 })

      // Phase Exit (fade out upwards, except last one)
      if (i < phases.length - 1) {
        tl.to(phase, { 
          opacity: 0, 
          y: -30, 
          filter: "blur(10px)", 
          duration: 1, 
          ease: "power2.in" 
        })
      }
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-[#050505]">
      {/* Fixed Background Context */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/noise.png')] mix-blend-overlay" />

      <div className="relative h-screen w-full flex items-center justify-center">
        {steps.map((step, i) => (
          <div 
            key={i} 
            className="phase-layer absolute inset-0 flex items-center justify-center px-6 opacity-0"
            style={{ pointerEvents: i === 0 ? 'auto' : 'none' }}
          >
            {/* Subtle Glow Background (Animated with Layer) */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial ${step.glow} to-transparent opacity-20 blur-[100px]`} />
            
            {/* Massive Background Number */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black text-white/[0.02] pointer-events-none select-none italic leading-none whitespace-nowrap">
              {step.phase}
            </div>

            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
              {/* Phase Badge */}
              <div className="flex items-center gap-3 mb-10">
                <span className="h-[1px] w-12 bg-white/20" />
                <span className={`text-xs font-black uppercase tracking-[0.5em] ${step.accent}`}>Phase {step.phase}</span>
                <span className="h-[1px] w-12 bg-white/20" />
              </div>

              {/* Icon */}
              <div className={`mb-12 h-24 w-24 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl transition-transform hover:scale-110`}>
                <step.icon size={48} className={step.accent} />
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter text-center mb-6 leading-none">
                {step.title}
              </h2>
              <h4 className={`${step.accent} text-xl md:text-2xl font-bold uppercase tracking-[0.2em] mb-12`}>
                {step.subtitle}
              </h4>

              {/* Narrative */}
              <p className="max-w-3xl text-center text-xl md:text-2xl text-zinc-400 leading-relaxed font-medium mb-12">
                {step.desc}
              </p>

              {/* Tech Badges */}
              <div className="flex flex-wrap justify-center gap-4">
                {step.tags.map(tag => (
                  <span key={tag} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-zinc-400 uppercase tracking-widest hover:border-white/30 hover:text-white transition-all">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Persistent Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-zinc-700">
           <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Keep Scrolling</span>
           <MoveDown size={20} className="animate-bounce" />
        </div>
      </div>
    </div>
  )
}
