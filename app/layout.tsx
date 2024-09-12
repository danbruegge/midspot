import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Midspot",
  description: "Let's find a midspot to meet!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
