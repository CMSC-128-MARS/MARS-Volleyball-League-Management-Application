import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeagueCard } from '@/components/common/league-card';
import AddLeagueCard from '@/components/common/add-league-card';
import { useLeagues } from '@/hooks/use-leagues';
const LeagueDashboard = () => {
  const { leagues, isLoading, error, refetch } = useLeagues({ limit: 50 });

  return (
    <>
      <div
        className="bg-background text-primary-foreground relative overflow-auto h-full"
        style={{
          backgroundImage: `url('/assets/Grunge.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      >
        
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
                  className="data-[state=active]:bg-success data-[state=active]:text-white"
                >
                  Add
                </TabsTrigger>
                <TabsTrigger
                  value="remove"
                  className="data-[state=active]:bg-destructive data-[state=active]:text-white"
                >
                  Remove
                </TabsTrigger>
              </TabsList>
            </div>
            {/* Divider */}
            <hr
              className="w-full border-gray-400"
              role="separator"
              aria-label="Section divider"
            ></hr>
            {/* Tabs Content */}
            <div className="flex-grow">
              <TabsContent
                value="view"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {isLoading && (
                  <p className="col-span-full text-center text-muted-foreground">
                    Loading leagues…
                  </p>
                )}

                {!isLoading && error && (
                  <div className="col-span-full text-center text-red-600">
                    <p>{error}</p>
                    <button type="button" className="mt-2 text-primary underline" onClick={refetch}>
                      Try again
                    </button>
                  </div>
                )}

                {!isLoading && !error && leagues.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground">
                    No leagues found.
                  </p>
                )}

                {leagues.map((league) => (
                  <LeagueCard
                    key={league.league_id}
                    leagueId={league.league_id}
                    name={league.league_name}
                    location={league.location}
                    description={league.description}
                  />
                ))}
              </TabsContent>
              <TabsContent
                value="add"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
              >
                <AddLeagueCard />
                {isLoading && (
                  <p className="col-span-full text-center text-muted-foreground">
                    Loading leagues…
                  </p>
                )}

                {!isLoading && error && (
                  <div className="col-span-full text-center text-red-600">
                    <p>{error}</p>
                    <button type="button" className="mt-2 text-primary underline" onClick={refetch}>
                      Try again
                    </button>
                  </div>
                )}

                {!isLoading && !error && leagues.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground">
                    No leagues found.
                  </p>
                )}

                {leagues.map((league) => (
                  <LeagueCard
                    key={league.league_id}
                    leagueId={league.league_id}
                    name={league.league_name}
                    location={league.location}
                    description={league.description}
                  />
                ))}
              </TabsContent>
              <TabsContent
                value="remove"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
              >
                {isLoading && (
                  <p className="col-span-full text-center text-muted-foreground">
                    Loading leagues…
                  </p>
                )}

                {!isLoading && error && (
                  <div className="col-span-full text-center text-red-600">
                    <p>{error}</p>
                    <button type="button" className="mt-2 text-primary underline" onClick={refetch}>
                      Try again
                    </button>
                  </div>
                )}

                {!isLoading && !error && leagues.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground">
                    No leagues found.
                  </p>
                )}

                {leagues.map((league) => (
                  <LeagueCard
                    key={league.league_id}
                    leagueId={league.league_id}
                    name={league.league_name}
                    location={league.location}
                    description={league.description}
                    mode="remove"
                  />
                ))}
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default LeagueDashboard;
