import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/noto-sans-sc/wght.css";
import "@fontsource-variable/noto-serif-sc/wght.css";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.davidxiong.site'),
  title: "熊乐乐のBlog",
  description: "熊乐乐的个人博客",
  verification: {
    google: [
      "ZJDzikFmXYVXlN1tam8o8ksafNEEijMOw7dEps_oW0I",
      "tb5SEzjyVP1xHwIrbvSN90BS5dQtQAqn_PzLN3zjI8M"
    ],
    other: {
      "baidu-site-verification": "codeva-G4kFwFkkNI",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
