import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import ThemedUserButton from "@/components/themed-user-button";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: RootLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-y-auto"><div className="container mx-auto p-4">
      <div className="flex items-center space-x-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <>
              <SidebarTrigger />
            </>
          </HoverCardTrigger>
          <HoverCardContent className="w-40 rounded-xl">
            <p className="text-xs">CTRL + B or CMD + B</p>
          </HoverCardContent>
        </HoverCard>
        <div className="flex-auto"></div>
        <ThemedUserButton />
      </div>
      {children}
    </div></main>
    </SidebarProvider>
  );
}
