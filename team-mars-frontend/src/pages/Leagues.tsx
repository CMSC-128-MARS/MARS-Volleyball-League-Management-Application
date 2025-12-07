import { Tabs, /*TabsContent*/ TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeagueCard } from '@/components/common/league-card';

const LeagueDashboard = () => {
    return (
        <>
            <div className="bg-background text-primary-foreground relative overflow-auto h-full"
            style={{
            backgroundImage: `url('/assets/Grunge.png')`,
            backgroundSize: 'auto',
            backgroundRepeat: 'repeat',
            }}>
                <Tabs defaultValue="view" className="w-full">
                    {/* Main Container */}
                    <div className="py-[56px] md:px-[20px] lg:px-[80px] min-h-full gap-[36px] flex flex-col">
                        {/* Header */}
                        <div className="flex flex-col items-center justify-between gap-[20px]">
                            <h2 className="text-foreground uppercase text-center">League Management</h2>
                            {/* Tabs */}
                            <TabsList className="shadow-md">
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
                         {/* Divider */}
                        <hr className="w-full border-[#A3A3A3]" role="separator" aria-label="Section divider"></hr>
                        {/* Tabs Content */}
                        <div className="flex-grow">
                            {/* View Tab Content */}
                            <LeagueCard />
                            {/* Add Tab Content */}
                            {/* Remove Tab Content */}
                        </div>
                    </div>
                </Tabs>
            </div>
        </>
    );
}

export default LeagueDashboard;