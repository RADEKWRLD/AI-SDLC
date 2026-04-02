"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getAllPosts, type BlogPost } from "@/lib/blog/posts";
import { ArrowRight, Loader2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BATCH_SIZE = 7;

/* ── Card Components ── */

function FeaturedCard({ post, batch }: { post: BlogPost; batch: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-batch={batch}
      className="group card-hover col-span-1 md:col-span-6 bg-surface-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col md:flex-row"
    >
      <div className="md:w-2/5 p-10 md:p-12 flex flex-col justify-center bg-linear-to-br from-primary/5 to-transparent relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full mb-6">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider font-sans">最新文章</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <time className="block mt-4 text-sm text-muted-foreground font-sans">
            {new Date(post.date).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </div>
      </div>
      <div className="md:w-3/5 p-10 md:p-12 flex flex-col justify-center">
        {post.tags && (
          <div className="flex gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted-foreground">{tag}</span>
            ))}
          </div>
        )}
        <p className="text-muted-foreground font-serif leading-[1.85] text-lg">{post.excerpt}</p>
        <div className="mt-8 flex items-center gap-2 text-primary font-medium">
          阅读全文
          <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function CompactCard({ post, batch }: { post: BlogPost; batch: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-batch={batch}
      className="group card-hover bg-surface-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col p-7 h-full"
    >
      {post.tags && (
        <div className="flex gap-2 mb-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{tag}</span>
          ))}
        </div>
      )}
      <h2 className="text-lg font-serif font-medium mb-2 group-hover:text-primary transition-colors leading-snug">
        {post.title}
      </h2>
      <time className="text-xs text-muted-foreground font-sans mb-3">
        {new Date(post.date).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
      </time>
      <p className="text-sm text-muted-foreground font-serif leading-[1.7] flex-1 line-clamp-3">{post.excerpt}</p>
      <div className="mt-4 flex items-center gap-1.5 text-primary text-sm font-medium">
        阅读更多
        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

function WideCard({ post, batch }: { post: BlogPost; batch: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-batch={batch}
      className="group card-hover bg-surface-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col md:flex-row p-7 md:p-8 md:items-center gap-6 h-full"
    >
      <div className="flex-1 min-w-0">
        {post.tags && (
          <div className="flex gap-2 mb-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{tag}</span>
            ))}
          </div>
        )}
        <h2 className="text-xl font-serif font-medium mb-2 group-hover:text-primary transition-colors leading-snug">
          {post.title}
        </h2>
        <p className="text-sm text-muted-foreground font-serif leading-[1.7] line-clamp-2">{post.excerpt}</p>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-2">
        <time className="text-xs text-muted-foreground font-sans">
          {new Date(post.date).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
        </time>
        <div className="flex items-center gap-1.5 text-primary text-sm font-medium">
          阅读更多
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

/* ── Bento: flat grid items with col-span on a 6-col grid ── */
/*  Pattern cycle: A(2+4) → B(4+2) → C(2+2+2) → repeat      */

function bentoItems(posts: BlogPost[], batchOffset: number): React.ReactNode[] {
  const items: React.ReactNode[] = [];
  let i = 0;
  let rowCycle = 0;

  while (i < posts.length) {
    const batch = Math.floor((batchOffset + i) / BATCH_SIZE);
    const pattern = rowCycle % 3;

    if (pattern === 0 && i + 1 < posts.length) {
      // Row A: 2 + 4
      items.push(
        <div key={`b-${batchOffset + i}`} className="col-span-1 md:col-span-2">
          <CompactCard post={posts[i]} batch={batch} />
        </div>,
        <div key={`b-${batchOffset + i + 1}`} className="col-span-1 md:col-span-4">
          <WideCard post={posts[i + 1]} batch={batch} />
        </div>
      );
      i += 2;
    } else if (pattern === 1 && i + 1 < posts.length) {
      // Row B: 4 + 2
      items.push(
        <div key={`b-${batchOffset + i}`} className="col-span-1 md:col-span-4">
          <WideCard post={posts[i]} batch={batch} />
        </div>,
        <div key={`b-${batchOffset + i + 1}`} className="col-span-1 md:col-span-2">
          <CompactCard post={posts[i + 1]} batch={batch} />
        </div>
      );
      i += 2;
    } else if (pattern === 2 && i + 2 < posts.length) {
      // Row C: 2 + 2 + 2
      items.push(
        <div key={`b-${batchOffset + i}`} className="col-span-1 md:col-span-2">
          <CompactCard post={posts[i]} batch={batch} />
        </div>,
        <div key={`b-${batchOffset + i + 1}`} className="col-span-1 md:col-span-2">
          <CompactCard post={posts[i + 1]} batch={batch} />
        </div>,
        <div key={`b-${batchOffset + i + 2}`} className="col-span-1 md:col-span-2">
          <CompactCard post={posts[i + 2]} batch={batch} />
        </div>
      );
      i += 3;
    } else {
      // Fallback: 3 + 3
      items.push(
        <div key={`b-${batchOffset + i}`} className="col-span-1 md:col-span-3">
          <CompactCard post={posts[i]} batch={batch} />
        </div>
      );
      if (i + 1 < posts.length) {
        items.push(
          <div key={`b-${batchOffset + i + 1}`} className="col-span-1 md:col-span-3">
            <CompactCard post={posts[i + 1]} batch={batch} />
          </div>
        );
        i += 2;
      } else {
        i += 1;
      }
    }
    rowCycle++;
  }

  return items;
}

/* ── Page ── */

export default function BlogPage() {
  const allPosts = getAllPosts();
  const rootRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const prevCountRef = useRef(BATCH_SIZE);
  const visibleCountRef = useRef(BATCH_SIZE);

  const displayedPosts = allPosts.slice(0, visibleCount);
  const hasMore = visibleCount < allPosts.length;
  const featured = displayedPosts[0];
  const gridPosts = displayedPosts.slice(1);

  visibleCountRef.current = visibleCount;

  // Hero + first batch GSAP
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const scroller = root.closest("[data-blog-scroller]");
    if (scroller) ScrollTrigger.defaults({ scroller });

    const ctx = gsap.context(() => {
      const ease = "power2.out";

      const heroTl = gsap.timeline({ defaults: { ease } });
      heroTl
        .from("[data-anim='blog-tagline']", { y: 24, opacity: 0, duration: 0.6 })
        .from("[data-anim='blog-title']", { y: 24, opacity: 0, duration: 0.6 }, "-=0.3")
        .from("[data-anim='blog-desc']", { y: 24, opacity: 0, duration: 0.6 }, "-=0.3")
        .from("[data-anim='blog-count']", { y: 16, opacity: 0, duration: 0.4 }, "-=0.2");

      gsap.from("[data-batch='0']", {
        scrollTrigger: { trigger: "[data-anim='blog-grid']", start: "top 85%" },
        opacity: 0, duration: 0.6, stagger: 0.08, ease,
      });
    }, root);

    return () => { ctx.revert(); ScrollTrigger.defaults({ scroller: undefined }); };
  }, []);

  // IntersectionObserver auto-load
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const scroller = sentinel.closest("[data-blog-scroller]");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCountRef.current < allPosts.length) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, allPosts.length));
        }
      },
      { root: scroller || null, rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [allPosts.length]);

  // Animate new batches
  useEffect(() => {
    if (visibleCount === prevCountRef.current) return;
    const batchIndex = Math.ceil(prevCountRef.current / BATCH_SIZE);
    prevCountRef.current = visibleCount;

    requestAnimationFrame(() => {
      const newCards = rootRef.current?.querySelectorAll(`[data-batch='${batchIndex}']`);
      if (!newCards?.length) return;
      gsap.from(newCards, { opacity: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" });
    });
  }, [visibleCount]);

  return (
    <section ref={rootRef} className="py-16 px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <span data-anim="blog-tagline" className="inline-block text-primary text-sm font-medium mb-6 tracking-widest uppercase font-sans">
            Blog
          </span>
          <h1 data-anim="blog-title" className="heading-display text-foreground">
            产品动态与<span className="text-primary">技术分享</span>
          </h1>
          <p data-anim="blog-desc" className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-[1.75] font-serif">
            来自 CycleMind 团队的最新文章：产品更新、使用技巧和技术深度解读。
          </p>
          <div data-anim="blog-count" className="mt-4 text-sm text-muted-foreground font-sans">
            共 {allPosts.length} 篇文章
          </div>
        </div>

        {/* Single flat 6-col Bento Grid — no nested grids, no overlaps */}
        <div data-anim="blog-grid" className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {featured && <FeaturedCard post={featured} batch={0} />}
          {bentoItems(gridPosts, 1)}
        </div>

        {/* Sentinel for auto-load */}
        <div ref={sentinelRef} className="h-4" />
        {hasMore && (
          <div className="flex justify-center items-center gap-2 mt-6 text-sm text-muted-foreground font-sans">
            <Loader2 size={14} className="animate-spin text-primary" />
            加载中...
          </div>
        )}
        {!hasMore && allPosts.length > BATCH_SIZE && (
          <div className="text-center mt-8 text-sm text-muted-foreground font-sans">
            已显示全部 {allPosts.length} 篇文章
          </div>
        )}
      </div>
    </section>
  );
}
