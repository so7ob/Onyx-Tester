import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "اختبارات ترقية ONYX",
  description: "تنفيذ اختبارات العمليات الأساسية حسب النظام والشاشة ومتابعة النتائج والأدلة.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
