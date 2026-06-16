import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RuutPilot - Revenue Command Center for Med Spas",
  description:
    "RuutPilot helps med and beauty spas find missed leads, stalled quotes, unpaid invoices, follow-ups, and review opportunities before revenue slips away.",
  keywords: [
    "revenue operations system for med spas",
    "business operations audit for beauty spas",
    "lead follow-up system for service businesses",
    "spa revenue leakage audit",
    "RuutPilot",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
