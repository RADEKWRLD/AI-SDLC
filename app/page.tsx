"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { num: "01", title: "需求结构化", desc: "自然语言需求自动解析为结构化模块，AI 智能拆解功能点与约束条件" },
  { num: "02", title: "架构图生成", desc: "自动生成 Mermaid 架构图，展示系统模块划分与依赖关系" },
  { num: "03", title: "ER 图生成", desc: "从需求中识别数据实体与关联，自动生成 ER 关系图" },
  { num: "04", title: "API 规范输出", desc: "基于架构设计自动生成 RESTful API 接口文档" },
  { num: "05", title: "发展计划", desc: "AI 制定阶段性开发路线图，包含里程碑与风险评估" },
];

const showcases = [
  {
    tag: "多 Agent 并行",
    title: "五大 Agent 协同工作",
    desc: "Orchestrator 智能分析需求后，同时调度需求分析、架构设计、ER 建模、API 规范、计划制定五个专业 Agent 并行处理，实时流式返回进度。",
    img: "/five-agents.png",
    imgAlt: "Agent 并行架构示意",
  },
  {
    tag: "实时渲染",
    title: "Mermaid 图表即时预览",
    desc: "架构图和 ER 图生成后立即渲染为可交互的矢量图形，支持缩放、平移和 SVG 导出，编辑代码后实时刷新预览。",
    img: "/mermaid-display.png",
    imgAlt: "Mermaid 渲染预览截图",
  },
  {
    tag: "模板库",
    title: "快速搭建你的项目",
    desc: "内置丰富的项目模板，覆盖 Web 应用、移动端、微服务等常见架构。选择模板一键生成完整设计文档，快速启动你的下一个项目。",
    img: "/template.png",
    imgAlt: "模板库截图",
  },
];

