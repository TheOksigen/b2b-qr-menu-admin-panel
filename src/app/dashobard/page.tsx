import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/app/_components/ui/hover-card";
import { SidebarTrigger } from "@/app/_components/ui/sidebar";
import { Button } from "@/app/_components/ui/button";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser()  

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" className="p-0 hover:bg-transparent">
              <SidebarTrigger />
              <span className="ml-2">{user ? `${user.firstName} Dashboard` : 'Dashboard'}</span>
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