import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL('https://david-lolly.github.io'),
  title: "熊乐乐のBlog",
  description: "熊乐乐的个人博客",
  verification: {
    google: "ZJDzikFmXYVXlN1tam8o8ksafNEEijMOw7dEps_oW0I",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
