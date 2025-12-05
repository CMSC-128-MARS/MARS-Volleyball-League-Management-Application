import AddTeamDetails from '@/components/common/add-team-details';
import CreateRoster from '@/components/common/create-roster';
import TeamNavigationButtons from '@/components/common/team-navigation-buttons';
import SelectedPlayersCard from '@/components/common/select-players-card';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ApiPlayer } from '@/lib/api';
import { createTeam } from '@/lib/api';

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
    if (!isSaved) {
      return;
    }

    try {
      await createTeam({
        team_name: teamName,
        league_id: leagueId,
      });

      navigate('/teams');
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Failed to create team. Please try again.');
    }
  };

  const handleSave = () => {
    if (!teamName || !leagueId) {
      alert('Please enter team name and select a league');
      return;
    }

    setIsSaved(true);
  };

  const handleAddPlayer = (player: ApiPlayer) => {
    if (!selectedPlayers.find((p) => p.player_id === player.player_id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.player_id !== playerId));
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
        <TeamNavigationButtons onBack={handleBack} onNext={handleNext} isDisabled={!isSaved} />
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
          selectedPlayerIds={selectedPlayers.map((p) => p.player_id)}
        />
      </div>
      {selectedMethod === 'manual' && (
        <div className="mt-10 flex-1">
          <SelectedPlayersCard
            players={selectedPlayers}
            onRemovePlayer={handleRemovePlayer}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      )}
    </div>
  );
}
