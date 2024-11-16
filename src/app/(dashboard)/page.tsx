import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  // const user = await currentUser(); 
  // currentUseri cagirma herdefe, onnansa men yazan cachedAuth islet

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent"
              asChild // aschild eleave edilemlidi hydration error olur cunki button icinde button (sudebartrigger olmaz)
            >
              <SidebarTrigger />
              {/* <span className="ml-2">
                  {user ? `${user.firstName} Dashboard` : "Dashboard"}
                </span> */}
              {/* Cox react child olmamalidi asChild olanda only 1 */}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-40 rounded-xl">
            <p className="text-xs">CTRL + B or CMD + B</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}
