import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PaiperSum - AI Legal Document Analysis",
  description:
    "Understand legal documents in plain English. Automated risk assessment, clause detection, and compliance insights for Terms of Service, Privacy Policies, and contracts.",
  keywords: [
    "legal document analysis",
    "contract review",
    "terms of service analyzer",
    "privacy policy checker",
    "legal AI",
    "document summarizer",
  ],
  authors: [{ name: "PaiperSum" }],
  openGraph: {
    title: "PaiperSum - AI Legal Document Analysis",
    description:
      "Understand legal documents in plain English. Automated risk assessment and clause detection.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PaiperSum - AI Legal Document Analysis",
    description:
      "Understand legal documents in plain English. Automated risk assessment and clause detection.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
