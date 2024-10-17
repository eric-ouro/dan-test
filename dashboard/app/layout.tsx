import HeaderAuth from "@components/header-auth";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "O U R O",
  description: "Ouro Circularity ⥀ ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground font-dm-mono">
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full flex justify-between items-center p-3 px-5 text-sm font-dm-mono">
                  <div className="flex gap-5 items-center">
                    <Link href={"/"}>OURO Alpha / Plastic</Link>
                    {/* <Link href={"/dashboard"}>Dashboard</Link> */}
                  </div>
                  <HeaderAuth />
                </div>
              </nav>
              <div className="flex flex-col gap-20 w-full p-5">
                {children}
              </div>
            </div>
          </main>
      </body>
    </html>
  );
}
