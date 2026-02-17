import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealthCare Pro - Your Trusted Healthcare Partner",
  description: "Connect with expert healthcare professionals, manage your medical records, and access quality care whenever you need it.",
  keywords: ["healthcare", "medical", "doctors", "patient portal", "telemedicine", "health"],
  openGraph: {
    title: "HealthCare Pro - Your Trusted Healthcare Partner",
    description: "Connect with expert healthcare professionals and access quality care.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthCare Pro",
    description: "Your trusted healthcare partner.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
