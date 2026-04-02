"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "Blog" },
];

export default function BlogNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-ambient">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-4">
        <Link href="/" className="text-2xl font-serif font-medium tracking-normal text-primary">
          CycleMind
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex gap-3 items-center">
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-medium rounded-full bg-secondary hover:bg-accent hover:text-primary transition-all duration-300 btn-press focus-anthropic"
          >
            登录
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-medium rounded-full bg-primary text-white hover:opacity-90 transition-all duration-300 shadow-sm btn-press focus-anthropic"
          >
            开始使用
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted-foreground hover:text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-medium rounded-full bg-secondary hover:bg-accent hover:text-primary transition-all duration-300 btn-press focus-anthropic"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-medium rounded-full bg-primary text-white hover:opacity-90 transition-all duration-300 shadow-sm btn-press focus-anthropic"
            >
              开始使用
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
