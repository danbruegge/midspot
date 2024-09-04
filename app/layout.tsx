import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Places Between",
  description: "Find the places between the places you know.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
