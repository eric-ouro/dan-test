import HeaderAuth from "@components/header-auth";
import { ThemeSwitcher } from "@components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import StoreProvider from "@/lib/store/provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Ouro Circularity",
  description: "Ouro Circularity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <html lang="en" className={GeistSans.className} suppressHydrationWarning>
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="/favicon.svg" />
        </head>
        <body className="bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  <Link href={"/"}>OURO</Link>
                </div>
                <div className="flex gap-5 items-center">
                  <HeaderAuth />
                  <ThemeSwitcher />
                </div>
              </div>
            </nav>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
