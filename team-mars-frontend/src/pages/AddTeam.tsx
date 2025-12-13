import AddTeamDetails from '@/components/common/add-team-details';
import CreateRoster from '@/components/common/create-roster';
import TeamNavigationButtons from '@/components/common/team-navigation-buttons';
import SelectedPlayersCard from '@/components/common/select-players-card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ApiPlayer } from '@/lib/api';
import { teamApiService } from '@/lib/team';

export default function AddTeamCard() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<'manual' | 'automatic' | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<ApiPlayer[]>([]);
  const [teamName, setTeamName] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    navigate('/teams');
  };

  const handleNext = async () => {
    if (!isSaved || selectedPlayers.length === 0) {
      return;
    }

    let loadingToastId;
    try {
      setIsSaving(true);
      loadingToastId = toast.loading('Creating team...', {
        duration: 10000,
        style: {
          borderRadius: '2px',
          border: '2px solid var(--border)',
        },
      });
      const createdTeam = await teamApiService.createTeam({
        team_name: teamName,
        league_id: leagueId,
      });

      // Add players to the team after creation
      if (selectedPlayers.length > 0) {
        await Promise.all(
          selectedPlayers.map((player) =>
            teamApiService.addPlayerToTeam(
              createdTeam.team_id,
              player.player_id,
              player.default_position || undefined,
            ),
          ),
        );
      }
      toast.dismiss(loadingToastId);
      toast.success('Team successfully created!', {
        duration: 5000,
        style: {
          color: "var(--success)",
          borderRadius: "2px",
          border: "2px solid var(--success)"
        }
      });
      navigate('/teams');
    } catch (error) {
      console.error('Failed to create team:', error);
      if (loadingToastId) toast.dismiss(loadingToastId);
      toast.error('Failed to create team. Please try again.', { duration: 5000, style: {
       borderRadius: "2px", border: "2px solid var(--destructive)"
      } })
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    if (!teamName || !leagueId) {
      toast.error('Missing team name or league input.', { duration: 5000, style: {
        borderRadius: "2px", border: "2px solid var(--destructive)"
      } })
      return;
    }

    if (selectedPlayers.length === 0) {
      toast.error('Select at least one player.', { duration: 5000, style: {
        borderRadius: "2px", border: "2px solid var(--destructive)"
      } })
      return;
    }

    setIsSaved(true);
  };

  const handleAddPlayer = (player: ApiPlayer) => {
    setSelectedPlayers((prev) => {
      if (prev.find((p) => p.player_id === player.player_id)) return prev;
      return [...prev, player];
    });
  };

  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers((prev) => {
      const next = prev.filter((p) => p.player_id !== playerId);
      if (next.length === 0) setIsSaved(false);
      return next;
    });
  };

  const handleResetPlayers = () => {
    setSelectedPlayers([]);
    setIsSaved(false);
  };

  return (
    <div
      className="items-center p-5 md:p-5 lg:p-20 justify-center w-full min-h-[calc(100vh-5rem)]"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="mb-9">
        <TeamNavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          isDisabled={!isSaved}
          isCreating={isSaving}
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
        <AddTeamDetails
          teamName={teamName}
          onTeamNameChange={setTeamName}
          leagueId={leagueId}
          onLeagueChange={setLeagueId}
        />
        <CreateRoster
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
          onPlayerAdd={handleAddPlayer}
          onClearPlayers={handleResetPlayers}
          selectedPlayerIds={selectedPlayers.map((p) => p.player_id)}
        />
      </div>
      {(selectedMethod === 'manual' || selectedMethod === 'automatic') && (
        <div className="mt-10 flex-1">
          <SelectedPlayersCard
            players={selectedPlayers}
            onRemovePlayer={handleRemovePlayer}
            onReset={handleResetPlayers}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      )}
    </div>
  );
}