const workflow = [
  { step: "1", label: "输入需求", desc: "用自然语言描述你的系统需求" },
  { step: "2", label: "AI 分析", desc: "Orchestrator 分析并分配 Agent" },
  { step: "3", label: "并行生成", desc: "多个 Agent 同时处理不同产物" },
  { step: "4", label: "实时预览", desc: "五类文档即时渲染到预览面板" },
  { step: "5", label: "迭代演化", desc: "追加需求自动更新，版本持续演进" },
];

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = rootRef.current;
    if (!scroller) return;

    // Set default scroller for all ScrollTriggers
    ScrollTrigger.defaults({ scroller });

    const ctx = gsap.context(() => {
      // Hero entrance
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from("[data-anim='tagline']", { y: 30, opacity: 0, duration: 0.6 })
        .from("[data-anim='headline']", { y: 40, opacity: 0, duration: 0.7 }, "-=0.3")
        .from("[data-anim='desc']", { y: 30, opacity: 0, duration: 0.6 }, "-=0.3")
        .from("[data-anim='cta']", { y: 20, opacity: 0, duration: 0.5 }, "-=0.2");

      // Feature cards — left to right reveal
      gsap.from("[data-anim='feature']", {
        scrollTrigger: { trigger: "[data-section='features']", start: "top 80%" },
        x: -40, opacity: 0, duration: 0.5, stagger: 0.12, ease: "power2.out",
      });

      // Showcase sections - alternating slide
      document.querySelectorAll("[data-anim='showcase']").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          x: i % 2 === 0 ? -60 : 60, opacity: 0, duration: 0.8, ease: "power2.out",
        });
      });

      // Showcase image placeholders
      gsap.from("[data-anim='showcase-img']", {
        scrollTrigger: { trigger: "[data-section='showcases']", start: "top 70%" },
        scale: 0.9, opacity: 0, duration: 0.7, stagger: 0.2, ease: "back.out(1.4)",
      });

      // Workflow steps
      gsap.from("[data-anim='step']", {
        scrollTrigger: { trigger: "[data-section='workflow']", start: "top 80%" },
        y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out",
      });

      // Section titles
      document.querySelectorAll("[data-anim='section-title']").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
        });
      });

      // CTA banner
      gsap.from("[data-anim='cta-banner']", {
        scrollTrigger: { trigger: "[data-section='cta-banner']", start: "top 85%" },
        y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
      });
    }, rootRef);

    return () => {
      ctx.revert();
      ScrollTrigger.defaults({ scroller: undefined });
    };
  }, []);

  return (
    <div ref={rootRef} className="flex flex-col bg-[var(--background)] overflow-y-auto h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight">CycleMind</h1>
          <div className="flex gap-3 items-center">
            <Link href="/login" className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--secondary)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all duration-300">
              登录
            </Link>
            <Link href="/register" className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--primary)] text-white hover:brightness-110 transition-all duration-300 shadow-sm">
              开始使用
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative z-10 min-h-[85vh] pt-20 pb-24 px-6 lg:px-10 overflow-hidden">
        <div className="absolute top-1/2 -right-[-10%] -translate-y-1/2 opacity-[0.15] pointer-events-none select-none">
          <img src="/logo.svg" alt="" className="w-[500px] h-[500px] animate-[spin_20s_linear_infinite]" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl">
            <p data-anim="tagline" className="text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-6">
              AI-Powered Software Design
            </p>
            <h2 data-anim="headline" className="heading-display text-[var(--foreground)]">
              从需求到设计
              <br />
              <span className="text-[var(--primary)]">AI 一步到位</span>
            </h2>
            <p data-anim="desc" className="mt-8 text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl leading-relaxed font-light">
              输入自然语言需求，AI 自动生成架构图、ER 图、API 规范和发展计划。
              五大 Agent 并行协作，SSE 实时推送，版本自动追踪。
            </p>
            <div data-anim="cta" className="mt-10 flex gap-4 items-center flex-wrap">
              <Link href="/register" className="px-8 py-4 rounded-xl bg-[var(--primary)] text-white text-base font-bold hover:brightness-110 transition-all duration-300 shadow-lg shadow-[var(--primary)]/20">
                免费开始 &rarr;
              </Link>
              <Link href="/login" className="px-8 py-4 rounded-xl bg-[var(--secondary)] text-base font-semibold hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all duration-300">
                已有账号
              </Link>
            </div>
          </div>
        </div>
      </section>

      <hr className="separator-editorial max-w-7xl mx-auto" />

      {/* ===== Features Grid (5 columns) ===== */}
      <section data-section="features" className="relative z-0 py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div data-anim="section-title" className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-3">Core Features</p>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">五大核心能力</h3>
            <p className="mt-4 text-[var(--muted-foreground)] max-w-xl mx-auto">从需求输入到设计产出，一键生成完整的软件设计文档</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((f) => (
              <div key={f.num} data-anim="feature" className="group p-6 rounded-xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.06)] card-hover">
                <span className="text-3xl font-extrabold text-[var(--primary)]/20 group-hover:text-[var(--primary)]/40 transition-all duration-300">{f.num}</span>
                <h4 className="mt-3 text-lg font-bold tracking-tight">{f.title}</h4>
                <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="separator-editorial max-w-7xl mx-auto" />

      {/* ===== Showcases (alternating layout + image placeholders) ===== */}
      <section data-section="showcases" className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto space-y-32">
          {showcases.map((s, i) => (
            <div key={i} data-anim="showcase" className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-20`}>
              <div className="flex-1 max-w-lg">
                <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-widest mb-3">{s.tag}</p>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{s.title}</h3>
                <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed">{s.desc}</p>
              </div>
              <div data-anim="showcase-img" className="flex-1 w-full">
                <img src={s.img} alt={s.imgAlt} className="w-full rounded-2xl border border-[var(--accent)] shadow-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="separator-editorial max-w-7xl mx-auto" />

      {/* ===== Workflow ===== */}
      <section data-section="workflow" className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div data-anim="section-title" className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-3">How It Works</p>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">五步完成软件设计</h3>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-6">
            {workflow.map((w, i) => (
              <div key={i} data-anim="step" className="flex-1 relative">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {w.step}
                  </div>
                  {i < workflow.length - 1 && <div className="hidden md:block flex-1 h-px bg-[var(--primary)]/20" />}
                </div>
                <h4 className="font-bold text-base">{w.label}</h4>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="separator-editorial max-w-7xl mx-auto" />

      {/* ===== CTA Banner ===== */}
      <section data-section="cta-banner" className="py-24 px-6 lg:px-10">
        <div data-anim="cta-banner" className="max-w-4xl mx-auto text-center bg-[var(--primary)] rounded-3xl px-8 py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">开始用 AI 设计你的下一个项目</h3>
            <p className="mt-4 text-white/70 max-w-lg mx-auto">无需手动绘图，无需编写模板。输入需求，CycleMind 帮你生成一切。</p>
            <div className="mt-8">
              <Link href="/register" className="px-8 py-4 rounded-xl bg-white text-[var(--primary)] text-base font-bold hover:bg-white/90 transition-all duration-300 shadow-lg shadow-black/10">
                免费注册 &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-10 px-6 bg-[var(--secondary)]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <a href="https://github.com/RADEKWRLD" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[var(--primary)] hover:brightness-110 transition-all">
            RADEKWRLD
          </a>
          <span className="text-xs text-[var(--muted-foreground)]">&copy; 2026 CycleMind - AI-Powered Software Design</span>
        </div>
      </footer>
    </div>
  );
}
