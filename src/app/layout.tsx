import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "./_components/theme-provider";
import { Header } from "./_components/header";

export const metadata: Metadata = {
  title: "Dashboard Link-a-menu",
  description: "Dashboard Link-a-menu",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header ownerName="John" />
              <div className="flex-1">{children}</div>
            </div>            
          </TRPCReactProvider>
        </ThemeProvider>
      </body> 
    </html>
  );
}
