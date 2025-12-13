import TeamManagementCard from '@/components/common/team-management-card';
import TeamViewButtons from '@/components/navigation/team-view-buttons';
import TeamDetailsComponent from '@/components/common/team-details';
import AddTeamDetails from '@/components/common/add-team-details';
import CreateRoster from '@/components/common/create-roster';
import SelectedPlayersCard from '@/components/common/select-players-card';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '@/hooks/use-team';
import { useMemo, useState } from 'react';
import type { ApiPlayer } from '@/lib/api';
import { teamApiService } from '@/lib/team';

export default function TeamDetails() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { team, isLoading, error, refetch } = useTeam(teamId || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTeamName, setEditTeamName] = useState('');
  const [editLeagueId, setEditLeagueId] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<ApiPlayer[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<'manual' | 'automatic' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const players = useMemo(() => {
    if (!team?.team_players || team.team_players.length === 0) {
      return [];
    }

    return team.team_players
      .filter((tp) => tp.leave_date === null && tp.player)
      .map((tp) => ({
        ...tp.player!,
        skill_level: 0,
        position: tp.position || tp.player!.default_position,
      }));
  }, [team]);

  const handleBack = () => {
    navigate('/teams');
  };

  const handleNext = () => {
    // TODO: Implement next navigation
  };

  const handleEditToggle = (editing: boolean) => {
    setIsEditing(editing);
    if (editing && team) {
      // Initialize edit state with current team data
      setEditTeamName(team.team_name);
      setEditLeagueId(team.league?.league_id || '');
      // Convert players to ApiPlayer format
      const apiPlayers: ApiPlayer[] = players.map((p) => ({
        player_id: p.player_id,
        first_name: p.first_name,
        last_name: p.last_name || '',
        jersey_number: p.jersey_number || 0,
        default_position: p.default_position || '',
        created_at: p.created_at,
      }));
      setSelectedPlayers(apiPlayers);
      setSelectedMethod('manual');
    }
  };

  const handleAddPlayer = (player: ApiPlayer) => {
    if (!selectedPlayers.find((p) => p.player_id === player.player_id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    // If we're editing an existing team and the player is already assigned on server,
    // remove immediately via API and refresh. Otherwise just remove locally.
    try {
      const isOriginallyAssigned = players.some((p) => p.player_id === playerId);
      if (isEditing && teamId && isOriginallyAssigned) {
        await teamApiService.removePlayerFromTeam(teamId, playerId);
        // refresh team roster
        await refetch?.();
        // notify other components (cards) to reload server-side players
        try {
          window.dispatchEvent(new CustomEvent('team-player-changed', { detail: { teamId } }));
        } catch {
          // ignore event dispatch failures
        }
      }
    } catch (err) {
      console.error('Failed to remove player from team:', err);
      toast.error('Failed to remove player from team. Please try again.', { duration: 5000, style: {
        background: "var(--destructive)", color: "white", borderRadius: "2px", border: "none"
      } })
      return;
    }

    setSelectedPlayers((prev) => prev.filter((p) => p.player_id !== playerId));
  };

  const handleSave = async () => {
    if (!team || !teamId) return;

    try {
      setIsSaving(true);
      // Update team details (name and league)
      await teamApiService.updateTeam(teamId, {
        team_name: editTeamName,
        league_id: editLeagueId,
      });

      // Update team players
      const originalPlayerIds = players.map((p) => p.player_id);
      const newPlayerIds = selectedPlayers.map((p) => p.player_id);

      // Find players to add (in selectedPlayers but not in original)
      const playersToAdd = selectedPlayers.filter((p) => !originalPlayerIds.includes(p.player_id));

      // Find players to remove (in original but not in selectedPlayers)
      const playersToRemove = players.filter((p) => !newPlayerIds.includes(p.player_id));

      // Add new players
      await Promise.all(
        playersToAdd.map((player) =>
          teamApiService.addPlayerToTeam(
            teamId,
            player.player_id,
            player.default_position || undefined,
          ),
        ),
      );

      // Remove players (set leave_date)
      await Promise.all(
        playersToRemove.map((player) =>
          teamApiService.removePlayerFromTeam(teamId, player.player_id),
        ),
      );

      // Exit edit mode and reload the team data
      setIsEditing(false);
      // Keep SPA-friendly behavior: refetch team rather than full reload
      await refetch?.();
    } catch (error) {
      console.error('Failed to save team changes:', error);
      toast.error('Failed to save team changes. Please try again.', { duration: 5000, style: {
        background: "var(--destructive)", color: "white", borderRadius: "2px", border: "none"
      } })
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!teamId) return;

    try {
      // First attempt to remove any team_player records to avoid FK issues
      try {
        if (team?.team_players && Array.isArray(team.team_players)) {
          await Promise.all(
            (team.team_players || []).map((tp: { team_player_id?: string }) =>
              tp.team_player_id
                ? teamApiService.deleteTeamPlayer(tp.team_player_id)
                : Promise.resolve(),
            ),
          );
        }
      } catch (cleanupErr) {
        // Log but continue to attempt deleting the team
        console.warn('Failed to cleanup team players before delete:', cleanupErr);
      }

      await teamApiService.deleteTeam(teamId);
      navigate('/teams');
    } catch (error) {
      console.error('Failed to delete team:', error);
      toast.error('Failed to delete team. Please try again.', { duration: 5000, style: {
        background: "var(--destructive)", color: "white", borderRadius: "2px", border: "none"
      } })
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center p-5 md:p-5 lg:p-20 w-full min-h-[calc(100vh-5rem)]"
        style={{
          backgroundImage: `url('/assets/Grunge.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      >
        <p className="text-lg">Loading team details...</p>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div
        className="flex items-center justify-center p-5 md:p-5 lg:p-20 w-full min-h-[calc(100vh-5rem)]"
        style={{
          backgroundImage: `url('/assets/Grunge.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      >
        <p className="text-lg text-red-600">{error || 'Team not found'}</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-6 items-center p-5 md:p-5 lg:p-20 justify-start w-full min-h-[calc(100vh-5rem)]"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <TeamViewButtons
        onBack={handleBack}
        onNext={handleNext}
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        onSave={handleSave}
        onDelete={handleDelete}
        teamName={team.team_name}
        isSaving={isSaving}
      />
      <div className="flex flex-col lg:flex-row gap-6 w-full lg:items-start">
        {!isEditing ? (
          <>
            <div className="flex flex-col gap-6 lg:w-1/3">
              <TeamManagementCard
                name={team.team_name}
                playerCount={team.active_player_count || 0}
                teamId={team.team_id}
              />
              <TeamDetailsComponent
                teamName={team.team_name}
                leagueName={team.league?.league_name || 'Unknown League'}
                teamId={team.team_id}
              />
            </div>
            <div className="lg:w-2/3">
              <SelectedPlayersCard
                players={players}
                teamId={teamId}
                team={team}
                isViewMode={true}
                onSave={() => {}}
                isSaving={false}
                showButtons={false}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              <AddTeamDetails
                teamName={editTeamName}
                onTeamNameChange={setEditTeamName}
                leagueId={editLeagueId}
                onLeagueChange={setEditLeagueId}
                isEditMode={true}
              />
              <CreateRoster
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
                onPlayerAdd={handleAddPlayer}
                selectedPlayerIds={selectedPlayers.map((p) => p.player_id)}
                isEditMode={true}
                teamId={teamId}
                onPlayerAssigned={refetch}
              />
            </div>
            <div className="w-full">
              <SelectedPlayersCard
                players={selectedPlayers}
                teamId={teamId}
                onRemovePlayer={handleRemovePlayer}
                isViewMode={false}
                onSave={handleSave}
                isSaving={isSaving}
                showButtons={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
