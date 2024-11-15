import { SidebarProvider } from "../_components/ui/sidebar";
import { AppSidebar } from "../_components/app-sidebar";
import { cookies } from "next/headers";
import { GeistSans } from "geist/font/sans";
interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function layout({
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
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </SidebarProvider>
        </body>
      </html>
    
  );
}