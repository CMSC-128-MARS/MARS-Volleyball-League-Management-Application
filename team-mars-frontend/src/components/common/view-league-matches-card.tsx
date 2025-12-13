import { useState } from 'react';
import { toast } from 'sonner';
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

type ViewLeagueMatchesCardProps = {
  teams: Team[];
  matches: Match[];
  isEditing?: boolean;
  leagueId?: string;
  onMatchesChange?: () => void;
};

export default function ViewLeagueMatchesCard({
  teams,
  matches,
  isEditing,
  leagueId,
  onMatchesChange,
}: ViewLeagueMatchesCardProps) {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [editingMatchData, setEditingMatchData] = useState<Match | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingMatchId, setDeletingMatchId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Separate matches into upcoming and completed
  const now = new Date();
  const upcomingMatches = matches.filter((match) => {
    const matchDate = new Date(match.match_date);
    const hasStats = match.match_stats && match.match_stats.length > 0;
    return matchDate > now || !hasStats;
  });
  const completedMatches = matches.filter((match) => {
    const matchDate = new Date(match.match_date);
    const hasStats = match.match_stats && match.match_stats.length > 0;
    return matchDate <= now && hasStats;
  });

  const handleEditMatch = (matchId: string) => {
    const match = matches.find((m) => m.match_id === matchId);
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
      onMatchesChange?.();
    } catch (error) {
      console.error('Failed to delete match:', error);
      toast.error('Failed to delete match. Please try again.', { duration: 5000, style: {
        background: "var(--destructive)", color: "white", borderRadius: "2px", border: "none"
      } })


    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeletingMatchId(null);
  };

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
                      const team1Stats = match.match_stats?.find(
                        (s) => s.team_id === match.team1?.team_id,
                      );
                      const team2Stats = match.match_stats?.find(
                        (s) => s.team_id === match.team2?.team_id,
                      );

                      return (
                        <LeagueMatchCard
                          key={match.match_id}
                          matchId={match.match_id}
                          matchDate={match.match_date}
                          location={match.location}
                          team1Name={match.team1?.team_name || 'TBD'}
                          team2Name={match.team2?.team_name || 'TBD'}
                          team1SetsWon={team1Stats?.sets_won}
                          team2SetsWon={team2Stats?.sets_won}
                          team1SetsLost={team1Stats?.sets_lost}
                          team2SetsLost={team2Stats?.sets_lost}
                          team1TotalScore={team1Stats?.total_score}
                          team2TotalScore={team2Stats?.total_score}
                          team1IsWinner={team1Stats?.is_winner}
                          team2IsWinner={team2Stats?.is_winner}
                          num_of_sets={match.num_of_sets}
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
                  className="hover:cursor-pointer hover:bg-gray-100 hover:text-primary h-10 border-primary"
                  onClick={cancelDelete}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-destructive h-10 hover:bg-destructive/80 hover:cursor-pointer"
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
