import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AiChatFloatingButton } from "@/features/ai-chat/components/ai-chat-floating-button";
import { AiChatModal } from "@/features/ai-chat/components/ai-chat-modal";
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
      <body className="min-h-full flex flex-col bg-[#0B0F17] text-slate-100 selection:bg-sky-500 selection:text-slate-950">
        <QueryProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <AiChatFloatingButton />
          <AiChatModal />
          <ResumeUploadAiModal />
        </QueryProvider>
      </body>
    </html>
  );
}
