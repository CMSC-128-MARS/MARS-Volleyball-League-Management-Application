import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddMatchDialog from '@/components/forms/add-match';
import LeagueMatchCard from './league-match-card';

type Team = {
  team_id: string;
  team_name: string;
  wins?: number;
  losses?: number;
};

type Match = {
  match_id: string;
  match_date: string;
  location?: string;
  team1?: {
    team_id: string;
    team_name: string;
  };
  team2?: {
    team_id: string;
    team_name: string;
  };
  match_stats?: Array<{
    match_team_stats_id: string;
    total_score?: number;
    sets_won?: number;
    sets_lost?: number;
    is_winner?: boolean;
    team_id?: string;
  }>;
};

type ViewLeagueTeamsCardProps = {
  teams: Team[];
  matches: Match[];
  showTeamsOnly?: boolean;
  showMatchesOnly?: boolean;
  isEditing?: boolean;
  leagueId?: string;
  onMatchesChange?: () => void;
};

export default function ViewLeagueTeamsCard({ 
  teams, 
  matches, 
  showTeamsOnly, 
  showMatchesOnly, 
  isEditing, 
  leagueId,
  onMatchesChange 
}: ViewLeagueTeamsCardProps) {
  // Separate matches into upcoming and completed
  const now = new Date();
  const upcomingMatches = matches.filter(match => {
    const matchDate = new Date(match.match_date);
    const hasStats = match.match_stats && match.match_stats.length > 0;
    return matchDate > now || !hasStats;
  });
  const completedMatches = matches.filter(match => {
    const matchDate = new Date(match.match_date);
    const hasStats = match.match_stats && match.match_stats.length > 0;
    return matchDate <= now && hasStats;
  });

  const handleEditMatch = (matchId: string) => {
    // TODO: Implement edit match
    console.log('Edit match:', matchId);
  };

  const handleDeleteMatch = (matchId: string) => {
    // TODO: Implement delete match
    console.log('Delete match:', matchId);
  };

  // If showMatchesOnly is true, only render matches
  if (showMatchesOnly) {
    return (
      <div className="w-full h-full shadow-md">
        <Card className="gap-2 transition-all duration-200">
          <CardHeader className="items-center px-6 pt-4">
            <CardTitle className="flex flex-row justify-between items-center w-full">
              <h4>Matches</h4>
              <span className="pg2-bold text-muted-foreground">Total: {matches.length}</span>
            </CardTitle>
          </CardHeader>
          <hr className="w-full border-t border-[#A3A3A3]" />
          <CardContent className="px-6 pb-6 pt-4">
            {matches.length === 0 && !isEditing ? (
              <p className="text-center text-muted-foreground py-4">No matches</p>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Upcoming Section */}
                {upcomingMatches.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Upcoming</h3>
                    <div className="flex flex-col gap-4">
                      {upcomingMatches.map((match) => (
                        <LeagueMatchCard
                          key={match.match_id}
                          matchId={match.match_id}
                          matchDate={match.match_date}
                          location={match.location}
                          team1Name={match.team1?.team_name || 'TBD'}
                          team2Name={match.team2?.team_name || 'TBD'}
                          firstToSets={3}
                          isCompleted={false}
                          isEditing={isEditing}
                          onEdit={handleEditMatch}
                          onDelete={handleDeleteMatch}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Section */}
                {completedMatches.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Completed</h3>
                    <div className="flex flex-col gap-4">
                      {completedMatches.map((match) => {
                        const team1Stats = match.match_stats?.find(s => s.team_id === match.team1?.team_id);
                        const team2Stats = match.match_stats?.find(s => s.team_id === match.team2?.team_id);
                        
                        return (
                          <LeagueMatchCard
                            key={match.match_id}
                            matchId={match.match_id}
                            matchDate={match.match_date}
                            location={match.location}
                            team1Name={match.team1?.team_name || 'TBD'}
                            team2Name={match.team2?.team_name || 'TBD'}
                            team1Score={team1Stats?.sets_won}
                            team2Score={team2Stats?.sets_won}
                            team1Sets={team1Stats ? [team1Stats.total_score || 0] : []}
                            team2Sets={team2Stats ? [team2Stats.total_score || 0] : []}
                            isCompleted={true}
                            isEditing={isEditing}
                            onEdit={handleEditMatch}
                            onDelete={handleDeleteMatch}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add Match Button */}
                {isEditing && leagueId && (
                  <div className="flex justify-center py-4">
                    <AddMatchDialog 
                      leagueId={leagueId} 
                      teams={teams}
                      onMatchAdded={onMatchesChange}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // If showTeamsOnly is true, only render teams
  if (showTeamsOnly) {
    return (
      <div className="w-full h-full shadow-md">
        <Card className="gap-2 transition-all duration-200">
          <CardHeader className="items-center px-6 pt-4">
            <CardTitle className="flex flex-row justify-between items-center w-full">
              <h4>Team Standings</h4>
            </CardTitle>
          </CardHeader>
          <hr className="w-full border-t border-[#A3A3A3]" />
          <CardContent className="px-6 pb-6 pt-4">
            {teams.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No teams in this league yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#A3A3A3] pg3-bold">
                      <th className="text-center py-2 px-2">Rank</th>
                      <th className="text-center py-2 px-2">Team</th>
                      <th className="text-center py-2 px-2">W</th>
                      <th className="text-center py-2 px-2">L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, index) => (
                      <tr key={team.team_id} className="border-b border-border hover:bg-accent">
                        <td className="py-3 px-2 text-center pg2">{index + 1}</td>
                        <td className="py-3 px-2 font-medium text-center pg2-bold">{team.team_name}</td>
                        <td className="py-3 px-2 text-center pg2">{team.wins ?? '-'}</td>
                        <td className="py-3 px-2 text-center pg2">{team.losses ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default: render both
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Team Standings Card */}
      <div className="w-full h-full shadow-md">
        <Card className="gap-2 transition-all duration-200">
          <CardHeader className="items-center px-6 pt-4">
            <CardTitle className="flex flex-row justify-between items-center w-full">
              <h4>Team Standings</h4>
            </CardTitle>
          </CardHeader>
          <hr className="w-full border-t border-[#A3A3A3]" />
          <CardContent className="px-6 pb-6 pt-4">
            {teams.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No teams in this league yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#A3A3A3] pg3-bold">
                      <th className="text-center py-2 px-2">Rank</th>
                      <th className="text-center py-2 px-2">Team</th>
                      <th className="text-center py-2 px-2">W</th>
                      <th className="text-center py-2 px-2">L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, index) => (
                      <tr key={team.team_id} className="border-b border-border hover:bg-accent">
                        <td className="py-3 px-2 text-center pg2">{index + 1}</td>
                        <td className="py-3 px-2 font-medium text-center pg2-bold">{team.team_name}</td>
                        <td className="py-3 px-2 text-center pg2">{team.wins ?? '-'}</td>
                        <td className="py-3 px-2 text-center pg2">{team.losses ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Matches Card */}
      <div className="w-full h-full shadow-md">
        <Card className="gap-2 transition-all duration-200">
          <CardHeader className="items-center px-6 pt-4">
            <CardTitle className="flex flex-row justify-between items-center w-full">
              <h4>Matches</h4>
              <span className="pg2-bold text-muted-foreground">Total: {matches.length}</span>
            </CardTitle>
          </CardHeader>
          <hr className="w-full border-t border-[#A3A3A3]" />
          <CardContent className="px-6 pb-6 pt-4">
            {matches.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No matches</p>
            ) : (
              <div className="flex flex-col gap-2">
                {matches.map((match) => (
                  <div key={match.match_id} className="p-3 border rounded hover:bg-gray-50">
                    <p className="text-sm">Match on {new Date(match.match_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
