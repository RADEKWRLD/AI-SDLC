import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-SDLC - AI 驱动的软件设计自动化平台",
  description: "输入自然语言需求，AI 自动生成架构图、ER 图、API 规范和发展计划",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${interTight.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
