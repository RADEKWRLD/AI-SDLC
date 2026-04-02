import { readFile } from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/blog/posts";
import BlogPostClient from "@/components/blog-post-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post ? `${post.title} - CycleMind Blog` : "Post Not Found",
    description: post?.excerpt,
  };
}

/** Server-side: parse headings from HTML, inject IDs, return TOC + processed HTML */
function parseHtmlWithToc(html: string) {
  const toc: { id: string; text: string; level: number }[] = [];
  let index = 0;

  const processed = html.replace(
    /<(h[123])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag, attrs, content) => {
      const id = `heading-${index++}`;
      const text = content.replace(/<[^>]*>/g, "").trim();
      const level = parseInt(tag[1]);
      toc.push({ id, text, level });
      return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
    }
  );

  return { toc, html: processed };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  if (/[./\\]/.test(slug)) {
    notFound();
  }

  const post = getPostBySlug(slug);
  if (!post) notFound();

  let rawHtml: string;
  try {
    const htmlPath = path.join(process.cwd(), "public", "blog", `${slug}.html`);
    rawHtml = await readFile(htmlPath, "utf-8");
  } catch {
    notFound();
  }

  const { toc, html: htmlContent } = parseHtmlWithToc(rawHtml);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link
        href="/blog"
        data-anim="post-back"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
      >
        <ArrowLeft size={14} />
        返回博客
      </Link>

      <header className="relative mb-16 pb-12 border-b border-border">
        <div data-anim="post-accent" className="flex items-center gap-4 mb-8">
          <div className="w-10 h-1 rounded-full bg-primary" />
          {post.tags && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider font-sans"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <h1
          data-anim="post-title"
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-[1.1] tracking-tight"
        >
          {post.title.split("").map((char, i) => (
            <span key={i} className={char === " " ? "" : "inline-block"}>
              {char}
            </span>
          ))}
        </h1>

        <div data-anim="post-meta" className="mt-8 flex items-center gap-5">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium font-sans text-foreground">CycleMind Team</span>
            <time className="text-sm text-muted-foreground font-sans">
              {new Date(post.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>

        {post.coverImage && (
          <img
            data-anim="post-cover"
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-2xl mt-10"
          />
        )}
      </header>

      <BlogPostClient toc={toc} htmlContent={htmlContent} />
    </div>
  );
}
