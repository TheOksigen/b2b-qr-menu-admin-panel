import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: RootLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </SidebarProvider>
  );
}
