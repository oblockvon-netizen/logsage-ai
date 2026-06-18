import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogSage AI",
  description: "Transform Logs Into Security Intelligence"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
