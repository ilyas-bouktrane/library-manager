import { Outfit } from "next/font/google";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_PAGE_WIDTH } from "@/lib/consts";
import { Header } from "@/components/others/header";
import { Footer } from "@/components/others/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { SettingsProvider } from "@/components/settings/settings-context";
import { getSettings } from "@/lib/settings";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Library Manager",
  description:
    "A system that helps library managers effectively organize book collections and track member loans using an automated database. It manages book availability, borrower records, and return dates while automating email notifications for overdue items.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const settings = await getSettings();

  return (
    <html
      lang={locale}
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
          <NextIntlClientProvider locale={locale}>
            <NextTopLoader />
            <Toaster />
            <SettingsProvider value={settings}>
              <Header />
              {children}
              <Footer />
            </SettingsProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
