import TeamManagementCard from '@/components/common/team-management-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Team() {
  return (
    <div
      className="w-full"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <Tabs defaultValue="view" className="w-full max-w-[400px] mx-auto px-4">
        <div className="justify-center items-center pt-8 px-8 pb-5 flex flex-col gap-5">
          <p className="font-heading font-semibold text-2xl text-center ">TEAM MANAGEMENT</p>
          <TabsList>
            <TabsTrigger
              value="view"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              View
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="data-[state=active]:bg-[#15803D] data-[state=active]:text-white"
            >
              Add
            </TabsTrigger>
            <TabsTrigger
              value="remove"
              className="data-[state=active]:bg-[#D52020] data-[state=active]:text-white"
            >
              Remove
            </TabsTrigger>
          </TabsList>
          <hr className="w-full border-t border-muted-foreground" />
        </div>
        <TabsContent value="view">
          <TeamManagementCard />
        </TabsContent>
        <TabsContent value="add">Change your password here.</TabsContent>
        <TabsContent value="remove">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
