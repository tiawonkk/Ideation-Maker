import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/layout/AppProvider";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title:
    "Hackathon Brief Generator AI — From Hackathon Theme to Winning Project Strategy",
  description:
    "AI Product Strategist and Hackathon Planning Workspace. Validate problems with real citations, design solutions, align with judges, and export an execution-ready A4 PDF project brief.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-200">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
