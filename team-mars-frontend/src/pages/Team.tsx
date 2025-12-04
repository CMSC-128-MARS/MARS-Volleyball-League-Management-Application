import { useMemo } from 'react';
import TeamManagementCard from '@/components/common/team-management-card';
import AddTeamCard from '@/components/common/add-team';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeams } from '@/hooks/use-teams';
import type { ApiTeam } from '@/lib/api';

type TeamSummary = {
  id: string;
  name: string;
  playerCount: number;
};

const derivePlayerCount = (team: ApiTeam): number => {
  const candidates = [team.active_player_count, team.total_player_count, team.player_count];
  for (const candidate of candidates) {
    if (typeof candidate === 'number' && !Number.isNaN(candidate)) {
      return candidate;
    }
  }

  if (Array.isArray(team.team_players)) {
    return team.team_players.filter((player) => player?.leave_date == null).length;
  }

  return 0;
};

export default function Team() {
  const { teams, isLoading, error, refetch } = useTeams({ limit: 50 });

  const normalizedTeams = useMemo<TeamSummary[]>(
    () =>
      teams.map((team, index) => ({
        id: team.team_id || `${team.team_name || 'team'}-${index}`,
        name: team.team_name || 'Unnamed Team',
        playerCount: derivePlayerCount(team),
      })),
    [teams],
  );

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
            {isLoading && (
              <p className="col-span-full text-center text-muted-foreground">Loading teams…</p>
            )}

            {!isLoading && error && (
              <div className="col-span-full text-center text-red-600">
                <p>{error}</p>
                <button type="button" className="mt-2 text-primary underline" onClick={refetch}>
                  Try again
                </button>
              </div>
            )}

            {!isLoading && !error && normalizedTeams.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">No teams found.</p>
            )}

            {normalizedTeams.map((team) => (
              <TeamManagementCard key={team.id} name={team.name} playerCount={team.playerCount} />
            ))}
          </TabsContent>
          <TabsContent
            value="add"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6"
          >
            {' '}
            <AddTeamCard />
            {isLoading && (
              <p className="col-span-full text-center text-muted-foreground">Loading teams…</p>
            )}
            {!isLoading && error && (
              <div className="col-span-full text-center text-red-600">
                <p>{error}</p>
                <button type="button" className="mt-2 text-primary underline" onClick={refetch}>
                  Try again
                </button>
              </div>
            )}
            {!isLoading && !error && normalizedTeams.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">No teams found.</p>
            )}
            {normalizedTeams.map((team) => (
              <TeamManagementCard key={team.id} name={team.name} playerCount={team.playerCount} />
            ))}
            .
          </TabsContent>
          <TabsContent
            value="remove"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6"
          >
            {' '}
            {isLoading && (
              <p className="col-span-full text-center text-muted-foreground">Loading teams…</p>
            )}
            {!isLoading && error && (
              <div className="col-span-full text-center text-red-600">
                <p>{error}</p>
                <button type="button" className="mt-2 text-primary underline" onClick={refetch}>
                  Try again
                </button>
              </div>
            )}
            {!isLoading && !error && normalizedTeams.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">No teams found.</p>
            )}
            {normalizedTeams.map((team) => (
              <TeamManagementCard
                key={team.id}
                name={team.name}
                playerCount={team.playerCount}
                showRemoveIcon={true}
              />
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
