import { LayoutDashboard, UsersRound, Volleyball, Trophy, Headset } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { useEffect, useRef } from 'react';

const items = [
  {
    title: 'Dashboard',
    url: 'dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Players',
    url: 'players',
    icon: UsersRound,
  },
  {
    title: 'Teams',
    url: 'teams',
    icon: Volleyball,
  },
  {
    title: 'Leagues',
    url: 'leagues',
    icon: Trophy,
  },
  {
    title: 'Contact Support',
    url: 'contact',
    icon: Headset,
  },
];

export function AppSidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { open, setOpen, isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        !(target as Element).closest('[aria-label="Toggle sidebar"]')
      ) {
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
  }, [open, setOpen]);

  return (
    <div ref={sidebarRef}>
      <Sidebar
        collapsible="offcanvas"
        
       className="bg-primary-alt !top-[64px] !h-[calc(100vh-64px)] md:!top-[73px] md:!h-[calc(100vh-73px)] !z-50 !border-none"
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
                      <Link to={item.url} onClick={handleLinkClick}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail className="!top-10 md:!top-[100px] !h-screen md:!h-[calc(100vh-73px)] hidden md:flex" />
      </Sidebar>
    </div>
  );
}

export default AppSidebar;
