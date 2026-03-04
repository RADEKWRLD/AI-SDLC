import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">{children}</main>
      </div>
    </SessionProvider>
  );
}
