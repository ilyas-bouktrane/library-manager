import { Outfit } from "next/font/google";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_PAGE_WIDTH } from "@/lib/consts";
import { Header } from "@/components/custom/header";
import { Footer } from "@/components/custom/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import { SettingsProvider } from "@/components/settings/settings-context";
import { getSettings } from "@/lib/settings";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Library Manager",
  description:
    "A system that helps library managers effectively organize book collections and track member loans using an automated database. It manages book availability, borrower records, and return dates while automating email notifications for overdue items.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  return (
    <html
      lang="en"
      className={`${cn("h-full", "antialiased", "font-sans", outfit.variable)} flex flex-col items-center`}
      suppressHydrationWarning
    >
      <body
        style={{ width: DEFAULT_PAGE_WIDTH, paddingTop: DEFAULT_HEADER_HEIGHT }}
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader />
          <Toaster />
          <SettingsProvider value={settings}>
            <Header />
            {children}
            <Footer />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
