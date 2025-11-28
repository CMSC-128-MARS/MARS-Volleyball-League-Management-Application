import { LayoutDashboard, UsersRound, Volleyball, Trophy, Headset } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const items = [
  {
    title: 'Dashboard',
    url: '#',
    icon: LayoutDashboard,
  },
  {
    title: 'Players',
    url: '#',
    icon: UsersRound,
  },
  {
    title: 'Teams',
    url: '#',
    icon: Volleyball,
  },
  {
    title: 'Leagues',
    url: '#',
    icon: Trophy,
  },
  {
    title: 'Contact Support',
    url: '#',
    icon: Headset,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" className="!top-[80px] !h-[calc(100vh-80px)] !z-50">
      <SidebarContent className="bg-primary-alt font-paragraph pt-6 pb-6 pr-1 pl-1">
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-center items-center mb-8">
            <img src="/assets/logo.png" alt="MARS Logo" className="w-12 h-12" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarGroupLabel className="text-left text-white ml-2 text-[12px]">
              Navigation
            </SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-accent rounded-[6px] text-[14px]">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
