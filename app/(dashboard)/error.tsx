"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        出错了
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] text-center max-w-md">
        {error.message || "页面加载时发生了意外错误，请重试。"}
      </p>
      <Button onClick={reset}>重试</Button>
    </div>
  );
}
