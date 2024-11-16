import ThemedUserButton from "@/components/themed-user-button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SidebarTrigger } from "@/components/ui/sidebar";

// bu hisseni layoutun icine yerlesdirmek lazimdir

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
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
    </div>
  );
}
