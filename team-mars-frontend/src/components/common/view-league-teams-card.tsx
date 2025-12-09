import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import AddMatchDialog from '@/components/forms/add-match';
import EditMatchDialog from '@/components/forms/edit-match';
import LeagueMatchCard from './league-match-card';
import { matchApiService } from '@/lib/match';

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

export default function ViewLeagueTeamsCard({ 
  teams, 
  matches, 
  showTeamsOnly, 
  showMatchesOnly, 
  isEditing, 
  leagueId,
  onMatchesChange 
}: ViewLeagueTeamsCardProps) {
  const navigate = useNavigate();
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [editingMatchData, setEditingMatchData] = useState<Match | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingMatchId, setDeletingMatchId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    const match = matches.find(m => m.match_id === matchId);
    if (match) {
      setEditingMatchId(matchId);
      setEditingMatchData(match);
    }
  };

  const handleCloseEditDialog = () => {
    setEditingMatchId(null);
    setEditingMatchData(null);
  };

  const handleDeleteMatch = (matchId: string) => {
    setDeletingMatchId(matchId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingMatchId) return;

    try {
      setIsDeleting(true);
      await matchApiService.deleteMatch(deletingMatchId);
      setIsDeleteDialogOpen(false);
      setDeletingMatchId(null);
      onMatchesChange?.(); // Refresh the matches
    } catch (error) {
      console.error('Failed to delete match:', error);
      alert('Failed to delete match. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeletingMatchId(null);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {upcomingMatches.map((match) => (
                        <LeagueMatchCard
                          key={match.match_id}
                          matchId={match.match_id}
                          matchDate={match.match_date}
                          location={match.location}
                          team1Name={match.team1?.team_name || 'TBD'}
                          team2Name={match.team2?.team_name || 'TBD'}
                          num_of_sets={match.num_of_sets}
                          isCompleted={match.is_completed || false}
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
                    <h3 className="pg1-bold mb-4">Completed</h3>
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
                            num_of_sets={match.num_of_sets }
                            isCompleted={match.is_completed || true}
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

        {/* Edit Match Dialog */}
        {editingMatchId && editingMatchData && (
          <EditMatchDialog
            matchId={editingMatchId}
            isOpen={!!editingMatchId}
            onClose={handleCloseEditDialog}
            teams={teams}
            initialData={{
              team1_id: editingMatchData.team1?.team_id || '',
              team2_id: editingMatchData.team2?.team_id || '',
              match_date: editingMatchData.match_date,
              location: editingMatchData.location || '',
              num_of_sets: editingMatchData.num_of_sets || 3,
              is_completed: editingMatchData.is_completed || false,
            }}
            onMatchUpdated={onMatchesChange}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-left">Delete Match?</DialogTitle>
              <DialogDescription>
                <p className="font-paragraph text-left">
                  Are you sure you want to delete this match?
                </p>
                <div className="flex gap-2 mt-4 justify-end items-end">
                  <Button
                    variant={'outline'}
                    className="hover:cursor-pointer h-10 border-muted-foreground"
                    onClick={cancelDelete}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#D52020] h-10 hover:bg-[#D52020] hover:opacity-80 hover:cursor-pointer"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                  >
                    <Trash /> {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
            <div className="flex flex-col gap-4">
              {teams.length === 0 && isEditing ? (
                <div className="flex justify-center">
                  <Button 
                    variant="default" 
                    className="w-full px-6 py-2 cursor-pointer"
                    onClick={() => navigate('/addteam')}
                  >
                    Add a team
                  </Button>
                </div>
              ) : teams.length > 0 ? (
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
              ) : null}
              {teams.length > 0 && isEditing && (
                <Button 
                  variant="default" 
                  className="w-full px-6 py-2 cursor-pointer"
                  onClick={() => navigate('/addteam')}
                >
                  Add a team
                </Button>
              )}
            </div>
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
