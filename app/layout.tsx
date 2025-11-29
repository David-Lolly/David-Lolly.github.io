import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "熊乐乐のBlog",
  description: "熊乐乐的个人博客",
  icons: {
    icon: "/static/images/avatar.jpg",
    shortcut: "/static/images/avatar.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/static/images/avatar.jpg" type="image/jpeg" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
