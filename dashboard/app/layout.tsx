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
        <body className="bg-background text-foreground max-w-[1024px] mx-auto">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <nav className="w-full flex justify-center py-4">
              <div className="w-full flex justify-between items-center sans">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="text-foreground">
                    <path d="M 10.969 1.513 L 9 0.422 L 6.469 1.828 L 9 3.234 L 10.372 2.469 C 13.624 3.111 16.087 5.985 16.087 9.422 C 16.087 13.331 12.909 16.509 9 16.509 C 5.091 16.509 1.912 13.331 1.912 9.422 C 1.912 7.279 2.874 5.361 4.382 4.061 L 5.625 2.391 L 3.662 3.268 C 1.869 4.81 0.84 7.058 0.844 9.422 C 0.844 13.928 4.494 17.578 9 17.578 C 13.506 17.578 17.156 13.928 17.156 9.422 C 17.156 5.597 14.518 2.396 10.969 1.513 Z" />
                  </svg>
                  <div className="flex gap-3 items-center font-medium">
                  <Link href={"/"}>OURO</Link>
                </div>
                </div>
                  <HeaderAuth />
              </div>
            </nav>
            <div className=" min-h-screen flex flex-col gap-8">
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
