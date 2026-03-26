import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

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
      className={cn("h-full", "antialiased", "font-sans", outfit.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
