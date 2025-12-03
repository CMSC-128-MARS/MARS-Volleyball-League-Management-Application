import TeamManagementCard from '@/components/common/team-management-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Team() {
  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <Tabs defaultValue="view" className="w-full">
        <div className="w-full max-w-4xl xl:max-w-5xl mx-auto px-4 md:px-8">
          <div className="justify-center items-center pt-8 px-8 pb-4 flex flex-col gap-5">
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
          </div>
        </div>
        <div className="w-full px-4 md:px-10 my-4">
          <hr className="border-t border-[#A3A3A3]" />
        </div>
        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20">
          <TabsContent
            value="view"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6"
          >
            <TeamManagementCard />
            <TeamManagementCard />
            <TeamManagementCard />
            <TeamManagementCard />
            <TeamManagementCard />
            <TeamManagementCard />
          </TabsContent>
          <TabsContent value="add">Add content here.</TabsContent>
          <TabsContent value="remove">Remove content here.</TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
