import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ResumeUploadAiModal } from "@/features/resume/components/resume-upload-ai-modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahmad Nurjuwaidi | Software Engineering Fresh Graduate",
  description: "Computer Science (Software Engineering) Fresh Graduate portfolio featuring Next.js 15, React 19, TypeScript, Laravel 12, PostgreSQL, and Supabase projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="relative min-h-full flex flex-col bg-[#0B0F17] text-slate-100 selection:bg-sky-500 selection:text-slate-950 overflow-x-hidden">
        {/* Ambient atmospheric backdrop (glows & subtle grid) */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[750px] h-[600px] rounded-full bg-gradient-to-tr from-sky-500/10 via-teal-400/5 to-transparent blur-[130px]" />
          <div className="absolute top-1/4 right-0 translate-x-1/3 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-indigo-600/10 via-purple-600/5 to-transparent blur-[140px]" />
          <div className="absolute bottom-1/4 left-0 -translate-x-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-600/5 via-teal-500/5 to-transparent blur-[140px]" />
          <div className="absolute inset-0 bg-grid-subtle opacity-70" />
        </div>

        <QueryProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <ResumeUploadAiModal />
        </QueryProvider>
      </body>
    </html>
  );
}
