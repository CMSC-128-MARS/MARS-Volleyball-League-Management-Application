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
  useSidebar,
} from '@/components/ui/sidebar';
import { useEffect, useRef } from 'react';

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
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { open, setOpen, isMobile } = useSidebar();

  useEffect(() => {
    if (!open || isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, isMobile, setOpen]);

  return (
    <div ref={sidebarRef}>
      <Sidebar
        collapsible="offcanvas"
        className="!top-[80px] !h-[calc(100vh-80px)] !z-50 !border-none"
      >
        <SidebarContent className="bg-primary-alt font-paragraph pt-6 pb-6 pr-1 pl-1">
          <SidebarGroup>
            <SidebarGroupLabel className="flex justify-center items-center mb-8">
              <img src="/assets/logo.png" alt="MARS Logo" className="w-12 h-12" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-accent rounded-[6px] text-[14px]"
                    >
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
    </div>
  );
}

export default AppSidebar;
