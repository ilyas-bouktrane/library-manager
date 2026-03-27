import { Outfit } from "next/font/google";
import { HEADER_HEIGHT, PAGE_WIDTH } from "@/lib/consts";
import { Header } from "@/components/custom/header";
import { Footer } from "@/components/custom/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Library Manager",
  description:
    "A system that helps library managers effectively organize book collections and track member loans using an automated database. It manages book availability, borrower records, and return dates while automating email notifications for overdue items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cn("h-full", "antialiased", "font-sans", outfit.variable)} flex flex-col items-center`}
      suppressHydrationWarning
    >
      <body
        style={{ width: PAGE_WIDTH, paddingTop: HEADER_HEIGHT }}
        className="min-h-full flex flex-col"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader />
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
