"use client";

import * as React from "react";
import { dark } from "@clerk/themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import ModeToggle from "@/components/theme-switcher";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { api } from "@/trpc/react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronRight } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme } = useTheme();
  const { data: restaurants, isLoading } = api.restaurant.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex flex-col gap-0.5 leading-none">
                <OrganizationSwitcher
                  appearance={{
                    baseTheme: theme === "dark" ? dark : undefined,
                  }}
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {restaurants?.map((restaurant) => (
              <Collapsible
                key={restaurant.id}
                defaultOpen={true}
                className="group"
              >
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex items-center text-sm font-medium hover:bg-sidebar-accent px-2 py-1 rounded">
                      {restaurant.name}{" "}
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {restaurant.menus.map((menu) => (
                          
                          <SidebarMenuItem
                            key={menu.id}
                            className="pl-6 py-1.5 text-xs text-gray-300 rounded-md"
                          >
                            <SidebarMenuButton asChild>
                              <a
                                href={`/menus/${menu.id}`}
                                className="block w-full font-medium hover:underline"
                              >
                                {menu.title}
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>

                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
