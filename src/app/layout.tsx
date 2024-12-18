import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";

import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Dashboard Link-a-menu",
  description: "Dashboard Link-a-menu",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en" className={GeistSans.variable}>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              <main className="flex h-screen items-center justify-center overflow-y-auto">
                {/* <SignedOut>
                  <SignInButton />
                </SignedOut> */}
                {children}
              </main>
            </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
