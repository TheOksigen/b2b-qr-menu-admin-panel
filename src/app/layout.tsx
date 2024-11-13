import "./styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "./_components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "./_components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { cookies } from "next/headers";
import ModeToggle from "./_components/theme-switcher";

export const metadata: Metadata = {
  title: "Dashboard Link-a-menu",
  description: "Dashboard Link-a-menu",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: RootLayoutProps) {
  const cookieStore = cookies()
  const defaultOpen = (await cookieStore).get("sidebar:state")?.value === "true"

  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={GeistSans.variable}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
              <main className="flex-1 overflow-y-auto">
                {/* <SidebarTrigger className="mt-3  hidden md:block" /> */}
                {children}
              </main>
            </SidebarProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}