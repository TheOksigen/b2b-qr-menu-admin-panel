import "./styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "./_components/theme-provider";
import { api } from "@/trpc/server";
import { SidebarProvider, SidebarTrigger } from "./_components/ui/sidebar";
import { AppSidebar } from "./_components/app-slidebar";
import { cookies } from "next/headers";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


export const metadata: Metadata = {
  title: "Dashboard Link-a-menu",
  description: "Dashboard Link-a-menu",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

interface RootLayoutProps {
  children: React.ReactNode;
  props: {
    id: string;
  };
}

export default async function RootLayout({
  children,
  props
}: RootLayoutProps) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"



  // const { data } = api.restaurant.getById.useQuery({ id: props.id })
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${GeistSans.variable}`}
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
              {/* <VisuallyHidden> */}
                <AppSidebar />
                <main>
                  <SidebarTrigger />
                  {children}
                </main>
              {/* </VisuallyHidden> */}
            </SidebarProvider>
            {/* <div className="relative flex min-h-screen flex-col">
              <Header ownerName={data?.name || "Unknown"} />
              <div className="flex-1">{children}</div>
            </div> */}
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
