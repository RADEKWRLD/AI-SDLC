import type { Metadata } from "next";
import BlogNav from "@/components/blog-nav";
import { Github as GithubIcon, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - CycleMind",
  description: "CycleMind 团队博客：产品更新、技术分享与最佳实践。",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-blog-scroller className="flex flex-col bg-background noise-overlay h-screen overflow-y-auto">
      <BlogNav />
      <main className="flex-1 pt-20">{children}</main>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-10 section-dark">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="font-serif font-medium text-primary text-xl">CycleMind</div>
            <p className="text-muted-foreground text-sm">© 2026 CycleMind · AI 驱动的软件设计平台</p>
          </div>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full bg-surface-lowest flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
              href="https://github.com/RADEKWRLD"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon size={18} />
            </a>
            <a
              className="w-10 h-10 rounded-full bg-surface-lowest flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
              href="#"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
