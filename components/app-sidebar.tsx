"use client";

import * as React from "react";
import {
  IconDashboard,
  IconUser,
  IconCommand,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Spinner } from "./ui/spinner";
import { useSession } from "@/lib/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isPending, data } = useSession();

  const sideNavData = {
    user: data?.user,
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      ...(data?.user?.role === "admin" ? [
        {
          title: "Users",
          url: "/dashboard/users",
          icon: IconUser,
        },
        {
          title: "Question Bank",
          url: "/dashboard/quiz/questions",
          icon: IconCommand, // Placeholder icon
        },
        {
          title: "Host Quiz",
          url: "/dashboard/quiz/host",
          icon: IconDashboard, // Placeholder icon
        },
        {
          title: "Banned Users",
          url: "/dashboard/users/banned",
          icon: IconUser,
        }
      ] : []),
      {
        title: "Play Quiz",
        url: "/dashboard/quiz/play",
        icon: IconDashboard, // Placeholder icon
      }
    ],
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <IconCommand className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">onBoard-X</span>
                  <span className="truncate text-xs">Let's start your journey</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sideNavData.navMain} label="Platform" />
      </SidebarContent>
      <SidebarFooter>
        {isPending ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : data?.user ? (
          <NavUser user={data.user} />
        ) : (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
