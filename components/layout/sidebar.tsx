"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "工作台", icon: LayoutDashboard },
  { href: "/profile", label: "个人资料", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1A1A1A] flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-[#2E2E2E]">
        <Link href="/dashboard" className="text-xl font-extrabold tracking-tight text-white">
          AI-SDLC
        </Link>
        <p className="text-xs text-[#666] mt-1">AI 驱动软件设计</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300",
              pathname.startsWith(item.href)
                ? "bg-[var(--primary)] text-white font-semibold shadow-sm"
                : "text-[#999] hover:bg-[#2A2A2A] hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-[#2E2E2E]">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#999] hover:bg-[#2A2A2A] hover:text-white w-full transition-all duration-300"
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </button>
      </div>
    </aside>
  );
}
