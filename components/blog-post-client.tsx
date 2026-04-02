"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface BlogPostClientProps {
  toc: TocItem[];
  htmlContent: string;
}

export default function BlogPostClient({ toc, htmlContent }: BlogPostClientProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>(toc[0]?.id || "");

  // GSAP entrance animations
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const scroller = el.closest("[data-blog-scroller]");
    if (scroller) {
      ScrollTrigger.defaults({ scroller });
    }

    const ctx = gsap.context(() => {
      const ease = "power2.out";

      gsap.from("[data-anim='post-back']", { y: 16, opacity: 0, duration: 0.5, ease });
      gsap.from("[data-anim='post-accent']", { x: -20, opacity: 0, duration: 0.5, delay: 0.05, ease });
      gsap.from("[data-anim='post-title'] span", {
        y: 40, opacity: 0, duration: 0.5, stagger: 0.015, delay: 0.1, ease: "power3.out",
      });
      gsap.from("[data-anim='post-meta']", { y: 16, opacity: 0, duration: 0.5, delay: 0.4, ease });
      gsap.from("[data-anim='post-cover']", { y: 24, opacity: 0, duration: 0.7, delay: 0.5, ease });
      gsap.from("[data-anim='toc-sidebar']", { x: -20, opacity: 0, duration: 0.6, delay: 0.3, ease });

      // Content blocks scroll-in
      const blocks = el.querySelectorAll(
        ":scope > p, :scope > ul, :scope > ol, :scope > blockquote, :scope > pre, :scope > h1, :scope > h2, :scope > h3, :scope > img"
      );
      blocks.forEach((block) => {
        gsap.from(block, {
          scrollTrigger: { trigger: block, start: "top 90%" },
          y: 20, opacity: 0, duration: 0.6, ease,
        });
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.defaults({ scroller: undefined });
    };
  }, [htmlContent]);

  // Track active heading on scroll
  useEffect(() => {
    if (toc.length === 0) return;

    const scroller = contentRef.current?.closest("[data-blog-scroller]");
    if (!scroller) return;

    const handleScroll = () => {
      let current = "";
      for (const item of toc) {
        const heading = document.getElementById(item.id);
        if (heading && heading.getBoundingClientRect().top <= 120) {
          current = item.id;
        }
      }
      if (current) setActiveId(current);
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [toc]);

  // Click TOC → scrollIntoView on the heading
  const handleTocClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const heading = document.getElementById(id);
    if (!heading) return;
    heading.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  }, []);

  return (
    <div className="flex gap-10 lg:gap-16 relative">
      {/* TOC — left sticky sidebar, lg+ */}
      {toc.length > 0 && (
        <aside data-anim="toc-sidebar" className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-28">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground font-sans mb-4">
              目录
            </div>
            <nav className="space-y-0.5 border-l border-border">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleTocClick(e, item.id)}
                  className={`
                    block text-[13px] leading-relaxed py-1.5 transition-all duration-200
                    ${item.level <= 2 ? "pl-4" : "pl-7 text-[12px]"}
                    ${
                      activeId === item.id
                        ? "text-primary font-medium border-l-2 border-primary -ml-px"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="md-content font-serif min-w-0 flex-1 max-w-3xl"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
