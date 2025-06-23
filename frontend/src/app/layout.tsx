import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riders Club",
  description: "A community for motorcycle enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
