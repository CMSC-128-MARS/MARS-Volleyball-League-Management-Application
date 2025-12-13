import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Team = {
  team_id: string;
  team_name: string;
};

type Match = {
  match_id: string;
  match_date: string;
  location?: string;
  is_completed?: boolean;
  num_of_sets?: number;
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

export default function ViewLeagueTeamsCard(props: ViewLeagueTeamsCardProps) {
  const { teams, isEditing } = props;
  const navigate = useNavigate();

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
            <div className="flex flex-col gap-4">
              {teams.length === 0 && isEditing ? (
                <div className="flex justify-center">
                  <Button
                    variant="default"
                    className="w-full px-6 py-2 cursor-pointer"
                    onClick={() => navigate('/teams')}
                  >
                    Add a team
                  </Button>
                </div>
              ) : teams.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#A3A3A3] pg3-bold">
                        <th className="text-center py-2 px-2">No.</th>
                        <th className="text-center py-2 px-2">Team</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map((team, index) => (
                        <tr key={team.team_id} className="border-b border-border hover:bg-accent">
                          <td className="py-3 px-2 text-center pg2">{index + 1}</td>
                          <td className="py-3 px-2 font-medium text-center pg2-bold">
                            {team.team_name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {teams.length > 0 && isEditing && (
                <Button
                  variant="default"
                  className="w-full px-6 py-2 cursor-pointer"
                  onClick={() => navigate('/teams')}
                >
                  Add a team
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
