import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "Mangrove BPK RUN",
  description: "Join us for the Mangrove BPK RUN on 25 May 2025. Run for nature!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${prompt.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
