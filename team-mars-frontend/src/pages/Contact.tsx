import Sidebar from '@/components/navigation/Sidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Contact({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main>
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  )
}