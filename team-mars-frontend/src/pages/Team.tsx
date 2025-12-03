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
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
        <Tabs defaultValue="view" className="w-full">
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
        </Tabs>
      </div>
      <div className="w-full px-4 md:px-10 my-4">
        <hr className="border-t border-[#A3A3A3]" />
      </div>
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <Tabs defaultValue="view" className="w-full">
          <TabsContent
            value="view"
            className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          >
            <TeamManagementCard />
            <TeamManagementCard />
            <TeamManagementCard />
            <TeamManagementCard />
          </TabsContent>
          <TabsContent value="add">Add content here.</TabsContent>
          <TabsContent value="remove">Remove content here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
